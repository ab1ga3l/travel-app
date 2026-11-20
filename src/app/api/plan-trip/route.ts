// "Tell us about your trip": Aviora turns one paragraph into a full trip plan, with days, times,
// costs, a budget breakdown, tips and a packing list. Uses Claude structured outputs.
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { COUNTRIES } from "@/lib/countries";
import { EXTRAS } from "@/lib/countryExtras";
import { gemsFor } from "@/lib/gems";
import { OCCASIONS, VIBES } from "@/lib/site";
import { nameOf } from "@/lib/world";

export const runtime = "nodejs";
export const maxDuration = 120;

const Plan = z.object({
  trip_name: z.string().describe("Short, fun trip name, e.g. 'Amina's 25th in Zanzibar'"),
  country_code: z.string().describe("ISO alpha-2 code of the main destination. If none is given, pick the best fit for the traveller"),
  start: z.string().describe("YYYY-MM-DD, or empty if no exact dates"),
  end: z.string().describe("YYYY-MM-DD, or empty if no exact dates"),
  month: z.number().int().describe("1-12 if only a month is known, else 0"),
  people: z.number().int().describe("Number of travellers including the writer"),
  company: z.enum(["solo", "couple", "friends", "family"]),
  occasion: z.enum(OCCASIONS.map((o) => o.id) as [string, ...string[]]),
  vibes: z.array(z.enum(VIBES.map((v) => v.id) as [string, ...string[]])),
  budget_per_person: z.number().describe("Total trip budget per person in the given currency. Estimate it if not stated"),
  friends: z.array(z.string()).describe("First names of other travellers mentioned, if any"),
  summary: z.string().describe("2-3 warm sentences: what this trip is about and why it fits them"),
  days: z.array(z.object({
    day: z.number().int(),
    items: z.array(z.object({
      time: z.string().describe("HH:MM 24h"),
      title: z.string().describe("Specific place or activity, with its real name"),
      kind: z.enum(["activity", "stay", "flight", "transport", "food", "event", "note"]),
      note: z.string().describe("One short practical detail: area, how to get there, booking tip"),
      cost: z.number().describe("Estimated cost per person in the given currency, 0 if free"),
    })),
  })).describe("One entry per day, 3-5 items each, in time order"),
  budget: z.array(z.object({ label: z.string(), amount: z.number() })).describe("Per-person budget split: flights, stay, food, activities, transport, visa/fees, buffer"),
  tips: z.array(z.string()).describe("4-6 practical tips: money, safety, visa, culture, getting around"),
  packing: z.array(z.string()).describe("6-10 things to pack for this trip"),
});

const Body = z.object({
  text: z.string().min(10).max(2000),
  currency: z.string().regex(/^[A-Z]{3}$/).default("USD"),
  passport: z.string().regex(/^[A-Z]{2}$/).optional(),
  home: z.string().regex(/^[A-Z]{2}$/).optional(),
  vibes: z.array(z.string().max(20)).max(10).optional(),
  budget: z.string().max(20).optional(),
  pace: z.string().max(20).optional(),
});

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "Aviora isn't switched on yet." }, { status: 503 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Tell Aviora a bit more about the trip." }, { status: 400 });
  const b = parsed.data;
  const guides = COUNTRIES.map((c) => {
    const gems = gemsFor(c.code).map((g) => g.name).join(", ");
    return `${c.code} ${c.name}: best months ${c.bestMonths.join(",")}; daily USD ${c.dailyBudget.join("/")}; ${EXTRAS[c.code]?.tagline ?? ""}${gems ? ` Gems: ${gems}.` : ""}`;
  }).join("\n");

  try {
    const client = new Anthropic();
    const res = await client.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: betaZodOutputFormat(Plan) },
      system: `You are Aviora, the travel companion in an Africa-first travel app. Turn the traveller's description into a complete, realistic trip plan.
- Use real, specific places. Prefer the app's hidden gems where they fit.
- Times, costs and budgets must be realistic for the destination and the traveller's budget level. Costs are per person in ${b.currency}.
- If they gave a total or per-person budget, keep the plan within it. If not, estimate one for their budget level.
- Never invent visa rules or fees. In tips, say to check the official site for visa details.
- If they don't name a destination, pick the best fit for their vibe, the season and an easy visa.
Country guides in the app:
${guides}`,
      messages: [{
        role: "user",
        content: `Today is ${new Date().toISOString().slice(0, 10)}.
Traveller: ${b.passport ? `${nameOf(b.passport)} passport` : "passport unknown"}${b.home && b.home !== b.passport ? `, lives in ${nameOf(b.home)}` : ""}${b.vibes?.length ? `, likes ${b.vibes.join(", ")}` : ""}${b.budget ? `, budget style ${b.budget}` : ""}${b.pace ? `, pace ${b.pace}` : ""}. Currency: ${b.currency}.

<description>
${b.text}
</description>`,
      }],
    });
    if (res.stop_reason === "refusal" || !res.parsed_output) return NextResponse.json({ error: "Aviora couldn't plan that one. Try describing it differently." }, { status: 422 });
    return NextResponse.json({ plan: res.parsed_output });
  } catch (e) {
    console.error("plan-trip", e instanceof Anthropic.APIError ? `${e.status} ${e.message}` : e);
    return NextResponse.json({ error: "Aviora couldn't plan that right now." }, { status: 502 });
  }
}
