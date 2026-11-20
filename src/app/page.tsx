"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { CountryCard } from "@/components/Cards";
import { TripCard } from "@/components/TripCard";
import { TONE_COLORS, WorldMap } from "@/components/WorldMap";
import { COUNTRIES } from "@/lib/countries";
import { matchScore } from "@/lib/match";
import { useApp, useVisaRow } from "@/lib/store";
import { tripPhase } from "@/lib/tripTypes";
import { flag, nameOf, visaLabel, VISA_SOURCE, type VisaCode } from "@/lib/world";

const ease = (v: VisaCode | undefined) => (v == null ? 1 : typeof v === "number" || v === "vf" || v === "voa" ? 3 : v === "eta" || v === "ev" ? 2 : v === "vr" ? 1 : 0);
const GROUPS = [
  { id: "free", title: "Visa-free", hint: "Just your passport", tone: "free", test: (v: VisaCode) => typeof v === "number" || v === "vf" },
  { id: "voa", title: "Visa on arrival", hint: "Get it at the airport", tone: "free", test: (v: VisaCode) => v === "voa" },
  { id: "online", title: "eVisa / online", hint: "Apply online before", tone: "easy", test: (v: VisaCode) => v === "ev" || v === "eta" },
  { id: "vr", title: "Visa required", hint: "Apply at an embassy", tone: "hard", test: (v: VisaCode) => v === "vr" },
] as const;
const MONTH = new Date().getMonth() + 1;

export default function Home() {
  const { ready, profile, tripDocs, places } = useApp();
  const router = useRouter();
  const row = useVisaRow(profile?.passport);

  const lists = useMemo(() => {
    const out: Record<string, { code: string; v: VisaCode }[]> = { free: [], voa: [], online: [], vr: [] };
    if (!row) return out;
    for (const [code, v] of Object.entries(row) as [string, VisaCode][]) {
      if (code === profile?.passport) continue;
      const g = GROUPS.find((x) => x.test(v));
      if (g) out[g.id].push({ code, v });
    }
    for (const k in out) out[k].sort((a, b) => nameOf(a.code).localeCompare(nameOf(b.code)));
    return out;
  }, [row, profile?.passport]);

  const colors = useMemo(() => {
    const m: Record<string, string> = {};
    if (row) for (const [code, v] of Object.entries(row) as [string, VisaCode][]) m[code] = TONE_COLORS[visaLabel(v).tone] ?? "var(--muted)";
    if (profile?.passport) m[profile.passport] = "var(--ink)";
    return m;
  }, [row, profile?.passport]);

  const picks = useMemo(() => {
    if (!profile) return [];
    return COUNTRIES.filter((c) => c.code !== profile.passport)
      .map((c) => ({ c, s: matchScore(c, profile.vibes) + ease(row?.[c.code] as VisaCode) * 12 + (c.region === "africa" ? 4 : 0) }))
      .sort((a, b) => b.s - a.s).slice(0, 10).map((x) => x.c);
  }, [profile, row]);



  if (!ready || !profile) return <div className="muted">Loading…</div>;
  const active = tripDocs.filter((t) => tripPhase(t) !== "past").sort((a, b) => (a.start ?? "9").localeCompare(b.start ?? "9"));
  const been = places.filter((p) => p.status === "been").length;
  const easy = lists.free.length + lists.voa.length;

  return (
    <div className="stack-lg fade-in" style={{ maxWidth: 980 }}>
      <section className="stack" style={{ gap: 14 }}>
        <span className="eyebrow">Hey {profile.name.split(" ")[0] || "traveller"} {flag(profile.passport)}</span>
        <h1>Where are we <span className="gradient-text">going next?</span></h1>
        <div className="row"><Link href="/trips/new" className="btn btn-sun">＋ Plan a trip</Link></div>
      </section>

      {active[0] && <div style={{ maxWidth: 520 }}><TripCard t={active[0]} /></div>}

      <section className="section">
        <div className="between">
          <h2>Where you can go</h2>
          <span className="muted"><strong style={{ color: "var(--mint)" }}>{row ? easy : "…"}</strong> visa-free</span>
        </div>
        <div className="card" style={{ padding: 12 }}>
          <WorldMap colors={colors} onPick={(c) => router.push(`/visa/${profile.passport.toLowerCase()}/${c.toLowerCase()}`)} label={`Visa map for ${nameOf(profile.passport)} passport holders`} />
          <div className="legend" style={{ padding: "8px 4px 0" }}>
            <span><i style={{ background: "var(--mint)" }} />Visa-free</span>
            <span><i style={{ background: "var(--gold)" }} />eVisa</span>
            <span><i style={{ background: "var(--sunrise)" }} />Visa needed</span>
            <span><i style={{ background: "var(--ink)" }} />Home</span>
          </div>
        </div>
        <p className="muted" style={{ fontSize: "0.8rem" }}>Tap a country for details. {VISA_SOURCE.name}, {VISA_SOURCE.updated}. Always confirm before you book.</p>
      </section>

      <section className="section">
        <div className="between"><h2>Go now</h2><Link href="/discover" className="btn btn-ghost btn-sm">Explore all</Link></div>
        <div className="scroll-x">{picks.slice(0, 6).map((c) => <CountryCard key={c.code} c={c} width={290} />)}</div>
      </section>
    </div>
  );
}
