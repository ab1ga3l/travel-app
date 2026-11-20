// Generated country "poster": a night card with a soft glow, thin contour rings
// (like a map, or the circles of adire cloth) and a lime dashed route: "you can go".
// Calm on purpose: one quiet tint per region, the lime route is the only bright thing.
import { flag } from "@/lib/world";

const TINT: Record<string, string> = { africa: "#ff8a3d", asia: "#5ad1c9", europe: "#9d8cff" };

function seed(s: string) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507)), ((h >>> 0) % 1000) / 1000);
}

export function PosterArt({ code, region, id }: { code: string; region: string; id?: string }) {
  const tint = TINT[region] ?? TINT.africa;
  const r = seed(code);
  const cx = 110 + r() * 70;
  const cy = 20 + r() * 60;
  const rings = 6;
  const uid = (id ?? code).replace(/[^a-zA-Z0-9-]/g, "");
  const y1 = 150 + r() * 25, y2 = 95 + r() * 30, y3 = 60 + r() * 30;
  return (
    <svg className="p-art" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e1e24" />
          <stop offset="1" stopColor="#0f0f12" />
        </linearGradient>
        <radialGradient id={`gl-${uid}`} cx={cx / 200} cy={cy / 200} r="0.75">
          <stop offset="0" stopColor={tint} stopOpacity="0.3" />
          <stop offset="0.6" stopColor={tint} stopOpacity="0.06" />
          <stop offset="1" stopColor={tint} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#bg-${uid})`} />
      <rect width="200" height="200" fill={`url(#gl-${uid})`} />
      {Array.from({ length: rings }, (_, i) => (
        <circle key={i} cx={cx} cy={cy} r={12 + i * 16} fill="none" stroke="#f4f1ea" strokeOpacity={0.14 - i * 0.018} strokeWidth="0.8" />
      ))}
      <path d={`M-5 ${y1} C 50 ${y1 - 10}, 60 ${y2 + 20}, 100 ${y2} S 150 ${y3 + 10}, ${cx} ${cy}`} fill="none" stroke="#c6f24e" strokeOpacity="0.75" strokeWidth="1.4" strokeDasharray="4 4" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="3.2" fill="#c6f24e" />
      <circle cx={cx} cy={cy} r="7" fill="none" stroke="#c6f24e" strokeOpacity="0.35" />
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
