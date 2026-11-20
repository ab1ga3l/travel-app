// GENERATED from src/lib/match.ts by scripts/sync-shared.js. Do not edit here.
import type { Country } from "./countries";
import { EXTRAS } from "./countryExtras";
import type { Vibe } from "./site";

/** 0–100: how well a country fits the traveller's vibes, with a bonus for great weather this month. */
export function matchScore(c: Country, vibes: Vibe[], month = new Date().getMonth() + 1) {
  const ex = EXTRAS[c.code];
  if (!ex) return 0;
  const picks = vibes.length ? vibes : (Object.keys(ex.vibes) as Vibe[]);
  const vibeFit = picks.reduce((a, v) => a + (ex.vibes[v] ?? 0), 0) / (picks.length * 3);
  const weather = c.bestMonths.includes(month) ? 1 : c.okMonths.includes(month) ? 0.6 : 0.2;
  return Math.round((vibeFit * 0.8 + weather * 0.2) * 100);
}

export function topVibes(code: string, n = 3): Vibe[] {
  const ex = EXTRAS[code];
  if (!ex) return [];
  return (Object.entries(ex.vibes) as [Vibe, number][]).sort((a, b) => b[1] - a[1]).slice(0, n).map(([v]) => v);
}
