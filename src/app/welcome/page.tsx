"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { APP } from "@/lib/site";
import { useApp } from "@/lib/store";

function Motif() {
  return (
    <svg className="motif" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => <circle key={i} cx="320" cy="60" r={30 + i * 26} fill="none" stroke="var(--indigo)" strokeOpacity={0.5 - i * 0.1} strokeWidth="2" />)}
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i % 10) * 20 + 10} cy={250 + Math.floor(i / 10) * 14} r="2" fill="var(--gold)" fillOpacity="0.5" />)}
      <path d="M0 210 Q 100 180 200 205 T 400 195" stroke="var(--sunrise)" strokeOpacity="0.5" strokeDasharray="6 6" fill="none" strokeWidth="2" />
    </svg>
  );
}

const Row = ({ l, r, tone }: { l: string; r: string; tone: string }) => (
  <div className="between" style={{ fontSize: "0.9rem" }}><span>{l}</span><span className={`badge tone-${tone}`}>{r}</span></div>
);

const SLIDES = [
  {
    title: "Your passport, decoded.",
    sub: "See where you can go visa-free, with an eVisa, or with a visa, based on your own passport.",
    art: (
      <div className="mock">
        <span className="eyebrow">🇰🇪 Kenya passport</span>
        <Row l="🇷🇼 Rwanda" r="Visa-free" tone="free" />
        <Row l="🇿🇦 South Africa" r="Visa-free · 90 days" tone="free" />
        <Row l="🇹🇭 Thailand" r="eVisa online" tone="easy" />
        <Row l="🇫🇷 France" r="Visa required" tone="hard" />
      </div>
    ),
  },
  {
    title: "Plan it with your people.",
    sub: "One 6-letter code gets the whole crew in. Plans, votes and money in one place, not lost in the group chat.",
    art: (
      <div className="mock">
        <span className="eyebrow">Zanzibar girls' trip 🌴</span>
        <div className="avatars">{["AM", "WN", "SK", "JO", "LF"].map((x) => <span key={x} className="avatar">{x}</span>)}</div>
        <div className="note" style={{ textAlign: "center", fontFamily: "var(--mono)", fontSize: "1.3rem", letterSpacing: "0.3em" }}>KJMWTA</div>
        <span className="muted" style={{ fontSize: "0.8rem", textAlign: "center" }}>Share the code. Friends join in seconds.</span>
      </div>
    ),
  },
  {
    title: "One pot. Zero chasing.",
    sub: "Everyone pays in with M-Pesa or bank. See who's paid, what's left and how every shilling is spent.",
    art: (
      <div className="mock">
        <div className="between"><strong>KES 180,000 pot</strong><span className="badge tone-free">72% in</span></div>
        <div className="progress"><i style={{ width: "72%" }} /></div>
        <Row l="Amina" r="Paid ✓" tone="free" />
        <Row l="Wanjiru" r="Paid ✓" tone="free" />
        <Row l="Sharon" r="Pending" tone="easy" />
        <Row l="Joy" r="Not yet" tone="hard" />
      </div>
    ),
  },
  {
    title: "Vote. Decide. Go.",
    sub: "Propose a place or activity, everyone votes, results stay sealed until the deadline. The group chat never decides; this does.",
    art: (
      <div className="mock">
        <span className="eyebrow">Sunset dhow cruise?</span>
        <div className="row"><span className="chip" aria-pressed="true">👍 Yes</span><span className="chip">👎 No</span><span className="chip">🤷🏾 Abstain</span></div>
        <div className="note">🔒 Votes sealed until Friday 8pm</div>
      </div>
    ),
  },
  {
    title: "Feel it first. Travel safe. Collect the world.",
    sub: "Hear and see hidden gems before you go, check in safely, use it offline, and colour in your world map.",
    art: (
      <div className="mock">
        <div className="between"><span className="eyebrow">💎 Watamu, Kenya</span><span className="eq" style={{ color: "var(--gold)" }}><i /><i /><i /><i /></span></div>
        <strong style={{ fontFamily: "var(--display)", fontSize: "1.2rem" }}>turquoise. slow. salty.</strong>
        <Row l="🛟 Safety check-in" r="Arrived ✓" tone="free" />
        <Row l="🗺️ Countries visited" r="7 · 4% of world" tone="lilac" />
      </div>
    ),
  },
];

function Welcome() {
  const [i, setI] = useState(0);
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next");
  const from = sp.get("from");
  const { markIntroSeen } = useApp();
  const finish = () => { markIntroSeen(); router.push(`/setup?${new URLSearchParams({ ...(from ? { from } : {}), ...(next ? { next } : {}) }).toString()}`); };
  const s = SLIDES[i];
  return (
    <div className="onb fade-in" key={i}>
      <div className="between">
        <span className="logo" style={{ padding: 0 }}><span className="logo-mark">TK</span>{APP.name}</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={finish}>Skip</button>
      </div>
      <div className="slide-art"><Motif />{s.art}</div>
      <div className="stack" style={{ gap: 10, textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(1.8rem,7vw,2.6rem)" }}>{s.title}</h1>
        <p className="muted" style={{ fontSize: "1.02rem" }}>{s.sub}</p>
      </div>
      <div className="dots" aria-label={`Slide ${i + 1} of ${SLIDES.length}`}>{SLIDES.map((_, k) => <i key={k} data-on={k === i} />)}</div>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <button type="button" className="btn btn-ghost" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>Back</button>
        {i < SLIDES.length - 1
          ? <button type="button" className="btn btn-sun" onClick={() => setI(i + 1)}>Next</button>
          : <button type="button" className="btn btn-sun" onClick={finish}>Let&apos;s go →</button>}
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={null}><Welcome /></Suspense>;
}
