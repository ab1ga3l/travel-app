"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CountryCard, GemCard } from "@/components/Cards";
import { COUNTRIES, REGIONS, type Region } from "@/lib/countries";
import { GEMS } from "@/lib/gems";
import { matchScore } from "@/lib/match";
import { EXTRAS } from "@/lib/countryExtras";
import { VIBES, type Vibe } from "@/lib/site";
import { useApp, useVisaRow } from "@/lib/store";
import { nameOf, type VisaCode } from "@/lib/world";

const easy = (v: VisaCode | undefined) => typeof v === "number" || v === "vf" || v === "voa" || v === "eta" || v === "ev";

export function Discover() {
  const sp = useSearchParams();
  const { profile } = useApp();
  const row = useVisaRow(profile?.passport);
  const [tab, setTab] = useState<"countries" | "gems">(sp.get("tab") === "gems" ? "gems" : "countries");
  const [q, setQ] = useState("");
  const [vibe, setVibe] = useState<Vibe | "">((sp.get("vibe") as Vibe) || "");
  const [region, setRegion] = useState<Region | "">("");
  const [visaEasy, setVisaEasy] = useState(false);
  const [thisMonth, setThisMonth] = useState(false);
  const month = new Date().getMonth() + 1;

  const countries = useMemo(() => {
    const s = q.trim().toLowerCase();
    return COUNTRIES.filter((c) => !region || c.region === region)
      .filter((c) => !s || c.name.toLowerCase().includes(s) || c.highlights.join(" ").toLowerCase().includes(s))
      .filter((c) => !vibe || (EXTRAS[c.code]?.vibes[vibe] ?? 0) >= 2)
      .filter((c) => !thisMonth || c.bestMonths.includes(month))
      .filter((c) => !visaEasy || !row || easy(row[c.code] as VisaCode))
      .sort((a, b) => matchScore(b, vibe ? [vibe] : profile?.vibes ?? []) - matchScore(a, vibe ? [vibe] : profile?.vibes ?? []));
  }, [q, region, vibe, thisMonth, visaEasy, row, month, profile]);

  const gems = useMemo(() => {
    const s = q.trim().toLowerCase();
    const inRegion = (code: string) => !region || COUNTRIES.find((c) => c.code === code)?.region === region;
    return GEMS.filter((g) => inRegion(g.c))
      .filter((g) => !s || `${g.name} ${g.area} ${nameOf(g.c)} ${g.desc}`.toLowerCase().includes(s))
      .filter((g) => !vibe || g.vibes.includes(vibe))
      .filter((g) => !visaEasy || !row || easy(row[g.c] as VisaCode))
      .sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "hidden" ? -1 : 1));
  }, [q, region, vibe, visaEasy, row]);

  return (
    <div className="stack-lg fade-in">
      <div className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">Discover</span>
        <h1>Find your <span className="gradient-text">kind of place.</span></h1>
      </div>

      <div className="card" style={{ gap: 14 }}>
        <div className="field-row" style={{ alignItems: "center" }}>
          <div style={{ flex: "3 1 260px" }}>
            <label className="lbl" htmlFor="dq">Search</label>
            <input id="dq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Zanzibar, waterfalls, Lisbon, street food…" />
          </div>
          <div className="row" style={{ flex: "1 1 220px", alignSelf: "end" }}>
            <button type="button" className="chip" aria-pressed={tab === "countries"} onClick={() => setTab("countries")}>🌍 Countries</button>
            <button type="button" className="chip" aria-pressed={tab === "gems"} onClick={() => setTab("gems")}>💎 Gems</button>
          </div>
        </div>
        <div className="chips" aria-label="Vibe">
          <button type="button" className="chip" aria-pressed={!vibe} onClick={() => setVibe("")}>Any vibe</button>
          {VIBES.map((v) => (
            <button key={v.id} type="button" className="chip" aria-pressed={vibe === v.id} onClick={() => setVibe(vibe === v.id ? "" : v.id)}>{v.emoji} {v.label}</button>
          ))}
        </div>
        <div className="chips" aria-label="Region and filters">
          <button type="button" className="chip" aria-pressed={!region} onClick={() => setRegion("")}>All regions</button>
          {REGIONS.map((r) => <button key={r.id} type="button" className="chip" aria-pressed={region === r.id} onClick={() => setRegion(region === r.id ? "" : r.id)}>{r.name}</button>)}
          <button type="button" className="chip" aria-pressed={visaEasy} disabled={!profile} title={profile ? "" : "Set your passport first"} onClick={() => setVisaEasy(!visaEasy)}>🛂 Easy visa for me</button>
          {tab === "countries" && <button type="button" className="chip" aria-pressed={thisMonth} onClick={() => setThisMonth(!thisMonth)}>☀️ Great this month</button>}
        </div>
      </div>

      {tab === "countries" ? (
        countries.length ? <div className="grid">{countries.map((c) => <CountryCard key={c.code} c={c} />)}</div>
          : <div className="empty">No countries match those filters yet. Try another vibe or region.</div>
      ) : gems.length ? (
        <div className="grid">{gems.map((g) => <GemCard key={g.id} gem={g} />)}</div>
      ) : (
        <div className="empty">No gems here yet. Know one? Share it in the Community.</div>
      )}
    </div>
  );
}
