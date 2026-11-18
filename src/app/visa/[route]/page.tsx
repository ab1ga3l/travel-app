import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Affiliate } from "@/components/Affiliate";
import { StoryForm } from "@/components/StoryForm";
import { getStories } from "@/lib/supabase";
import { PLANS, SITE } from "@/lib/site";
import { AS_OF, DOCUMENT_LABELS, GUIDE, TOP_ROUTES, parseRoute, type DocumentKey } from "@/lib/visa";

export const revalidate = 3600; // refresh community stats hourly

export function generateStaticParams() {
  return TOP_ROUTES.map((route) => ({ route }));
}

export async function generateMetadata({ params }: { params: Promise<{ route: string }> }): Promise<Metadata> {
  const r = parseRoute((await params).route);
  if (!r) return {};
  return {
    title: `${r.destination.name} visa for ${r.passport.name} passport holders (${AS_OF})`,
    description: `Do ${r.passport.name} citizens need a visa for ${r.destination.name}? Requirements, fee, processing time, documents and real stories from applicants.`,
  };
}

const median = (a: (number | null)[]) => {
  const b = a.filter((x): x is number => typeof x === "number").sort((x, y) => x - y);
  return b.length ? b[Math.floor((b.length - 1) / 2)] : null;
};

export default async function RoutePage({ params }: { params: Promise<{ route: string }> }) {
  const r = parseRoute((await params).route);
  if (!r) notFound();
  const { passport, destination, rule } = r;
  const stories = await getStories(passport.code, destination.code);
  const decided = stories.filter((s) => s.outcome !== "pending");
  const approved = decided.filter((s) => s.outcome === "approved");
  const docCount = new Map<string, number>();
  approved.forEach((s) => s.documents.forEach((d) => docCount.set(d, (docCount.get(d) ?? 0) + 1)));
  const topDocs = [...docCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const wait = median(stories.map((s) => s.days_waited));
  const cost = median(stories.map((s) => s.total_cost_usd));

  return (
    <section className="section">
      <div className="wrap">
        <Link href="/visa" className="muted" style={{ fontSize: "0.9rem" }}>← Visa Hub</Link>
        <div className="section-head" style={{ marginTop: 12 }}>
          <span className="eyebrow">{passport.name} → {destination.name}</span>
          <h1 style={{ fontSize: "clamp(1.9rem,4vw,2.8rem)" }}>{destination.name} visa for {passport.name} passport holders</h1>
          <p>{rule.appliesTo}</p>
        </div>
        <div className="two-col">
          <div style={{ display: "grid", gap: 20 }}>
            <div className="panel">
              <h2 style={{ fontSize: "1.3rem" }}>{rule.visaName}</h2>
              <div>
                <div className="ledger-row"><span>How long you can stay</span><strong>{rule.stay}</strong></div>
                <div className="ledger-row"><span>Fee</span><strong>{rule.fee}</strong></div>
                <div className="ledger-row"><span>Processing time</span><strong>{rule.processing}</strong></div>
              </div>
              <p><strong>How to apply:</strong> {rule.howToApply}</p>
              <p className="notice">Checked {AS_OF}. Rules and fees change, so confirm on the official site before you pay anything.</p>
            </div>

            <div className="panel">
              <h2 style={{ fontSize: "1.3rem" }}>Documents checklist</h2>
              <ul className="clean">{rule.documents.map((d) => <li key={d}>{d}</li>)}</ul>
            </div>

            <div className="panel">
              <h2 style={{ fontSize: "1.3rem" }}>What {passport.name} applicants say</h2>
              {stories.length ? (
                <>
                  <div className="grid-3">
                    <div className="card"><strong style={{ fontFamily: "var(--display)", fontSize: "1.8rem" }}>{decided.length ? `${Math.round((approved.length / decided.length) * 100)}%` : "–"}</strong><span className="muted">approved ({approved.length} of {decided.length})</span></div>
                    <div className="card"><strong style={{ fontFamily: "var(--display)", fontSize: "1.8rem" }}>{wait != null ? `${wait} days` : "–"}</strong><span className="muted">typical wait</span></div>
                    <div className="card"><strong style={{ fontFamily: "var(--display)", fontSize: "1.8rem" }}>{cost != null ? `$${cost}` : "–"}</strong><span className="muted">typical total cost</span></div>
                  </div>
                  {topDocs.length > 0 && (
                    <p><strong>Approved applicants most often sent:</strong> {topDocs.map(([d, n]) => `${DOCUMENT_LABELS[d as DocumentKey] ?? d} (${n})`).join(", ")}</p>
                  )}
                  {stories.slice(0, 10).map((s) => (
                    <div key={s.id} className="card" style={{ gap: 6 }}>
                      <div className="row" style={{ alignItems: "center", gap: 8 }}>
                        <span className={`pill ${s.outcome === "approved" ? "pill-good" : s.outcome === "refused" ? "pill-bad" : "pill-sun"}`} style={{ flex: "0 0 auto" }}>{s.outcome}</span>
                        <span className="muted" style={{ fontSize: "0.85rem" }}>{s.visa_type} · {s.applied_at || "location not given"} · {s.created_at.slice(0, 10)}</span>
                      </div>
                      {s.refusal_reason && <p><strong>Refusal reason:</strong> {s.refusal_reason}</p>}
                      {s.advice && <p>{s.advice}</p>}
                    </div>
                  ))}
                </>
              ) : (
                <p className="muted">No stories for this route yet. Applied before? Share what happened below and help the next {passport.name} traveler.</p>
              )}
            </div>
            <StoryForm passport={passport.code} destination={destination.code} />
          </div>

          <aside style={{ display: "grid", gap: 16 }}>
            <div className="panel">
              <h3>Official sources</h3>
              {rule.official.map((o) => (
                <a key={o.url} href={o.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--forest)", fontWeight: 600 }}>{o.label} ↗</a>
              ))}
            </div>
            <div className="panel">
              <h3>Tips</h3>
              <ul className="clean">{rule.tips.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            <div className="panel" style={{ background: "var(--hibiscus-soft)", borderColor: "transparent" }}>
              <h3>Get your documents checked</h3>
              <p style={{ fontSize: "0.92rem" }}>Before you pay the visa fee, we review your checklist, bank statement summary and cover letter, and tell you what's missing.</p>
              <Link href="/pricing" className="btn btn-primary" style={{ justifySelf: "start" }}>{PLANS.review.name} · {PLANS.review.price}</Link>
            </div>
            {destination.group === "schengen" && <Affiliate kind="insurance" />}
            <Affiliate kind="hotels" />
            <div className="panel"><h3>🚫 Avoid scams</h3><ul className="clean">{GUIDE.scams.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <Link href="/agent" className="btn btn-ghost">Ask {SITE.agentName} about this route →</Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
