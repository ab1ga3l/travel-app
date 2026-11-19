"use client";
import Link from "next/link";
import { countryByCode } from "@/lib/countries";
import { daysUntil, potRaised, tripPhase, type TripDoc } from "@/lib/tripTypes";
import { flag, nameOf } from "@/lib/world";
import { PosterArt } from "./Poster";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const initials = (n: string) => n.split(/\s+/).map((x) => x[0]).join("").slice(0, 2).toUpperCase() || "?";

export function TripCard({ t }: { t: TripDoc }) {
  const phase = tripPhase(t);
  const d = daysUntil(t.start);
  const raised = potRaised(t);
  const pct = t.pot.target ? Math.min(100, Math.round((raised / t.pot.target) * 100)) : 0;
  const region = countryByCode(t.country)?.region ?? "africa";
  return (
    <Link href={`/trips/${t.id}`} className="card hover-lift" style={{ padding: 0, overflow: "hidden", gap: 0 }}>
      <div className="poster" style={{ minHeight: 120, borderRadius: 0 }}>
        <PosterArt code={t.country + t.id.slice(0, 4)} region={region} id={t.id} />
        <div className="p-top"><span className="p-flag">{flag(t.country)}</span>
          <span className="glass-pill">{phase === "now" ? "On the trip 🎉" : phase === "past" ? "Done ✓" : d != null ? `${d} days to go` : t.month ? `${MONTHS[t.month - 1]} · flexible` : "Planning"}</span></div>
        <span className="p-name" style={{ fontSize: "1.25rem" }}>{t.name}</span>
      </div>
      <div className="stack" style={{ gap: 10, padding: 16 }}>
        <div className="between">
          <span className="muted" style={{ fontSize: "0.85rem" }}>{nameOf(t.country)}{t.start ? ` · ${t.start}` : ""}</span>
          <div className="avatars">{t.members.slice(0, 5).map((m) => <span key={m.id} className="avatar" title={m.name}>{initials(m.name)}</span>)}</div>
        </div>
        {t.members.length > 1 && t.pot.target > 0 && (
          <div className="stack" style={{ gap: 4 }}>
            <div className="between" style={{ fontSize: "0.82rem" }}><span>💰 Pot</span><span>{pct}% · {t.currency} {raised.toLocaleString()} / {t.pot.target.toLocaleString()}</span></div>
            <div className="progress"><i style={{ width: `${pct}%` }} /></div>
          </div>
        )}
        {t.proposals.length > 0 && <span className="badge tone-lilac" style={{ justifySelf: "start" }}>🗳️ {t.proposals.length} to vote on</span>}
      </div>
    </Link>
  );
}

