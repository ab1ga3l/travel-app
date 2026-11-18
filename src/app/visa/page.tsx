import type { Metadata } from "next";
import Link from "next/link";
import { VisaPicker } from "@/components/VisaPicker";
import { DESTINATIONS, GROUP_RULES, GUIDE, PASSPORTS, routeSlug } from "@/lib/visa";

export const metadata: Metadata = {
  title: "Visa Hub: requirements and real stories for African passports",
  description: "Schengen, UK, US, Canada and UAE visa requirements for African passports, with documents, fees, processing times and community stories.",
};

export default function VisaHub() {
  const featured = PASSPORTS.slice(0, 6);
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Visa Hub</span>
          <h1>Get the visa. Skip the guesswork.</h1>
          <p>Choose your passport and destination to see what you need, what it costs and what helped other travelers get approved.</p>
        </div>
        <div className="panel" style={{ marginBottom: 32 }}>
          <VisaPicker passports={PASSPORTS} destinations={DESTINATIONS} />
        </div>
        <div className="two-col">
          <div style={{ display: "grid", gap: 24 }}>
            {featured.map((p) => (
              <div key={p.code} className="panel">
                <h2 style={{ fontSize: "1.3rem" }}>{p.name} passport</h2>
                <div className="chips">
                  {DESTINATIONS.map((d) => (
                    <Link key={d.code} className="chip" href={`/visa/${routeSlug(p.slug, d.slug)}`}>
                      {d.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="panel">
              <h2 style={{ fontSize: "1.3rem" }}>Visa types we cover</h2>
              {Object.values(GROUP_RULES).map((g) => (
                <div key={g.visaName} className="ledger-row"><span>{g.visaName}</span><strong className="muted" style={{ fontWeight: 500 }}>{g.stay}</strong></div>
              ))}
            </div>
          </div>
          <aside style={{ display: "grid", gap: 16 }}>
            <div className="panel"><h3>✅ Give your application the best chance</h3><ul className="clean">{GUIDE.bestChance.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div className="panel"><h3>🚫 Avoid visa scams</h3><ul className="clean">{GUIDE.scams.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div className="panel"><h3>🌍 Easier trips for African passports</h3><ul className="clean">{GUIDE.easier.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </aside>
        </div>
      </div>
    </section>
  );
}
