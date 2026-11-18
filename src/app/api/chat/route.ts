import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { runAgent, type ChatTurn } from "@/lib/agent";
import { PLANS } from "@/lib/site";

export const runtime = "nodejs";
export const maxDuration = 60;

// Simple per-IP daily limit for the free tier. For production, move this to a shared store
// (Upstash Redis, Supabase) so it survives restarts and works across server instances.
const DAILY_LIMIT = Number(process.env.AGENT_DAILY_LIMIT || PLANS.free.agentDailyLimit);
const usage = new Map<string, { day: string; count: number }>();

function allow(ip: string) {
  const day = new Date().toISOString().slice(0, 10);
  const u = usage.get(ip);
  if (!u || u.day !== day) {
    usage.set(ip, { day, count: 1 });
    return true;
  }
  if (u.count >= DAILY_LIMIT) return false;
  u.count++;
  return true;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "The AI agent isn't configured yet. Add ANTHROPIC_API_KEY to your environment." }, { status: 503 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allow(ip)) {
    return NextResponse.json({ error: "You've reached today's free questions. Visa Ready members get unlimited answers." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Send JSON with a messages array." }, { status: 400 });
  }
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) {
    return NextResponse.json({ error: "Send at least one message." }, { status: 400 });
  }
  const history: ChatTurn[] = raw
    .filter((m): m is ChatTurn => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 3000) }));
  if (!history.length || history[history.length - 1].role !== "user") {
    return NextResponse.json({ error: "The last message must come from the traveler." }, { status: 400 });
  }
  while (history.length && history[0].role !== "user") history.shift();

  try {
    const reply = await runAgent(history);
    return NextResponse.json({ reply });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Lots of travelers are asking right now. Try again in a minute." }, { status: 429 });
    }
    if (e instanceof Anthropic.APIError) {
      console.error("Claude API error", e.status, e.message);
      return NextResponse.json({ error: "The assistant is having trouble. Please try again." }, { status: 502 });
    }
    console.error(e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
