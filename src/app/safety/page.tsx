"use client";
import Link from "next/link";
import { useState } from "react";
import { SafetyPanel } from "@/components/trip/SafetyPanel";
import { useApp } from "@/lib/store";
import { tripPhase } from "@/lib/tripTypes";
import { WORLD } from "@/lib/world";

export default function SafetyPage() {
  const { ready, profile, tripDocs } = useApp();
  const next = tripDocs.filter((t) => tripPhase(t) !== "past").sort((a, b) => (a.start ?? "9").localeCompare(b.start ?? "9"))[0];
  const [country, setCountry] = useState<string>("");
  if (!ready || !profile) return <div className="muted">Loading…</div>;
  const dest = country || next?.country || profile.home || profile.passport;
  return (
    <div className="stack-lg fade-in" style={{ maxWidth: 860 }}>
      <div className="stack" style={{ gap: 8 }}>
        <span className="eyebrow">Safety</span>
        <h1>Travel brave. <span className="gradient-text">Stay connected.</span></h1>
        <p className="muted">Built with solo women travellers in mind, useful for everyone. One tap tells someone you trust that you&apos;re safe.</p>
      </div>
      {next && !country && <div className="note">Using your next trip: <Link href={`/trips/${next.id}`}>{next.name}</Link>. Check-ins there are saved to the trip.</div>}
      <div><label className="lbl" htmlFor="sc">Where are you?</label>
        <select id="sc" value={dest} onChange={(e) => setCountry(e.target.value)} style={{ maxWidth: 320 }}>{WORLD.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</select>
      </div>
      <SafetyPanel key={dest} country={dest} />
    </div>
  );
}
