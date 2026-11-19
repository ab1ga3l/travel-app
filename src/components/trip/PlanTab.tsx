"use client";
import Link from "next/link";
import { useState } from "react";
import { gemsFor } from "@/lib/gems";
import { tripDays } from "@/lib/tripBuild";
import type { ItemKind, PlanItem } from "@/lib/tripTypes";
import { nameOf } from "@/lib/world";
import { type TabProps, uid } from "./shared";

const KINDS: [ItemKind, string][] = [["activity", "🎟️ Activity"], ["food", "🍲 Food"], ["stay", "🛏️ Stay"], ["flight", "✈️ Flight"], ["transport", "🚌 Transport"], ["event", "🎉 Event"], ["note", "📝 Note"]];
const icon = (k: ItemKind) => KINDS.find(([x]) => x === k)?.[1].split(" ")[0] ?? "•";

export function PlanTab({ trip, update }: TabProps) {
  const days = Math.max(tripDays(trip), ...trip.items.map((i) => i.day), 1);
  const [form, setForm] = useState<{ day: number; time: string; title: string; kind: ItemKind; cost: string }>({ day: 1, time: "", title: "", kind: "activity", cost: "" });
  const gems = gemsFor(trip.country).filter((g) => !trip.items.some((i) => i.gemId === g.id));

  const add = (item: Omit<PlanItem, "id">) => update((t) => ({ ...t, items: [...t.items, { ...item, id: uid() }] }));
  const remove = (id: string) => update((t) => ({ ...t, items: t.items.filter((i) => i.id !== id) }));
  const move = (id: string, day: number) => update((t) => ({ ...t, items: t.items.map((i) => (i.id === id ? { ...i, day } : i)) }));
  const dirUrl = (list: PlanItem[]) => {
    const stops = list.filter((i) => i.kind !== "note").map((i) => `${i.title}, ${nameOf(trip.country)}`);
    if (stops.length < 2) return stops[0] ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops[0])}` : null;
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(stops[0])}&destination=${encodeURIComponent(stops[stops.length - 1])}&waypoints=${encodeURIComponent(stops.slice(1, -1).join("|"))}`;
  };

  return (
    <div className="stack-lg">
      {Array.from({ length: days }, (_, k) => k + 1).map((d) => {
        const list = trip.items.filter((i) => i.day === d).sort((a, b) => (a.time ?? "99").localeCompare(b.time ?? "99"));
        const url = dirUrl(list);
        return (
          <section key={d} className="card" style={{ gap: 10 }}>
            <div className="between"><h3>Day {d}{trip.start ? ` · ${new Date(Date.parse(trip.start) + (d - 1) * 864e5).toDateString().slice(0, 10)}` : ""}</h3>
              {url && <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">🗺️ Route in Maps</a>}</div>
            {list.length ? list.map((i) => (
              <div key={i.id} className="between" style={{ padding: "8px 0", borderTop: "1px solid var(--line)" }}>
                <div className="row" style={{ gap: 10, flexWrap: "nowrap", minWidth: 0 }}>
                  <span style={{ fontSize: "1.2rem" }} aria-hidden="true">{icon(i.kind)}</span>
                  <div style={{ minWidth: 0 }}>
                    <strong>{i.gemId ? <Link href={`/gems/${i.gemId}`}>{i.title}</Link> : i.title}</strong>
                    <div className="muted" style={{ fontSize: "0.8rem" }}>{[i.time, i.note, i.cost ? `${trip.currency} ${i.cost.toLocaleString()}` : ""].filter(Boolean).join(" · ")}</div>
                  </div>
                </div>
                <div className="row" style={{ gap: 6, flexWrap: "nowrap" }}>
                  <select aria-label="Move to day" value={i.day} onChange={(e) => move(i.id, Number(e.target.value))} style={{ width: 90, padding: "6px 8px" }}>
                    {Array.from({ length: days + 1 }, (_, k) => <option key={k} value={k + 1}>Day {k + 1}</option>)}
                  </select>
                  <button type="button" className="btn btn-ghost btn-sm" aria-label={`Remove ${i.title}`} onClick={() => remove(i.id)}>✕</button>
                </div>
              </div>
            )) : <p className="muted" style={{ fontSize: "0.9rem" }}>Nothing planned yet. Free day?</p>}
          </section>
        );
      })}

      <form className="card" style={{ gap: 12 }} onSubmit={(e) => { e.preventDefault(); if (!form.title.trim()) return; add({ day: form.day, time: form.time || undefined, title: form.title.trim(), kind: form.kind, cost: form.cost ? Number(form.cost) : undefined }); setForm({ ...form, title: "", cost: "" }); }}>
        <h3>Add to the plan</h3>
        <div className="chips">{KINDS.map(([k, l]) => <button key={k} type="button" className="chip" aria-pressed={form.kind === k} onClick={() => setForm({ ...form, kind: k })}>{l}</button>)}</div>
        <div className="field-row">
          <div style={{ flex: "3 1 220px" }}><label className="lbl" htmlFor="pt">What</label><input id="pt" maxLength={100} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sunset dhow cruise" /></div>
          <div style={{ flex: "1 1 100px" }}><label className="lbl" htmlFor="pd">Day</label><select id="pd" value={form.day} onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}>{Array.from({ length: days + 1 }, (_, k) => <option key={k} value={k + 1}>Day {k + 1}</option>)}</select></div>
          <div style={{ flex: "1 1 110px" }}><label className="lbl" htmlFor="ptm">Time</label><input id="ptm" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
          <div style={{ flex: "1 1 120px" }}><label className="lbl" htmlFor="pc">Cost ({trip.currency})</label><input id="pc" type="number" min={0} value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} /></div>
        </div>
        <button className="btn btn-sun" type="submit" style={{ justifySelf: "start" }}>Add</button>
      </form>

      {gems.length > 0 && (
        <section className="card" style={{ gap: 10 }}>
          <h3>💎 Gems you haven&apos;t added</h3>
          <div className="chips">{gems.map((g) => <button key={g.id} type="button" className="chip" onClick={() => add({ day: 1, title: g.name, kind: "activity", gemId: g.id, note: g.area })}>＋ {g.name}</button>)}</div>
        </section>
      )}
    </div>
  );
}
