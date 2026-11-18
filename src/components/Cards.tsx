"use client";
import Link from "next/link";
import type { Country } from "@/lib/countries";
import { EXTRAS } from "@/lib/countryExtras";
import { COST_LABEL, CROWD_LABEL, type Gem } from "@/lib/gems";
import { matchScore } from "@/lib/match";
import { vibeInfo } from "@/lib/site";
import { useApp } from "@/lib/store";
import { nameOf } from "@/lib/world";
import { MatchRing, VisaBadgeFor } from "./bits";
import { MonthStrip } from "./MonthStrip";
import { Poster, PosterArt } from "./Poster";

export function CountryCard({ c, width }: { c: Country; width?: number }) {
  const { profile } = useApp();
  const ex = EXTRAS[c.code];
  return (
    <Link href={`/discover/${c.slug}`} className="card hover-lift" style={{ padding: 10, gap: 10, width }}>
      <Poster code={c.code} name={c.name} region={c.region} height={170} topRight={<span className="glass-pill">${c.dailyBudget[1]}/day</span>} />
      <div className="stack" style={{ gap: 8, padding: "2px 6px 6px" }}>
        <div className="between" style={{ gap: 8 }}>
          <VisaBadgeFor code={c.code} compact />
          {profile && <MatchRing value={matchScore(c, profile.vibes)} />}
        </div>
        {ex && <p className="muted" style={{ fontSize: "0.88rem" }}>{ex.tagline}</p>}
        <MonthStrip best={c.bestMonths} ok={c.okMonths} />
      </div>
    </Link>
  );
}

export function GemCard({ gem, width }: { gem: Gem; width?: number }) {
  return (
    <Link href={`/gems/${gem.id}`} className="card hover-lift" style={{ padding: 0, overflow: "hidden", gap: 0, width }}>
      <div className="poster" style={{ minHeight: 140, borderRadius: 0 }}>
        <PosterArt code={gem.id} region={gem.c === "TH" || gem.c === "ID" ? "asia" : gem.c === "PT" ? "europe" : "africa"} id={gem.id} />
        <div className="p-top">
          <span className="glass-pill">{gem.kind === "hidden" ? "💎 Hidden gem" : "⭐ Famous"}</span>
          <span className="glass-pill">{CROWD_LABEL[gem.feel.crowd]}</span>
        </div>
        <span className="glass-pill" style={{ justifySelf: "start", alignSelf: "flex-start" }}>{gem.area} · {nameOf(gem.c)}</span>
      </div>
      <div className="stack" style={{ gap: 8, padding: 16 }}>
        <h3>{gem.name}</h3>
        {gem.alt && <span className="badge tone-free" style={{ justifySelf: "start" }}>Quieter than {gem.alt}</span>}
        <p className="muted" style={{ fontSize: "0.88rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{gem.desc}</p>
        <div className="row" style={{ gap: 6 }}>
          {gem.vibes.slice(0, 2).map((v) => <span key={v} className="badge tone-lilac">{vibeInfo(v).emoji} {vibeInfo(v).label.split(" ")[0]}</span>)}
          <span className="badge tone-unknown">{COST_LABEL[gem.cost]}</span>
        </div>
      </div>
    </Link>
  );
}
