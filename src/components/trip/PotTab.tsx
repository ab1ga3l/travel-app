"use client";
import { useState } from "react";
import { payMethodsOf } from "@/lib/geo";
import { useApp } from "@/lib/store";
import { potRaised, potSpent } from "@/lib/tripTypes";
import { type TabProps, memberName, money, uid, waLink } from "./shared";

const CATS = ["Stay", "Transport", "Food", "Activities", "Shopping", "Other"];

export function PotTab({ trip, me, canManage, update }: TabProps) {
  const { profile } = useApp();
  const methods = payMethodsOf(profile?.home ?? profile?.passport ?? "KE");
  const raised = potRaised(trip);
  const spent = potSpent(trip);
  const share = trip.pot.target / Math.max(1, trip.members.length);
  const pct = trip.pot.target ? Math.min(100, Math.round((raised / trip.pot.target) * 100)) : 0;
  const [pay, setPay] = useState({ memberId: me.id, amount: String(Math.round(share) || ""), method: methods[0], ref: "" });
  const [spend, setSpend] = useState({ label: "", amount: "", category: "Stay" });
  const [settings, setSettings] = useState({ target: String(trip.pot.target || ""), payTo: trip.pot.payTo ?? "", payNote: trip.pot.payNote ?? "" });
  const [msg, setMsg] = useState("");

  const paidBy = (mid: string, status?: "confirmed" | "pending") => trip.pot.contributions.filter((c) => c.memberId === mid && (!status || c.status === status)).reduce((a, c) => a + c.amount, 0);
  const notPaid = trip.members.filter((m) => paidBy(m.id, "confirmed") < share - 0.5);
  const byCat = CATS.map((c) => [c, trip.pot.spends.filter((s) => s.category === c).reduce((a, s) => a + s.amount, 0)] as const).filter(([, v]) => v > 0);

  const recordPay = () => {
    const amount = Number(pay.amount);
    if (!(amount > 0)) return setMsg("Enter the amount you sent.");
    update((t) => ({ ...t, pot: { ...t.pot, contributions: [...t.pot.contributions, { id: uid(), memberId: pay.memberId, amount, method: pay.method, ref: pay.ref.trim() || undefined, status: canManage ? "confirmed" : "pending", at: new Date().toISOString() }] } }));
    setMsg(canManage ? "Recorded and confirmed." : "Recorded! The treasurer will confirm it.");
    setPay({ ...pay, ref: "" });
  };
  const confirm = (id: string) => update((t) => ({ ...t, pot: { ...t.pot, contributions: t.pot.contributions.map((c) => (c.id === id ? { ...c, status: "confirmed" } : c)) } }));
  const removeC = (id: string) => update((t) => ({ ...t, pot: { ...t.pot, contributions: t.pot.contributions.filter((c) => c.id !== id) } }));
  const addSpend = () => {
    const amount = Number(spend.amount);
    if (!spend.label.trim() || !(amount > 0)) return;
    update((t) => ({ ...t, pot: { ...t.pot, spends: [...t.pot.spends, { id: uid(), label: spend.label.trim(), amount, category: spend.category, byMemberId: me.id, at: new Date().toISOString() }] } }));
    setSpend({ label: "", amount: "", category: spend.category });
  };
  const saveSettings = () => update((t) => ({ ...t, pot: { ...t.pot, target: Math.max(0, Number(settings.target) || 0), payTo: settings.payTo.trim() || undefined, payNote: settings.payNote.trim() || undefined } }));

  const reminder = `💰 ${trip.name} pot: ${money(trip, raised)} of ${money(trip, trip.pot.target)} in. Still to pay: ${notPaid.map((m) => m.name).join(", ") || "nobody 🎉"}. Each share is ${money(trip, share)}.${trip.pot.payTo ? ` Send to ${trip.pot.payTo}.` : ""}`;

  return (
    <div className="stack-lg">
      <section className="card" style={{ gap: 12 }}>
        <div className="between"><span className="eyebrow">Group pot</span><span className="badge tone-free">{pct}% in</span></div>
        <div className="kpi"><strong>{money(trip, raised)}</strong><span>of {money(trip, trip.pot.target)} target · {money(trip, share)} each</span></div>
        <div className="progress"><i style={{ width: `${pct}%` }} /></div>
        <div className="grid-3 kpis">
          <div className="kpi"><strong style={{ fontSize: "1.2rem", color: "var(--mint)" }}>{money(trip, raised)}</strong><span>paid in</span></div>
          <div className="kpi"><strong style={{ fontSize: "1.2rem", color: "var(--sunrise)" }}>{money(trip, spent)}</strong><span>spent</span></div>
          <div className="kpi"><strong style={{ fontSize: "1.2rem" }}>{money(trip, raised - spent)}</strong><span>left in the pot</span></div>
        </div>
        {trip.pot.payTo && <p className="note">Send your share to <strong style={{ userSelect: "all" }}>{trip.pot.payTo}</strong>{trip.pot.payNote ? ` · ${trip.pot.payNote}` : ""}</p>}
      </section>

      <section className="card" style={{ gap: 10 }}>
        <div className="between"><h3>Who&apos;s paid</h3><a className="btn btn-ghost btn-sm" href={waLink(reminder)} target="_blank" rel="noopener noreferrer">📣 Remind on WhatsApp</a></div>
        {trip.members.map((m) => {
          const ok = paidBy(m.id, "confirmed"), pend = paidBy(m.id, "pending");
          const tone = ok >= share - 0.5 ? "free" : ok + pend > 0 ? "easy" : "hard";
          return (
            <div key={m.id} className="between" style={{ padding: "6px 0", borderTop: "1px solid var(--line)" }}>
              <span>{m.name}{m.role === "treasurer" ? " · 🏦 treasurer" : m.role === "owner" ? " · organiser" : ""}</span>
              <span className={`badge tone-${tone}`}>{tone === "free" ? `Paid ✓ ${money(trip, ok)}` : tone === "easy" ? `${money(trip, ok + pend)} (${pend ? "pending" : "part"})` : "Not yet"}</span>
            </div>
          );
        })}
      </section>

      <section className="card" style={{ gap: 12 }}>
        <h3>I paid into the pot</h3>
        <div className="field-row">
          {canManage && <div><label className="lbl" htmlFor="pm">Who paid</label><select id="pm" value={pay.memberId} onChange={(e) => setPay({ ...pay, memberId: e.target.value })}>{trip.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>}
          <div><label className="lbl" htmlFor="pa">Amount ({trip.currency})</label><input id="pa" type="number" min={0} value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} /></div>
          <div><label className="lbl" htmlFor="pmt">How</label><select id="pmt" value={pay.method} onChange={(e) => setPay({ ...pay, method: e.target.value })}>{methods.map((x) => <option key={x}>{x}</option>)}</select></div>
          <div><label className="lbl" htmlFor="pr">Transaction code</label><input id="pr" maxLength={30} value={pay.ref} onChange={(e) => setPay({ ...pay, ref: e.target.value.toUpperCase() })} placeholder="e.g. SKL4X2ABCD" /></div>
        </div>
        <div className="row"><button type="button" className="btn btn-sun" onClick={recordPay}>Record payment</button><span role="status" className="muted">{msg}</span></div>
      </section>

      {trip.pot.contributions.length > 0 && (
        <section className="card" style={{ gap: 8 }}>
          <h3>Payments</h3>
          {[...trip.pot.contributions].reverse().map((c) => (
            <div key={c.id} className="between" style={{ padding: "6px 0", borderTop: "1px solid var(--line)" }}>
              <span>{memberName(trip, c.memberId)} · {money(trip, c.amount)} <span className="muted" style={{ fontSize: "0.8rem" }}>via {c.method}{c.ref ? ` · ${c.ref}` : ""} · {c.at.slice(0, 10)}</span></span>
              <span className="row" style={{ gap: 6 }}>
                <span className={`badge tone-${c.status === "confirmed" ? "free" : "easy"}`}>{c.status}</span>
                {canManage && c.status === "pending" && <button type="button" className="btn btn-soft btn-sm" onClick={() => confirm(c.id)}>Confirm</button>}
                {canManage && <button type="button" className="btn btn-ghost btn-sm" aria-label="Remove payment" onClick={() => removeC(c.id)}>✕</button>}
              </span>
            </div>
          ))}
        </section>
      )}

      <section className="card" style={{ gap: 12 }}>
        <h3>How the pot is spent</h3>
        {byCat.length > 0 && byCat.map(([c, v]) => (
          <div key={c} className="row" style={{ gap: 10, flexWrap: "nowrap" }}>
            <span style={{ width: 90, fontSize: "0.85rem" }}>{c}</span>
            <div className="bar" style={{ flex: 1 }}><i style={{ width: `${(v / Math.max(1, spent)) * 100}%`, background: "var(--grad-sun)" }} /></div>
            <strong style={{ minWidth: 90, textAlign: "right", fontSize: "0.85rem" }}>{money(trip, v)}</strong>
          </div>
        ))}
        {canManage ? (
          <div className="field-row" style={{ alignItems: "end" }}>
            <div style={{ flex: "2 1 180px" }}><label className="lbl" htmlFor="sl">Spent on</label><input id="sl" maxLength={60} value={spend.label} onChange={(e) => setSpend({ ...spend, label: e.target.value })} placeholder="Villa deposit" /></div>
            <div><label className="lbl" htmlFor="sa">Amount</label><input id="sa" type="number" min={0} value={spend.amount} onChange={(e) => setSpend({ ...spend, amount: e.target.value })} /></div>
            <div><label className="lbl" htmlFor="sc">Category</label><select id="sc" value={spend.category} onChange={(e) => setSpend({ ...spend, category: e.target.value })}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></div>
            <button type="button" className="btn btn-soft" style={{ flex: "0 0 auto" }} onClick={addSpend}>Add spend</button>
          </div>
        ) : <p className="muted" style={{ fontSize: "0.85rem" }}>The organiser or treasurer records spending, so everyone sees where the money goes.</p>}
        {trip.pot.spends.length > 0 && [...trip.pot.spends].reverse().slice(0, 12).map((s) => (
          <div key={s.id} className="between" style={{ fontSize: "0.88rem" }}><span>{s.label} <span className="muted">· {s.category}</span></span><span>{money(trip, s.amount)}</span></div>
        ))}
      </section>

      {canManage && (
        <section className="card" style={{ gap: 12 }}>
          <h3>Pot settings</h3>
          <div className="field-row">
            <div><label className="lbl" htmlFor="st">Target ({trip.currency})</label><input id="st" type="number" min={0} value={settings.target} onChange={(e) => setSettings({ ...settings, target: e.target.value })} /></div>
            <div><label className="lbl" htmlFor="sp">Where to send money</label><input id="sp" maxLength={60} value={settings.payTo} onChange={(e) => setSettings({ ...settings, payTo: e.target.value })} placeholder="M-Pesa 0712 345 678 (Amina)" /></div>
          </div>
          <div><label className="lbl" htmlFor="sn">Note for the crew</label><input id="sn" maxLength={120} value={settings.payNote} onChange={(e) => setSettings({ ...settings, payNote: e.target.value })} placeholder="Pay by 1 Dec, use your name as reference" /></div>
          <button type="button" className="btn btn-soft" style={{ justifySelf: "start" }} onClick={saveSettings}>Save</button>
        </section>
      )}
      <p className="muted" style={{ fontSize: "0.8rem" }}>The pot is a shared tracker: money goes straight to your treasurer by M-Pesa, bank or card, and everyone sees it here. Paying and withdrawing inside the app is coming with a licensed payments partner.</p>
    </div>
  );
}
