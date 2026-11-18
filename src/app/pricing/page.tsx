import type { Metadata } from "next";
import Link from "next/link";
import { PLANS, SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Pricing", description: "Free travel and visa guides, plus Visa Ready membership and application reviews." };

function Buy({ url, label }: { url: string; label: string }) {
  if (!url) return <span className="btn btn-ghost" aria-disabled="true">Coming soon</span>;
  return <a className="btn btn-primary" href={url}>{label}</a>;
}

export default function Pricing() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Pricing</span>
          <h1>Fair prices for a fairer journey</h1>
          <p>The guides and community stories are free forever. Pay only when you want more help with an application.</p>
        </div>
        <div className="grid-3">
          <div className="card plan">
            <h3>{PLANS.free.name}</h3>
            <div className="price">{PLANS.free.price}</div>
            <ul className="clean">
              <li>All country guides and visa route pages</li>
              <li>Community visa stories</li>
              <li>{PLANS.free.agentDailyLimit} questions a day to {SITE.agentName}</li>
            </ul>
            <Link className="btn btn-ghost" href="/agent">Start free</Link>
          </div>
          <div className="card plan featured">
            <span className="pill pill-sun" style={{ justifySelf: "start" }}>Most popular</span>
            <h3>{PLANS.visaReady.name}</h3>
            <div className="price">{PLANS.visaReady.price}<span className="muted" style={{ fontSize: "1rem", fontWeight: 500 }}> {PLANS.visaReady.period}</span></div>
            <p className="muted" style={{ fontSize: "0.9rem" }}>or {PLANS.visaReady.yearly}</p>
            <ul className="clean">
              <li>Unlimited questions to {SITE.agentName}</li>
              <li>A personal document checklist for your route</li>
              <li>Cover letter outline you fill in with your own facts</li>
              <li>Travel-history plan: easier countries to visit first</li>
              <li>Alerts when rules change for your passport</li>
            </ul>
            <Buy url={PLANS.visaReady.checkoutUrl} label="Join Visa Ready" />
          </div>
          <div className="card plan">
            <h3>{PLANS.review.name}</h3>
            <div className="price">{PLANS.review.price}<span className="muted" style={{ fontSize: "1rem", fontWeight: 500 }}> {PLANS.review.period}</span></div>
            <ul className="clean">
              <li>We review your document list, bank statement summary and cover letter</li>
              <li>Written feedback within 72 hours</li>
              <li>What's missing and what to explain better</li>
            </ul>
            <Buy url={PLANS.review.checkoutUrl} label="Book a review" />
          </div>
        </div>
        <p className="muted" style={{ marginTop: 20, fontSize: "0.85rem", maxWidth: "70ch" }}>
          {SITE.name} is not a law firm, a government agency or a visa agent, and we can&apos;t guarantee any visa decision. Reviews are honest feedback on completeness and clarity. See <Link href="/legal">terms</Link>.
        </p>
      </div>
    </section>
  );
}
