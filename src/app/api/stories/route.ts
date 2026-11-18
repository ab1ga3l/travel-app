import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { DESTINATIONS, DOCUMENT_KEYS, PASSPORTS } from "@/lib/visa";

const Story = z.object({
  passport: z.string().length(2).refine((c) => PASSPORTS.some((p) => p.code === c)),
  destination: z.string().length(2).refine((c) => DESTINATIONS.some((d) => d.code === c)),
  visa_type: z.enum(["tourist", "business", "student", "transit", "work"]),
  outcome: z.enum(["approved", "refused", "pending"]),
  applied_at: z.string().max(80).optional().default(""),
  days_waited: z.number().int().min(0).max(730).nullable().optional(),
  total_cost_usd: z.number().int().min(0).max(20000).nullable().optional(),
  documents: z.array(z.enum(DOCUMENT_KEYS)).max(12).default([]),
  refusal_reason: z.string().max(500).optional().default(""),
  advice: z.string().max(1000).optional().default(""),
  website: z.string().max(0).optional(), // honeypot: bots fill it, people don't see it
});

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json({ error: "Story sharing isn't switched on yet." }, { status: 503 });
  }
  const parsed = Story.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }
  const { website, ...s } = parsed.data;
  void website;
  const { error } = await supabase.from("visa_stories").insert({
    ...s,
    applied_at: s.applied_at || null,
    refusal_reason: s.outcome === "refused" ? s.refusal_reason || null : null,
    advice: s.advice || null,
    approved_for_display: false, // reviewed before it appears publicly
  });
  if (error) {
    console.error("insert story", error.message);
    return NextResponse.json({ error: "Couldn't save your story. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
