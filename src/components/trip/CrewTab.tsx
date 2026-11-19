"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP } from "@/lib/site";
import { useApp } from "@/lib/store";
import type { Member } from "@/lib/tripTypes";
import { WORLD, flag, nameOf } from "@/lib/world";
import { initials } from "../TripCard";
import { type TabProps, uid, waLink } from "./shared";

export function CrewTab({ trip, me, canManage, update }: TabProps) {
  const { deleteTrip } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", passport: me.passport });
  const [copied, setCopied] = useState(false);
  const isOwner = me.role === "owner";
  const link = typeof window !== "undefined" ? `${window.location.origin}/join?code=${trip.code}` : `${APP.url}/join?code=${trip.code}`;
  const invite = `✈️ Join "${trip.name}" (${nameOf(trip.country)}) on ${APP.name}! Plan, vote and track the pot together. Tap ${link} or use code ${trip.code}.`;

  const add = () => {
    if (!form.name.trim()) return;
    const m: Member = { id: uid(), name: form.name.trim(), passport: form.passport, role: "member" };
    update((t) => ({ ...t, members: [...t.members, m] }));
    setForm({ ...form, name: "" });
  };
  const setRole = (id: string, role: Member["role"]) => update((t) => ({ ...t, members: t.members.map((m) => (m.id === id ? { ...m, role } : m.role === "treasurer" && role === "treasurer" ? { ...m, role: "member" } : m)) }));
  const remove = (id: string) => update((t) => ({ ...t, members: t.members.filter((m) => m.id !== id) }));
  const copy = async () => { try { await navigator.clipboard.writeText(trip.code); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* no clipboard */ } };

  return (
    <div className="stack-lg">
      <section className="card glow" style={{ gap: 12 }}>
        <span className="eyebrow">Invite your people</span>
        <div className="row" style={{ alignItems: "center" }}>
          <button type="button" className="mono" onClick={copy} style={{ fontSize: "2rem", letterSpacing: "0.3em", fontWeight: 700, background: "none", border: "1px dashed var(--line-strong)", borderRadius: 14, padding: "8px 16px", color: "var(--gold)" }} aria-label="Copy invite code">{trip.code}</button>
          <span className="muted">{copied ? "Copied!" : "Tap to copy"}</span>
        </div>
        <div className="row">
          <a className="btn btn-sun" href={waLink(invite)} target="_blank" rel="noopener noreferrer">Share on WhatsApp</a>
          {typeof navigator !== "undefined" && "share" in navigator && <button type="button" className="btn btn-ghost" onClick={() => navigator.share({ title: trip.name, text: invite, url: link }).catch(() => {})}>More ways to share</button>}
        </div>
        <p className="muted" style={{ fontSize: "0.82rem" }}>Friends join with this code from Trips → Join. Each person gets their own visa checklist for their passport.</p>
      </section>

      <section className="card" style={{ gap: 8 }}>
        <h3>The crew ({trip.members.length})</h3>
        {trip.members.map((m) => (
          <div key={m.id} className="between" style={{ padding: "8px 0", borderTop: "1px solid var(--line)" }}>
            <span className="row" style={{ gap: 10, flexWrap: "nowrap" }}>
              <span className="avatars"><span className="avatar">{initials(m.name)}</span></span>
              <span><strong>{m.name}</strong>{m.id === me.id ? " (you)" : ""}<br /><span className="muted" style={{ fontSize: "0.8rem" }}>{flag(m.passport)} {nameOf(m.passport)} passport · {m.role === "owner" ? "organiser" : m.role === "treasurer" ? "🏦 treasurer" : "member"}{m.userId ? "" : " · not on the app yet"}</span></span>
            </span>
            {isOwner && m.role !== "owner" && (
              <span className="row" style={{ gap: 6 }}>
                {m.role !== "treasurer" ? <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRole(m.id, "treasurer")}>Make treasurer</button>
                  : <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRole(m.id, "member")}>Remove treasurer</button>}
                <button type="button" className="btn btn-ghost btn-sm" aria-label={`Remove ${m.name}`} onClick={() => remove(m.id)}>✕</button>
              </span>
            )}
          </div>
        ))}
      </section>

      {canManage && (
        <form className="card" style={{ gap: 12 }} onSubmit={(e) => { e.preventDefault(); add(); }}>
          <h3>Add someone who isn&apos;t on the app</h3>
          <div className="field-row">
            <div><label className="lbl" htmlFor="cn">Name</label><input id="cn" maxLength={40} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Wanjiru" /></div>
            <div><label className="lbl" htmlFor="cp">Passport</label><select id="cp" value={form.passport} onChange={(e) => setForm({ ...form, passport: e.target.value })}>{WORLD.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</select></div>
          </div>
          <button className="btn btn-soft" type="submit" style={{ justifySelf: "start" }}>Add to crew</button>
        </form>
      )}

      {isOwner && (
        <button type="button" className="btn btn-ghost" style={{ justifySelf: "start", color: "var(--sunrise)" }} onClick={async () => { if (confirm(`Delete "${trip.name}" for everyone? This can't be undone.`)) { await deleteTrip(trip.id); router.push("/trips"); } }}>Delete trip</button>
      )}
    </div>
  );
}
