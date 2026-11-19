"use client";
import { useCallback, useEffect, useState } from "react";
import { useApp, type Vote } from "@/lib/store";
import { cloudEnabled } from "@/lib/supabaseBrowser";
import type { Proposal } from "@/lib/tripTypes";
import { type TabProps, memberName, uid, waLink } from "./shared";

const isOpen = (p: Proposal) => !p.revealed && (!p.deadline || Date.parse(p.deadline) > Date.now());

export function VoteTab({ trip, me, canManage, update }: TabProps) {
  const { session, castVote, myVotes, voteResults } = useApp();
  const shared = cloudEnabled && !!session;
  const [mine, setMine] = useState<Record<string, Vote>>({});
  const [results, setResults] = useState<Record<string, { yes: number; no: number; abstain: number }>>({});
  const [form, setForm] = useState({ title: "", detail: "", deadline: "", sealed: true });

  const refresh = useCallback(async () => {
    if (!shared) return;
    const [m, r] = await Promise.all([myVotes(trip.id), voteResults(trip.id)]);
    setMine(m); setResults(r);
  }, [shared, trip.id, myVotes, voteResults]);
  useEffect(() => { refresh(); }, [refresh, trip.updatedAt]);

  const propose = () => {
    if (!form.title.trim()) return;
    const p: Proposal = { id: uid(), title: form.title.trim(), detail: form.detail.trim() || undefined, kind: "activity", deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined, sealed: form.sealed, createdBy: me.id, at: new Date().toISOString() };
    update((t) => ({ ...t, proposals: [p, ...t.proposals] }));
    setForm({ title: "", detail: "", deadline: "", sealed: true });
  };
  const vote = async (p: Proposal, v: Vote) => { await castVote(trip, p.id, v); setMine((m) => ({ ...m, [p.id]: v })); refresh(); };
  const reveal = (id: string) => update((t) => ({ ...t, proposals: t.proposals.map((p) => (p.id === id ? { ...p, revealed: true } : p)) }));
  const remove = (id: string) => update((t) => ({ ...t, proposals: t.proposals.filter((p) => p.id !== id) }));

  return (
    <div className="stack-lg">
      {!shared && trip.members.length > 1 && <p className="note">Votes from friends sync once accounts are switched on. For now you can collect ideas and record your own vote.</p>}
      <form className="card" style={{ gap: 12 }} onSubmit={(e) => { e.preventDefault(); propose(); }}>
        <h3>🗳️ Propose something</h3>
        <div><label className="lbl" htmlFor="vt">What should we vote on?</label><input id="vt" maxLength={100} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sunset dhow cruise on Saturday?" /></div>
        <div className="field-row">
          <div><label className="lbl" htmlFor="vd">Details (optional)</label><input id="vd" maxLength={200} value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} placeholder="KES 3,500 each, 2 hours" /></div>
          <div><label className="lbl" htmlFor="vdl">Voting closes</label><input id="vdl" type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
        </div>
        <label className="row" style={{ gap: 8, cursor: "pointer" }}><input type="checkbox" checked={form.sealed} onChange={(e) => setForm({ ...form, sealed: e.target.checked })} style={{ width: 18, height: 18, accentColor: "var(--gold)" }} /> 🔒 Keep votes sealed until it closes</label>
        <button className="btn btn-sun" type="submit" style={{ justifySelf: "start" }}>Start the vote</button>
      </form>

      {trip.proposals.length === 0 ? <div className="empty">No votes yet. Propose the first activity, place or date.</div> : trip.proposals.map((p) => {
        const r = results[p.id];
        const my = shared ? mine[p.id] : p.localVote;
        const total = r ? r.yes + r.no + r.abstain : 0;
        const open = isOpen(p);
        const verdict = r && !open ? (r.yes > r.no ? "approved" : "declined") : null;
        return (
          <section key={p.id} className="card" style={{ gap: 12 }}>
            <div className="between">
              <span className={`badge ${open ? "tone-lilac" : verdict === "approved" ? "tone-free" : verdict ? "tone-hard" : "tone-unknown"}`}>{open ? "Voting" : verdict === "approved" ? "✅ Approved" : verdict ? "❌ Declined" : "Closed"}</span>
              <span className="muted" style={{ fontSize: "0.8rem" }}>by {memberName(trip, p.createdBy)}{p.deadline ? ` · ${open ? "closes" : "closed"} ${new Date(p.deadline).toLocaleString()}` : ""}</span>
            </div>
            <h3>{p.title}</h3>
            {p.detail && <p className="muted">{p.detail}</p>}
            <div className="row">
              {(["yes", "no", "abstain"] as Vote[]).map((v) => (
                <button key={v} type="button" className="chip" aria-pressed={my === v} disabled={!open} onClick={() => vote(p, v)}>{v === "yes" ? "👍 Yes" : v === "no" ? "👎 No" : "🤷🏾 Abstain"}</button>
              ))}
            </div>
            {my && <span className="muted" style={{ fontSize: "0.82rem" }}>Your vote: {my}{p.sealed && open ? " (only you can see this)" : ""}</span>}
            {r && total > 0 ? (
              <div className="stack" style={{ gap: 6 }}>
                {(["yes", "no", "abstain"] as const).map((k) => (
                  <div key={k} className="row" style={{ gap: 10, flexWrap: "nowrap" }}>
                    <span style={{ width: 64, fontSize: "0.85rem", textTransform: "capitalize" }}>{k}</span>
                    <div className="bar" style={{ flex: 1 }}><i style={{ width: `${(r[k] / total) * 100}%`, background: k === "yes" ? "var(--mint)" : k === "no" ? "var(--sunrise)" : "var(--muted)" }} /></div>
                    <strong style={{ width: 24, textAlign: "right" }}>{r[k]}</strong>
                  </div>
                ))}
              </div>
            ) : shared && p.sealed && open ? <p className="note">🔒 Votes are sealed until {p.deadline ? new Date(p.deadline).toLocaleString() : "the organiser reveals them"}.</p> : null}
            <div className="row">
              <a className="btn btn-ghost btn-sm" href={waLink(`🗳️ Vote on "${p.title}" for ${trip.name}! Open Tokende → Trips → Vote. New here? Join with code ${trip.code}.`)} target="_blank" rel="noopener noreferrer">Share on WhatsApp</a>
              {canManage && open && <button type="button" className="btn btn-ghost btn-sm" onClick={() => reveal(p.id)}>Reveal now</button>}
              {canManage && <button type="button" className="btn btn-ghost btn-sm" onClick={() => remove(p.id)}>Delete</button>}
            </div>
          </section>
        );
      })}
    </div>
  );
}
