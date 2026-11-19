"use client";
import Link from "next/link";
import { useApp, useVisaRow } from "@/lib/store";
import { visaLabel, type VisaCode } from "@/lib/world";

export function MatchRing({ value, label = "match" }: { value: number; label?: string }) {
  return (
    <span className="match" title={`${value}% ${label} with your travel style`}>
      <span className="match-ring" style={{ ["--p" as string]: value }} aria-hidden="true" />
      {value}% {label}
    </span>
  );
}

export function VisaBadgeFor({ code, compact = false }: { code: string; compact?: boolean }) {
  const { profile } = useApp();
  const row = useVisaRow(profile?.passport);
  if (!profile) return compact ? null : <Link href="/setup" className="badge tone-unknown">Set your passport</Link>;
  if (!row) return <span className="badge tone-unknown">Checking…</span>;
  if (code === profile.passport) return <span className="badge tone-free">Home</span>;
  const v = visaLabel(row[code] as VisaCode | undefined);
  return <span className={`badge tone-${v.tone}`}>{v.label}</span>;
}

export function SectionHead({ eyebrow, title, sub, action }: { eyebrow?: string; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="section-head">
      <div className="stack" style={{ gap: 6 }}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
