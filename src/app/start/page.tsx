"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APP, VIBES, type Vibe } from "@/lib/site";
import { useApp, type Profile } from "@/lib/store";
import { WORLD, flag } from "@/lib/world";

const STEPS = ["You", "Vibe", "Style"] as const;
const COMMON = ["NG", "GH", "KE", "ZA", "UG", "TZ", "RW", "ET", "EG", "SN", "CM", "CI", "ZW", "MA"];

export default function Start() {
  const { profile, saveProfile } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Profile>({ name: "", passport: "NG", vibes: [], budget: "comfy", company: "solo", pace: "balanced" });
  useEffect(() => { if (profile) setP(profile); }, [profile]);

  const toggleVibe = (v: Vibe) => setP((x) => ({ ...x, vibes: x.vibes.includes(v) ? x.vibes.filter((y) => y !== v) : [...x.vibes, v] }));
  const done = () => { saveProfile(p); router.push("/"); };
  const can = step === 0 ? !!p.passport : step === 1 ? p.vibes.length > 0 : true;

  return (
    <div className="stack-lg fade-in" style={{ maxWidth: 820 }}>
      <div className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">Step {step + 1} of {STEPS.length} · {STEPS[step]}</span>
        <div className="progress" aria-hidden="true"><i style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
      </div>

      {step === 0 && (
        <section className="stack-lg">
          <div className="stack">
            <h1>Let&apos;s get you <span className="gradient-text">travel-ready.</span></h1>
            <p className="muted" style={{ fontSize: "1.05rem" }}>Your passport decides what&apos;s easy. Tell us yours and we&apos;ll show visa-free trips first.</p>
          </div>
          <div className="field-row">
            <div><label className="lbl" htmlFor="nm">What should we call you?</label><input id="nm" value={p.name} maxLength={40} placeholder="Your first name" onChange={(e) => setP({ ...p, name: e.target.value })} /></div>
            <div>
              <label className="lbl" htmlFor="pp">Your passport</label>
              <select id="pp" value={p.passport} onChange={(e) => setP({ ...p, passport: e.target.value })}>
                <optgroup label="Popular">{COMMON.map((c) => <option key={c} value={c}>{flag(c)} {WORLD.find((w) => w.code === c)?.name}</option>)}</optgroup>
                <optgroup label="All countries">{WORLD.map((w) => <option key={w.code} value={w.code}>{flag(w.code)} {w.name}</option>)}</optgroup>
              </select>
            </div>
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="stack-lg">
          <div className="stack">
            <h1>What&apos;s your <span className="gradient-text">vibe?</span></h1>
            <p className="muted" style={{ fontSize: "1.05rem" }}>Pick as many as you like. Clubbing in Lagos and gorilla treks in Rwanda can share a passport.</p>
          </div>
          <div className="choice-grid">
            {VIBES.map((v) => (
              <button key={v.id} type="button" className="choice" aria-pressed={p.vibes.includes(v.id)} onClick={() => toggleVibe(v.id)}>
                <span className="big" aria-hidden="true">{v.emoji}</span>
                <strong>{v.label}</strong>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="stack-lg">
          <div className="stack">
            <h1>How do you <span className="gradient-text">roll?</span></h1>
            <p className="muted" style={{ fontSize: "1.05rem" }}>This shapes budgets and the kind of places we suggest.</p>
          </div>
          <Group label="Budget" value={p.budget} onChange={(v) => setP({ ...p, budget: v as Profile["budget"] })}
            options={[["backpacker", "🎒", "Backpacker"], ["comfy", "🛋️", "Comfy"], ["treat", "🥂", "Treat myself"]]} />
          <Group label="Who's coming" value={p.company} onChange={(v) => setP({ ...p, company: v as Profile["company"] })}
            options={[["solo", "🧍🏾", "Just me"], ["couple", "💑", "My partner"], ["friends", "👯", "Friends"], ["family", "👨‍👩‍👧", "Family"]]} />
          <Group label="Pace" value={p.pace} onChange={(v) => setP({ ...p, pace: v as Profile["pace"] })}
            options={[["slow", "🐢", "Slow, 1–2 things a day"], ["balanced", "⚖️", "Balanced"], ["packed", "⚡", "Pack it in"]]} />
        </section>
      )}

      <div className="between">
        <button type="button" className="btn btn-ghost" onClick={() => (step ? setStep(step - 1) : router.back())}>Back</button>
        {step < STEPS.length - 1 ? (
          <button type="button" className="btn btn-sun" disabled={!can} onClick={() => setStep(step + 1)}>Continue</button>
        ) : (
          <button type="button" className="btn btn-sun" onClick={done}>Show my world →</button>
        )}
      </div>
      <p className="muted" style={{ fontSize: "0.82rem" }}>
        Saved on this device. Create an account in Profile to keep it on every phone and laptop. {APP.name} never sells your data.
      </p>
    </div>
  );
}

function Group({ label, value, options, onChange }: { label: string; value: string; options: [string, string, string][]; onChange: (v: string) => void }) {
  return (
    <div className="stack" style={{ gap: 8 }}>
      <span className="lbl">{label}</span>
      <div className="choice-grid">
        {options.map(([v, e, t]) => (
          <button key={v} type="button" className="choice" aria-pressed={value === v} onClick={() => onChange(v)}>
            <span className="big" aria-hidden="true">{e}</span><strong>{t}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
