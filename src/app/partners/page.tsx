import type { Metadata } from "next";
import { APP } from "@/lib/site";

export const metadata: Metadata = { title: "Partner with us", description: `Reach travellers who are ready to go with ${APP.name}.` };

const OFFERS = [
  ["🏦", "Banks & fintechs", "“Money abroad, powered by you” on every country guide: cards that work abroad, FX tips and travel accounts."],
  ["🗺️", "Tourism boards", "Featured placement for travellers whose passport gets in easily, and whose vibe matches your country."],
  ["🛟", "Insurers", "Visa-compliant cover shown right where people need it: on the visa checklist."],
  ["🏨", "Hotels, airlines & tours", "Exclusive deals for the community, with clear tracking."],
  ["🎓", "Agencies & consultants", "Licensed, vetted visa consultants and student-recruitment agencies, with referrals from people who just checked their route."],
];

export default function Partners() {
  return (
    <div className="stack-lg fade-in" style={{ maxWidth: 900 }}>
      <div className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">Partner with {APP.name}</span>
        <h1>Meet travellers <span className="gradient-text">who are ready to go.</span></h1>
        <p className="muted" style={{ fontSize: "1.05rem" }}>People use {APP.name} right before they book: when they&apos;ve picked a place, checked the visa and need the rest. We keep the app free for travellers, and partners make that possible.</p>
      </div>
      <div className="grid-2">
        {OFFERS.map(([e, t, d]) => (
          <div key={t} className="card"><span style={{ fontSize: "1.8rem" }} aria-hidden="true">{e}</span><h3>{t}</h3><p className="muted">{d}</p></div>
        ))}
      </div>
      <div className="card" style={{ borderColor: "var(--mint)" }}>
        <h2>Our one rule</h2>
        <p>Partners never change visa information, verdicts or rankings. Sponsored content is always labeled. Travellers&apos; trust is the reason this audience is worth reaching.</p>
      </div>
      <div className="card">
        <h2>Get in touch</h2>
        {APP.contactEmail ? <p>Email <strong style={{ userSelect: "all" }}>{APP.contactEmail}</strong> with your company and what you&apos;d like to offer.</p> : <p className="muted">Partnership contact coming soon.</p>}
      </div>
    </div>
  );
}
