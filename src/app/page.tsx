"use client";
import Link from "next/link";
import { useMemo } from "react";
import { CountryCard, GemCard } from "@/components/Cards";
import { SectionHead } from "@/components/bits";
import { COUNTRIES, countryByCode } from "@/lib/countries";
import { GEMS } from "@/lib/gems";
import { matchScore } from "@/lib/match";
import { APP, VIBES, vibeInfo } from "@/lib/site";
import { useApp, useVisaRow } from "@/lib/store";
import { flag, nameOf, type VisaCode } from "@/lib/world";

const ease = (v: VisaCode | undefined) => (v == null ? 1 : typeof v === "number" || v === "vf" || v === "voa" ? 3 : v === "eta" || v === "ev" ? 2 : v === "vr" ? 1 : 0);

export default function Home() {
  const { ready, profile, trips } = useApp();
  const row = useVisaRow(profile?.passport);

  const picks = useMemo(() => {
    if (!profile) return COUNTRIES.filter((c) => c.region === "africa").slice(0, 8);
    return COUNTRIES.filter((c) => c.code !== profile.passport)
      .map((c) => ({ c, s: matchScore(c, profile.vibes) + ease(row?.[c.code] as VisaCode) * 12 }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 10)
      .map((x) => x.c);
  }, [profile, row]);

  const gems = useMemo(() => {
    const vs = profile?.vibes ?? [];
    return GEMS.filter((g) => g.kind === "hidden" && (!vs.length || g.vibes.some((v) => vs.includes(v)))).slice(0, 10);
  }, [profile]);

  const easyCount = row ? Object.values(row).filter((v) => typeof v === "number" || v === "vf" || v === "voa").length : null;
  const onlineCount = row ? Object.values(row).filter((v) => v === "eta" || v === "ev").length : null;
  const upcoming = trips.filter((t) => t.status === "going").sort((a, b) => (a.start ?? "9").localeCompare(b.start ?? "9"));

  if (!ready) return <div className="muted">Loading…</div>;

  return (
    <div className="stack-lg fade-in">
      {!profile ? (
        <section className="hero">
          <div className="hero-grid">
            <div className="stack" style={{ gap: 18 }}>
              <span className="eyebrow">{APP.name} · {APP.meaning}</span>
              <h1>Know before you go.<br /><span className="gradient-text">Then go.</span></h1>
              <p className="muted" style={{ fontSize: "1.1rem", maxWidth: "46ch" }}>
                Places that match your vibe, the hidden gems locals love, every visa detail for <em>your</em> passport, and a map of everywhere you&apos;ve been.
              </p>
              <div className="row">
                <Link href="/start" className="btn btn-sun">Find my travel vibe →</Link>
                <Link href="/visa" className="btn btn-ghost">Check a visa</Link>
              </div>
            </div>
            <div className="grid-2">
              {[
                ["🛂", "Visa truth", "Free, eVisa or full visa for your passport, plus documents, fees and real stories."],
                ["🌊", "Feel it first", "See and hear a place before you book, even without VR."],
                ["💎", "Hidden gems", "Quieter spots locals love, rated worth it or skip it."],
                ["🗺️", "Your world", "Map where you've been, where you're going and dream trips."],
              ].map(([e, t, d]) => (
                <div key={t} className="card card-soft" style={{ gap: 6 }}>
                  <span style={{ fontSize: "1.6rem" }} aria-hidden="true">{e}</span>
                  <h3>{t}</h3>
                  <p className="muted" style={{ fontSize: "0.88rem" }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="hero">
          <div className="hero-grid">
            <div className="stack" style={{ gap: 14 }}>
              <span className="eyebrow">Hey {profile.name || "traveller"} {flag(profile.passport)}</span>
              <h1>Where are we <span className="gradient-text">going next?</span></h1>
              <div className="chips">
                {profile.vibes.map((v) => <span key={v} className="badge tone-lilac">{vibeInfo(v).emoji} {vibeInfo(v).label}</span>)}
                <Link href="/start" className="badge tone-unknown">Edit vibe</Link>
              </div>
            </div>
            <div className="grid-2">
              <div className="card card-soft kpi"><strong className="gradient-text">{easyCount ?? "…"}</strong><span>countries visa-free or visa on arrival with your {nameOf(profile.passport)} passport</span></div>
              <div className="card card-soft kpi"><strong style={{ color: "var(--gold)" }}>{onlineCount ?? "…"}</strong><span>more with an eVisa or online authorisation</span></div>
              <Link href="/trips" className="card card-soft kpi hover-lift"><strong style={{ color: "var(--mint)" }}>{trips.filter((t) => t.status === "been").length}</strong><span>countries you&apos;ve been to →</span></Link>
              <Link href="/ask" className="card card-soft kpi hover-lift"><strong>✨</strong><span>Ask {APP.assistant} anything about your next trip →</span></Link>
            </div>
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="section">
          <SectionHead eyebrow="Coming up" title="Your next trips" action={<Link href="/trips" className="btn btn-ghost btn-sm">All trips</Link>} />
          <div className="scroll-x">
            {upcoming.map((t) => {
              const c = countryByCode(t.country);
              return (
                <Link key={t.id} href={c ? `/discover/${c.slug}` : `/visa/${profileOr(profile?.passport)}/${t.country.toLowerCase()}`} className="card hover-lift" style={{ width: 260 }}>
                  <span style={{ fontSize: "1.6rem" }}>{flag(t.country)}</span>
                  <h3>{nameOf(t.country)}</h3>
                  <span className="muted" style={{ fontSize: "0.85rem" }}>{t.start ? `From ${t.start}` : "Dates not set"}</span>
                  <span className="badge tone-easy" style={{ justifySelf: "start" }}>Check visa & packing →</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="section">
        <SectionHead eyebrow={profile ? "Picked for your vibe and passport" : "Start with Africa"} title={profile ? "Go now" : "Easy trips to start with"}
          sub={profile ? "Sorted by how well they fit you, how easy the visa is, and the weather this month." : undefined}
          action={<Link href="/discover" className="btn btn-ghost btn-sm">Discover all</Link>} />
        <div className="scroll-x">
          {picks.map((c) => <CountryCard key={c.code} c={c} width={290} />)}
        </div>
      </section>

      <section className="section">
        <SectionHead eyebrow="Worth it?" title="Hidden gems for you" sub="Quieter alternatives to the places everyone posts. Feel them before you go." />
        <div className="scroll-x">
          {gems.map((g) => <GemCard key={g.id} gem={g} width={280} />)}
        </div>
      </section>

      {!profile && (
        <section className="section">
          <SectionHead eyebrow="Pick a mood" title="What kind of trip?" />
          <div className="chips">
            {VIBES.map((v) => <Link key={v.id} href={`/discover?vibe=${v.id}`} className="chip">{v.emoji} {v.label}</Link>)}
          </div>
        </section>
      )}
    </div>
  );
}

const profileOr = (p?: string) => (p ?? "ng").toLowerCase();
