// Generated country "poster": a gradient sky plus an adire-inspired motif (concentric circles,
// dots and lines, like resist-dyed cloth). Every country gets its own variation; no photos needed.
import { flag } from "@/lib/world";

const PALETTES: Record<string, [string, string, string]> = {
  africa: ["#ff8a3d", "#ffb23e", "#2a1530"],
  asia: ["#5ad1c9", "#9d8cff", "#101828"],
  europe: ["#9d8cff", "#ff5a5f", "#16121f"],
};

function seed(s: string) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507)), ((h >>> 0) % 1000) / 1000);
}

export function PosterArt({ code, region, id }: { code: string; region: string; id?: string }) {
  const [a, b, night] = PALETTES[region] ?? PALETTES.africa;
  const r = seed(code);
  const cx = 60 + r() * 80;
  const cy = 30 + r() * 50;
  const rings = 3 + Math.floor(r() * 3);
  const gid = `g-${id ?? code}`;
  const dots = Array.from({ length: 26 }, (_, i) => ({ x: (i % 13) * 16 + 4, y: 150 + Math.floor(i / 13) * 14 + (i % 2) * 4 }));
  return (
    <svg className="p-art" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={b} />
          <stop offset="0.55" stopColor={a} />
          <stop offset="1" stopColor={night} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${gid})`} />
      {Array.from({ length: rings }, (_, i) => (
        <circle key={i} cx={cx} cy={cy} r={14 + i * 13} fill="none" stroke="#fff" strokeOpacity={0.22 - i * 0.03} strokeWidth={i === 0 ? 10 : 2} />
      ))}
      <path d={`M0 ${120 + r() * 20} Q 60 ${100 + r() * 20} 100 ${125 + r() * 10} T 200 ${115 + r() * 20} V200 H0Z`} fill={night} fillOpacity="0.55" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={1.6} fill="#fff" fillOpacity="0.35" />
      ))}
      <path d="M0 186 H200" stroke="#fff" strokeOpacity="0.2" strokeDasharray="6 5" />
    </svg>
  );
}

export function Poster({
  code, name, region, topRight, bottom, height = 190,
}: { code: string; name: string; region: string; topRight?: React.ReactNode; bottom?: React.ReactNode; height?: number }) {
  return (
    <div className="poster" style={{ minHeight: height }}>
      <PosterArt code={code} region={region} />
      <div className="p-top">
        <span className="p-flag" aria-hidden="true">{flag(code)}</span>
        {topRight}
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <span className="p-name">{name}</span>
        {bottom}
      </div>
    </div>
  );
}
