"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { currencyOf } from "@/lib/geo";
import { VIBE_PICKS, fromPicks, picksFrom } from "@/lib/site";
import { useApp, type Profile } from "@/lib/store";
import { WORLD, flag, nameOf } from "@/lib/world";

const POPULAR = ["KE", "NG", "GH", "ZA", "UG", "TZ", "RW", "ET", "EG", "SN", "CM", "CI", "ZW", "MA", "ZM"];
const STEPS = ["About you", "Your vibe", "How you travel"] as const;

function CountrySelect({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      <optgroup label="Popular">{POPULAR.map((c) => <option key={c} value={c}>{flag(c)} {nameOf(c)}</option>)}</optgroup>
      <optgroup label="All countries">{WORLD.map((w) => <option key={w.code} value={w.code}>{flag(w.code)} {w.name}</option>)}</optgroup>
    </select>
  );
}

function Setup() {
  const sp = useSearchParams();
  const router = useRouter();
  const { profile, saveProfile, session } = useApp();
  const [step, setStep] = useState(0);
  const from = sp.get("from")?.toUpperCase();
  const [p, setP] = useState<Profile>({
    name: "", passport: from && /^[A-Z]{2}$/.test(from) ? from : "KE", vibes: [], interests: [], picks: [], budget: "comfy", company: "friends", pace: "balanced", assistantStyle: "warm",
  });
  const [diaspora, setDiaspora] = useState(false);
  useEffect(() => {
    if (profile) { setP({ ...profile, interests: profile.interests ?? [], picks: profile.picks ?? picksFrom(profile.vibes, profile.interests) }); setDiaspora(!!profile.home && profile.home !== profile.passport); }
  }, [profile]);

  const home = diaspora ? p.home ?? p.passport : p.passport;
  const currency = p.currency ?? currencyOf(home);
  const toggle = <T extends string>(arr: T[] | undefined, v: T) => ((arr ?? []).includes(v) ? (arr ?? []).filter((x) => x !== v) : [...(arr ?? []), v]);
  const picks = p.picks ?? [];
  const can = step === 0 ? p.name.trim().length > 0 : step === 1 ? picks.length > 0 : true;

  const finish = () => {
    saveProfile({ ...p, ...fromPicks(picks), home, currency, onboarded: true, assistantNickname: undefined });
    const next = sp.get("next");
    router.replace(next && next.startsWith("/") ? next : "/trips/new?first=1");
  };

  return (
    <div className="onb fade-in" key={step}>
      <div className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">Step {step + 1} of {STEPS.length} · {STEPS[step]}</span>
        <div className="progress" aria-hidden="true"><i style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
      </div>

      {step === 0 && (
        <section className="stack-lg">
          <h1 style={{ fontSize: "clamp(1.8rem,7vw,2.4rem)" }}>Who&apos;s <span className="gradient-text">travelling?</span></h1>
          {session?.user.phone || session?.user.email ? <p className="muted">Signed in as {session.user.phone ? `+${session.user.phone}` : session.user.email}</p> : null}
          <div><label className="lbl" htmlFor="nm">Your full name</label><input id="nm" value={p.name} maxLength={60} autoComplete="name" placeholder="e.g. Amina Wanjiru" onChange={(e) => setP({ ...p, name: e.target.value })} /></div>
          <div><label className="lbl" htmlFor="pp">Where are you from? (your passport)</label><CountrySelect id="pp" value={p.passport} onChange={(v) => setP({ ...p, passport: v, currency: undefined })} /></div>
          <div className="stack" style={{ gap: 8 }}>
            <span className="lbl">Where do you live now?</span>
            <div className="chips">
              <button type="button" className="chip" aria-pressed={!diaspora} onClick={() => setDiaspora(false)}>{flag(p.passport)} {nameOf(p.passport)}</button>
              <button type="button" className="chip" aria-pressed={diaspora} onClick={() => setDiaspora(true)}>🌍 Somewhere else</button>
            </div>
            {diaspora && <CountrySelect id="home" value={p.home ?? "GB"} onChange={(v) => setP({ ...p, home: v, currency: undefined })} />}
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="stack-lg">
          <h1 style={{ fontSize: "clamp(1.8rem,7vw,2.4rem)" }}>What&apos;s your <span className="gradient-text">vibe?</span></h1>
          <p className="muted">Pick everything that sounds like you. The more you pick, the better we can match places to you.</p>
          <div className="choice-grid tight">
            {VIBE_PICKS.map((v) => (
              <button key={v.id} type="button" className="choice" aria-pressed={picks.includes(v.id)} onClick={() => setP({ ...p, picks: toggle(picks, v.id) })}>
                <span className="big" aria-hidden="true">{v.emoji}</span><strong>{v.label}</strong>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="stack-lg">
          <h1 style={{ fontSize: "clamp(1.8rem,7vw,2.4rem)" }}>How do you like to <span className="gradient-text">travel?</span></h1>
          <Group label="Budget" value={p.budget} onChange={(v) => setP({ ...p, budget: v as Profile["budget"] })} options={[["backpacker", "🎒", "Backpacker"], ["comfy", "🛋️", "Comfy"], ["treat", "🥂", "Treat myself"]]} />
          <Group label="Usually with" value={p.company} onChange={(v) => setP({ ...p, company: v as Profile["company"] })} options={[["solo", "🧍🏾", "Solo"], ["couple", "💑", "Partner"], ["friends", "👯", "Friends"], ["family", "👨‍👩‍👧", "Family"]]} />
          <Group label="Pace" value={p.pace} onChange={(v) => setP({ ...p, pace: v as Profile["pace"] })} options={[["slow", "🐢", "Slow"], ["balanced", "⚖️", "Balanced"], ["packed", "⚡", "Pack it in"]]} />
        </section>
      )}

      <div className="row" style={{ justifyContent: "space-between" }}>
        <button type="button" className="btn btn-ghost" onClick={() => (step ? setStep(step - 1) : router.back())}>Back</button>
        {step < STEPS.length - 1
          ? <button type="button" className="btn btn-sun" disabled={!can} onClick={() => setStep(step + 1)}>Continue</button>
          : <button type="button" className="btn btn-sun" onClick={finish}>Plan my first trip →</button>}
      </div>
    </div>
  );
}

function Group({ label, value, options, onChange }: { label: string; value: string; options: [string, string, string][]; onChange: (v: string) => void }) {
  return (
    <div className="stack" style={{ gap: 8 }}>
      <span className="lbl">{label}</span>
      <div className="choice-grid">
        {options.map(([v, e, t]) => (
          <button key={v} type="button" className="choice" aria-pressed={value === v} onClick={() => onChange(v)}><span className="big" aria-hidden="true">{e}</span><strong>{t}</strong></button>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={null}><Setup /></Suspense>;
}
