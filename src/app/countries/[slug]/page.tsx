import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Affiliate } from "@/components/Affiliate";
import { MonthStrip } from "@/components/MonthStrip";
import { COUNTRIES, countryBySlug } from "@/lib/countries";
import { SITE } from "@/lib/site";
import { DESTINATIONS } from "@/lib/visa";

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = countryBySlug((await params).slug);
  if (!c) return {};
  return {
    title: `${c.name} travel guide: best time to visit, budget and itinerary`,
    description: `Best months to visit ${c.name}, weather, ${c.currency.split(" · ")[1] ?? "currency"}, plugs, daily budget and a sample itinerary.`,
  };
}

export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = countryBySlug((await params).slug);
  if (!c) notFound();
  const visaDest = DESTINATIONS.find((d) => d.code === c.code);
  return (
    <section className="section">
      <div className="wrap">
        <Link href="/countries" className="muted" style={{ fontSize: "0.9rem" }}>← All countries</Link>
        <div className="section-head" style={{ marginTop: 12 }}>
          <span className="eyebrow">{c.region}</span>
          <h1>{c.name}</h1>
          <p>{c.highlights.join(" · ")}</p>
        </div>
        <div className="two-col">
          <div style={{ display: "grid", gap: 20 }}>
            <div className="panel">
              <h2 style={{ fontSize: "1.3rem" }}>Best time to visit</h2>
              <MonthStrip best={c.bestMonths} ok={c.okMonths} />
              <p className="muted" style={{ fontSize: "0.85rem" }}>Green: great · Grey: possible · Red: not ideal</p>
              <p>{c.weather}</p>
            </div>
            <div className="panel">
              <h2 style={{ fontSize: "1.3rem" }}>Sample itinerary</h2>
              {c.itinerary ? (
                <>
                  <ol className="days">{c.itinerary.map((d) => <li key={d}>{d}</li>)}</ol>
                  <p className="muted" style={{ fontSize: "0.85rem" }}>Written by {SITE.name}. Adjust travel days to your pace.</p>
                </>
              ) : (
                <p className="muted">
                  We&apos;re writing this one. Meanwhile, <Link href="/agent">ask {SITE.agentName}</Link> for a day-by-day plan based on this guide.
                </p>
              )}
            </div>
            <Affiliate kind="tours" />
          </div>
          <aside style={{ display: "grid", gap: 16 }}>
            <div className="panel">
              <div className="ledger-row"><span>Capital</span><strong>{c.capital}</strong></div>
              <div className="ledger-row"><span>Currency</span><strong>{c.currency}</strong></div>
              <div className="ledger-row"><span>Languages</span><strong>{c.languages}</strong></div>
              <div className="ledger-row"><span>Plug types</span><strong>{c.plugs}</strong></div>
            </div>
            <div className="panel">
              <h3>Daily budget per person</h3>
              <div className="ledger-row"><span>Backpacker</span><strong>${c.dailyBudget[0]}</strong></div>
              <div className="ledger-row"><span>Comfortable</span><strong>${c.dailyBudget[1]}</strong></div>
              <div className="ledger-row"><span>Treat yourself</span><strong>${c.dailyBudget[2]}</strong></div>
              <p className="muted" style={{ fontSize: "0.8rem" }}>Food, local transport and a room. Excludes flights and big-ticket items like safaris or gorilla permits.</p>
            </div>
            <div className="panel"><h3>💳 Money tip</h3><p>{c.moneyTip}</p></div>
            {visaDest && (
              <Link className="btn btn-primary" href="/visa">Check the {c.name} visa for your passport →</Link>
            )}
            <Affiliate kind="esim" />
            <p className="muted" style={{ fontSize: "0.8rem" }}>Facts checked November 2026. Confirm entry rules and prices before you travel.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
