"use client";
// New trip: describe it in your own words and Aviora builds the whole trip.
// "Fill it in myself" stays as a quiet option for people who know exactly what they want.
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { APP } from "@/lib/site";
import { useApp } from "@/lib/store";
import { buildTrip, type TripAnswers } from "@/lib/tripBuild";
import { tripFromPlan, tripFromText, type AiPlan } from "@/lib/tripText";
import { WORLD, flag, nameOf } from "@/lib/world";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const EXAMPLES = [
  "My 25th birthday in Zanzibar with 4 girls in February. Beach, boat parties and good food, about KES 80,000 each.",
  "A cheap solo week somewhere visa-free in East Africa next month. I love hiking and coffee.",
  "Honeymoon for 7 nights in May, somewhere romantic with a pool villa, budget $3,000 each.",
];

/** Turns ?country=&month=&occasion=&name= links (from events, maps, guides) into a starting sentence. */
function seedText(sp: URLSearchParams) {
  const c = sp.get("country"), m = Number(sp.get("month")), name = sp.get("name"), occ = sp.get("occasion");
  if (!c && !name) return "";
  return [name ? `A trip for ${name}` : "A trip", c ? `to ${nameOf(c)}` : "", m ? `in ${MONTHS[m - 1]}` : "", occ && occ !== "none" && !name ? `(${occ})` : ""].filter(Boolean).join(" ") + ". ";
}

function NewTrip() {
  const router = useRouter();
  const sp = useSearchParams();
  const { profile, session, saveTrip } = useApp();
  const [text, setText] = useState(() => seedText(sp));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [manual, setManual] = useState(sp.get("mode") === "manual");
  const [a, setA] = useState<TripAnswers>({ country: sp.get("country")?.toUpperCase() ?? "", vibes: profile?.vibes ?? [], occasion: "none", company: profile?.company ?? "friends", people: 2, budgetPerPerson: 0, currency: profile?.currency ?? "USD" });

  if (!profile) return <div className="muted">Loading…</div>;

  const build = async () => {
    if (text.trim().length < 10) { setMsg("Tell Aviora a little more: where, when, who and your budget."); return; }
    setBusy(true); setMsg("");
    let trip = null;
    try {
      const r = await fetch("/api/plan-trip", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, currency: profile.currency ?? "USD", passport: profile.passport, home: profile.home, vibes: profile.vibes, budget: profile.budget, pace: profile.pace }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.plan?.country_code) trip = tripFromPlan(j.plan as AiPlan, profile, session?.user.id);
    } catch { /* offline: fall back below */ }
    if (!trip) trip = tripFromText(text, profile, session?.user.id);
    setBusy(false);
    if (!trip) { setMsg("Aviora is offline right now and couldn't spot a destination. Add a country or city, e.g. \"Zanzibar\"."); return; }
    await saveTrip(trip);
    router.replace(`/trips/${trip.id}?new=1`);
  };

  const createManual = async () => {
    if (!a.country) { setMsg("Pick a destination first."); return; }
    const trip = buildTrip(a, profile, session?.user.id);
    await saveTrip(trip);
    router.replace(`/trips/${trip.id}?new=1`);
  };

  if (manual) {
    return (
      <form className="stack-lg fade-in" style={{ maxWidth: 720 }} onSubmit={(e) => { e.preventDefault(); createManual(); }}>
        <div className="stack" style={{ gap: 8 }}><span className="eyebrow">Fill it in yourself</span><h1>Set up your trip</h1></div>
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
        <div className="row" style={{ justifyContent: "space-between" }}><button type="button" className="btn btn-ghost" onClick={() => setManual(false)}>Back</button><button className="btn btn-sun" type="submit">Create trip</button></div>
      </form>
    );
  }

  return (
    <div className="stack-lg fade-in" style={{ maxWidth: 720 }}>
      <div className="stack" style={{ gap: 8 }}>
        <span className="eyebrow">{sp.get("first") ? `Welcome, ${profile.name.split(" ")[0] || "traveller"} 👋🏾` : "New trip"}</span>
        <h1>Tell {APP.assistant} about <span className="gradient-text">your trip.</span></h1>
        <p className="muted">Where, when, who&apos;s coming, the occasion and your budget, in your own words. {APP.assistant} builds the whole trip: every day, costs, a budget, tips and what to pack.</p>
      </div>
      <div className="card glow" style={{ gap: 12 }}>
        <textarea value={text} maxLength={2000} onChange={(e) => setText(e.target.value)} rows={6} autoFocus aria-label="Describe your trip"
          placeholder="e.g. My 25th birthday in Zanzibar with 4 girls in February. Beach, boat parties and good food, about KES 80,000 each." />
        <button type="button" className="btn btn-sun" disabled={busy} onClick={build} style={{ justifySelf: "stretch" }}>{busy ? `✨ ${APP.assistant} is building your trip…` : "✨ Build my trip"}</button>
        {msg && <p role="status" className="muted" style={{ fontSize: "0.9rem" }}>{msg}</p>}
      </div>
      {!text && (
        <div className="stack" style={{ gap: 8 }}>
          <span className="lbl">Need an idea? Tap one</span>
          {EXAMPLES.map((e) => <button key={e} type="button" className="chip" style={{ justifyContent: "flex-start", textAlign: "left", borderRadius: 16 }} onClick={() => setText(e)}>{e}</button>)}
        </div>
      )}
      <div className="row">
        <Link href="/join" className="btn btn-ghost btn-sm">🔑 Join a friend&apos;s trip</Link>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setManual(true)}>Fill it in myself</button>
      </div>
    </div>
  );
}

export default function NewTripPage() {
  return <Suspense fallback={<div className="muted">Loading…</div>}><NewTrip /></Suspense>;
}
