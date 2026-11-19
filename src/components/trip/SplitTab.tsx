"use client";
import { useState } from "react";
import { settleUp } from "@/lib/tripTypes";
import { type TabProps, memberName, money, uid, waLink } from "./shared";

export function SplitTab({ trip, me, update }: TabProps) {
  const [form, setForm] = useState({ label: "", amount: "", paidBy: me.id, mode: "equal" as "equal" | "custom" });
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [err, setErr] = useState("");
  const settle = settleUp(trip);
  const total = trip.expenses.reduce((a, e) => a + e.amount, 0);

  const add = () => {
    const amount = Number(form.amount);
    if (!form.label.trim() || !(amount > 0)) return setErr("Add what it was and how much.");
    let split: "equal" | Record<string, number> = "equal";
    if (form.mode === "custom") {
      split = Object.fromEntries(Object.entries(custom).map(([k, v]) => [k, Number(v) || 0]).filter(([, v]) => (v as number) > 0));
      const sum = Object.values(split).reduce((a, b) => a + b, 0);
      if (Math.abs(sum - amount) > 1) return setErr(`The shares add up to ${money(trip, sum)}, not ${money(trip, amount)}.`);
    }
    update((t) => ({ ...t, expenses: [...t.expenses, { id: uid(), label: form.label.trim(), amount, paidBy: form.paidBy, split, at: new Date().toISOString() }] }));
    setForm({ ...form, label: "", amount: "" }); setCustom({}); setErr("");
  };
  const remove = (id: string) => update((t) => ({ ...t, expenses: t.expenses.filter((e) => e.id !== id) }));
  const summary = `🧾 ${trip.name}: who owes whom\n${settle.map((s) => `• ${memberName(trip, s.from)} → ${memberName(trip, s.to)}: ${money(trip, s.amount)}`).join("\n") || "All square 🎉"}`;

  return (
    <div className="stack-lg">
      <p className="muted">Split is for costs someone paid on the spot, separate from the pot. We work out the fewest transfers to settle up.</p>
      <section className="card" style={{ gap: 10 }}>
        <div className="between"><h3>Settle up</h3><span className="muted">{money(trip, total)} shared so far</span></div>
        {settle.length === 0 ? <p className="note">All square 🎉</p> : settle.map((s, i) => (
          <div key={i} className="between" style={{ padding: "6px 0", borderTop: "1px solid var(--line)" }}>
            <span><strong>{memberName(trip, s.from)}</strong> pays <strong>{memberName(trip, s.to)}</strong></span>
            <span className="badge tone-easy">{money(trip, s.amount)}</span>
          </div>
        ))}
        {settle.length > 0 && <a className="btn btn-ghost btn-sm" style={{ justifySelf: "start" }} href={waLink(summary)} target="_blank" rel="noopener noreferrer">Share on WhatsApp</a>}
      </section>

      <form className="card" style={{ gap: 12 }} onSubmit={(e) => { e.preventDefault(); add(); }}>
        <h3>Add an expense</h3>
        <div className="field-row">
          <div style={{ flex: "2 1 180px" }}><label className="lbl" htmlFor="el">What</label><input id="el" maxLength={60} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Dinner at Forodhani" /></div>
          <div><label className="lbl" htmlFor="ea">Amount ({trip.currency})</label><input id="ea" type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
          <div><label className="lbl" htmlFor="ep">Paid by</label><select id="ep" value={form.paidBy} onChange={(e) => setForm({ ...form, paidBy: e.target.value })}>{trip.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
        </div>
        <div className="chips">
          <button type="button" className="chip" aria-pressed={form.mode === "equal"} onClick={() => setForm({ ...form, mode: "equal" })}>Split equally</button>
          <button type="button" className="chip" aria-pressed={form.mode === "custom"} onClick={() => setForm({ ...form, mode: "custom" })}>Custom amounts</button>
        </div>
        {form.mode === "custom" && (
          <div className="field-row">
            {trip.members.map((m) => (
              <div key={m.id}><label className="lbl" htmlFor={`c-${m.id}`}>{m.name}</label><input id={`c-${m.id}`} type="number" min={0} value={custom[m.id] ?? ""} onChange={(e) => setCustom({ ...custom, [m.id]: e.target.value })} /></div>
            ))}
          </div>
        )}
        <div className="row"><button className="btn btn-sun" type="submit">Add expense</button><span role="status" className="muted">{err}</span></div>
      </form>

      {trip.expenses.length > 0 && (
        <section className="card" style={{ gap: 8 }}>
          <h3>Expenses</h3>
          {[...trip.expenses].reverse().map((e) => (
            <div key={e.id} className="between" style={{ padding: "6px 0", borderTop: "1px solid var(--line)" }}>
              <span>{e.label} <span className="muted" style={{ fontSize: "0.8rem" }}>· {memberName(trip, e.paidBy)} paid · {e.split === "equal" ? "equal split" : "custom"}</span></span>
              <span className="row" style={{ gap: 6 }}><strong>{money(trip, e.amount)}</strong><button type="button" className="btn btn-ghost btn-sm" aria-label={`Remove ${e.label}`} onClick={() => remove(e.id)}>✕</button></span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
