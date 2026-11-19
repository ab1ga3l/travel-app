"use client";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { CrewTab } from "@/components/trip/CrewTab";
import { PlanTab } from "@/components/trip/PlanTab";
import { PotTab } from "@/components/trip/PotTab";
import { ReadyTab } from "@/components/trip/ReadyTab";
import { SafetyPanel } from "@/components/trip/SafetyPanel";
import { SplitTab } from "@/components/trip/SplitTab";
import { VoteTab } from "@/components/trip/VoteTab";
import { countryByCode } from "@/lib/countries";
import { OCCASIONS } from "@/lib/site";
import { useApp } from "@/lib/store";
import { daysUntil, potRaised, READY_ITEMS, tripPhase, type TripDoc } from "@/lib/tripTypes";
import { flag, nameOf } from "@/lib/world";
import { PosterArt } from "@/components/Poster";

const TABS = [
  ["plan", "🗓️ Plan"], ["ready", "✅ Ready"], ["vote", "🗳️ Vote"], ["pot", "💰 Pot"], ["split", "🧾 Split"], ["safety", "🛡️ Safety"], ["crew", "👥 Crew"],
] as const;
type Tab = (typeof TABS)[number][0];

function TripView() {
  const { id } = useParams<{ id: string }>();
  const q = useSearchParams();
  const { ready, tripDocs, session, saveTrip } = useApp();
  const trip = tripDocs.find((t) => t.id === id);
  const [tab, setTab] = useState<Tab>("plan");
  const latest = useRef(tripDocs);
  useEffect(() => { latest.current = tripDocs; }, [tripDocs]);
  useEffect(() => {
    try { const t = sessionStorage.getItem(`tk-tab-${id}`) as Tab | null; if (t && TABS.some(([k]) => k === t)) setTab(t); } catch { /* blocked */ }
  }, [id]);
  const pick = (t: Tab) => { setTab(t); try { sessionStorage.setItem(`tk-tab-${id}`, t); } catch { /* blocked */ } };

  const update = useCallback(async (fn: (t: TripDoc) => TripDoc) => {
    const cur = latest.current.find((t) => t.id === id);
    if (!cur) return;
    const next = fn(cur);
    latest.current = latest.current.map((t) => (t.id === id ? next : t));
    await saveTrip(next);
  }, [id, saveTrip]);

  if (!ready) return <div className="muted">Loading…</div>;
  if (!trip) return (
    <div className="empty"><span style={{ fontSize: "2rem" }}>🧭</span><strong>We can&apos;t find that trip.</strong><span>It may have been deleted, or it lives on another device.</span><Link href="/trips" className="btn btn-sun">Back to trips</Link></div>
  );

  const uid = session?.user.id;
  const me = trip.members.find((m) => uid && m.userId === uid) ?? trip.members.find((m) => m.role === "owner") ?? trip.members[0];
  const canManage = me.role === "owner" || me.role === "treasurer";
  const phase = tripPhase(trip);
  const d = daysUntil(trip.start);
  const readyPct = Math.round((trip.members.reduce((a, m) => a + READY_ITEMS.filter((i) => trip.checklist[m.id]?.[i.id]).length, 0) / Math.max(1, trip.members.length * READY_ITEMS.length)) * 100);
  const occ = OCCASIONS.find((o) => o.id === trip.occasion);
  const props = { trip, me, canManage, update };
  const c = countryByCode(trip.country);

  return (
    <div className="stack-lg fade-in">
      {q.get("new") && <div className="note">🎉 Trip created! Invite your crew from the <button type="button" className="linkish" onClick={() => pick("crew")}>Crew tab</button>, then start planning.</div>}
      <div className="poster" style={{ minHeight: 190 }}>
        <PosterArt code={trip.country + trip.id.slice(0, 4)} region={c?.region ?? "africa"} id={trip.id} />
        <div className="p-top"><span className="p-flag">{flag(trip.country)}</span>
          <span className="glass-pill">{phase === "now" ? "On the trip 🎉" : phase === "past" ? "Done ✓" : d != null ? `${d} days to go` : "Planning"}</span></div>
        <div className="stack" style={{ gap: 4, position: "relative" }}>
          <span className="p-name">{trip.name}</span>
          <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>{nameOf(trip.country)}{trip.start ? ` · ${trip.start}${trip.end ? ` → ${trip.end}` : ""}` : ""}{occ && occ.id !== "none" ? ` · ${occ.emoji} ${occ.label}` : ""}</span>
        </div>
      </div>

      <div className="grid-3 kpis">
        <div className="kpi"><strong>{trip.members.length}</strong><span>in the crew</span></div>
        <div className="kpi"><strong>{readyPct}%</strong><span>ready to fly</span></div>
        <div className="kpi"><strong>{trip.pot.target ? `${Math.round((potRaised(trip) / trip.pot.target) * 100)}%` : "—"}</strong><span>pot filled</span></div>
      </div>

      <div className="tabs-row" role="tablist" aria-label="Trip sections">
        {TABS.map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={tab === k} className="tab-pill" onClick={() => pick(k)}>{l}</button>)}
      </div>

      <div role="tabpanel">
        {tab === "plan" && <PlanTab {...props} />}
        {tab === "ready" && <ReadyTab {...props} />}
        {tab === "vote" && <VoteTab {...props} />}
        {tab === "pot" && <PotTab {...props} />}
        {tab === "split" && <SplitTab {...props} />}
        {tab === "safety" && <SafetyPanel trip={trip} update={update} />}
        {tab === "crew" && <CrewTab {...props} />}
      </div>

      <div className="row">
        {c && <Link href={`/discover/${c.slug}`} className="btn btn-ghost btn-sm">About {nameOf(trip.country)} →</Link>}
        <Link href={`/ask?q=${encodeURIComponent(`Help me plan ${trip.name} in ${nameOf(trip.country)}`)}`} className="btn btn-ghost btn-sm">✨ Ask Aviora about this trip</Link>
        <Link href="/deals" className="btn btn-ghost btn-sm">Stays & flights deals</Link>
      </div>
    </div>
  );
}

export default function TripPage() {
  return <Suspense fallback={<div className="muted">Loading…</div>}><TripView /></Suspense>;
}
