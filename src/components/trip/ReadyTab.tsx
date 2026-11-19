"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchVisaRow } from "@/lib/store";
import { READY_ITEMS } from "@/lib/tripTypes";
import { flag, nameOf, visaLabel, type VisaCode } from "@/lib/world";
import type { TabProps } from "./shared";

export function ReadyTab({ trip, update }: TabProps) {
  const [visa, setVisa] = useState<Record<string, VisaCode | undefined>>({});
  useEffect(() => {
    let live = true;
    Promise.all(Array.from(new Set(trip.members.map((m) => m.passport))).map(async (p) => [p, (await fetchVisaRow(p))[trip.country] as VisaCode | undefined] as const))
      .then((pairs) => live && setVisa(Object.fromEntries(pairs)));
    return () => { live = false; };
  }, [trip.members, trip.country]);

  const toggle = (mid: string, key: string) =>
    update((t) => ({ ...t, checklist: { ...t.checklist, [mid]: { ...(t.checklist[mid] ?? {}), [key]: !t.checklist[mid]?.[key] } } }));

  const allReady = trip.members.every((m) => READY_ITEMS.every((i) => trip.checklist[m.id]?.[i.id]));
  return (
    <div className="stack-lg">
      <p className="muted">Everyone&apos;s passport is different, so everyone gets their own checklist. Tick things off as you go.</p>
      {allReady && <div className="note">🎉 The whole crew is ready to fly!</div>}
      <div className="grid-2">
        {trip.members.map((m) => {
          const done = READY_ITEMS.filter((i) => trip.checklist[m.id]?.[i.id]).length;
          const home = m.passport === trip.country;
          const v = visaLabel(visa[m.passport]);
          return (
            <section key={m.id} className="card" style={{ gap: 10 }}>
              <div className="between"><h3>{m.name}</h3><span className="badge tone-unknown">{flag(m.passport)} {nameOf(m.passport)}</span></div>
              {home ? <span className="badge tone-free" style={{ justifySelf: "start" }}>Home country</span>
                : <div className="row"><span className={`badge tone-${v.tone}`}>{v.label}</span><Link href={`/visa/${m.passport.toLowerCase()}/${trip.country.toLowerCase()}`} className="btn btn-ghost btn-sm">Visa checklist →</Link></div>}
              <div className="progress"><i style={{ width: `${(done / READY_ITEMS.length) * 100}%`, background: "var(--mint)" }} /></div>
              <span className="muted" style={{ fontSize: "0.8rem" }}>{done} of {READY_ITEMS.length} ready</span>
              <div className="stack" style={{ gap: 6 }}>
                {READY_ITEMS.map((i) => (
                  <label key={i.id} className="row" style={{ gap: 10, cursor: "pointer", flexWrap: "nowrap" }}>
                    <input type="checkbox" checked={!!trip.checklist[m.id]?.[i.id]} onChange={() => toggle(m.id, i.id)} style={{ width: 20, height: 20, flex: "0 0 auto", accentColor: "var(--mint)" }} />
                    <span style={{ fontSize: "0.9rem" }}>{i.label}</span>
                  </label>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
