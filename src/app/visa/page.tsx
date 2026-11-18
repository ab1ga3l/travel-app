"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GUIDE } from "@/lib/visa";
import { useApp, useVisaRow } from "@/lib/store";
import { WORLD, flag, visaLabel, type VisaCode } from "@/lib/world";

const BIG = ["FR", "DE", "ES", "IT", "PT", "NL", "GR", "GB", "US", "CA", "AE", "TR", "TH", "JP", "CN", "ZA", "KE", "RW", "GH", "MA"];

export default function VisaHome() {
  const { profile } = useApp();
  const router = useRouter();
  const [from, setFrom] = useState("NG");
  const [to, setTo] = useState("FR");
  useEffect(() => { if (profile?.passport) setFrom(profile.passport); }, [profile?.passport]);
  const row = useVisaRow(from);

  const groups = useMemo(() => {
    if (!row) return null;
    const out = { free: [] as string[], online: [] as string[], visa: [] as string[] };
    for (const [k, v] of Object.entries(row)) {
      const t = visaLabel(v as VisaCode).tone;
      if (t === "free") out.free.push(k); else if (t === "easy") out.online.push(k); else if (t === "hard") out.visa.push(k);
    }
    const nm = (c: string) => WORLD.find((w) => w.code === c)?.name ?? c;
    (Object.keys(out) as (keyof typeof out)[]).forEach((k) => out[k].sort((a, b) => nm(a).localeCompare(nm(b))));
    return out;
  }, [row]);

  return (
    <div className="stack-lg fade-in">
      <div className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">Visa centre</span>
        <h1>Everything you need, <span className="gradient-text">before you go.</span></h1>
        <p className="muted" style={{ fontSize: "1.05rem", maxWidth: "60ch" }}>Whether you need a visa, what documents and bank statements to prepare, fees, how to pay, how long you can stay, whether you can extend, and what other travellers with your passport experienced.</p>
      </div>

      <form className="card" onSubmit={(e) => { e.preventDefault(); router.push(`/visa/${from.toLowerCase()}/${to.toLowerCase()}`); }}>
        <div className="field-row" style={{ alignItems: "end" }}>
          <div><label className="lbl" htmlFor="vf">My passport</label>
            <select id="vf" value={from} onChange={(e) => setFrom(e.target.value)}>{WORLD.map((w) => <option key={w.code} value={w.code}>{flag(w.code)} {w.name}</option>)}</select></div>
          <div><label className="lbl" htmlFor="vt">Going to</label>
            <select id="vt" value={to} onChange={(e) => setTo(e.target.value)}>{WORLD.filter((w) => w.code !== from).map((w) => <option key={w.code} value={w.code}>{flag(w.code)} {w.name}</option>)}</select></div>
          <button className="btn btn-sun" type="submit" style={{ flex: "0 0 auto" }}>Check →</button>
        </div>
        {row && to && (
          <p className="muted" style={{ fontSize: "0.9rem" }}>Quick answer: <span className={`badge tone-${visaLabel(row[to] as VisaCode).tone}`}>{visaLabel(row[to] as VisaCode).label}</span></p>
        )}
      </form>

      <section className="section">
        <h2>Popular checks for {flag(from)} {WORLD.find((w) => w.code === from)?.name}</h2>
        <div className="chips">
          {BIG.filter((c) => c !== from).map((c) => {
            const v = visaLabel(row?.[c] as VisaCode | undefined);
            return <Link key={c} href={`/visa/${from.toLowerCase()}/${c.toLowerCase()}`} className="chip">{flag(c)} {WORLD.find((w) => w.code === c)?.name} <span className={`badge tone-${v.tone}`}>{row ? v.label.split(" ·")[0] : "…"}</span></Link>;
          })}
        </div>
      </section>

      {groups && (
        <section className="grid-3">
          {([["free", "✅ Just go", "Visa-free or visa on arrival", "var(--mint)"], ["online", "💻 Apply online", "eVisa or travel authorisation", "var(--gold)"], ["visa", "🏛️ Plan ahead", "Visa needed before you travel", "var(--sunrise)"]] as const).map(([k, t, s, col]) => (
            <div key={k} className="card">
              <div className="kpi"><strong style={{ color: col }}>{groups[k].length}</strong><span>{s}</span></div>
              <h3>{t}</h3>
              <div className="chips" style={{ maxHeight: 220, overflowY: "auto" }}>
                {groups[k].map((c) => <Link key={c} href={`/visa/${from.toLowerCase()}/${c.toLowerCase()}`} className="badge tone-unknown">{flag(c)} {WORLD.find((w) => w.code === c)?.name ?? c}</Link>)}
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="grid-3">
        <div className="card"><h3>✅ Give your application the best chance</h3><ul className="list">{GUIDE.bestChance.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div className="card"><h3>🚫 Avoid visa scams</h3><ul className="list">{GUIDE.scams.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div className="card"><h3>🌍 Easier trips for African passports</h3><ul className="list">{GUIDE.easier.map((x) => <li key={x}>{x}</li>)}</ul></div>
      </section>
      <p className="muted" style={{ fontSize: "0.8rem" }}>Entry rules from the open Passport Index dataset (updated Feb 2026) plus our own checks. Rules change: always confirm on official government websites.</p>
    </div>
  );
}
