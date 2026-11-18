import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "About us" };

export default function About() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <span className="eyebrow">About {SITE.name}</span>
        <h1 style={{ marginTop: 10 }}>Built by travelers who know the visa queue</h1>
        <div style={{ display: "grid", gap: 16, marginTop: 20, fontSize: "1.05rem" }}>
          <p>
            Most travel websites assume you can just book a flight and go. If you hold an African passport, the trip starts months earlier: appointments, bank statements, cover letters and the fear of losing your fee to a refusal.
          </p>
          <p>
            {SITE.name} puts that part first. We explain visa requirements in plain language, collect real stories from people with your passport, and pair them with country guides that tell you the best months to go and what a day really costs.
          </p>
          <p>
            We start with Africa, then Asia and Europe. Our facts carry a date and a link to the official source, and our AI assistant, {SITE.agentName}, is built to say &ldquo;check the embassy&rdquo; rather than guess.
          </p>
          {SITE.contactEmail && <p>Say hello: {SITE.contactEmail}</p>}
        </div>
      </div>
    </section>
  );
}
