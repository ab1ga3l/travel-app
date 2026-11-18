import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const Body = z.object({ email: z.string().email().max(200), passport: z.string().length(2).optional() });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!supabase) return NextResponse.json({ error: "Sign-ups open soon." }, { status: 503 });
  const { error } = await supabase.from("newsletter").upsert({ email: parsed.data.email.toLowerCase(), passport: parsed.data.passport ?? null });
  if (error) return NextResponse.json({ error: "Couldn't save your email. Please try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
