import type { Metadata } from "next";
import { APP } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <div className="stack-lg fade-in" style={{ maxWidth: 760 }}>
      <span className="eyebrow">About {APP.name} · {APP.meaning}</span>
      <h1>Built for passports that <span className="gradient-text">have to try harder.</span></h1>
      <div className="stack" style={{ fontSize: "1.05rem" }}>
        <p>Most travel apps assume you can book a flight and go. If you hold an African passport, the trip starts months earlier: appointments, bank statements, cover letters, and the fear of losing your fee to a refusal.</p>
        <p>{APP.name} puts that first. Every country shows what your passport needs, what to prepare and what other travellers experienced. Then comes the fun part: places that match your vibe, hidden gems you can feel before you go, and a map of everywhere you&apos;ve been.</p>
        <p>We start with Africa, then Asia and Europe. Facts carry a date and an official source, and {APP.assistant}, our assistant ({APP.assistantMeaning}), checks official sites instead of guessing.</p>
      </div>
      <div className="card">
        <h3>Where our data comes from</h3>
        <ul className="list">
          <li>Entry rules for every passport: the open Passport Index dataset (MIT licence, updated February 2026).</li>
          <li>Visa checklists, fees and processes: official government and embassy pages, checked November 2026.</li>
          <li>Ratings, stories and tips: travellers in our community.</li>
        </ul>
      </div>
    </div>
  );
}
