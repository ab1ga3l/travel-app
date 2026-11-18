import { NextResponse } from "next/server";
import { visaRow } from "@/lib/visaMatrix";

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams.get("passport")?.toUpperCase() ?? "";
  if (!/^[A-Z]{2}$/.test(p)) return NextResponse.json({ error: "Use ?passport=NG" }, { status: 400 });
  return NextResponse.json({ passport: p, row: visaRow(p) }, { headers: { "Cache-Control": "public, max-age=86400" } });
}
