import Link from "next/link";
import { AgentChat } from "@/components/AgentChat";
import { Band } from "@/components/Band";
import { MonthStrip } from "@/components/MonthStrip";
import { Newsletter } from "@/components/Newsletter";
import { VisaPicker } from "@/components/VisaPicker";
import { COUNTRIES, REGIONS } from "@/lib/countries";
import { PLANS, SITE } from "@/lib/site";
import { DESTINATIONS, PASSPORTS, routeSlug } from "@/lib/visa";

const PROBLEMS = [
  { stat: "48%", title: "of Nigerian Schengen visas were refused in 2025", body: "Ghana was 47% and Senegal 52%. We show what approved applicants did differently." },
  { stat: "42%", title: "of fees kept on refused Schengen visas came from Africans", body: "Africans made up only 24% of applicants. A stronger first application saves real money." },
  { stat: "30–50%", title: "more for flights inside Africa", body: "Than similar distances elsewhere. Our guides point to cheaper routes and regional airlines." },
];

const POPULAR = [
  ["nigeria", "united-kingdom", "Nigeria → UK"], ["ghana", "germany", "Ghana → Germany"], ["kenya", "united-states", "Kenya → USA"],
  ["south-africa", "france", "South Africa → France"], ["nigeria", "canada", "Nigeria → Canada"], ["uganda", "united-arab-emirates", "Uganda → UAE"],
];

export default function Home() {
  const month = new Date().getMonth() + 1;
  const inSeason = COUNTRIES.filter((c) => c.region === "africa" && c.bestMonths.includes(month)).slice(0, 4);
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <span className="eyebrow" style={{ color: "var(--sun)" }}>Built Africa-first · for every passport</span>
            <h1 style={{ marginTop: 12 }}>
              Your passport shouldn&apos;t <em>limit</em> your world.
            </h1>
            <p className="hero-lead">
              Clear visa requirements, real stories from travelers who applied, and country guides with the best months and budgets. Plus {SITE.agentName}, an AI assistant that answers your questions.
            </p>
            <div className="hero-stats">
              <div><strong>36</strong><span>country guides across Africa, Asia and Europe</span></div>
              <div><strong>{DESTINATIONS.length}</strong><span>visa destinations explained step by step</span></div>
              <div><strong>24/7</strong><span>answers from {SITE.agentName}</span></div>
            </div>
          </div>
          <div className="hero-card">
            <span className="eyebrow">Check a visa in 10 seconds</span>
            <VisaPicker passports={PASSPORTS} destinations={DESTINATIONS} />
            <hr style={{ border: 0, borderTop: "1px solid var(--line)", width: "100%" }} />
            <span className="eyebrow">Or ask {SITE.agentName}</span>
            <AgentChat compact agentName={SITE.agentName} />
          </div>
        </div>
      </section>
      <Band />

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Why we exist</span>
            <h2>Travel is harder on some passports. We make it fairer.</h2>
            <p>Most travel sites are written for people who never think about visas. We start with the hard part.</p>
          </div>
          <div className="grid-3">
            {PROBLEMS.map((p) => (
              <div key={p.stat} className="card problem">
                <strong>{p.stat}</strong>
                <h3>{p.title}</h3>
                <p className="muted">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: "0.8rem", marginTop: 12 }}>
            Sources: LAGO Collective analysis of European Commission Schengen data (2025); African Airlines Association and industry reports.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--surface)", borderBlock: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Visa Hub</span>
            <h2>Popular visa routes</h2>
            <p>Requirements, fees, processing times, the documents approved applicants used, and the official links.</p>
          </div>
          <div className="grid">
            {POPULAR.map(([p, d, label]) => (
              <Link key={label} href={`/visa/${routeSlug(p, d)}`} className="card card-link">
                <span className="stamp" style={{ color: "var(--forest)", justifySelf: "start" }}>VISA GUIDE</span>
                <h3>{label}</h3>
                <span className="muted">Requirements, documents and real stories →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Good to go now</span>
            <h2>Great in Africa this month</h2>
            <p>Start with trips that are easier on African passports, and travel when the weather is at its best.</p>
          </div>
          <div className="grid">
            {inSeason.map((c) => (
              <Link key={c.code} href={`/countries/${c.slug}`} className="card card-link">
                <h3>{c.name}</h3>
                <MonthStrip best={c.bestMonths} ok={c.okMonths} />
                <span className="muted" style={{ fontSize: "0.9rem" }}>{c.highlights.slice(0, 2).join(" · ")}</span>
                <span style={{ fontSize: "0.9rem" }}>From ${c.dailyBudget[0]}/day · {c.currency.split(" · ")[0]}</span>
              </Link>
            ))}
          </div>
          <div className="row" style={{ marginTop: 20 }}>
            {REGIONS.map((r) => (
              <Link key={r.id} href={`/countries#${r.id}`} className="btn btn-ghost" style={{ flex: "0 0 auto" }}>
                {r.name} guides →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--surface)", borderBlock: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>From &ldquo;can I go?&rdquo; to boarding</h2>
          </div>
          <div className="grid-3">
            <div className="card"><span className="stamp" style={{ color: "var(--hibiscus)", justifySelf: "start" }}>STEP 1</span><h3>Check your route</h3><p className="muted">See the visa you need, the fee, the time it takes and the official link.</p></div>
            <div className="card"><span className="stamp" style={{ color: "var(--hibiscus)", justifySelf: "start" }}>STEP 2</span><h3>Learn from others</h3><p className="muted">Read stories from people with your passport who applied: what they sent and what happened.</p></div>
            <div className="card"><span className="stamp" style={{ color: "var(--hibiscus)", justifySelf: "start" }}>STEP 3</span><h3>Apply with confidence</h3><p className="muted">Use the checklist, ask {SITE.agentName}, or get your documents reviewed before you pay the fee.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap two-col">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">{PLANS.visaReady.name}</span>
            <h2>Don&apos;t lose your visa fee to a weak application</h2>
            <p>
              A refused Schengen visa costs €90 plus service fees, and the refusal stays on your record. Visa Ready gives you unlimited help from {SITE.agentName}, personal document checklists and a cover letter outline for {PLANS.visaReady.price}/month.
            </p>
            <div className="row" style={{ marginTop: 8 }}>
              <Link href="/pricing" className="btn btn-primary" style={{ flex: "0 0 auto" }}>See plans</Link>
              <Link href="/visa" className="btn btn-ghost" style={{ flex: "0 0 auto" }}>Explore the Visa Hub</Link>
            </div>
          </div>
          <div className="panel" style={{ background: "#14213d", color: "var(--on-dark)", borderColor: "#14213d" }}>
            <h3>Visa rule changes, in your inbox</h3>
            <p style={{ opacity: 0.8 }}>One short email when rules change for African passports, plus the best travel deals. No spam.</p>
            <Newsletter />
          </div>
        </div>
      </section>
    </>
  );
}
