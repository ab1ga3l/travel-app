"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { EVENTS, eventSearchUrl, type EventTag } from "@/lib/events";
import { tagsFor } from "@/lib/interestTags";
import { useApp } from "@/lib/store";
import { flag, nameOf } from "@/lib/world";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TAGS: [EventTag, string][] = [["music", "🎶 Music"], ["culture", "🎭 Culture"], ["tech", "💻 Tech"], ["sports", "🏟️ Sports"], ["faith", "🕌 Faith"], ["food", "🍲 Food"], ["nature", "🌿 Nature"]];

function Events() {
  const q = useSearchParams();
  const { profile } = useApp();
  const mine = tagsFor(profile?.interests);
  const [month, setMonth] = useState<number | 0>(0);
  const [tags, setTags] = useState<EventTag[]>(mine);
  const [text, setText] = useState(q.get("q") ?? "");
  const now = new Date().getMonth() + 1;

  const list = useMemo(() => {
    const t = text.trim().toLowerCase();
    const soon = (m: number[]) => Math.min(...m.map((x) => (x - now + 12) % 12));
    return EVENTS.filter((e) => (!month || e.months.includes(month)) && (!tags.length || e.tags.some((x) => tags.includes(x))) && (!t || `${e.name} ${e.city} ${nameOf(e.country)}`.toLowerCase().includes(t)))
      .sort((a, b) => soon(a.months) - soon(b.months));
  }, [month, tags, text, now]);

  return (
    <div className="stack-lg fade-in">
      <div className="stack" style={{ gap: 8 }}>
        <span className="eyebrow">Festivals & events</span>
        <h1>Plan a trip <span className="gradient-text">around a moment.</span></h1>
        <p className="muted">Usual months are shown. Dates move each year, so always check the official announcement before you book.</p>
      </div>
      <input aria-label="Search events" placeholder="Search by name, city or country" value={text} onChange={(e) => setText(e.target.value)} style={{ maxWidth: 420 }} />
      <div className="chips">{TAGS.map(([t, l]) => <button key={t} type="button" className="chip" aria-pressed={tags.includes(t)} onClick={() => setTags(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])}>{l}</button>)}</div>
      <div className="tabs-row" role="tablist" aria-label="Month">
        <button type="button" role="tab" aria-selected={month === 0} className="tab-pill" onClick={() => setMonth(0)}>Any month</button>
        {MONTHS.map((m, i) => <button key={m} type="button" role="tab" aria-selected={month === i + 1} className="tab-pill" onClick={() => setMonth(i + 1)}>{m}</button>)}
      </div>
      {list.length === 0 ? <div className="empty">Nothing matches. Try another month or fewer filters.</div> : (
        <div className="grid">
          {list.map((e) => (
            <article key={e.name} className="card" style={{ gap: 8 }}>
              <div className="between"><span style={{ fontSize: "1.6rem" }}>{flag(e.country)}</span><span className="badge tone-easy">{e.months.map((m) => MONTHS[m - 1]).join(" · ")}</span></div>
              <h3>{e.name}</h3>
              <span className="muted" style={{ fontSize: "0.85rem" }}>{e.city}, {nameOf(e.country)}</span>
              <p style={{ fontSize: "0.9rem" }}>{e.blurb}</p>
              <div className="chips">{e.tags.map((t) => <span key={t} className="badge tone-lilac">{t}</span>)}</div>
              <div className="row">
                <Link href={`/trips/new?country=${e.country}&month=${e.months[0]}&occasion=festival&name=${encodeURIComponent(e.name)}`} className="btn btn-sun btn-sm">Plan a trip around this</Link>
                <a href={eventSearchUrl(e)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">Check dates ↗</a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  return <Suspense fallback={<div className="muted">Loading…</div>}><Events /></Suspense>;
}
