"use client";
import { useState } from "react";
import { DOCUMENT_KEYS, DOCUMENT_LABELS, type DocumentKey } from "@/lib/visa";

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export function StoryForm({ passport, destination }: { passport: string; destination: string }) {
  const [type, setType] = useState("tourist");
  const [outcome, setOutcome] = useState<"approved" | "refused" | "pending">("approved");
  const [docs, setDocs] = useState<DocumentKey[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(form: HTMLFormElement) {
    const f = new FormData(form);
    const num = (k: string) => { const v = String(f.get(k) ?? "").trim(); return v === "" ? null : Math.round(Number(v)); };
    setBusy(true); setMsg("");
    try {
      const res = await fetch("/api/stories", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passport, destination, visa_type: type, outcome, documents: docs,
          applied_at: String(f.get("applied_at") ?? ""), days_waited: num("days_waited"), total_cost_usd: num("total_cost_usd"),
          refusal_reason: String(f.get("refusal_reason") ?? ""), advice: String(f.get("advice") ?? ""), website: String(f.get("website") ?? ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg("Thank you! Your story appears after a quick check.");
      form.reset(); setDocs([]);
    } catch (e) {
      setMsg(e instanceof Error && e.message ? e.message : "Couldn't send your story.");
    } finally { setBusy(false); }
  }

  const pick = (vals: string[], cur: string, set: (v: string) => void) => (
    <div className="chips">{vals.map((v) => <button key={v} type="button" className="chip" aria-pressed={cur === v} onClick={() => set(v)}>{cap(v)}</button>)}</div>
  );

  return (
    <form className="card" onSubmit={(e) => { e.preventDefault(); submit(e.currentTarget); }} style={{ gap: 14 }}>
      <span className="eyebrow" style={{ color: "var(--lilac)" }}>Help the next person</span>
      <h2>Share your visa story</h2>
      <p className="muted" style={{ fontSize: "0.9rem" }}>Anonymous. No names or passport numbers. Checked before it appears.</p>
      <div className="stack" style={{ gap: 6 }}><span className="lbl">Visa type</span>{pick(["tourist", "business", "student", "transit", "work"], type, setType)}</div>
      <div className="stack" style={{ gap: 6 }}><span className="lbl">Result</span>{pick(["approved", "refused", "pending"], outcome, (v) => setOutcome(v as typeof outcome))}</div>
      <div className="field-row">
        <div><label className="lbl" htmlFor="sf-at">Where you applied</label><input id="sf-at" name="applied_at" maxLength={80} placeholder="e.g. VFS Lagos" /></div>
        <div><label className="lbl" htmlFor="sf-days">Days to decision</label><input id="sf-days" name="days_waited" type="number" min={0} max={730} /></div>
        <div><label className="lbl" htmlFor="sf-cost">Total cost (USD)</label><input id="sf-cost" name="total_cost_usd" type="number" min={0} max={20000} /></div>
      </div>
      <div className="stack" style={{ gap: 6 }}>
        <span className="lbl">Documents you submitted</span>
        <div className="chips">
          {DOCUMENT_KEYS.map((k) => (
            <button key={k} type="button" className="chip" aria-pressed={docs.includes(k)} onClick={() => setDocs(docs.includes(k) ? docs.filter((x) => x !== k) : [...docs, k])}>{DOCUMENT_LABELS[k]}</button>
          ))}
        </div>
      </div>
      {outcome === "refused" && <div><label className="lbl" htmlFor="sf-reason">Refusal reason given</label><textarea id="sf-reason" name="refusal_reason" maxLength={500} /></div>}
      <div><label className="lbl" htmlFor="sf-adv">Advice for the next person</label><textarea id="sf-adv" name="advice" maxLength={1000} placeholder="What would you do differently?" /></div>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />
      <div className="row"><button className="btn btn-sun" type="submit" disabled={busy}>{busy ? "Sending…" : "Share story"}</button><span role="status" className="muted">{msg}</span></div>
    </form>
  );
}
