"use client";
import Link from "next/link";
import { useState } from "react";
import type { Thing } from "@/lib/countryExtras";
import { VIBES, vibeInfo, type Vibe } from "@/lib/site";
import { newId, useApp, useVisaRow, type PlaceStatus } from "@/lib/store";
import { flag, nameOf, visaLabel, type VisaCode } from "@/lib/world";

export function VisaPanel({ code, covered }: { code: string; covered: boolean }) {
  const { profile } = useApp();
  const row = useVisaRow(profile?.passport);
  if (!profile) {
    return (
      <div className="card" style={{ gap: 10 }}>
        <span className="eyebrow">Getting in</span>
        <h3>Can you go visa-free?</h3>
        <p className="muted">Tell us your passport and we&apos;ll show your exact entry rule here.</p>
        <Link href="/setup" className="btn btn-sun" style={{ justifySelf: "start" }}>Set my passport</Link>
      </div>
    );
  }
  const home = code === profile.passport;
  const v = visaLabel(row?.[code] as VisaCode | undefined);
  return (
    <div className="card" style={{ gap: 10 }}>
      <span className="eyebrow">Getting in · {flag(profile.passport)} {nameOf(profile.passport)} passport</span>
      {home ? <h3>This is home 🏠</h3> : row ? <span className={`badge tone-${v.tone}`} style={{ justifySelf: "start", fontSize: "0.95rem", padding: "7px 14px" }}>{v.label}</span> : <span className="muted">Checking…</span>}
      {!home && (
        <>
          <p className="muted" style={{ fontSize: "0.9rem" }}>
            {v.tone === "free" ? "You can usually just go. Carry a return ticket, proof of where you'll stay and enough money for the trip."
              : v.tone === "easy" ? "Apply online before you fly. Use only the official government site."
                : v.tone === "hard" ? "You'll need a visa before you travel. See documents, fees, bank statements and real stories."
                  : "Check the official rules before you plan anything."}
          </p>
          <Link href={`/visa/${profile.passport.toLowerCase()}/${code.toLowerCase()}`} className="btn btn-soft" style={{ justifySelf: "start" }}>
            {covered ? "Full visa guide →" : "Visa details & stories →"}
          </Link>
        </>
      )}
    </div>
  );
}

export function TripButtons({ code }: { code: string }) {
  const { places, upsertPlace, removePlace } = useApp();
  const existing = places.find((t) => t.country === code);
  const set = (status: PlaceStatus) => {
    if (existing?.status === status) return removePlace(existing.id);
    upsertPlace({ id: existing?.id ?? newId(), country: code, status, start: existing?.start, end: existing?.end });
  };
  const opts: [PlaceStatus, string][] = [["been", "✅ Been"], ["going", "🧳 Going"], ["dream", "💭 Dream"]];
  return (
    <div className="row" role="group" aria-label="Add to my map">
      {opts.map(([s, l]) => (
        <button key={s} type="button" className="chip" aria-pressed={existing?.status === s} onClick={() => set(s)}>{l}</button>
      ))}
    </div>
  );
}

export function ThingsToDo({ things }: { things: Thing[] }) {
  const { profile } = useApp();
  const [vibe, setVibe] = useState<Vibe | "">("");
  const mine = new Set(profile?.vibes ?? []);
  const present = VIBES.filter((v) => things.some((t) => t.v === v.id));
  const list = things.filter((t) => !vibe || t.v === vibe).sort((a, b) => Number(mine.has(b.v)) - Number(mine.has(a.v)));
  return (
    <div className="stack">
      <div className="chips">
        <button type="button" className="chip" aria-pressed={!vibe} onClick={() => setVibe("")}>All</button>
        {present.map((v) => <button key={v.id} type="button" className="chip" aria-pressed={vibe === v.id} onClick={() => setVibe(vibe === v.id ? "" : v.id)}>{v.emoji} {v.label.split(" ")[0]}</button>)}
      </div>
      <div className="grid-2">
        {list.map((t) => (
          <div key={t.t} className="card card-soft" style={{ padding: 16, gap: 6 }}>
            <span className="badge tone-lilac" style={{ justifySelf: "start" }}>{vibeInfo(t.v).emoji} {vibeInfo(t.v).label}{mine.has(t.v) ? " · your vibe" : ""}</span>
            <span style={{ fontWeight: 600 }}>{t.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
