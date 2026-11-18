import type { Metadata } from "next";
import Link from "next/link";
import { DEALS } from "@/lib/site";

export const metadata: Metadata = { title: "Deals", description: "Stays, flights, rides, eSIM, insurance and tours from vetted partners." };

export default function Deals() {
  const items = Object.entries(DEALS);
  return (
    <div className="stack-lg fade-in">
      <div className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">Deals</span>
        <h1>Book it <span className="gradient-text">for less.</span></h1>
        <p className="muted" style={{ maxWidth: "60ch" }}>Partners we trust for the bits you need: a bed, a seat, a ride from the airport and data when you land. Using them keeps the app free.</p>
      </div>
      <div className="grid">
        {items.map(([k, d]) => (
          <div key={k} className="card hover-lift">
            <span style={{ fontSize: "2rem" }} aria-hidden="true">{d.emoji}</span>
            <h3>{d.title}</h3>
            <p className="muted" style={{ fontSize: "0.9rem" }}>{d.blurb}</p>
            {d.url ? (
              <a className="btn btn-sun btn-sm" href={d.url} target="_blank" rel="sponsored noopener noreferrer" style={{ justifySelf: "start" }}>See deals ↗</a>
            ) : (
              <span className="badge tone-unknown" style={{ justifySelf: "start" }}>Partner coming soon</span>
            )}
          </div>
        ))}
      </div>
      <p className="muted" style={{ fontSize: "0.8rem" }}>Partner links: we may earn a commission at no extra cost to you. Partners never pay for visa information or rankings.</p>
      <div className="card" style={{ borderColor: "var(--gold)" }}>
        <span className="eyebrow">For businesses</span>
        <h2>Hotels, airlines, banks and tourism boards</h2>
        <p className="muted">Reach travellers who are ready to go, especially across Africa.</p>
        <Link href="/partners" className="btn btn-ghost" style={{ justifySelf: "start" }}>Partner with us →</Link>
      </div>
    </div>
  );
}
