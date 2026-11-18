"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { WorldMap } from "@/components/WorldMap";
import { countryByCode } from "@/lib/countries";
import { newId, useApp, useVisaRow, type Trip, type TripStatus } from "@/lib/store";
import { WORLD, flag, nameOf, visaLabel, type VisaCode } from "@/lib/world";

const TABS: [TripStatus, string, string][] = [["been", "✅ Been", "var(--mint)"], ["going", "🧳 Going", "var(--gold)"], ["dream", "💭 Dream", "var(--lilac)"]];

export default function Trips() {
  const { profile, trips, upsertTrip, removeTrip, session } = useApp();
  const row = useVisaRow(profile?.passport);
  const [tab, setTab] = useState<TripStatus>("been");
  const [picked, setPicked] = useState<string | null>(null);
  const [country, setCountry] = useState("KE");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const status = useMemo(() => Object.fromEntries(trips.map((t) => [t.country, t.status])) as Record<string, TripStatus>, [trips]);
  const been = trips.filter((t) => t.status === "been").length;
  const list = trips.filter((t) => t.status === tab).sort((a, b) => (a.start ?? "").localeCompare(b.start ?? "") || nameOf(a.country).localeCompare(nameOf(b.country)));

  const add = (code: string, s: TripStatus, extra: Partial<Trip> = {}) => {
    const existing = trips.find((t) => t.country === code);
    upsertTrip({ id: existing?.id ?? newId(), country: code, status: s, ...extra });
  };

  return (
    <div className="stack-lg fade-in">
      <div className="between">
        <div className="stack" style={{ gap: 8 }}>
          <span className="eyebrow">My trips</span>
          <h1>Your <span className="gradient-text">world</span>, so far.</h1>
        </div>
        {!session && <Link href="/profile" className="btn btn-ghost btn-sm">Sign in to sync across devices</Link>}
      </div>

      <section className="grid-3">
        <div className="card kpi"><strong style={{ color: "var(--mint)" }}>{been}</strong><span>countries visited · {Math.round((been / 195) * 100)}% of the world</span></div>
        <div className="card kpi"><strong style={{ color: "var(--gold)" }}>{trips.filter((t) => t.status === "going").length}</strong><span>trips coming up</span></div>
        <div className="card kpi"><strong style={{ color: "var(--lilac)" }}>{trips.filter((t) => t.status === "dream").length}</strong><span>dream destinations</span></div>
      </section>

      <section className="stack">
        <WorldMap status={status} onPick={(c) => setPicked(c)} />
        <div className="between">
          <div className="legend"><span><i style={{ background: "var(--mint)" }} />Been</span><span><i style={{ background: "var(--gold)" }} />Going</span><span><i style={{ background: "var(--lilac)" }} />Dream</span></div>
          <span className="muted" style={{ fontSize: "0.82rem" }}>Tap a country on the map to add it.</span>
        </div>
        {picked && (
          <div className="card fade-in" style={{ gap: 10 }}>
            <div className="between"><h3>{flag(picked)} {nameOf(picked)}</h3><button type="button" className="btn btn-ghost btn-sm" onClick={() => setPicked(null)}>Close</button></div>
            <div className="row">
              {TABS.map(([s, l]) => <button key={s} type="button" className="chip" aria-pressed={status[picked] === s} onClick={() => { add(picked, s); setPicked(null); }}>{l}</button>)}
              {status[picked] && <button type="button" className="chip" onClick={() => { const t = trips.find((x) => x.country === picked); if (t) removeTrip(t.id); setPicked(null); }}>Remove</button>}
            </div>
          </div>
        )}
      </section>

      <form className="card" onSubmit={(e) => { e.preventDefault(); add(country, tab, { start: start || undefined, end: end || undefined }); setStart(""); setEnd(""); }}>
        <h3>Add a trip</h3>
        <div className="field-row" style={{ alignItems: "end" }}>
          <div><label className="lbl" htmlFor="tc">Country</label><select id="tc" value={country} onChange={(e) => setCountry(e.target.value)}>{WORLD.map((w) => <option key={w.code} value={w.code}>{flag(w.code)} {w.name}</option>)}</select></div>
          <div><label className="lbl" htmlFor="ts">From</label><input id="ts" type="date" value={start} onChange={(e) => setStart(e.target.value)} /></div>
          <div><label className="lbl" htmlFor="te">To</label><input id="te" type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
          <button type="submit" className="btn btn-sun" style={{ flex: "0 0 auto" }}>Add to {TABS.find(([s]) => s === tab)?.[1].split(" ")[1]}</button>
        </div>
      </form>

      <section className="stack">
        <div className="chips">{TABS.map(([s, l]) => <button key={s} type="button" className="chip" aria-pressed={tab === s} onClick={() => setTab(s)}>{l} · {trips.filter((t) => t.status === s).length}</button>)}</div>
        {list.length ? (
          <div className="grid">
            {list.map((t) => {
              const c = countryByCode(t.country);
              const v = visaLabel(row?.[t.country] as VisaCode | undefined);
              return (
                <div key={t.id} className="card hover-lift">
                  <div className="between"><span style={{ fontSize: "1.8rem" }}>{flag(t.country)}</span><button type="button" className="btn btn-ghost btn-sm" onClick={() => removeTrip(t.id)} aria-label={`Remove ${nameOf(t.country)}`}>✕</button></div>
                  <h3>{nameOf(t.country)}</h3>
                  {(t.start || t.end) && <span className="muted" style={{ fontSize: "0.85rem" }}>{t.start}{t.end ? ` → ${t.end}` : ""}</span>}
                  {t.status !== "been" && profile && t.country !== profile.passport && <span className={`badge tone-${v.tone}`} style={{ justifySelf: "start" }}>{row ? v.label : "…"}</span>}
                  <div className="row">
                    {t.status !== "been" && profile && <Link href={`/visa/${profile.passport.toLowerCase()}/${t.country.toLowerCase()}`} className="btn btn-soft btn-sm">Visa checklist</Link>}
                    {c && <Link href={`/discover/${c.slug}`} className="btn btn-soft btn-sm">Guide</Link>}
                    {t.status === "going" && <button type="button" className="btn btn-soft btn-sm" onClick={() => add(t.country, "been", { start: t.start, end: t.end })}>Mark as been</button>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty">
            {tab === "been" ? "Tap the countries you've visited on the map. Watch your world fill up." : tab === "going" ? "No trips planned yet. Add one above, then check the visa checklist." : "Where would you go if nothing stopped you? Add your dream list."}
          </div>
        )}
      </section>
    </div>
  );
}
