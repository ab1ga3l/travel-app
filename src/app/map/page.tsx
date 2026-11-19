"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { STATUS_COLORS, TONE_COLORS, WorldMap } from "@/components/WorldMap";
import { badgesFor, travelStreak } from "@/lib/badges";
import { CONTINENTS, continentOf } from "@/lib/geo";
import { APP } from "@/lib/site";
import { newId, useApp, useVisaRow, type PlaceStatus } from "@/lib/store";
import { flag, nameOf, visaLabel, WORLD, type VisaCode } from "@/lib/world";

const UN_COUNT = 195;
const STATUS: [PlaceStatus, string][] = [["been", "✅ Been"], ["going", "🧳 Going"], ["dream", "✨ Dream"]];

export default function MyMap() {
  const { ready, profile, places, tripDocs, upsertPlace, removePlace } = useApp();
  const row = useVisaRow(profile?.passport);
  const [mode, setMode] = useState<"travels" | "passport">("travels");
  const [picked, setPicked] = useState<string | null>(null);
  const [add, setAdd] = useState("");
  const [year, setYear] = useState("");
  const [shareMsg, setShareMsg] = useState("");

  const been = useMemo(() => Array.from(new Set(places.filter((p) => p.status === "been").map((p) => p.country))), [places]);
  const streak = travelStreak(places);
  const badges = badgesFor(places, tripDocs, streak);
  const pct = ((been.length / UN_COUNT) * 100).toFixed(1);

  const colors = useMemo(() => {
    const m: Record<string, string> = {};
    if (mode === "travels") {
      for (const s of ["dream", "going", "been"] as PlaceStatus[]) for (const p of places.filter((x) => x.status === s)) m[p.country] = STATUS_COLORS[s];
    } else if (row) {
      for (const [c, v] of Object.entries(row) as [string, VisaCode][]) m[c] = TONE_COLORS[visaLabel(v).tone] ?? "var(--muted)";
      for (const c of been) m[c] = "var(--lilac)";
    }
    if (profile?.passport) m[profile.passport] = mode === "travels" ? "color-mix(in srgb, var(--lilac) 60%, transparent)" : "var(--lilac)";
    return m;
  }, [mode, places, row, been, profile?.passport]);

  if (!ready || !profile) return <div className="muted">Loading…</div>;
  const existing = picked ? places.find((p) => p.country === picked) : undefined;
  const setStatus = (code: string, status: PlaceStatus) => {
    upsertPlace({ id: existing?.id ?? newId(), country: code, status, start: status === "been" && year ? `${year}-01-01` : existing?.start });
  };
  const contStats = Object.entries(CONTINENTS).map(([name, list]) => ({ name, n: been.filter((c) => continentOf(c) === name).length, of: list.length }));

  const share = async () => {
    const blob = await drawCard(profile.name, been, pct, contStats.filter((c) => c.n > 0).length);
    if (!blob) return;
    const file = new File([blob], "my-travel-map.png", { type: "image/png" });
    const text = `I've been to ${been.length} countries (${pct}% of the world) 🌍 Mapped on ${APP.name}.`;
    try {
      if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], text }); return; }
    } catch { /* cancelled */ }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "my-travel-map.png"; a.click();
    setShareMsg("Saved the image. Post it anywhere!");
  };

  return (
    <div className="stack-lg fade-in">
      <div className="between">
        <div className="stack" style={{ gap: 8 }}><span className="eyebrow">My map</span><h1>{been.length ? <>You&apos;ve seen <span className="gradient-text">{pct}%</span> of the world</> : <>Start your <span className="gradient-text">map</span></>}</h1></div>
        <button type="button" className="btn btn-sun" onClick={share} disabled={!been.length}>📸 Share my map</button>
      </div>
      {shareMsg && <span role="status" className="muted">{shareMsg}</span>}

      <div className="grid-3 kpis">
        <div className="card kpi"><strong style={{ color: "var(--mint)" }}>{been.length}</strong><span>countries visited of {UN_COUNT}</span></div>
        <div className="card kpi"><strong style={{ color: "var(--gold)" }}>{contStats.filter((c) => c.n > 0).length}<span style={{ fontSize: "1rem", color: "var(--muted)" }}>/6</span></strong><span>continents</span></div>
        <div className="card kpi"><strong>{streak ? `🔥 ${streak}` : "—"}</strong><span>{streak ? `year${streak > 1 ? "s" : ""} in a row travelling` : "add years to start a streak"}</span></div>
      </div>

      <div className="tabs-row" role="tablist" aria-label="Map mode">
        <button type="button" role="tab" aria-selected={mode === "travels"} className="tab-pill" onClick={() => setMode("travels")}>🗺️ My travels</button>
        <button type="button" role="tab" aria-selected={mode === "passport"} className="tab-pill" onClick={() => setMode("passport")}>🛂 Where my passport can go</button>
      </div>

      <div className="card" style={{ padding: 12 }}>
        <WorldMap colors={colors} onPick={setPicked} label={mode === "travels" ? "Countries you've visited" : "Where your passport can go"} />
        <div className="legend" style={{ padding: "8px 4px 0" }}>
          {mode === "travels" ? <>
            <span><i style={{ background: "var(--mint)" }} />Been</span><span><i style={{ background: "var(--gold)" }} />Going</span><span><i style={{ background: "var(--lilac)" }} />Dream</span>
          </> : <>
            <span><i style={{ background: "var(--mint)" }} />Visa-free / on arrival</span><span><i style={{ background: "var(--gold)" }} />eVisa</span><span><i style={{ background: "var(--sunrise)" }} />Visa required</span><span><i style={{ background: "var(--lilac)" }} />Been / home</span>
          </>}
        </div>
        <p className="muted" style={{ fontSize: "0.8rem", padding: "4px" }}>Tap a country to mark it.</p>
      </div>

      {picked && (
        <section className="card glow" style={{ gap: 12 }}>
          <div className="between"><h3>{flag(picked)} {nameOf(picked)}</h3><button type="button" className="btn btn-ghost btn-sm" onClick={() => setPicked(null)} aria-label="Close">✕</button></div>
          {row && picked !== profile.passport && <span className={`badge tone-${visaLabel(row[picked] as VisaCode).tone}`} style={{ justifySelf: "start" }}>{visaLabel(row[picked] as VisaCode).label}</span>}
          <div className="chips">
            {STATUS.map(([s, l]) => <button key={s} type="button" className="chip" aria-pressed={existing?.status === s} onClick={() => setStatus(picked, s)}>{l}</button>)}
            {existing && <button type="button" className="chip" onClick={() => removePlace(existing.id)}>Remove</button>}
          </div>
          <div className="field-row" style={{ alignItems: "end" }}>
            <div><label className="lbl" htmlFor="yr">Year you went (for streaks)</label><input id="yr" type="number" min={1950} max={new Date().getFullYear()} value={year} onChange={(e) => setYear(e.target.value)} placeholder={existing?.start?.slice(0, 4) ?? String(new Date().getFullYear())} /></div>
            <div className="row" style={{ flex: "0 0 auto" }}>
              <Link href={`/visa/${profile.passport.toLowerCase()}/${picked.toLowerCase()}`} className="btn btn-ghost btn-sm">Visa details</Link>
              <Link href={`/trips/new?country=${picked}`} className="btn btn-soft btn-sm">Plan a trip</Link>
            </div>
          </div>
        </section>
      )}

      <form className="row" onSubmit={(e) => { e.preventDefault(); if (add) { setPicked(add); setAdd(""); } }}>
        <select aria-label="Add a country" value={add} onChange={(e) => setAdd(e.target.value)} style={{ maxWidth: 280 }}>
          <option value="">Add a country…</option>
          {WORLD.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
        <button className="btn btn-soft" type="submit" disabled={!add}>Add</button>
      </form>

      <section className="section">
        <h2>Continents</h2>
        <div className="grid-3">
          {contStats.map((c) => (
            <div key={c.name} className="card" style={{ gap: 8 }}>
              <div className="between"><strong>{c.name}</strong><span className="muted">{c.n}/{c.of}</span></div>
              <div className="bar"><i style={{ width: `${(c.n / c.of) * 100}%`, background: "var(--grad-sun)" }} /></div>
            </div>
          ))}
        </div>
      </section>

      {been.length > 0 && (
        <section className="section">
          <h2>Passport stamps</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
            {been.map((c, i) => {
              const p = places.find((x) => x.country === c && x.status === "been");
              const tones = ["var(--mint)", "var(--gold)", "var(--sunrise)", "var(--lilac)"];
              return (
                <div key={c} className="stamp-card" style={{ color: tones[i % 4], ["--rot" as string]: `${((i * 37) % 13) - 6}deg` }}>
                  <span style={{ fontSize: "1.6rem" }}>{flag(c)}</span>
                  <strong>{c}</strong>
                  <span style={{ fontSize: "0.7rem" }}>{nameOf(c).toUpperCase().slice(0, 16)}</span>
                  <span style={{ fontSize: "0.7rem" }}>{p?.start?.slice(0, 4) ?? "ARRIVED"}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="section">
        <h2>Badges <span className="muted" style={{ fontSize: "1rem" }}>{badges.filter((b) => b.earned).length}/{badges.length}</span></h2>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
          {badges.map((b) => (
            <div key={b.id} className="badge-tile" data-locked={!b.earned}>
              <span className="big" aria-hidden="true">{b.emoji}</span>
              <strong style={{ fontSize: "0.9rem" }}>{b.name}</strong>
              <span className="muted" style={{ fontSize: "0.75rem" }}>{b.how}{!b.earned && b.progress ? ` · ${b.progress}` : ""}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Draws a 1080×1350 share card. */
async function drawCard(name: string, been: string[], pct: string, conts: number): Promise<Blob | null> {
  const cv = document.createElement("canvas");
  cv.width = 1080; cv.height = 1350;
  const g = cv.getContext("2d");
  if (!g) return null;
  try { await document.fonts.ready; } catch { /* ignore */ }
  const bg = g.createLinearGradient(0, 0, 1080, 1350);
  bg.addColorStop(0, "#0b1026"); bg.addColorStop(1, "#24133d");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1350);
  const sun = g.createRadialGradient(900, 1200, 50, 900, 1200, 700);
  sun.addColorStop(0, "rgba(255,107,74,0.55)"); sun.addColorStop(1, "rgba(255,107,74,0)");
  g.fillStyle = sun; g.fillRect(0, 0, 1080, 1350);
  g.fillStyle = "#ffc24b"; g.font = "600 34px 'IBM Plex Mono', monospace";
  g.fillText(`${(name || "MY").toUpperCase()}'S TRAVEL MAP`, 80, 140);
  const tg = g.createLinearGradient(80, 0, 700, 0);
  tg.addColorStop(0, "#ff6b4a"); tg.addColorStop(1, "#ffc24b");
  g.fillStyle = tg; g.font = "800 260px Unbounded, sans-serif";
  g.fillText(String(been.length), 70, 430);
  g.fillStyle = "#f4efe6"; g.font = "600 52px 'Instrument Sans', sans-serif";
  g.fillText(`countries · ${pct}% of the world`, 80, 510);
  g.fillText(`${conts} continent${conts === 1 ? "" : "s"}`, 80, 580);
  g.font = "64px sans-serif";
  been.slice(0, 40).forEach((c, i) => g.fillText(flag(c), 80 + (i % 10) * 92, 720 + Math.floor(i / 10) * 96));
  if (been.length > 40) { g.font = "600 40px 'Instrument Sans', sans-serif"; g.fillText(`+${been.length - 40} more`, 80, 1130); }
  g.fillStyle = "#3ddbb4"; g.font = "700 44px Unbounded, sans-serif";
  g.fillText(APP.name.toUpperCase(), 80, 1260);
  g.fillStyle = "rgba(244,239,230,0.7)"; g.font = "500 30px 'Instrument Sans', sans-serif";
  g.fillText("Map yours →", 80, 1300);
  return new Promise((r) => cv.toBlob((b) => r(b), "image/png"));
}
