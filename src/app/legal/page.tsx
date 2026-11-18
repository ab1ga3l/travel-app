import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Terms, privacy and disclosures" };

export default function Legal() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 780, display: "grid", gap: 22 }}>
        <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.4rem)" }}>Terms, privacy and disclosures</h1>
        <p className="notice">This is a starting template. Have it reviewed by a lawyer in the country where you register the business.</p>
        <div className="panel">
          <h2 style={{ fontSize: "1.2rem" }}>Not legal or immigration advice</h2>
          <p>{SITE.name} gives general travel and visa information. We are not a government agency, a law firm or a visa agent, and we don&apos;t submit applications. Visa decisions are made only by the relevant authorities. Always confirm requirements on official websites.</p>
        </div>
        <div className="panel">
          <h2 style={{ fontSize: "1.2rem" }}>AI assistant</h2>
          <p>{SITE.agentName} is an AI assistant powered by Anthropic&apos;s Claude. It can make mistakes. Don&apos;t share passport numbers, bank details or other sensitive data in the chat. Conversations are sent to our AI provider to generate answers.</p>
        </div>
        <div className="panel">
          <h2 style={{ fontSize: "1.2rem" }}>Community stories</h2>
          <p>Stories are anonymous, checked before they appear, and reflect individual experiences, not guarantees. Don&apos;t include names, passport numbers or contact details.</p>
        </div>
        <div className="panel">
          <h2 style={{ fontSize: "1.2rem" }}>Partner links</h2>
          <p>Some links are affiliate links. If you book through them we may earn a commission at no extra cost to you. Partners never pay for visa information or rankings.</p>
        </div>
        <div className="panel">
          <h2 style={{ fontSize: "1.2rem" }}>Privacy</h2>
          <p>We collect only what you choose to give us: your email for updates, anonymous visa stories and your chat questions. We don&apos;t sell personal data. Contact us to delete your data.</p>
        </div>
      </div>
    </section>
  );
}
