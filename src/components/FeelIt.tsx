"use client";
import { useEffect, useRef, useState } from "react";
import { CROWD_LABEL, type Gem, type Sound } from "@/lib/gems";
import { Soundscape } from "@/lib/soundscape";

const SKY: Record<Sound, [string, string, string]> = {
  ocean: ["#ffb36b", "#ff6b4a", "#123a6b"],
  forest: ["#3ddbb4", "#1f6b52", "#0a2a22"],
  city: ["#5b6cf0", "#2a1f63", "#0b1026"],
  market: ["#ffc24b", "#ff6b4a", "#3a1430"],
  waterfall: ["#bdf3e6", "#3ddbb4", "#0f3b4a"],
  wind: ["#ffd9a0", "#ff9a4a", "#4a1f2a"],
};

function Scene({ sound }: { sound: Sound }) {
  const [a, b, c] = SKY[sound];
  return (
    <svg className="scene" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${sound}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="0.55" stopColor={b} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill={`url(#sky-${sound})`} />
      {sound === "ocean" && (
        <g>
          <circle cx="600" cy="170" r="60" fill="#fff4d6" opacity="0.85" />
          {[0, 1, 2].map((i) => (
            <path key={i} className={`wave w${i + 1}`} d={`M-100 ${250 + i * 40} Q 50 ${230 + i * 40} 200 ${250 + i * 40} T 500 ${250 + i * 40} T 800 ${250 + i * 40} T 1100 ${250 + i * 40} V400 H-100Z`} fill={c} opacity={0.45 + i * 0.2} />
          ))}
        </g>
      )}
      {sound === "forest" && (
        <g>
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={`M${i * 62 - 20} 400 L${i * 62 + 20} ${180 + (i % 3) * 40} L${i * 62 + 60} 400Z`} fill={i % 2 ? "#0a2a22" : "#124a3a"} opacity={0.9} />
          ))}
          {Array.from({ length: 18 }, (_, i) => (
            <circle key={i} className="twinkle" style={{ animationDelay: `${(i % 6) * 0.5}s` }} cx={(i * 47) % 800} cy={120 + ((i * 53) % 200)} r="3" fill="#fff6a0" />
          ))}
        </g>
      )}
      {sound === "city" && (
        <g>
          {Array.from({ length: 12 }, (_, i) => {
            const h = 120 + ((i * 37) % 160);
            return (
              <g key={i}>
                <rect x={i * 68} y={400 - h} width="58" height={h} fill="#0b1026" opacity="0.92" />
                {Array.from({ length: 8 }, (_, j) => (
                  <rect key={j} className="blink" style={{ animationDelay: `${((i + j) % 7) * 0.7}s` }} x={i * 68 + 8 + (j % 3) * 16} y={400 - h + 14 + Math.floor(j / 3) * 26} width="9" height="12" fill="#ffc24b" opacity="0.8" />
                ))}
              </g>
            );
          })}
        </g>
      )}
      {sound === "market" && (
        <g>
          {[0, 1].map((row) => (
            <g key={row}>
              <path d={`M0 ${60 + row * 70} Q 400 ${110 + row * 70} 800 ${60 + row * 70}`} stroke="#fff" strokeOpacity="0.4" fill="none" />
              {Array.from({ length: 16 }, (_, i) => (
                <path key={i} className="sway" style={{ animationDelay: `${i * 0.15}s` }} d={`M${i * 52 + 10} ${70 + row * 70 + Math.sin(i / 2.5) * 12} l14 0 l-7 22z`} fill={["#ff6b4a", "#ffc24b", "#3ddbb4", "#b79cff"][(i + row) % 4]} />
              ))}
            </g>
          ))}
          {Array.from({ length: 7 }, (_, i) => <rect key={i} x={i * 120 + 10} y="300" width="100" height="100" rx="8" fill="#3a1430" opacity="0.8" />)}
          {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={i * 120 + 60} cy="296" r="16" fill="#ffc24b" opacity="0.5" />)}
        </g>
      )}
      {sound === "waterfall" && (
        <g>
          <path d="M0 400 L0 120 Q 200 80 330 130 L330 400Z" fill="#0f3b4a" />
          <path d="M800 400 L800 110 Q 600 90 470 140 L470 400Z" fill="#0f3b4a" />
          <rect x="330" y="120" width="140" height="280" fill="#e6fbf5" opacity="0.35" />
          {Array.from({ length: 22 }, (_, i) => (
            <line key={i} className="fall" style={{ animationDelay: `${(i % 7) * 0.2}s` }} x1={338 + i * 6} y1={130 + (i % 5) * 50} x2={338 + i * 6} y2={170 + (i % 5) * 50} stroke="#fff" strokeOpacity="0.8" strokeWidth="2" />
          ))}
          <ellipse cx="400" cy="395" rx="200" ry="30" fill="#fff" opacity="0.25" />
        </g>
      )}
      {sound === "wind" && (
        <g>
          <circle cx="220" cy="150" r="70" fill="#fff4d6" opacity="0.8" />
          <path d="M0 300 Q 200 220 400 290 T 800 270 V400 H0Z" fill="#7a2f2a" opacity="0.9" />
          <path d="M0 340 Q 250 290 500 340 T 800 330 V400 H0Z" fill="#4a1f2a" />
          {Array.from({ length: 10 }, (_, i) => (
            <path key={i} className="sand" style={{ animationDelay: `${i * 0.6}s` }} d={`M${i * 60} ${250 + (i % 4) * 25} q 40 -6 80 0`} stroke="#fff" strokeOpacity="0.5" fill="none" />
          ))}
        </g>
      )}
      <rect width="800" height="400" fill="#000" opacity="0.12" />
    </svg>
  );
}

export function FeelIt({ gem }: { gem: Gem }) {
  const [on, setOn] = useState(false);
  const [err, setErr] = useState("");
  const engine = useRef<Soundscape | null>(null);
  useEffect(() => () => engine.current?.stop(), []);

  const toggle = async () => {
    setErr("");
    if (on) { engine.current?.stop(); setOn(false); return; }
    engine.current = engine.current ?? new Soundscape();
    const ok = await engine.current.play(gem.feel.sound).catch(() => false);
    if (ok) setOn(true); else setErr("Sound isn't available in this browser.");
  };

  const q = encodeURIComponent(`${gem.name} ${gem.area}`);
  return (
    <section className="feel" aria-label={`Feel ${gem.name}`}>
      <Scene sound={gem.feel.sound} />
      <div className="feel-ui">
        <div className="between">
          <span className="glass-pill">Feel it · {CROWD_LABEL[gem.feel.crowd]}</span>
          <button type="button" className="btn btn-sun btn-sm" onClick={toggle} aria-pressed={on}>
            {on ? <><span className="eq" aria-hidden="true"><i /><i /><i /><i /></span> Pause sound</> : "🔊 Hear the vibe"}
          </button>
        </div>
        <div className="stack" style={{ gap: 14 }}>
          <div className="feel-words">{gem.feel.words.map((w) => <span key={w}>{w}.</span>)}</div>
          <div className="row">
            <a className="btn btn-soft btn-sm" href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer">🌐 Look around in 360°</a>
            <a className="btn btn-soft btn-sm" href={`https://www.youtube.com/results?search_query=${q}+walk+4K`} target="_blank" rel="noopener noreferrer">🎥 Walk-through videos</a>
            <a className="btn btn-soft btn-sm" href={`https://www.youtube.com/results?search_query=${q}+360+VR`} target="_blank" rel="noopener noreferrer">🥽 Have VR? 360° videos</a>
          </div>
          {err && <p role="alert" className="glass-pill" style={{ justifySelf: "start" }}>{err}</p>}
          <p style={{ fontSize: "0.78rem", opacity: 0.8 }}>The sound is an ambient mood we generate, not a live recording. 360° views open Google Maps and YouTube.</p>
        </div>
      </div>
    </section>
  );
}
