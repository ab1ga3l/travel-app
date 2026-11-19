"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { emergencyFor } from "@/lib/geo";
import type { TripDoc } from "@/lib/tripTypes";
import { nameOf } from "@/lib/world";
import { uid, waLink } from "./shared";

export const SAFETY_TIPS = [
  "Share your live location with your trusted contact for taxi rides and late nights.",
  "Use registered ride apps or hotel taxis after dark, and check the plate before you get in.",
  "Keep a copy of your passport photo page offline and in your email.",
  "Book your first night before you land, ideally somewhere with 24-hour reception.",
  "Agree a check-in time with your contact. If you go quiet, they know when to act.",
  "Trust your gut. Leaving a place early is always allowed.",
  "Women-only hostel rooms and well-reviewed female-run stays are worth the small premium.",
  "Carry a little cash in a second place in case your wallet goes missing.",
];

interface Props { trip?: TripDoc; update?: (fn: (t: TripDoc) => TripDoc) => Promise<void>; country?: string }

/** Safety check-in: works for a trip (saves the log on the trip) or on its own. */
export function SafetyPanel({ trip, update, country }: Props) {
  const dest = trip?.country ?? country ?? "KE";
  const sos = emergencyFor(dest);
  const [contact, setContact] = useState({ name: trip?.safety.contactName ?? "", phone: trip?.safety.contactPhone ?? "" });
  const [where, setWhere] = useState("");
  const [saved, setSaved] = useState("");
  useEffect(() => {
    if (trip) return;
    try { const c = JSON.parse(localStorage.getItem("tk-safety-contact") ?? "null"); if (c?.phone || c?.name) setContact(c); } catch { /* blocked */ }
  }, [trip]);

  const saveContact = () => {
    if (update) update((t) => ({ ...t, safety: { ...t.safety, contactName: contact.name.trim() || undefined, contactPhone: contact.phone.trim() || undefined } }));
    else try { localStorage.setItem("tk-safety-contact", JSON.stringify(contact)); } catch { /* blocked */ }
    setSaved("Saved.");
  };
  const msg = (kind: "arrived" | "plan" | "help") => {
    const place = where.trim() ? ` at ${where.trim()}` : "";
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (kind === "arrived") return `✅ I've arrived safely${place}, ${nameOf(dest)} (${time}).`;
    if (kind === "help") return `🆘 I need help${place}, ${nameOf(dest)}. Please call me now. Local police: ${sos.police}.`;
    return `🧭 My plan${trip ? ` for ${trip.name}` : ""}: ${nameOf(dest)}${trip?.start ? ` from ${trip.start}` : ""}${trip?.end ? ` to ${trip.end}` : ""}.${where ? ` Staying at ${where}.` : ""} I'll check in daily. If you don't hear from me in 24 hours, please call me, then my stay.`;
  };
  const log = (message: string) => update?.((t) => ({ ...t, safety: { ...t.safety, checkIns: [{ id: uid(), at: new Date().toISOString(), message }, ...t.safety.checkIns].slice(0, 30) } }));
  const send = (kind: "arrived" | "plan" | "help") => { const m = msg(kind); log(m); window.open(waLink(m, contact.phone), "_blank", "noopener"); };

  return (
    <div className="stack-lg">
      <section className="card" style={{ gap: 12 }}>
        <h3>🛡️ Your trusted contact</h3>
        <p className="muted" style={{ fontSize: "0.9rem" }}>Someone back home who gets your check-ins. Messages open in WhatsApp, so we never see them.</p>
        <div className="field-row">
          <div><label className="lbl" htmlFor="sn">Name</label><input id="sn" maxLength={40} value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Mum" /></div>
          <div><label className="lbl" htmlFor="sp">WhatsApp number</label><input id="sp" type="tel" maxLength={20} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+254 712 345 678" /></div>
        </div>
        <div className="row"><button type="button" className="btn btn-soft" onClick={saveContact}>Save contact</button><span role="status" className="muted">{saved}</span></div>
      </section>

      <section className="card" style={{ gap: 12 }}>
        <h3>Check in</h3>
        <div><label className="lbl" htmlFor="sw">Where are you? (optional)</label><input id="sw" maxLength={80} value={where} onChange={(e) => setWhere(e.target.value)} placeholder="Hotel name, area" /></div>
        <div className="row">
          <button type="button" className="btn btn-sun" onClick={() => send("arrived")}>✅ I&apos;ve arrived safely</button>
          <button type="button" className="btn btn-ghost" onClick={() => send("plan")}>🧭 Share my plan</button>
          <button type="button" className="btn btn-ghost" style={{ borderColor: "var(--sunrise)", color: "var(--sunrise)" }} onClick={() => send("help")}>🆘 I need help</button>
        </div>
        {trip && trip.safety.checkIns.length > 0 && (
          <div className="stack" style={{ gap: 4 }}>
            <span className="eyebrow">Check-in log</span>
            {trip.safety.checkIns.slice(0, 6).map((c) => <span key={c.id} className="muted" style={{ fontSize: "0.82rem" }}>{new Date(c.at).toLocaleString()} · {c.message.slice(0, 70)}</span>)}
          </div>
        )}
      </section>

      <section className="card" style={{ gap: 10 }}>
        <h3>🚨 Emergency in {nameOf(dest)}</h3>
        <div className="grid-2">
          <a className="kpi" href={`tel:${sos.police.replace(/[^\d+]/g, "")}`}><strong>{sos.police}</strong><span>Police</span></a>
          <a className="kpi" href={`tel:${sos.ambulance.replace(/[^\d+]/g, "")}`}><strong>{sos.ambulance}</strong><span>Ambulance</span></a>
        </div>
        {sos.note && <p className="muted" style={{ fontSize: "0.85rem" }}>{sos.note}</p>}
        <p className="muted" style={{ fontSize: "0.8rem" }}>Check numbers with your embassy or hotel when you land. Save them in <Link href="/pocket">Pocket</Link> for offline use.</p>
      </section>

      <section className="card" style={{ gap: 8 }}>
        <h3>Travelling solo? Tips from women who&apos;ve done it</h3>
        <ul className="stack" style={{ gap: 6, paddingLeft: 18 }}>{SAFETY_TIPS.map((t) => <li key={t} style={{ fontSize: "0.92rem" }}>{t}</li>)}</ul>
      </section>
    </div>
  );
}
