"use client";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COUNTRIES } from "@/lib/countries";
import { matchScore } from "@/lib/match";
import { APP, OCCASIONS, OCCASION_PICKS, VIBES, type Occasion, type Vibe } from "@/lib/site";
import { useApp, useVisaRow } from "@/lib/store";
import { buildTrip, type TripAnswers } from "@/lib/tripBuild";
import { WORLD, flag, nameOf, visaLabel, type VisaCode } from "@/lib/world";

type Mode = "choose" | "guide" | "manual";
const STEPS = ["What", "Occasion", "Who", "Where", "When", "Budget", "Review"] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function NewTrip() {
  const sp = useSearchParams();
  const router = useRouter();
  const { profile, session, saveTrip } = useApp();
  const row = useVisaRow(profile?.passport);
  const [mode, setMode] = useState<Mode>(sp.get("mode") === "manual" ? "manual" : sp.get("country") ? "guide" : "choose");
  const [step, setStep] = useState(0);
  const [a, setA] = useState<TripAnswers>({
    country: sp.get("country")?.toUpperCase() || "", vibes: profile?.vibes ?? [], occasion: (sp.get("occasion") as Occasion) || "none",
    company: profile?.company ?? "friends", people: profile?.company === "solo" ? 1 : profile?.company === "couple" ? 2 : 4,
    month: sp.get("month") ? Number(sp.get("month")) : undefined, name: sp.get("name") ?? undefined, budgetPerPerson: 0, currency: profile?.currency ?? "USD", friends: [],
  });
  const [flex, setFlex] = useState(!!sp.get("month"));
  const [text, setText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => { if (profile) setA((x) => ({ ...x, vibes: x.vibes.length ? x.vibes : profile.vibes, currency: profile.currency ?? x.currency })); }, [profile]);

  const suggestions = useMemo(() => {
    const occ = OCCASION_PICKS[a.occasion]?.countries ?? [];
    const month = a.month ?? (a.start ? new Date(a.start).getMonth() + 1 : undefined);
    return COUNTRIES.filter((c) => c.code !== profile?.passport)
      .map((c) => {
        const v = visaLabel(row?.[c.code] as VisaCode | undefined).tone;
        const s = matchScore(c, a.vibes, month) + (v === "free" ? 25 : v === "easy" ? 12 : 0) + (occ.includes(c.code) ? 20 : 0);
        return { c, s, v };
      })
      .sort((x, y) => y.s - x.s).slice(0, 6);
  }, [a.vibes, a.occasion, a.month, a.start, row, profile?.passport]);

  if (!profile) return <div className="muted">Loading…</div>;

  const toggleVibe = (v: Vibe) => setA({ ...a, vibes: a.vibes.includes(v) ? a.vibes.filter((x) => x !== v) : [...a.vibes, v] });
  const create = async () => {
    if (!a.country) { setMsg("Pick a destination first."); return; }
    const t = buildTrip(a, profile, session?.user.id);
    await saveTrip(t);
    router.replace(`/trips/${t.id}?new=1`);
  };
  const parse = async () => {
    setParsing(true); setMsg("");
    try {
      const r = await fetch("/api/plan-parse", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, currency: a.currency }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      const x = j.answers;
      setA((p) => ({
        ...p, name: x.trip_name || p.name, country: /^[A-Z]{2}$/.test(x.country_code) ? x.country_code : p.country,
        vibes: x.vibes?.length ? x.vibes : p.vibes, occasion: x.occasion ?? p.occasion, company: x.company ?? p.company,
        people: x.people > 0 ? x.people : p.people, month: x.month > 0 ? x.month : p.month, start: x.start || p.start, end: x.end || p.end,
        budgetPerPerson: x.budget_per_person > 0 ? x.budget_per_person : p.budgetPerPerson,
      }));
      if (x.month > 0) setFlex(true);
      setStep(STEPS.length - 1);
    } catch (e) { setMsg(e instanceof Error && e.message ? e.message : "Couldn't read that. Try the questions."); }
    finally { setParsing(false); }
  };

  if (mode === "choose") {
    return (
      <div className="stack-lg fade-in" style={{ maxWidth: 680 }}>
        <div className="stack" style={{ gap: 8 }}>
          <span className="eyebrow">{sp.get("first") ? `Welcome, ${profile.name || "traveller"} 👋🏾` : "New trip"}</span>
          <h1>Where to <span className="gradient-text">next?</span></h1>
        </div>
        <button type="button" className="big-cta" onClick={() => setMode("guide")}>
          <span style={{ fontSize: "1.8rem" }} aria-hidden="true">✨</span>
          <strong>Guide me step by step</strong>
          <span>Answer a few quick questions, or just describe your dream trip. We&apos;ll build the first draft.</span>
        </button>
        <div className="grid-2">
          <button type="button" className="card hover-lift" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => setMode("manual")}>
            <span style={{ fontSize: "1.5rem" }}>✍🏾</span><h3>Create manually</h3><span className="muted" style={{ fontSize: "0.88rem" }}>You know where and when. Just set it up.</span>
          </button>
          <Link href="/discover" className="card hover-lift">
            <span style={{ fontSize: "1.5rem" }}>🧭</span><h3>Just exploring</h3><span className="muted" style={{ fontSize: "0.88rem" }}>Browse places, gems and events first.</span>
          </Link>
        </div>
        <Link href="/join" className="btn btn-ghost" style={{ justifySelf: "start" }}>🔑 Got a code? Join a friend&apos;s trip</Link>
      </div>
    );
  }

  if (mode === "manual") {
    return (
      <form className="stack-lg fade-in" style={{ maxWidth: 720 }} onSubmit={(e) => { e.preventDefault(); create(); }}>
        <div className="stack" style={{ gap: 8 }}><span className="eyebrow">Create manually</span><h1>Set up your trip</h1></div>
        <div className="card" style={{ gap: 14 }}>
          <div><label className="lbl" htmlFor="tn">Trip name</label><input id="tn" maxLength={60} value={a.name ?? ""} onChange={(e) => setA({ ...a, name: e.target.value })} placeholder="Zanzibar with the girls" /></div>
          <div><label className="lbl" htmlFor="tc">Destination</label>
            <select id="tc" required value={a.country} onChange={(e) => setA({ ...a, country: e.target.value })}>
              <option value="">Choose a country</option>{WORLD.map((w) => <option key={w.code} value={w.code}>{flag(w.code)} {w.name}</option>)}
            </select></div>
          <div className="field-row">
            <div><label className="lbl" htmlFor="ts">Start</label><input id="ts" type="date" value={a.start ?? ""} onChange={(e) => setA({ ...a, start: e.target.value })} /></div>
            <div><label className="lbl" htmlFor="te">End</label><input id="te" type="date" value={a.end ?? ""} onChange={(e) => setA({ ...a, end: e.target.value })} /></div>
          </div>
          <div className="field-row">
            <div><label className="lbl" htmlFor="tp">People</label><input id="tp" type="number" min={1} max={40} value={a.people} onChange={(e) => setA({ ...a, people: Math.max(1, Number(e.target.value)), company: Number(e.target.value) <= 1 ? "solo" : a.company })} /></div>
            <div><label className="lbl" htmlFor="tb">Budget per person ({a.currency})</label><input id="tb" type="number" min={0} value={a.budgetPerPerson || ""} onChange={(e) => setA({ ...a, budgetPerPerson: Number(e.target.value) })} /></div>
          </div>
        </div>
        <p role="status" className="muted">{msg}</p>
        <div className="row" style={{ justifyContent: "space-between" }}><button type="button" className="btn btn-ghost" onClick={() => setMode("choose")}>Back</button><button className="btn btn-sun" type="submit">Create trip</button></div>
      </form>
    );
  }

  const s = STEPS[step];
  return (
    <div className="stack-lg fade-in" style={{ maxWidth: 760 }} key={step}>
      <div className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">Guide me · {step + 1} of {STEPS.length}</span>
        <div className="progress" aria-hidden="true"><i style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
      </div>

      {step === 0 && (
        <div className="card card-soft" style={{ gap: 10 }}>
          <span className="lbl">✍🏾 Or just tell us</span>
          <textarea value={text} maxLength={1500} onChange={(e) => setText(e.target.value)} placeholder="e.g. Birthday trip for 6 girls in December, beach and party, about KES 80,000 each" aria-label="Describe your trip" />
          <div className="row"><button type="button" className="btn btn-soft btn-sm" disabled={parsing || text.trim().length < 5} onClick={parse}>{parsing ? "Reading…" : `✨ Let ${profile.assistantNickname || APP.assistant} fill it in`}</button><span role="status" className="muted" style={{ fontSize: "0.85rem" }}>{msg}</span></div>
        </div>
      )}

      {s === "What" && (<section className="stack-lg"><h1>What do you want to <span className="gradient-text">do?</span></h1>
        <div className="choice-grid">{VIBES.map((v) => <button key={v.id} type="button" className="choice" aria-pressed={a.vibes.includes(v.id)} onClick={() => toggleVibe(v.id)}><span className="big">{v.emoji}</span><strong>{v.label}</strong></button>)}</div></section>)}

      {s === "Occasion" && (<section className="stack-lg"><h1>Is it a <span className="gradient-text">special occasion?</span></h1>
        <div className="choice-grid">{OCCASIONS.map((o) => <button key={o.id} type="button" className="choice" aria-pressed={a.occasion === o.id} onClick={() => setA({ ...a, occasion: o.id })}><span className="big">{o.emoji}</span><strong>{o.label}</strong></button>)}</div>
        {OCCASION_PICKS[a.occasion] && <p className="note">💡 {OCCASION_PICKS[a.occasion]!.tip}</p>}</section>)}

      {s === "Who" && (<section className="stack-lg"><h1>Who&apos;s <span className="gradient-text">coming?</span></h1>
        <div className="choice-grid">{([["solo", "🧍🏾", "Just me"], ["couple", "💑", "Me + partner"], ["friends", "👯", "Friends"], ["family", "👨‍👩‍👧", "Family"]] as const).map(([v, e, l]) => (
          <button key={v} type="button" className="choice" aria-pressed={a.company === v} onClick={() => setA({ ...a, company: v, people: v === "solo" ? 1 : v === "couple" ? 2 : Math.max(3, a.people) })}><span className="big">{e}</span><strong>{l}</strong></button>))}</div>
        {(a.company === "friends" || a.company === "family") && (
          <div className="field-row">
            <div style={{ maxWidth: 160 }}><label className="lbl" htmlFor="pc">How many people?</label><input id="pc" type="number" min={2} max={40} value={a.people} onChange={(e) => setA({ ...a, people: Math.max(2, Number(e.target.value)) })} /></div>
            <div><label className="lbl" htmlFor="fn">Friends&apos; names (optional, comma separated)</label><input id="fn" value={(a.friends ?? []).join(", ")} onChange={(e) => setA({ ...a, friends: e.target.value.split(",").map((x) => x.trim()).slice(0, 30) })} placeholder="Amina, Wanjiru, Joy" /></div>
          </div>)}
        {a.company !== "solo" && <p className="muted" style={{ fontSize: "0.88rem" }}>You&apos;ll get an invite code so everyone can join, vote and pay into the pot.</p>}</section>)}

      {s === "Where" && (<section className="stack-lg"><h1>Where to? <span className="gradient-text">Or surprise you?</span></h1>
        <select aria-label="Destination" value={a.country} onChange={(e) => setA({ ...a, country: e.target.value })}>
          <option value="">I&apos;m not sure yet: suggest places</option>{WORLD.map((w) => <option key={w.code} value={w.code}>{flag(w.code)} {w.name}</option>)}
        </select>
        <span className="lbl">✨ Picked for your vibe, occasion and {nameOf(profile.passport)} passport</span>
        <div className="grid-2">{suggestions.map(({ c, v }) => (
          <button key={c.code} type="button" className="choice" aria-pressed={a.country === c.code} onClick={() => setA({ ...a, country: c.code })}>
            <span className="big">{flag(c.code)}</span><strong>{c.name}</strong>
            <span className={`badge tone-${v}`}>{visaLabel(row?.[c.code] as VisaCode | undefined).label}</span>
          </button>))}</div></section>)}

      {s === "When" && (<section className="stack-lg"><h1>When are you <span className="gradient-text">going?</span></h1>
        <div className="chips"><button type="button" className="chip" aria-pressed={!flex} onClick={() => setFlex(false)}>📅 Exact dates</button><button type="button" className="chip" aria-pressed={flex} onClick={() => setFlex(true)}>🌤️ Flexible month</button></div>
        {flex ? (
          <div className="chips">{MONTHS.map((m, i) => <button key={m} type="button" className="chip" aria-pressed={a.month === i + 1} onClick={() => setA({ ...a, month: i + 1, start: undefined, end: undefined })}>{m}</button>)}</div>
        ) : (
          <div className="field-row">
            <div><label className="lbl" htmlFor="ds">From</label><input id="ds" type="date" value={a.start ?? ""} onChange={(e) => setA({ ...a, start: e.target.value, month: undefined })} /></div>
            <div><label className="lbl" htmlFor="de">To</label><input id="de" type="date" value={a.end ?? ""} min={a.start} onChange={(e) => setA({ ...a, end: e.target.value })} /></div>
          </div>)}</section>)}

      {s === "Budget" && (<section className="stack-lg"><h1>Budget <span className="gradient-text">per person?</span></h1>
        <div style={{ maxWidth: 320 }}><label className="lbl" htmlFor="bp">Amount in {a.currency}</label><input id="bp" type="number" min={0} inputMode="numeric" value={a.budgetPerPerson || ""} onChange={(e) => setA({ ...a, budgetPerPerson: Number(e.target.value) })} placeholder="e.g. 80000" /></div>
        {a.people > 1 && a.budgetPerPerson > 0 && <p className="note">Group pot target: <strong>{a.currency} {(a.budgetPerPerson * a.people).toLocaleString()}</strong> for {a.people} people. You can change it later.</p>}</section>)}

      {s === "Review" && (<section className="stack-lg"><h1>Looking <span className="gradient-text">good?</span></h1>
        <div className="card" style={{ gap: 4 }}>
          <div><label className="lbl" htmlFor="rn">Trip name</label><input id="rn" maxLength={60} value={a.name ?? ""} placeholder={`Trip to ${a.country ? nameOf(a.country) : "…"}`} onChange={(e) => setA({ ...a, name: e.target.value })} /></div>
          <div className="ledger" style={{ marginTop: 8 }}>
            <div className="ledger-row"><span className="muted">Where</span><span>{a.country ? `${flag(a.country)} ${nameOf(a.country)}` : <button type="button" className="btn btn-soft btn-sm" onClick={() => setStep(3)}>Pick a place</button>}</span></div>
            <div className="ledger-row"><span className="muted">Vibe</span><span>{a.vibes.map((v) => VIBES.find((x) => x.id === v)?.emoji).join(" ") || "Any"}</span></div>
            <div className="ledger-row"><span className="muted">Occasion</span><span>{OCCASIONS.find((o) => o.id === a.occasion)?.label}</span></div>
            <div className="ledger-row"><span className="muted">Who</span><span>{a.people} {a.people === 1 ? "person" : "people"}</span></div>
            <div className="ledger-row"><span className="muted">When</span><span>{a.start ? `${a.start}${a.end ? ` → ${a.end}` : ""}` : a.month ? MONTHS[a.month - 1] : "Not set"}</span></div>
            <div className="ledger-row"><span className="muted">Budget</span><span>{a.budgetPerPerson ? `${a.currency} ${a.budgetPerPerson.toLocaleString()} each` : "Not set"}</span></div>
          </div>
        </div>
        <p className="muted">We&apos;ll add a starter plan from the gems and things to do that match your vibe, a visa checklist for everyone, and the group pot.</p></section>)}

      <p role="status" className="muted">{step !== 0 ? msg : ""}</p>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <button type="button" className="btn btn-ghost" onClick={() => (step ? setStep(step - 1) : setMode("choose"))}>Back</button>
        {step < STEPS.length - 1
          ? <button type="button" className="btn btn-sun" disabled={step === 0 && !a.vibes.length} onClick={() => setStep(step + 1)}>{s === "Where" && !a.country ? "Decide later" : "Continue"}</button>
          : <button type="button" className="btn btn-sun" onClick={create}>Create trip 🎉</button>}
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div className="muted">Loading…</div>}><NewTrip /></Suspense>;
}
