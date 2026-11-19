import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { askAssistant } from "@/lib/assistant";
import { APP } from "@/lib/site";

export const runtime = "nodejs";
export const maxDuration = 120;

// Simple per-visitor daily limit to keep AI costs predictable. For production, move this to a
// shared store (Supabase or Upstash) so it survives restarts and works across server instances.
const LIMIT = Number(process.env.AGENT_DAILY_LIMIT || APP.freeQuestionsPerDay);
const usage = new Map<string, { day: string; n: number }>();
function allow(id: string) {
  const day = new Date().toISOString().slice(0, 10);
  const u = usage.get(id);
  if (!u || u.day !== day) { usage.set(id, { day, n: 1 }); return true; }
  if (u.n >= LIMIT) return false;
  u.n++;
  return true;
}

const Body = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) })).min(1).max(40),
  profile: z.object({
    name: z.string().max(40).optional(), passport: z.string().regex(/^[A-Z]{2}$/), vibes: z.array(z.string().max(20)).max(7).optional(),
    budget: z.string().max(20).optional(), company: z.string().max(20).optional(), pace: z.string().max(20).optional(),
    home: z.string().regex(/^[A-Z]{2}$/).optional(), interests: z.array(z.string().max(20)).max(12).optional(),
    assistantStyle: z.enum(["warm", "direct", "detailed"]).optional(), assistantNickname: z.string().max(20).optional(),
  }).optional(),
});

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: `${APP.assistant} isn't switched on yet. Add ANTHROPIC_API_KEY to the environment.` }, { status: 503 });
  }
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please send a question." }, { status: 400 });
  const history = parsed.data.messages.slice(-14);
  while (history.length && history[0].role !== "user") history.shift();
  if (!history.length || history[history.length - 1].role !== "user") return NextResponse.json({ error: "Please send a question." }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allow(ip)) return NextResponse.json({ error: `That's today's ${LIMIT} free questions. Come back tomorrow!` }, { status: 429 });

  try {
    const reply = await askAssistant(history, parsed.data.profile);
    return NextResponse.json({ reply });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return NextResponse.json({ error: "Lots of travellers are asking right now. Try again in a minute." }, { status: 429 });
    if (e instanceof Anthropic.APIError) { console.error("Claude API", e.status, e.message); return NextResponse.json({ error: `${APP.assistant} is having trouble. Please try again.` }, { status: 502 }); }
    console.error(e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
