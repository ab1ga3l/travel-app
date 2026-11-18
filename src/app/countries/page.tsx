import type { Metadata } from "next";
import Link from "next/link";
import { MonthStrip } from "@/components/MonthStrip";
import { COUNTRIES, REGIONS } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Country guides: best months, budgets and itineraries",
  description: "Travel guides for Africa, Asia and Europe with the best months to visit, weather, currency, plugs, daily budgets and sample itineraries.",
};

export default function Countries() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Country guides</span>
          <h1>Where to go, and when</h1>
          <p>Every guide shows the best months, the weather, money tips, plugs and what a day really costs. We start with Africa.</p>
        </div>
        {REGIONS.map((r) => (
          <div key={r.id} id={r.id} style={{ marginBottom: 48, scrollMarginTop: 90 }}>
            <h2 style={{ marginBottom: 6 }}>{r.name}</h2>
            <p className="muted" style={{ marginBottom: 18 }}>{r.blurb}</p>
            <div className="grid">
              {COUNTRIES.filter((c) => c.region === r.id).map((c) => (
                <Link key={c.code} href={`/countries/${c.slug}`} className="card card-link">
                  <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ flex: "1 1 auto" }}>{c.name}</h3>
                    {c.itinerary && <span className="pill pill-good" style={{ flex: "0 0 auto" }}>Itinerary</span>}
                  </div>
                  <MonthStrip best={c.bestMonths} ok={c.okMonths} />
                  <span className="muted" style={{ fontSize: "0.88rem" }}>{c.highlights.slice(0, 3).join(" · ")}</span>
                  <span style={{ fontSize: "0.88rem" }}>${c.dailyBudget[0]}–${c.dailyBudget[2]} a day · plugs {c.plugs}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
