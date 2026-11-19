// Turns the answers from "Guide me" (or the manual form) into a first draft of a trip.
import { countryByCode } from "./countries";
import { EXTRAS } from "./countryExtras";
import { gemsFor } from "./gems";
import type { Occasion, Vibe } from "./site";
import type { Profile } from "./store";
import { makeCode, type Member, type PlanItem, type TripDoc } from "./tripTypes";
import { nameOf } from "./world";

export interface TripAnswers {
  name?: string;
  country: string;
  vibes: Vibe[];
  occasion: Occasion;
  company: TripDoc["company"];
  people: number;
  start?: string;
  end?: string;
  month?: number;
  budgetPerPerson: number;
  currency: string;
  friends?: string[];
}

const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));

export function tripDays(a: { start?: string; end?: string }) {
  if (a.start && a.end) return Math.max(1, Math.min(30, Math.round((Date.parse(a.end) - Date.parse(a.start)) / 864e5) + 1));
  return 5;
}

/** A starter plan: the gems and things to do that match the trip's vibes, spread across the days. */
export function suggestItems(country: string, vibes: Vibe[], days: number): PlanItem[] {
  const gems = gemsFor(country).filter((g) => !vibes.length || g.vibes.some((v) => vibes.includes(v)));
  const things = (EXTRAS[country]?.things ?? []).filter((t) => !vibes.length || vibes.includes(t.v));
  const picks: Omit<PlanItem, "id" | "day">[] = [
    ...gems.map((g) => ({ title: g.name, kind: "activity" as const, gemId: g.id, note: g.area })),
    ...things.map((t) => ({ title: t.t, kind: "activity" as const })),
  ].slice(0, days * 2);
  return picks.map((p, i) => ({ ...p, id: uid(), day: (i % days) + 1, time: i < days ? "10:00" : "16:00" }));
}

export function buildTrip(a: TripAnswers, profile: Profile, ownerUserId?: string): TripDoc {
  const owner: Member = { id: uid(), name: profile.name || "You", passport: profile.passport, role: "owner", userId: ownerUserId };
  const friends: Member[] = (a.friends ?? []).filter(Boolean).map((n) => ({ id: uid(), name: n, passport: profile.passport, role: "member" }));
  const c = countryByCode(a.country);
  const now = new Date().toISOString();
  return {
    id: uid(),
    code: makeCode(),
    name: a.name?.trim() || `${a.occasion !== "none" ? occasionWord(a.occasion) + " in " : ""}${c?.name ?? nameOf(a.country)}`,
    country: a.country,
    start: a.start || undefined,
    end: a.end || undefined,
    month: a.month,
    vibes: a.vibes,
    occasion: a.occasion,
    company: a.company,
    budgetPerPerson: a.budgetPerPerson,
    currency: a.currency,
    members: [owner, ...friends],
    items: suggestItems(a.country, a.vibes, tripDays(a)),
    checklist: {},
    pot: { target: Math.round(a.budgetPerPerson * Math.max(1, a.people)), contributions: [], spends: [] },
    expenses: [],
    proposals: [],
    safety: { checkIns: [] },
    createdAt: now,
    updatedAt: now,
  };
}

function occasionWord(o: Occasion) {
  return ({ birthday: "Birthday", honeymoon: "Honeymoon", proposal: "Proposal trip", wedding: "Wedding", anniversary: "Anniversary", bachelor: "Last fling", graduation: "Grad trip", festival: "Festival trip", sport: "Match trip", work: "Workation", none: "" } as Record<string, string>)[o] ?? "";
}
