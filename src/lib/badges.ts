import { continentOf } from "./geo";
import type { Place } from "./types";
import type { TripDoc } from "./tripTypes";

export interface Badge { id: string; emoji: string; name: string; how: string; earned: boolean; progress?: string }

const AFRICA_REGIONS: Record<string, string[]> = {
  East: ["KE", "TZ", "UG", "RW", "BI", "ET", "SO", "DJ", "ER", "SS"],
  West: ["NG", "GH", "SN", "CI", "BJ", "TG", "BF", "ML", "NE", "GM", "GN", "GW", "SL", "LR", "CV", "MR"],
  North: ["EG", "MA", "TN", "DZ", "LY", "SD", "EH"],
  Southern: ["ZA", "NA", "BW", "ZW", "ZM", "MZ", "MW", "LS", "SZ", "AO"],
  Central: ["CM", "CF", "TD", "CG", "CD", "GA", "GQ", "ST"],
  Islands: ["MU", "SC", "MG", "KM", "RE", "YT"],
};

/** Badges from where you've been and the trips you've run. */
export function badgesFor(places: Place[], trips: TripDoc[], streak: number): Badge[] {
  const been = Array.from(new Set(places.filter((p) => p.status === "been").map((p) => p.country)));
  const africa = been.filter((c) => continentOf(c) === "Africa");
  const conts = new Set(been.map(continentOf).filter(Boolean));
  const regions = Object.entries(AFRICA_REGIONS).filter(([, l]) => l.some((c) => been.includes(c))).length;
  const group = trips.some((t) => t.members.length >= 3);
  const potDone = trips.some((t) => t.pot.target > 0 && t.pot.contributions.filter((c) => c.status === "confirmed").reduce((a, c) => a + c.amount, 0) >= t.pot.target);
  const voted = trips.some((t) => t.proposals.length >= 3);
  const solo = trips.some((t) => t.company === "solo" && t.safety.checkIns.length > 0);
  const special = trips.some((t) => t.occasion !== "none");
  const b = (id: string, emoji: string, name: string, how: string, earned: boolean, progress?: string): Badge => ({ id, emoji, name, how, earned, progress });
  return [
    b("first", "🛫", "First stamp", "Add your first country", been.length >= 1),
    b("five", "🖐🏾", "High five", "Visit 5 countries", been.length >= 5, `${Math.min(been.length, 5)}/5`),
    b("ten", "🔟", "Double digits", "Visit 10 countries", been.length >= 10, `${Math.min(been.length, 10)}/10`),
    b("afro5", "🌍", "Africa explorer", "Visit 5 African countries", africa.length >= 5, `${Math.min(africa.length, 5)}/5`),
    b("regions", "🧭", "Pan-African", "Visit every African region", regions >= 6, `${regions}/6`),
    b("conts", "🌐", "Continental", "Visit 3 continents", conts.size >= 3, `${Math.min(conts.size, 3)}/3`),
    b("crew", "👯🏾", "Squad goals", "Plan a trip with 3+ people", group),
    b("pot", "💰", "Pot filled", "Fill a group pot to target", potDone),
    b("vote", "🗳️", "Democracy", "Run 3 votes on one trip", voted),
    b("solo", "🛡️", "Solo & safe", "Check in safely on a solo trip", solo),
    b("occasion", "🎂", "Make it special", "Plan a trip for an occasion", special),
    b("streak", "🔥", "On a roll", "Travel 3 years in a row", streak >= 3, `${Math.min(streak, 3)}/3`),
  ];
}

/** Consecutive years (ending this year or last) with at least one trip. */
export function travelStreak(places: Place[]) {
  const years = new Set(places.filter((p) => p.status === "been" && p.start).map((p) => Number(p.start!.slice(0, 4))));
  let y = new Date().getFullYear();
  if (!years.has(y)) y -= 1;
  let n = 0;
  while (years.has(y)) { n++; y--; }
  return n;
}
