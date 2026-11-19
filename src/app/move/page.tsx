"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { COUNTRIES, countryByCode } from "@/lib/countries";
import { EXTRAS } from "@/lib/countryExtras";
import { convert, currencyOf, fmtMoney, getRates, payMethodsOf } from "@/lib/geo";
import { useApp, useVisaRow } from "@/lib/store";
import { flag, nameOf, visaLabel, type VisaCode } from "@/lib/world";

type Why = "work" | "remote" | "study" | "business" | "family" | "retire";
const WHYS: [Why, string][] = [["work", "💼 A job offer"], ["remote", "💻 Remote work / nomad"], ["study", "🎓 Study"], ["business", "🚀 Start a business"], ["family", "💞 Join family or partner"], ["retire", "🌴 Retire or slow down"]];
const ROUTE_HINT: Record<Why, RegExp> = {
  work: /work|employ|skill|blue|talent|job|class d/i, remote: /nomad|remote|digital/i, study: /stud/i, business: /invest|business|entrepreneur|start|golden|class g/i, family: /depend|family|spouse|partner/i, retire: /retire|passive|pension|golden|d7/i,
};
const SCAMS = [
  "Anyone who “guarantees” a visa for a fee. Only governments approve visas; agents can only help with paperwork.",
  "Fake job offers that ask you to pay for a work permit or “processing”. Real employers pay these.",
  "Landlords who want a deposit before you've seen the place or signed anything. View first, or send a trusted friend.",
  "Unofficial eVisa websites that charge several times the official fee. Use the government site we link to.",
  "Currency exchangers on the street. Use banks, mobile money or licensed bureaus.",
];
const SETTLE = ["Get a local SIM and mobile money or a bank account", "Register with your embassy", "Find a doctor and get health cover", "Learn 20 phrases in the local language", "Join a community group for people from home", "Sort tax: where you pay and what you declare"];

interface Ans { to: string; why: Why; months: number; people: number; budget: string }

export default function Move() {
  const { ready, profile } = useApp();
  const row = useVisaRow(profile?.passport);
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Ans>({ to: "", why: "remote", months: 6, people: 1, budget: "" });
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  useEffect(() => { getRates().then((r) => r && setRates(r.rates)); }, []);

  const homeCur = profile?.currency ?? currencyOf(profile?.home ?? profile?.passport ?? "KE");
  const options = useMemo(() => COUNTRIES.filter((c) => EXTRAS[c.code] && c.code !== profile?.passport), [profile?.passport]);
  if (!ready || !profile) return <div className="muted">Loading…</div>;

  const toUSD = (usd: number) => (rates ? convert(usd, "USD", homeCur, rates) : null);
  const money = (usd: number) => { const v = toUSD(usd); return v == null ? `$${Math.round(usd).toLocaleString()}` : fmtMoney(v, homeCur); };

  if (step < 4) {
    return (
      <div className="stack-lg fade-in onb" style={{ maxWidth: 720 }}>
        <div className="stack" style={{ gap: 8 }}>
          <span className="eyebrow">Move abroad · step {step + 1} of 4</span>
          <h1>{["Where are you dreaming of?", "Why are you moving?", "When, and who's coming?", "What can you spend each month?"][step]}</h1>
        </div>
        <div className="progress"><i style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>
        {step === 0 && (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
            {options.map((c) => (
              <button key={c.code} type="button" className="chip" aria-pressed={a.to === c.code} style={{ justifyContent: "flex-start" }} onClick={() => { setA({ ...a, to: c.code }); setStep(1); }}>
                {flag(c.code)} {c.name}
              </button>
            ))}
          </div>
        )}
        {step === 1 && <div className="chips">{WHYS.map(([w, l]) => <button key={w} type="button" className="chip" aria-pressed={a.why === w} onClick={() => { setA({ ...a, why: w }); setStep(2); }}>{l}</button>)}</div>}
        {step === 2 && (
          <div className="stack" style={{ gap: 14 }}>
            <div><span className="lbl">How soon?</span><div className="chips">{[[3, "In 3 months"], [6, "In 6 months"], [12, "In a year"], [24, "Someday"]].map(([m, l]) => <button key={m} type="button" className="chip" aria-pressed={a.months === m} onClick={() => setA({ ...a, months: m as number })}>{l}</button>)}</div></div>
            <div><span className="lbl">Who&apos;s moving?</span><div className="chips">{[[1, "Just me"], [2, "Me + partner"], [3, "Family of 3"], [4, "Family of 4+"]].map(([n, l]) => <button key={n} type="button" className="chip" aria-pressed={a.people === n} onClick={() => setA({ ...a, people: n as number })}>{l}</button>)}</div></div>
          </div>
        )}
        {step === 3 && (
          <div><label className="lbl" htmlFor="mb">Monthly budget in {homeCur} (optional)</label><input id="mb" type="number" min={0} value={a.budget} onChange={(e) => setA({ ...a, budget: e.target.value })} placeholder="We'll compare it to real costs" /></div>
        )}
        <div className="row">
          {step > 0 && <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>Back</button>}
          {step >= 2 && <button type="button" className="btn btn-sun" onClick={() => setStep(step + 1)}>{step === 3 ? "Build my move plan ✨" : "Next"}</button>}
        </div>
      </div>
    );
  }

  const c = countryByCode(a.to)!;
  const ex = EXTRAS[a.to];
  const routes = [...ex.living.routes].sort((x, y) => Number(ROUTE_HINT[a.why].test(y)) - Number(ROUTE_HINT[a.why].test(x)));
  const scale = a.people === 1 ? 1 : a.people === 2 ? 1.6 : 1.6 + (a.people - 2) * 0.35;
  const cost = { rent: ex.living.monthlyUSD * 0.45 * scale, food: ex.living.monthlyUSD * 0.25 * scale, transport: ex.living.monthlyUSD * 0.1 * scale, other: ex.living.monthlyUSD * 0.2 * scale };
  const monthly = ex.living.monthlyUSD * scale;
  const setup = monthly * 3 + 600 * a.people; // deposit + first month + visas/flights buffer
  const budgetHome = Number(a.budget) || 0;
  const monthlyHome = toUSD(monthly);
  const fits = budgetHome && monthlyHome ? budgetHome >= monthlyHome : null;
  const v = row?.[a.to] as VisaCode | undefined;
  const timeline = [
    [a.months, "Research routes and pick one. Check the official immigration site."],
    [Math.max(a.months - 1, 0.5), "Do a scouting trip: 1–2 weeks to test neighbourhoods."],
    [Math.max(a.months * 0.6, 0.5), "Gather documents: passport (valid 12+ months), police clearance, degree certificates, bank statements."],
    [Math.max(a.months * 0.4, 0.4), "Apply for your visa or permit. Book short-term housing for the first month."],
    [Math.max(a.months * 0.2, 0.2), "Health insurance, flights, notify your bank, sort tax at home."],
    [0, "Land, get a SIM and mobile money, register, find your community."],
  ] as const;

  return (
    <div className="stack-lg fade-in">
      <div className="stack" style={{ gap: 8 }}>
        <span className="eyebrow">Your move plan</span>
        <h1>{flag(a.to)} Moving to <span className="gradient-text">{c.name}</span></h1>
        <p className="muted">{ex.living.note}</p>
        <div className="row"><button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(0)}>Change answers</button><Link href={`/discover/${c.slug}`} className="btn btn-ghost btn-sm">Country guide</Link></div>
      </div>

      <div className="grid-3 kpis">
        <div className="card kpi"><strong>{money(monthly)}</strong><span>typical monthly cost for {a.people === 1 ? "one person" : `${a.people} people`}</span></div>
        <div className="card kpi"><strong>{money(setup)}</strong><span>to set up (deposit, first month, permits, flights)</span></div>
        <div className="card kpi"><strong className={fits === false ? "" : ""} style={{ color: fits == null ? undefined : fits ? "var(--mint)" : "var(--sunrise)" }}>{fits == null ? "—" : fits ? "Fits ✓" : "Tight"}</strong><span>{fits == null ? (budgetHome ? "live exchange rates unavailable right now" : "add a budget to compare") : `vs your ${fmtMoney(budgetHome, homeCur)} a month`}</span></div>
      </div>

      <section className="card" style={{ gap: 10 }}>
        <h2>🛂 Your routes in</h2>
        {v != null && <p>To visit first with your {nameOf(profile.passport)} passport: <span className={`badge tone-${visaLabel(v).tone}`}>{visaLabel(v).label}</span></p>}
        {routes.map((r, i) => (
          <div key={r} className="between" style={{ padding: "8px 0", borderTop: "1px solid var(--line)" }}>
            <span>{r}</span>{i === 0 && ROUTE_HINT[a.why].test(r) && <span className="badge tone-free">Best fit for you</span>}
          </div>
        ))}
        <p className="muted" style={{ fontSize: "0.82rem" }}>Route names are real programmes as of November 2026. Rules, fees and income thresholds change often, so confirm on the official immigration site before you pay anything.</p>
        <Link href={`/visa/${profile.passport.toLowerCase()}/${a.to.toLowerCase()}`} className="btn btn-soft btn-sm" style={{ justifySelf: "start" }}>Entry rules for your passport →</Link>
      </section>

      <section className="card" style={{ gap: 10 }}>
        <h2>🗓️ Your timeline</h2>
        {timeline.map(([m, t], i) => (
          <div key={i} className="row" style={{ gap: 12, flexWrap: "nowrap", alignItems: "start" }}>
            <span className="badge tone-lilac" style={{ minWidth: 92, justifyContent: "center" }}>{m === 0 ? "Move day" : m >= 1 ? `${Math.round(m)} mo before` : `${Math.round(m * 4)} wk before`}</span>
            <span style={{ fontSize: "0.92rem" }}>{t}</span>
          </div>
        ))}
      </section>

      <section className="card" style={{ gap: 10 }}>
        <h2>💸 Monthly costs, in {rates ? homeCur : "USD"}</h2>
        {Object.entries(cost).map(([k, val]) => (
          <div key={k} className="row" style={{ gap: 10, flexWrap: "nowrap" }}>
            <span style={{ width: 90, textTransform: "capitalize", fontSize: "0.88rem" }}>{k}</span>
            <div className="bar" style={{ flex: 1 }}><i style={{ width: `${(val / monthly) * 100}%`, background: "var(--grad-sun)" }} /></div>
            <strong style={{ minWidth: 110, textAlign: "right", fontSize: "0.88rem" }}>{money(val)}</strong>
          </div>
        ))}
        <p className="muted" style={{ fontSize: "0.82rem" }}>Estimates for a comfortable mid-range life in the main city. Pay locally with {payMethodsOf(a.to).slice(0, 2).join(" or ")}.</p>
      </section>

      <section className="grid-2">
        <div className="card" style={{ gap: 8 }}>
          <h2>🏠 Settling in</h2>
          {SETTLE.map((s) => <span key={s} style={{ fontSize: "0.9rem" }}>⬜ {s}</span>)}
        </div>
        <div className="card" style={{ gap: 8 }}>
          <h2>🤝🏾 Culture</h2>
          {ex.dos.map((d) => <span key={d} style={{ fontSize: "0.9rem" }}>👍🏾 {d}</span>)}
          {ex.donts.map((d) => <span key={d} style={{ fontSize: "0.9rem" }}>🙅🏾 {d}</span>)}
        </div>
      </section>

      <section className="card" style={{ gap: 8 }}>
        <h2>🚩 Scams to avoid</h2>
        {SCAMS.map((s) => <span key={s} style={{ fontSize: "0.9rem" }}>• {s}</span>)}
      </section>

      <section className="grid-2">
        <Link href={`/trips/new?country=${a.to}&name=${encodeURIComponent(`Scouting ${c.name}`)}`} className="card hover-lift glow" style={{ gap: 6 }}><span style={{ fontSize: "1.6rem" }}>🔎</span><h3>Plan a scouting trip</h3><p className="muted" style={{ fontSize: "0.88rem" }}>Spend 1–2 weeks living like a local before you commit.</p></Link>
        <Link href={`/community?country=${a.to}`} className="card hover-lift" style={{ gap: 6 }}><span style={{ fontSize: "1.6rem" }}>💬</span><h3>Talk to people who moved</h3><p className="muted" style={{ fontSize: "0.88rem" }}>Ask the community what they wish they&apos;d known.</p></Link>
      </section>

      <section className="section">
        <h2>Compare with</h2>
        <div className="chips">{options.filter((o) => o.code !== a.to).slice(0, 20).map((o) => <button key={o.code} type="button" className="chip" aria-pressed={compare.includes(o.code)} onClick={() => setCompare(compare.includes(o.code) ? compare.filter((x) => x !== o.code) : [...compare, o.code].slice(-3))}>{flag(o.code)} {o.name}</button>)}</div>
        {compare.length > 0 && (
          <div className="card" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead><tr><th style={{ textAlign: "left", padding: 6 }}></th>{[a.to, ...compare].map((x) => <th key={x} style={{ textAlign: "left", padding: 6 }}>{flag(x)} {nameOf(x)}</th>)}</tr></thead>
              <tbody>
                <tr><td style={{ padding: 6 }} className="muted">Monthly</td>{[a.to, ...compare].map((x) => <td key={x} style={{ padding: 6 }}>{money(EXTRAS[x].living.monthlyUSD * scale)}</td>)}</tr>
                <tr><td style={{ padding: 6 }} className="muted">To visit</td>{[a.to, ...compare].map((x) => <td key={x} style={{ padding: 6 }}><span className={`badge tone-${visaLabel(row?.[x] as VisaCode).tone}`}>{visaLabel(row?.[x] as VisaCode).label}</span></td>)}</tr>
                <tr><td style={{ padding: 6 }} className="muted">Routes</td>{[a.to, ...compare].map((x) => <td key={x} style={{ padding: 6 }}>{EXTRAS[x].living.routes.length}</td>)}</tr>
                <tr><td style={{ padding: 6 }} className="muted">Languages</td>{[a.to, ...compare].map((x) => <td key={x} style={{ padding: 6 }}>{countryByCode(x)?.languages}</td>)}</tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
