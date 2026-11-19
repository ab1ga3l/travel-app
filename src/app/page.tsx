"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CountryCard, GemCard } from "@/components/Cards";
import { SectionHead } from "@/components/bits";
import { TripCard } from "@/components/TripCard";
import { TONE_COLORS, WorldMap } from "@/components/WorldMap";
import { COUNTRIES } from "@/lib/countries";
import { continentOf } from "@/lib/geo";
import { EVENTS } from "@/lib/events";
import { GEMS } from "@/lib/gems";
import { tagsFor } from "@/lib/interestTags";
import { matchScore } from "@/lib/match";
import { APP, vibeInfo } from "@/lib/site";
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
  const [group, setGroup] = useState<(typeof GROUPS)[number]["id"]>("free");
  const [africaOnly, setAfricaOnly] = useState(false);
  const nick = profile?.assistantNickname || APP.assistant;

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
    if (profile?.passport) m[profile.passport] = "var(--lilac)";
    return m;
  }, [row, profile?.passport]);

  const picks = useMemo(() => {
    if (!profile) return [];
    return COUNTRIES.filter((c) => c.code !== profile.passport)
      .map((c) => ({ c, s: matchScore(c, profile.vibes) + ease(row?.[c.code] as VisaCode) * 12 + (c.region === "africa" ? 4 : 0) }))
      .sort((a, b) => b.s - a.s).slice(0, 10).map((x) => x.c);
  }, [profile, row]);

  const gems = useMemo(() => {
    const vs = profile?.vibes ?? [];
    return GEMS.filter((g) => g.kind === "hidden" && (!vs.length || g.vibes.some((v) => vs.includes(v)))).slice(0, 10);
  }, [profile]);

  const events = useMemo(() => {
    const tags = tagsFor(profile?.interests);
    const soon = (m: number[]) => Math.min(...m.map((x) => (x - MONTH + 12) % 12));
    return EVENTS.filter((e) => !tags.length || e.tags.some((t) => tags.includes(t))).sort((a, b) => soon(a.months) - soon(b.months)).slice(0, 8);
  }, [profile?.interests]);

  if (!ready || !profile) return <div className="muted">Loading…</div>;
  const active = tripDocs.filter((t) => tripPhase(t) !== "past").sort((a, b) => (a.start ?? "9").localeCompare(b.start ?? "9"));
  const been = places.filter((p) => p.status === "been").length;
  const easy = lists.free.length + lists.voa.length;
  const shown = lists[group].filter((x) => !africaOnly || continentOf(x.code) === "Africa");

  return (
    <div className="stack-lg fade-in">
      <section className="hero">
        <div className="hero-grid">
          <div className="stack" style={{ gap: 14 }}>
            <span className="eyebrow">Hey {profile.name || "traveller"} {flag(profile.passport)}</span>
            <h1>Where are we <span className="gradient-text">going next?</span></h1>
            <div className="chips">
              {profile.vibes.map((v) => <span key={v} className="badge tone-lilac">{vibeInfo(v).emoji} {vibeInfo(v).label}</span>)}
              <Link href="/profile" className="badge tone-unknown">Edit</Link>
            </div>
            <div className="row">
              <Link href="/trips/new" className="btn btn-sun">＋ Plan a trip</Link>
              <Link href="/ask" className="btn btn-ghost">✨ Ask {nick}</Link>
            </div>
          </div>
          <div className="grid-2 kpis">
            <div className="card card-soft kpi"><strong className="gradient-text">{row ? easy : "…"}</strong><span>countries visa-free or on arrival with your {nameOf(profile.passport)} passport</span></div>
            <div className="card card-soft kpi"><strong style={{ color: "var(--gold)" }}>{row ? lists.online.length : "…"}</strong><span>more with an eVisa or online authorisation</span></div>
            <Link href="/map" className="card card-soft kpi hover-lift"><strong style={{ color: "var(--mint)" }}>{been}</strong><span>countries on your map →</span></Link>
            <Link href="/trips" className="card card-soft kpi hover-lift"><strong>{active.length}</strong><span>trips in the works →</span></Link>
          </div>
        </div>
      </section>

      {active.length > 0 && (
        <section className="section">
          <SectionHead eyebrow="Your trips" title="Coming up" action={<Link href="/trips" className="btn btn-ghost btn-sm">All trips</Link>} />
          <div className="grid">{active.slice(0, 3).map((t) => <TripCard key={t.id} t={t} />)}</div>
        </section>
      )}

      <section className="section">
        <SectionHead eyebrow={`${flag(profile.passport)} Your passport`} title="Where you can go" sub={`Tap a country on the map, or browse the lists. Data: ${VISA_SOURCE.name}, updated ${VISA_SOURCE.updated}. Always confirm with the official source before you book.`} />
        <div className="card" style={{ padding: 12 }}>
          <WorldMap colors={colors} onPick={(c) => router.push(`/visa/${profile.passport.toLowerCase()}/${c.toLowerCase()}`)} label={`Visa map for ${nameOf(profile.passport)} passport holders`} />
          <div className="legend" style={{ padding: "8px 4px 0" }}>
            <span><i style={{ background: "var(--mint)" }} />Visa-free / on arrival</span>
            <span><i style={{ background: "var(--gold)" }} />eVisa / online</span>
            <span><i style={{ background: "var(--sunrise)" }} />Visa required</span>
            <span><i style={{ background: "var(--lilac)" }} />Home</span>
          </div>
        </div>
        <div className="tabs-row" role="tablist" aria-label="Visa groups">
          {GROUPS.map((g) => <button key={g.id} type="button" role="tab" aria-selected={group === g.id} className="tab-pill" onClick={() => setGroup(g.id)}>{g.title} · {lists[g.id].length}</button>)}
          <button type="button" className="chip" aria-pressed={africaOnly} onClick={() => setAfricaOnly(!africaOnly)}>🌍 Africa only</button>
        </div>
        <div className="card" style={{ gap: 10 }}>
          <span className="muted" style={{ fontSize: "0.85rem" }}>{GROUPS.find((g) => g.id === group)?.hint}</span>
          {!row ? <span className="muted">Loading your passport…</span> : shown.length === 0 ? <span className="muted">None here.</span> : (
            <div className="list-cols">
              {shown.map((x) => (
                <Link key={x.code} href={`/visa/${profile.passport.toLowerCase()}/${x.code.toLowerCase()}`}>
                  {flag(x.code)} {nameOf(x.code)}{typeof x.v === "number" ? <span className="muted"> · {x.v}d</span> : null}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <SectionHead eyebrow="Picked for your vibe and passport" title="Go now" sub="Sorted by fit, how easy the visa is, and the weather this month." action={<Link href="/discover" className="btn btn-ghost btn-sm">Explore all</Link>} />
        <div className="scroll-x">{picks.map((c) => <CountryCard key={c.code} c={c} width={290} />)}</div>
      </section>

      {events.length > 0 && (
        <section className="section">
          <SectionHead eyebrow="For your interests" title="Festivals & events coming up" action={<Link href="/events" className="btn btn-ghost btn-sm">All events</Link>} />
          <div className="scroll-x">
            {events.map((e) => (
              <Link key={e.name} href={`/events?q=${encodeURIComponent(e.name)}`} className="card hover-lift" style={{ width: 260, gap: 6 }}>
                <span style={{ fontSize: "1.5rem" }}>{flag(e.country)}</span>
                <h3>{e.name}</h3>
                <span className="muted" style={{ fontSize: "0.82rem" }}>{e.city} · {e.months.map((m) => MONTHS[m - 1]).join(", ")}</span>
                <p className="muted" style={{ fontSize: "0.85rem" }}>{e.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <SectionHead eyebrow="Worth it?" title="Hidden gems for you" sub="Quieter alternatives to the places everyone posts. Feel them before you go." />
        <div className="scroll-x">{gems.map((g) => <GemCard key={g.id} gem={g} width={280} />)}</div>
      </section>

      <section className="grid-3">
        <Link href="/move" className="card hover-lift" style={{ gap: 6 }}><span style={{ fontSize: "1.6rem" }}>🏡</span><h3>Thinking of moving abroad?</h3><p className="muted" style={{ fontSize: "0.88rem" }}>Routes, costs, a timeline and what to avoid.</p></Link>
        <Link href="/safety" className="card hover-lift" style={{ gap: 6 }}><span style={{ fontSize: "1.6rem" }}>🛡️</span><h3>Safety check-in</h3><p className="muted" style={{ fontSize: "0.88rem" }}>One tap tells someone you arrived safely.</p></Link>
        <Link href="/community" className="card hover-lift" style={{ gap: 6 }}><span style={{ fontSize: "1.6rem" }}>💬</span><h3>Meet people who&apos;ve been</h3><p className="muted" style={{ fontSize: "0.88rem" }}>Ask travellers who were just there.</p></Link>
      </section>
    </div>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
