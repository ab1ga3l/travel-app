import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryForm } from "@/components/StoryForm";
import { getStories } from "@/lib/stories";
import { countryByCode } from "@/lib/countries";
import { APP } from "@/lib/site";
import { AS_OF, DESTINATIONS, DOCUMENT_LABELS, GROUP_RULES, GUIDE, type DocumentKey } from "@/lib/visa";
import { visaFor } from "@/lib/visaMatrix";
import { VISA_SOURCE, WORLD, flag, nameOf, visaLabel } from "@/lib/world";

export const revalidate = 3600;
export const dynamicParams = true;

const TOP_FROM = ["ng", "gh", "ke", "za", "ug", "cm", "et", "eg", "zw", "sn"];
const TOP_TO = ["fr", "de", "es", "it", "pt", "nl", "gb", "us", "ca", "ae", "tr", "th", "rw", "ke"];
export function generateStaticParams() {
  return TOP_FROM.flatMap((from) => TOP_TO.filter((to) => to !== from).map((to) => ({ from, to })));
}

const valid = (c: string) => WORLD.some((w) => w.code === c.toUpperCase());

export async function generateMetadata({ params }: { params: Promise<{ from: string; to: string }> }): Promise<Metadata> {
  const { from, to } = await params;
  if (!valid(from) || !valid(to)) return {};
  return {
    title: `${nameOf(to)} visa for ${nameOf(from)} passport holders`,
    description: `Do ${nameOf(from)} citizens need a visa for ${nameOf(to)}? Documents, bank statements, fees, how to pay, length of stay, extensions and real stories.`,
  };
}

const median = (a: (number | null)[]) => {
  const b = a.filter((x): x is number => typeof x === "number").sort((x, y) => x - y);
  return b.length ? b[Math.floor((b.length - 1) / 2)] : null;
};

const CARRY = [
  "Passport valid for at least 6 months, with blank pages",
  "Return or onward ticket",
  "Where you'll stay (hotel booking or host's address)",
  "Proof you can pay for the trip (recent bank statement or cards)",
  "Yellow fever certificate if you're coming from or through a country where it's required",
];

export default async function VisaRoute({ params }: { params: Promise<{ from: string; to: string }> }) {
  const { from, to } = await params;
  if (!valid(from) || !valid(to) || from === to) notFound();
  const P = from.toUpperCase(), D = to.toUpperCase();
  const status = visaFor(P, D);
  const v = visaLabel(status);
  const curated = DESTINATIONS.find((d) => d.code === D);
  const rule = curated ? GROUP_RULES[curated.group] : null;
  const stories = await getStories(P, D);
  const decided = stories.filter((s) => s.outcome !== "pending");
  const approved = decided.filter((s) => s.outcome === "approved");
  const docCount = new Map<string, number>();
  approved.forEach((s) => s.documents.forEach((d) => docCount.set(d, (docCount.get(d) ?? 0) + 1)));
  const topDocs = [...docCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const guide = countryByCode(D);
  const liveQ = encodeURIComponent(`Check the latest official visa rules for a ${nameOf(P)} passport holder visiting ${nameOf(D)} as a tourist: requirements, fee, how to pay, processing time and length of stay. Cite official sources.`);

  return (
    <div className="stack-lg fade-in">
      <Link href="/visa" className="muted" style={{ fontSize: "0.9rem" }}>← Visa centre</Link>
      <section className="hero">
        <div className="stack" style={{ gap: 14 }}>
          <span className="eyebrow">{flag(P)} {nameOf(P)} → {flag(D)} {nameOf(D)}</span>
          <h1 style={{ fontSize: "clamp(1.7rem,4vw,2.8rem)" }}>{nameOf(D)} visa for {nameOf(P)} passport holders</h1>
          <div className="row">
            <span className={`badge tone-${v.tone}`} style={{ fontSize: "1rem", padding: "8px 16px" }}>{v.label}</span>
            <span className="muted" style={{ fontSize: "0.85rem" }}>Entry rule from the {VISA_SOURCE.name} ({VISA_SOURCE.updated}){rule ? ` · details checked ${AS_OF}` : ""}</span>
          </div>
          <div className="row">
            <Link href={`/ask?q=${liveQ}`} className="btn btn-sun">✨ Ask {APP.assistant} to check the latest</Link>
            {guide && <Link href={`/discover/${guide.slug}`} className="btn btn-ghost">{nameOf(D)} travel guide</Link>}
          </div>
        </div>
      </section>

      <div className="split">
        <div className="stack-lg">
          {rule ? (
            <>
              <section className="card" style={{ gap: 14 }}>
                <span className="eyebrow">The visa</span>
                <h2>{rule.visaName}</h2>
                <p className="muted">{rule.appliesTo}</p>
                <div className="ledger">
                  <div className="ledger-row"><span className="muted">How long you can stay</span><span>{rule.stay}</span></div>
                  <div className="ledger-row"><span className="muted">Government fee</span><span>{rule.fee}</span></div>
                  <div className="ledger-row"><span className="muted">How to pay</span><span>{rule.payment}</span></div>
                  <div className="ledger-row"><span className="muted">Processing time</span><span>{rule.processing}</span></div>
                  <div className="ledger-row"><span className="muted">Can you extend?</span><span>{rule.extension}</span></div>
                </div>
              </section>
              <section className="card"><span className="eyebrow">Step by step</span><h2>How to apply</h2><p>{rule.howToApply}</p></section>
              <section className="card"><span className="eyebrow">Bank records & proof of funds</span><h2>Do you need bank statements?</h2><p>{rule.money}</p></section>
              <section className="card"><span className="eyebrow">Checklist</span><h2>Documents to prepare</h2><ul className="list">{rule.documents.map((d) => <li key={d}>{d}</li>)}</ul></section>
              <section className="card"><span className="eyebrow">From people who applied</span><h2>Tips</h2><ul className="list">{rule.tips.map((t) => <li key={t}>{t}</li>)}</ul></section>
            </>
          ) : (
            <section className="card" style={{ gap: 14 }}>
              <span className="eyebrow">What this means for you</span>
              {v.tone === "free" ? (
                <>
                  <h2>You can usually just go</h2>
                  <p>{typeof status === "number" ? `You can normally stay up to ${status} days without a visa.` : "You can enter without applying in advance."} Officers can still ask questions at the border, so carry:</p>
                  <ul className="list">{CARRY.map((c) => <li key={c}>{c}</li>)}</ul>
                  <p className="muted">Want to stay longer? Many countries let you extend at the local immigration office before your permitted stay ends, usually for a fee. Some charge arrival taxes or tourist levies even when no visa is needed.</p>
                </>
              ) : v.tone === "easy" ? (
                <>
                  <h2>Apply online before you fly</h2>
                  <p>You&apos;ll need an {status === "eta" ? "electronic travel authorisation" : "eVisa"}. Most take a few days; apply at least 1–2 weeks ahead.</p>
                  <ul className="list">
                    <li>Use only the official government portal. Fake sites charge extra or steal data.</li>
                    <li>Usually needed: passport scan, photo, travel dates, address where you&apos;ll stay, sometimes a return ticket and bank statement.</li>
                    <li>Fees are paid online by card. Keep the receipt and the approval email.</li>
                    <li>Print or save the approval to show at check-in and at the border.</li>
                  </ul>
                </>
              ) : v.tone === "hard" ? (
                <>
                  <h2>Get a visa before you travel</h2>
                  <p>Apply at the embassy, consulate or official visa centre. Start 6–12 weeks before your trip.</p>
                  <ul className="list">
                    <li>Bank statements for the last 3–6 months showing steady income</li>
                    <li>Employer letter with approved leave, or business registration</li>
                    <li>Flight reservation and accommodation booking (reservations, not paid tickets)</li>
                    <li>Travel insurance, cover letter and invitation letter if visiting someone</li>
                  </ul>
                </>
              ) : (
                <><h2>Check the official rules</h2><p>We don&apos;t have reliable data for this route. Ask {APP.assistant} to check official sources, or contact the embassy.</p></>
              )}
              <p className="note">Rules change often. Confirm on the official government website before booking, and never pay a &ldquo;visa agent&rdquo; who promises guaranteed approval.</p>
            </section>
          )}

          <section className="card" style={{ gap: 14 }}>
            <span className="eyebrow" style={{ color: "var(--lilac)" }}>Community</span>
            <h2>What {nameOf(P)} travellers experienced</h2>
            {stories.length ? (
              <>
                <div className="grid-3">
                  <div className="kpi"><strong style={{ color: "var(--mint)" }}>{decided.length ? `${Math.round((approved.length / decided.length) * 100)}%` : "–"}</strong><span>approved ({approved.length}/{decided.length})</span></div>
                  <div className="kpi"><strong>{median(stories.map((s) => s.days_waited)) ?? "–"}{median(stories.map((s) => s.days_waited)) != null ? " days" : ""}</strong><span>typical wait</span></div>
                  <div className="kpi"><strong>{median(stories.map((s) => s.total_cost_usd)) != null ? `$${median(stories.map((s) => s.total_cost_usd))}` : "–"}</strong><span>typical total cost</span></div>
                </div>
                {topDocs.length > 0 && <p><strong>Approved applicants most often sent:</strong> {topDocs.map(([d, n]) => `${DOCUMENT_LABELS[d as DocumentKey] ?? d} (${n})`).join(", ")}</p>}
                {stories.slice(0, 12).map((s) => (
                  <div key={s.id} className="card card-soft" style={{ padding: 14, gap: 6 }}>
                    <div className="row"><span className={`badge ${s.outcome === "approved" ? "tone-free" : s.outcome === "refused" ? "tone-hard" : "tone-easy"}`}>{s.outcome}</span><span className="muted" style={{ fontSize: "0.82rem" }}>{s.visa_type} · {s.applied_at || "location not given"} · {s.created_at.slice(0, 10)}</span></div>
                    {s.refusal_reason && <p><strong>Refusal reason:</strong> {s.refusal_reason}</p>}
                    {s.advice && <p>{s.advice}</p>}
                  </div>
                ))}
              </>
            ) : (
              <p className="muted">No stories for this route yet. Applied before? Share what happened and help the next {nameOf(P)} traveller.</p>
            )}
          </section>
          <StoryForm passport={P} destination={D} />
        </div>

        <aside className="stack">
          {rule && (
            <div className="card">
              <span className="eyebrow">Official sources</span>
              {rule.official.map((o) => <a key={o.url} href={o.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--mint)", fontWeight: 600 }}>{o.label} ↗</a>)}
            </div>
          )}
          {APP.reviewUrl && (
            <div className="card" style={{ borderColor: "var(--gold)" }}>
              <span className="eyebrow">Optional · money back if it doesn&apos;t help</span>
              <h3>Get your application checked</h3>
              <p className="muted" style={{ fontSize: "0.9rem" }}>Before you pay the visa fee, a reviewer checks your documents list, bank statement summary and cover letter.</p>
              <a href={APP.reviewUrl} className="btn btn-sun" style={{ justifySelf: "start" }}>Book a review</a>
            </div>
          )}
          <div className="card"><h3>🚫 Avoid scams</h3><ul className="list">{GUIDE.scams.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <Link href={`/community?country=${D}&topic=visa`} className="btn btn-ghost">💬 Ask the community about {nameOf(D)}</Link>
        </aside>
      </div>
    </div>
  );
}
