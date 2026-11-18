import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GemCard } from "@/components/Cards";
import { ThingsToDo, TripButtons, VisaPanel } from "@/components/CountryClient";
import { MonthStrip, monthName } from "@/components/MonthStrip";
import { Poster } from "@/components/Poster";
import { SectionHead } from "@/components/bits";
import { COUNTRIES, countryBySlug } from "@/lib/countries";
import { EXTRAS } from "@/lib/countryExtras";
import { gemsFor } from "@/lib/gems";
import { topVibes } from "@/lib/match";
import { APP, DEALS, vibeInfo } from "@/lib/site";
import { DESTINATIONS } from "@/lib/visa";

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = countryBySlug((await params).slug);
  return c ? { title: `${c.name}: best time, things to do, visa and living there`, description: EXTRAS[c.code]?.tagline } : {};
}

export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = countryBySlug((await params).slug);
  if (!c) notFound();
  const ex = EXTRAS[c.code];
  const gems = gemsFor(c.code);
  const covered = DESTINATIONS.some((d) => d.code === c.code);
  const deals = Object.values(DEALS).filter((d) => d.url);

  return (
    <div className="stack-lg fade-in">
      <Link href="/discover" className="muted" style={{ fontSize: "0.9rem" }}>← Discover</Link>
      <Poster code={c.code} name={c.name} region={c.region} height={300}
        topRight={<span className="glass-pill">{c.region.toUpperCase()}</span>}
        bottom={
          <div className="stack" style={{ gap: 10 }}>
            {ex && <p style={{ maxWidth: "52ch", fontSize: "1.05rem", textShadow: "0 1px 12px rgba(0,0,0,.4)" }}>{ex.tagline}</p>}
            <div className="row">{topVibes(c.code).map((v) => <span key={v} className="glass-pill">{vibeInfo(v).emoji} {vibeInfo(v).label}</span>)}</div>
          </div>
        } />

      <div className="between"><TripButtons code={c.code} /><Link href={`/wazi?q=${encodeURIComponent(`Plan a trip to ${c.name} for my vibe`)}`} className="btn btn-ghost btn-sm">✨ Ask {APP.assistant} about {c.name}</Link></div>

      <div className="split">
        <div className="stack-lg">
          <section className="card" style={{ gap: 14 }}>
            <div className="between"><h2>When to go</h2><span className="muted" style={{ fontSize: "0.85rem" }}>Gold outline = this month</span></div>
            <MonthStrip best={c.bestMonths} ok={c.okMonths} full />
            <p>{c.weather}</p>
            <p className="muted" style={{ fontSize: "0.9rem" }}>Best: {c.bestMonths.map(monthName).join(", ")}</p>
          </section>

          {ex && (
            <section className="section">
              <SectionHead title="Things to do, by vibe" sub="Your vibes are shown first." />
              <ThingsToDo things={ex.things} />
            </section>
          )}

          <section className="section">
            <SectionHead title="Hidden gems & famous spots" sub={gems.length ? "Feel each place before you go, and see if travelers say it's worth it." : undefined}
              action={<Link href="/community" className="btn btn-ghost btn-sm">Suggest a gem</Link>} />
            {gems.length ? <div className="grid">{gems.map((g) => <GemCard key={g.id} gem={g} />)}</div>
              : <div className="empty">No gems mapped here yet. Been? Share your favorite spot in the Community.</div>}
          </section>

          {c.itinerary && (
            <section className="card" style={{ gap: 12 }}>
              <h2>Trip ideas</h2>
              <p className="muted">A loose 7-day flow to start from. Swap in your own vibe.</p>
              <ol className="list">{c.itinerary.map((d) => <li key={d}>{d}</li>)}</ol>
            </section>
          )}

          {ex && (
            <section className="grid-2">
              <div className="card"><h3>👍 Do</h3><ul className="list">{ex.dos.map((d) => <li key={d}>{d}</li>)}</ul></div>
              <div className="card"><h3>✋ Don&apos;t</h3><ul className="list">{ex.donts.map((d) => <li key={d}>{d}</li>)}</ul></div>
            </section>
          )}

          {ex && (
            <section className="card" style={{ gap: 14 }}>
              <span className="eyebrow" style={{ color: "var(--lilac)" }}>Thinking bigger?</span>
              <h2>Could you live in {c.name}?</h2>
              <div className="grid-2">
                <div className="kpi"><strong>~${ex.living.monthlyUSD.toLocaleString()}</strong><span>rough monthly cost for one person, including modest rent</span></div>
                <p className="muted">{ex.living.note}</p>
              </div>
              <div><span className="lbl">Ways to stay longer</span><ul className="list">{ex.living.routes.map((r) => <li key={r}>{r}</li>)}</ul></div>
              <p className="note">Residence rules change often and depend on your passport. Confirm with the official immigration website, or ask {APP.assistant} to check the latest.</p>
            </section>
          )}
        </div>

        <aside className="stack">
          <VisaPanel code={c.code} covered={covered} />
          <div className="card">
            <span className="eyebrow">Money & essentials</span>
            <div className="ledger">
              <div className="ledger-row"><span className="muted">Currency</span><span>{c.currency}</span></div>
              <div className="ledger-row"><span className="muted">Languages</span><span>{c.languages}</span></div>
              <div className="ledger-row"><span className="muted">Plugs</span><span>{c.plugs}</span></div>
              <div className="ledger-row"><span className="muted">Capital</span><span>{c.capital}</span></div>
            </div>
            <p style={{ fontSize: "0.9rem" }}>💳 {c.moneyTip}</p>
          </div>
          <div className="card">
            <span className="eyebrow">Daily budget per person</span>
            <div className="ledger">
              <div className="ledger-row"><span className="muted">🎒 Backpacker</span><span>${c.dailyBudget[0]}</span></div>
              <div className="ledger-row"><span className="muted">🛋️ Comfy</span><span>${c.dailyBudget[1]}</span></div>
              <div className="ledger-row"><span className="muted">🥂 Treat yourself</span><span>${c.dailyBudget[2]}</span></div>
            </div>
            <p className="muted" style={{ fontSize: "0.8rem" }}>Food, local transport and a room. Flights, safaris and permits are extra.</p>
          </div>
          {deals.length > 0 && (
            <div className="card">
              <span className="eyebrow">Deals for this trip</span>
              {deals.map((d) => <a key={d.title} href={d.url} target="_blank" rel="sponsored noopener noreferrer" className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}>{d.emoji} {d.title} ↗</a>)}
              <p className="muted" style={{ fontSize: "0.75rem" }}>Partner links. We may earn a commission at no extra cost to you.</p>
            </div>
          )}
          <p className="muted" style={{ fontSize: "0.78rem" }}>Facts checked Nov 2026. Always confirm entry rules and prices before you travel.</p>
        </aside>
      </div>
    </div>
  );
}
