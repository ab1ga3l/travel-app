// Turns a free-text trip description ("birthday trip for 6 girls in December, beach and party,
// $800 each") into structured answers for the trip wizard, using Claude structured outputs.
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { COUNTRIES } from "@/lib/countries";
import { OCCASIONS, VIBES } from "@/lib/site";

export const runtime = "nodejs";
export const maxDuration = 60;

const Answers = z.object({
  country_code: z.string().describe("ISO alpha-2 code of the destination, or empty string if not stated"),
  vibes: z.array(z.enum(VIBES.map((v) => v.id) as [string, ...string[]])),
  occasion: z.enum(OCCASIONS.map((o) => o.id) as [string, ...string[]]),
  company: z.enum(["solo", "couple", "friends", "family"]),
  people: z.number().int(),
  month: z.number().int().describe("1-12, or 0 if not stated"),
  start: z.string().describe("YYYY-MM-DD or empty"),
  end: z.string().describe("YYYY-MM-DD or empty"),
  budget_per_person: z.number().describe("Amount per person in the given currency, or 0 if not stated"),
  trip_name: z.string().describe("A short fun trip name"),
});

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "AI isn't switched on yet. Answer the questions instead." }, { status: 503 });
  const body = await req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.slice(0, 1500).trim() : "";
  const currency = typeof body?.currency === "string" ? body.currency.slice(0, 3) : "USD";
  if (text.length < 5) return NextResponse.json({ error: "Tell us a bit more about the trip." }, { status: 400 });
  try {
    const client = new Anthropic();
    const res = await client.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 2000,
      output_config: { effort: "low", format: zodOutputFormat(Answers) },
      messages: [{
        role: "user",
        content: `Today is ${new Date().toISOString().slice(0, 10)}. Extract trip details from the traveller's description. Amounts are in ${currency} unless they say otherwise; convert roughly if needed. Countries we have guides for: ${COUNTRIES.map((c) => `${c.code}=${c.name}`).join(", ")} (any country is allowed). If a city is given, use its country.\n\n<description>\n${text}\n</description>`,
      }],
    });
    if (!res.parsed_output) return NextResponse.json({ error: "Couldn't read that. Try the questions instead." }, { status: 422 });
    return NextResponse.json({ answers: res.parsed_output });
  } catch (e) {
    console.error("plan-parse", e instanceof Anthropic.APIError ? `${e.status} ${e.message}` : e);
    return NextResponse.json({ error: "Couldn't read that right now. Try the questions instead." }, { status: 502 });
  }
}
