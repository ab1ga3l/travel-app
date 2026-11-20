// Generated country "poster": a night card with a soft glow, thin contour rings
// (like a map, or the circles of adire cloth) and a lime dashed route: "you can go".
// Calm on purpose: one quiet tint per region, the lime route is the only bright thing.
import { flag } from "@/lib/world";

const TINT: Record<string, string> = { africa: "#b02a52", asia: "#8b1e3f", europe: "#6e1a35" };

function seed(s: string) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507)), ((h >>> 0) % 1000) / 1000);
}

export function PosterArt({ code, region, id }: { code: string; region: string; id?: string }) {
  const tint = TINT[region] ?? TINT.africa;
  const r = seed(code);
  // Keep the art in the upper middle so the flag, the pill and the title stay clear.
  const cx = 120 + r() * 45;
  const cy = 70 + r() * 25;
  const rings = 6;
  const uid = (id ?? code).replace(/[^a-zA-Z0-9-]/g, "");
  const y1 = 30 + r() * 30, y2 = 75 + r() * 25, y3 = 50 + r() * 30;
  return (
    <svg className="p-art" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141416" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <radialGradient id={`gl-${uid}`} cx={cx / 200} cy={cy / 200} r="0.75">
          <stop offset="0" stopColor={tint} stopOpacity="0.3" />
          <stop offset="0.6" stopColor={tint} stopOpacity="0.06" />
          <stop offset="1" stopColor={tint} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`fd-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#bg-${uid})`} />
      <rect width="200" height="200" fill={`url(#gl-${uid})`} />
      {Array.from({ length: rings }, (_, i) => (
        <circle key={i} cx={cx} cy={cy} r={12 + i * 16} fill="none" stroke="#f4f1ea" strokeOpacity={0.14 - i * 0.018} strokeWidth="0.8" />
      ))}
      <path d={`M-5 ${y1} C 40 ${y1 + 10}, 55 ${y2}, 90 ${y2} S 110 ${y3}, ${cx} ${cy}`} fill="none" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1.4" strokeDasharray="4 4" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="3.2" fill="#ffffff" />
      <circle cx={cx} cy={cy} r="7" fill="none" stroke="#ffffff" strokeOpacity="0.35" />
      <rect y="110" width="200" height="90" fill={`url(#fd-${uid})`} />
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
