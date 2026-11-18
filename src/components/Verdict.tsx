"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { sb } from "@/lib/supabaseBrowser";

type Vote = { verdict: "worth" | "skip"; note: string | null; paid_usd: number | null; crowd: string | null; best_time: string | null; felt_safe: string | null; created_at: string; user_id: string };

export function Verdict({ gemId }: { gemId: string }) {
  const { session } = useApp();
  const client = sb();
  const [votes, setVotes] = useState<Vote[] | null>(null);
  const [mine, setMine] = useState<"worth" | "skip" | "">("");
  const [note, setNote] = useState("");
  const [paid, setPaid] = useState("");
  const [crowd, setCrowd] = useState("");
  const [best, setBest] = useState("");
  const [safe, setSafe] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    if (!client) return setVotes([]);
    const { data } = await client.from("gem_votes").select("verdict,note,paid_usd,crowd,best_time,felt_safe,created_at,user_id").eq("gem_id", gemId).order("created_at", { ascending: false }).limit(100);
    setVotes((data ?? []) as Vote[]);
  }, [client, gemId]);
  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!client || !session) return;
    if (!mine) return setMsg("Pick Worth it or Skip it first.");
    const { error } = await client.from("gem_votes").upsert({
      gem_id: gemId, user_id: session.user.id, verdict: mine, note: note.trim() || null,
      paid_usd: paid === "" ? null : Math.max(0, Math.round(Number(paid))), crowd: crowd || null, best_time: best || null, felt_safe: safe || null,
    });
    setMsg(error ? "Couldn't save. Please try again." : "Thanks! Your verdict helps the next traveller.");
    if (!error) load();
  };

  const w = votes?.filter((v) => v.verdict === "worth").length ?? 0;
  const n = votes?.length ?? 0;
  const pct = n ? Math.round((w / n) * 100) : 0;
  const paidVals = (votes ?? []).map((v) => v.paid_usd).filter((x): x is number => typeof x === "number").sort((a, b) => a - b);
  const medianPaid = paidVals.length ? paidVals[Math.floor((paidVals.length - 1) / 2)] : null;
  const safeYes = votes?.filter((v) => v.felt_safe === "yes").length ?? 0;
  const safeAll = votes?.filter((v) => v.felt_safe === "yes" || v.felt_safe === "no").length ?? 0;

  const pick = (opts: [string, string][], val: string, set: (v: string) => void, label: string) => (
    <div className="stack" style={{ gap: 6 }}>
      <span className="lbl">{label}</span>
      <div className="chips">{opts.map(([k, l]) => <button key={k} type="button" className="chip" aria-pressed={val === k} onClick={() => set(val === k ? "" : k)}>{l}</button>)}</div>
    </div>
  );

  return (
    <section className="card" style={{ gap: 16 }}>
      <div className="between">
        <h2>Worth it?</h2>
        {n > 0 && <span className="badge tone-free">{pct}% say worth it · {n} {n === 1 ? "verdict" : "verdicts"}</span>}
      </div>
      {n > 0 ? (
        <div className="stack">
          <div className="progress" aria-hidden="true"><i style={{ width: `${pct}%`, background: "var(--mint)" }} /></div>
          <div className="row">
            {medianPaid != null && <span className="badge tone-unknown">💵 Travellers paid ~${medianPaid}</span>}
            {safeAll > 0 && <span className="badge tone-lilac">👩🏾 Women felt safe {safeYes}/{safeAll}</span>}
          </div>
          {votes!.filter((v) => v.note).slice(0, 6).map((v, i) => (
            <div key={i} className="card card-soft" style={{ padding: 14, gap: 4 }}>
              <span className={`badge ${v.verdict === "worth" ? "tone-free" : "tone-hard"}`} style={{ justifySelf: "start" }}>{v.verdict === "worth" ? "👍 Worth it" : "👎 Skip it"}</span>
              <p>{v.note}</p>
              <span className="muted" style={{ fontSize: "0.75rem" }}>{v.created_at.slice(0, 10)}{v.best_time ? ` · best at ${v.best_time}` : ""}{v.crowd ? ` · ${v.crowd}` : ""}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted">{votes === null ? "Loading…" : "No verdicts yet. Been here? Be the first to say if it's worth it."}</p>
      )}

      <hr className="divider" />
      {!client ? (
        <p className="muted" style={{ fontSize: "0.9rem" }}>Ratings switch on when accounts are connected.</p>
      ) : !session ? (
        <div className="row"><span className="muted">Sign in to add your verdict.</span><Link href="/profile" className="btn btn-soft btn-sm">Sign in</Link></div>
      ) : (
        <div className="stack">
          <div className="row">
            <button type="button" className="chip" aria-pressed={mine === "worth"} onClick={() => setMine("worth")}>👍 Worth it</button>
            <button type="button" className="chip" aria-pressed={mine === "skip"} onClick={() => setMine("skip")}>👎 Skip it</button>
          </div>
          {pick([["quiet", "Quiet"], ["some people", "Some people"], ["packed", "Packed"]], crowd, setCrowd, "How busy?")}
          {pick([["morning", "Morning"], ["afternoon", "Afternoon"], ["sunset", "Sunset"], ["night", "Night"]], best, setBest, "Best time")}
          {pick([["yes", "Yes"], ["no", "No"], ["na", "Doesn't apply"]], safe, setSafe, "Felt safe as a woman on your own?")}
          <div className="field-row">
            <div style={{ maxWidth: 220 }}><label className="lbl" htmlFor="vp">What you paid (USD)</label><input id="vp" type="number" min={0} value={paid} onChange={(e) => setPaid(e.target.value)} /></div>
            <div style={{ flex: "3 1 260px" }}><label className="lbl" htmlFor="vn">Tip for others</label><input id="vn" maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Go early, bring cash, the path is steep…" /></div>
          </div>
          <div className="row"><button type="button" className="btn btn-sun" onClick={submit}>Post verdict</button><span role="status" className="muted">{msg}</span></div>
        </div>
      )}
    </section>
  );
}
