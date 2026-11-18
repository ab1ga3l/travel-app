import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GemCard } from "@/components/Cards";
import { TripButtons } from "@/components/CountryClient";
import { FeelIt } from "@/components/FeelIt";
import { Verdict } from "@/components/Verdict";
import { countryByCode } from "@/lib/countries";
import { COST_LABEL, CROWD_LABEL, GEMS, gemById } from "@/lib/gems";
import { APP, vibeInfo } from "@/lib/site";
import { flag, nameOf } from "@/lib/world";

export function generateStaticParams() {
  return GEMS.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const g = gemById((await params).id);
  return g ? { title: `${g.name}, ${nameOf(g.c)}: is it worth it?`, description: g.desc } : {};
}

export default async function GemPage({ params }: { params: Promise<{ id: string }> }) {
  const g = gemById((await params).id);
  if (!g) notFound();
  const c = countryByCode(g.c);
  const more = GEMS.filter((x) => x.c === g.c && x.id !== g.id).slice(0, 3);
  return (
    <div className="stack-lg fade-in">
      <Link href={c ? `/discover/${c.slug}` : "/discover"} className="muted" style={{ fontSize: "0.9rem" }}>← {flag(g.c)} {nameOf(g.c)}</Link>
      <div className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">{g.kind === "hidden" ? "💎 Hidden gem" : "⭐ Famous spot"} · {g.area}</span>
        <h1>{g.name}</h1>
        {g.alt && <span className="badge tone-free" style={{ justifySelf: "start" }}>A quieter alternative to {g.alt}</span>}
      </div>
      <FeelIt gem={g} />
      <div className="split">
        <div className="stack-lg">
          <section className="card">
            <p style={{ fontSize: "1.08rem" }}>{g.desc}</p>
            <div className="row">
              {g.vibes.map((v) => <span key={v} className="badge tone-lilac">{vibeInfo(v).emoji} {vibeInfo(v).label}</span>)}
            </div>
          </section>
          <Verdict gemId={g.id} />
        </div>
        <aside className="stack">
          <div className="card">
            <div className="ledger">
              <div className="ledger-row"><span className="muted">Cost</span><span>{COST_LABEL[g.cost]}</span></div>
              <div className="ledger-row"><span className="muted">Crowds</span><span>{CROWD_LABEL[g.feel.crowd]}</span></div>
              <div className="ledger-row"><span className="muted">Country</span><span>{flag(g.c)} {nameOf(g.c)}</span></div>
            </div>
          </div>
          <div className="card"><span className="eyebrow">Add {nameOf(g.c)} to your trips</span><TripButtons code={g.c} /></div>
          <Link href={`/wazi?q=${encodeURIComponent(`How do I get to ${g.name} in ${g.area}, ${nameOf(g.c)}, and is it worth it for my vibe?`)}`} className="btn btn-ghost">✨ Ask {APP.assistant} how to get there</Link>
        </aside>
      </div>
      {more.length > 0 && (
        <section className="section">
          <h2>More in {nameOf(g.c)}</h2>
          <div className="grid">{more.map((x) => <GemCard key={x.id} gem={x} />)}</div>
        </section>
      )}
    </div>
  );
}
