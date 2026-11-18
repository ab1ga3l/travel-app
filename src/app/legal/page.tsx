import type { Metadata } from "next";
import { APP } from "@/lib/site";

export const metadata: Metadata = { title: "Terms, privacy and disclosures" };

const SECTIONS: [string, string][] = [
  ["Not legal or immigration advice", `${APP.name} gives general travel and visa information. We are not a government agency, law firm or visa agent, and we don't submit applications. Only the relevant authorities decide on visas. Always confirm requirements on official websites.`],
  ["AI assistant", `${APP.assistant} is an AI assistant powered by Anthropic's Claude. It can make mistakes. Don't share passport numbers, bank details or other sensitive data in the chat. Your questions are sent to our AI provider to generate answers.`],
  ["Feel it", "Soundscapes are generated ambient moods, not live recordings. 360° and video links open Google Maps and YouTube, which have their own terms."],
  ["Community", "Posts, verdicts and visa stories reflect personal experiences, not guarantees. Don't post personal details. We remove spam, scams and abuse, and visa stories are checked before they appear."],
  ["Partner links", "Some links are affiliate or sponsored links. If you book through them we may earn a commission at no extra cost to you. Partners never pay for visa information, verdicts or rankings, and sponsored content is labeled."],
  ["Privacy", "Without an account, your profile and trips are saved only on your device. With an account, they're stored securely so they sync across devices. We don't sell personal data. Contact us to delete your account and data."],
];

export default function Legal() {
  return (
    <div className="stack-lg fade-in" style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)" }}>Terms, privacy & disclosures</h1>
      <p className="note">Starting template. Have it reviewed by a lawyer in the country where you register the business.</p>
      {SECTIONS.map(([t, d]) => (
        <section key={t} className="card"><h3>{t}</h3><p className="muted">{d}</p></section>
      ))}
    </div>
  );
}
