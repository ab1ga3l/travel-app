"use client";
import { useState } from "react";
import { DOCUMENT_KEYS, DOCUMENT_LABELS, type DocumentKey } from "@/lib/visa";

export function StoryForm({ passport, destination }: { passport: string; destination: string }) {
  const [type, setType] = useState("tourist");
  const [outcome, setOutcome] = useState<"approved" | "refused" | "pending">("approved");
  const [docs, setDocs] = useState<DocumentKey[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(form: HTMLFormElement) {
    const f = new FormData(form);
    const num = (k: string) => {
      const v = String(f.get(k) ?? "").trim();
      return v === "" ? null : Math.round(Number(v));
    };
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passport, destination, visa_type: type, outcome, documents: docs,
          applied_at: String(f.get("applied_at") ?? ""),
          days_waited: num("days_waited"), total_cost_usd: num("total_cost_usd"),
          refusal_reason: String(f.get("refusal_reason") ?? ""), advice: String(f.get("advice") ?? ""),
          website: String(f.get("website") ?? ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg("Thank you! Your story will appear after a quick check.");
      form.reset();
      setDocs([]);
    } catch (e) {
      setMsg(e instanceof Error && e.message ? e.message : "Couldn't send your story.");
    } finally {
      setBusy(false);
    }
  }

  const pick = (vals: string[], cur: string, set: (v: never) => void) => (
    <div className="chips">
      {vals.map((v) => (
        <button key={v} type="button" className="chip" aria-pressed={cur === v} onClick={() => set(v as never)}>
          {v[0].toUpperCase() + v.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <form className="panel" onSubmit={(e) => { e.preventDefault(); submit(e.currentTarget); }}>
      <h3>Share your visa story</h3>
      <p className="muted" style={{ fontSize: "0.9rem" }}>No names or passport numbers. Your story helps the next traveler prepare.</p>
      <div><span className="lbl">Visa type</span>{pick(["tourist", "business", "student", "transit", "work"], type, setType as never)}</div>
      <div><span className="lbl">Result</span>{pick(["approved", "refused", "pending"], outcome, setOutcome as never)}</div>
      <div className="row">
        <div><label className="lbl" htmlFor="sf-at">Where you applied</label><input id="sf-at" name="applied_at" maxLength={80} placeholder="e.g. VFS Lagos" /></div>
        <div><label className="lbl" htmlFor="sf-days">Days to decision</label><input id="sf-days" name="days_waited" type="number" min={0} max={730} /></div>
        <div><label className="lbl" htmlFor="sf-cost">Total cost (USD)</label><input id="sf-cost" name="total_cost_usd" type="number" min={0} max={20000} /></div>
      </div>
      <div>
        <span className="lbl">Documents you submitted</span>
        <div className="chips">
          {DOCUMENT_KEYS.map((k) => (
            <button key={k} type="button" className="chip" aria-pressed={docs.includes(k)}
              onClick={() => setDocs(docs.includes(k) ? docs.filter((x) => x !== k) : [...docs, k])}>
              {DOCUMENT_LABELS[k]}
            </button>
          ))}
        </div>
      </div>
      {outcome === "refused" && (
        <div><label className="lbl" htmlFor="sf-reason">Refusal reason given</label><textarea id="sf-reason" name="refusal_reason" maxLength={500} /></div>
      )}
      <div><label className="lbl" htmlFor="sf-adv">Advice for the next person</label><textarea id="sf-adv" name="advice" maxLength={1000} /></div>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />
      <div className="row" style={{ alignItems: "center" }}>
        <button className="btn btn-primary" type="submit" disabled={busy} style={{ flex: "0 0 auto" }}>{busy ? "Sending…" : "Share story"}</button>
        <p role="status" className="muted">{msg}</p>
      </div>
    </form>
  );
}
