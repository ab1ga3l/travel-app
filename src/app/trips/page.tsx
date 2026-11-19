"use client";
import Link from "next/link";
import { TripCard } from "@/components/TripCard";
import { useApp } from "@/lib/store";
import { tripPhase, type TripDoc } from "@/lib/tripTypes";

export default function Trips() {
  const { tripDocs, ready } = useApp();
  if (!ready) return <div className="muted">Loading…</div>;
  const groups: [string, TripDoc[]][] = [
    ["Happening now", tripDocs.filter((t) => tripPhase(t) === "now")],
    ["Coming up", tripDocs.filter((t) => tripPhase(t) === "upcoming").sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""))],
    ["Planning", tripDocs.filter((t) => tripPhase(t) === "planning")],
    ["Past trips", tripDocs.filter((t) => tripPhase(t) === "past")],
  ];
  return (
    <div className="stack-lg fade-in">
      <div className="between">
        <div className="stack" style={{ gap: 8 }}><span className="eyebrow">Your trips</span><h1>Let&apos;s <span className="gradient-text">go.</span></h1></div>
        <div className="row"><Link href="/join" className="btn btn-ghost">🔑 Join with code</Link><Link href="/trips/new" className="btn btn-sun">＋ New trip</Link></div>
      </div>
      {tripDocs.length === 0 ? (
        <div className="empty">
          <span style={{ fontSize: "2.2rem" }}>🧳</span>
          <strong>No trips yet.</strong>
          <span>Plan one in a minute, or join your friends with their code.</span>
          <Link href="/trips/new" className="btn btn-sun">Plan my first trip</Link>
        </div>
      ) : (
        groups.filter(([, l]) => l.length).map(([title, l]) => (
          <section key={title} className="section">
            <h2>{title}</h2>
            <div className="grid">{l.map((t) => <TripCard key={t.id} t={t} />)}</div>
          </section>
        ))
      )}
    </div>
  );
}
