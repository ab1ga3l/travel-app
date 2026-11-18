import type { Metadata } from "next";
import { AgentChat } from "@/components/AgentChat";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Ask ${SITE.agentName}: AI travel and visa assistant`,
  description: "Ask about visas, documents, the best time to travel, budgets and itineraries. Built for African passports.",
};

export default function AgentPage() {
  return (
    <section className="section">
      <div className="wrap two-col">
        <div className="panel" style={{ gap: 16 }}>
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">AI travel assistant</span>
            <h1 style={{ fontSize: "clamp(1.9rem,4vw,2.6rem)" }}>Ask {SITE.agentName}</h1>
            <p>{SITE.agentName} reads our country guides and visa checklists to answer you, and tells you when to double-check on an official site.</p>
          </div>
          <AgentChat agentName={SITE.agentName} />
        </div>
        <aside style={{ display: "grid", gap: 16 }}>
          <div className="panel">
            <h3>What {SITE.agentName} can help with</h3>
            <ul className="clean">
              <li>Which visa you need and how to apply</li>
              <li>Documents to prepare and how to make your application stronger</li>
              <li>Where to go in a given month and budget</li>
              <li>Day-by-day itineraries</li>
              <li>Money, plugs, safety and scams to avoid</li>
            </ul>
          </div>
          <div className="panel">
            <h3>What {SITE.agentName} won&apos;t do</h3>
            <ul className="clean">
              <li>Promise a visa approval. Nobody honest can.</li>
              <li>Help with fake documents or misleading applications.</li>
              <li>Replace the official embassy website.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
