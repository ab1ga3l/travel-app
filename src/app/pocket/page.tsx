"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { convert, currencyOf, emergencyFor, fmtMoney, getRates } from "@/lib/geo";
import { countryByCode } from "@/lib/countries";
import { EXTRAS } from "@/lib/countryExtras";
import { useApp } from "@/lib/store";
import { READY_ITEMS, tripPhase } from "@/lib/tripTypes";
import { flag, nameOf } from "@/lib/world";

const PHRASES: Record<string, [string, string][]> = {
  KE: [["Hello", "Jambo / Habari"], ["Thank you", "Asante"], ["How much?", "Ni pesa ngapi?"], ["Help!", "Saidia!"]],
  TZ: [["Hello", "Jambo / Habari"], ["Thank you", "Asante"], ["How much?", "Ni bei gani?"], ["Help!", "Saidia!"]],
  MA: [["Hello", "Salam"], ["Thank you", "Shukran"], ["How much?", "Bshhal?"], ["No thanks", "La, shukran"]],
  EG: [["Hello", "Salam"], ["Thank you", "Shukran"], ["How much?", "Bekam?"], ["No thanks", "La, shukran"]],
  SN: [["Hello", "Salaam aleekum"], ["Thank you", "Jërëjëf"], ["How much?", "Ñaata la?"]],
  RW: [["Hello", "Muraho"], ["Thank you", "Murakoze"], ["Goodbye", "Murabeho"]],
  GH: [["Welcome", "Akwaaba"], ["Thank you", "Medaase"], ["Please", "Mepa wo kyɛw"]],
  NG: [["Hello (Yoruba)", "Bawo ni"], ["Thank you (Yoruba)", "E se"], ["How far? (Pidgin)", "How far?"]],
  ET: [["Hello", "Selam"], ["Thank you", "Amesegenallo"], ["How much?", "Sint new?"]],
  ZA: [["Hello (Zulu)", "Sawubona"], ["Thank you (Zulu)", "Ngiyabonga"], ["Hello (Afrikaans)", "Hallo"]],
  TH: [["Hello", "Sawasdee kha/krap"], ["Thank you", "Khob khun kha/krap"], ["How much?", "Tao rai?"]],
  ID: [["Hello", "Halo"], ["Thank you", "Terima kasih"], ["How much?", "Berapa?"]],
};

export default function Pocket() {
  const { ready, profile, tripDocs } = useApp();
  const trip = tripDocs.filter((t) => tripPhase(t) !== "past").sort((a, b) => (a.start ?? "9").localeCompare(b.start ?? "9"))[0];
  const [rates, setRates] = useState<{ rates: Record<string, number>; at: string } | null>(null);
  const [amt, setAmt] = useState("1000");
  const [online, setOnline] = useState(true);
  useEffect(() => {
    getRates().then(setRates);
    const on = () => setOnline(navigator.onLine);
    on(); window.addEventListener("online", on); window.addEventListener("offline", on);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", on); };
  }, []);
  if (!ready || !profile) return <div className="muted">Loading…</div>;

  const dest = trip?.country ?? profile.home ?? profile.passport;
  const homeCur = profile.currency ?? currencyOf(profile.home ?? profile.passport);
  const destCur = currencyOf(dest);
  const sos = emergencyFor(dest);
  const c = countryByCode(dest);
  const ex = EXTRAS[dest];
  const me = trip?.members.find((m) => m.role === "owner") ?? trip?.members[0];
  const n = Number(amt) || 0;

  return (
    <div className="stack-lg fade-in" style={{ maxWidth: 860 }}>
      <div className="between">
        <div className="stack" style={{ gap: 8 }}><span className="eyebrow">Pocket · works offline</span><h1>{flag(dest)} Your <span className="gradient-text">pocket guide</span></h1></div>
        <span className={`badge ${online ? "tone-free" : "tone-easy"}`}>{online ? "● Online" : "● Offline: showing saved info"}</span>
      </div>
      <p className="muted">Everything here is saved on your phone, so it works with no signal. Open it once before you fly.</p>

      <section className="card" style={{ gap: 10 }}>
        <h3>🚨 Emergency in {nameOf(dest)}</h3>
        <div className="grid-2">
          <a className="kpi" href={`tel:${sos.police.replace(/[^\d+]/g, "")}`}><strong>{sos.police}</strong><span>Police</span></a>
          <a className="kpi" href={`tel:${sos.ambulance.replace(/[^\d+]/g, "")}`}><strong>{sos.ambulance}</strong><span>Ambulance</span></a>
        </div>
        {trip?.safety.contactName && <p>Trusted contact: <strong>{trip.safety.contactName}</strong> {trip.safety.contactPhone && <a href={`tel:${trip.safety.contactPhone}`}>{trip.safety.contactPhone}</a>}</p>}
      </section>

      <section className="card" style={{ gap: 10 }}>
        <h3>💱 Money</h3>
        <div className="field-row" style={{ alignItems: "end" }}>
          <div><label className="lbl" htmlFor="am">Amount in {destCur}</label><input id="am" type="number" min={0} value={amt} onChange={(e) => setAmt(e.target.value)} /></div>
          <div className="kpi" style={{ paddingBottom: 6 }}><strong style={{ fontSize: "1.4rem" }}>{rates ? fmtMoney(convert(n, destCur, homeCur, rates.rates) ?? 0, homeCur) : "…"}</strong><span>in {homeCur}{rates ? ` · rates from ${rates.at.slice(0, 10)}` : " · rates load once online"}</span></div>
        </div>
        {c && <p className="muted" style={{ fontSize: "0.88rem" }}>💡 {c.moneyTip}</p>}
      </section>

      {trip && (
        <section className="card" style={{ gap: 10 }}>
          <div className="between"><h3>🗓️ {trip.name}</h3><Link href={`/trips/${trip.id}`} className="btn btn-ghost btn-sm">Open trip</Link></div>
          {trip.items.length === 0 ? <p className="muted">No plan yet.</p> : Array.from(new Set(trip.items.map((i) => i.day))).sort((a, b) => a - b).map((d) => (
            <div key={d} className="stack" style={{ gap: 2 }}>
              <strong style={{ fontSize: "0.9rem" }}>Day {d}</strong>
              {trip.items.filter((i) => i.day === d).map((i) => <span key={i.id} className="muted" style={{ fontSize: "0.88rem" }}>{i.time ? `${i.time} · ` : ""}{i.title}</span>)}
            </div>
          ))}
          {me && <div className="stack" style={{ gap: 4 }}>
            <strong style={{ fontSize: "0.9rem" }}>Your checklist</strong>
            {READY_ITEMS.map((i) => <span key={i.id} style={{ fontSize: "0.88rem" }}>{trip.checklist[me.id]?.[i.id] ? "✅" : "⬜"} {i.label}</span>)}
          </div>}
        </section>
      )}

      {PHRASES[dest] && (
        <section className="card" style={{ gap: 8 }}>
          <h3>🗣️ Handy phrases</h3>
          {PHRASES[dest].map(([en, local]) => <div key={en} className="between"><span className="muted">{en}</span><strong>{local}</strong></div>)}
        </section>
      )}

      {ex && (
        <section className="grid-2">
          <div className="card" style={{ gap: 6 }}><h3>👍🏾 Do</h3>{ex.dos.map((d) => <span key={d} style={{ fontSize: "0.9rem" }}>{d}</span>)}</div>
          <div className="card" style={{ gap: 6 }}><h3>🙅🏾 Don&apos;t</h3>{ex.donts.map((d) => <span key={d} style={{ fontSize: "0.9rem" }}>{d}</span>)}</div>
        </section>
      )}
      {c && <p className="muted" style={{ fontSize: "0.85rem" }}>🔌 Plugs: type {c.plugs} · 🗣️ {c.languages} · {c.weather}</p>}
    </div>
  );
}
