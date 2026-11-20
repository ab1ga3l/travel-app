// GENERATED from src/lib/tripText.ts by scripts/sync-shared.js. Do not edit here.
// "Tell us about your trip": turns a paragraph into a full trip.
// Aviora (on the server) writes the whole plan; when she can't be reached, quickParse reads the
// basics straight from the text so creating a trip always works, even offline.
import { COUNTRIES } from "./countries";
import { WORLD } from "./world";
import type { Occasion, Vibe } from "./site";
import { buildTrip, tripDays, type TripAnswers } from "./tripBuild";
import type { ItemKind, PlanItem, TripBrief, TripDoc } from "./tripTypes";
import type { Profile } from "./types";

/** The plan Aviora returns from /api/plan-trip (see that route's schema). */
export interface AiPlan {
  trip_name: string;
  country_code: string;
  start: string;
  end: string;
  month: number;
  people: number;
  company: TripDoc["company"];
  occasion: Occasion;
  vibes: Vibe[];
  budget_per_person: number;
  friends: string[];
  summary: string;
  days: { day: number; items: { time: string; title: string; kind: ItemKind; note: string; cost: number }[] }[];
  budget: { label: string; amount: number }[];
  tips: string[];
  packing: string[];
}

const MONTHS = ["january|jan", "february|feb", "march|mar", "april|apr", "may", "june|jun", "july|jul", "august|aug", "september|sept|sep", "october|oct", "november|nov", "december|dec"];
const OCCASION_WORDS: [Occasion, RegExp][] = [
  ["birthday", /birthday|bday|b-day/], ["honeymoon", /honeymoon/], ["proposal", /propos/], ["wedding", /wedding/], ["anniversary", /anniversary/],
  ["bachelor", /bachelor|hen party|stag/], ["graduation", /graduat/], ["festival", /festival|concert|detty december/], ["sport", /\bmatch\b|marathon|race|afcon|world cup/], ["work", /conference|workation|business trip/],
];
const CITY: Record<string, string> = {
  zanzibar: "TZ", "dar es salaam": "TZ", arusha: "TZ", serengeti: "TZ", kilimanjaro: "TZ", nairobi: "KE", mombasa: "KE", diani: "KE", lamu: "KE", watamu: "KE", "maasai mara": "KE",
  kigali: "RW", lagos: "NG", abuja: "NG", accra: "GH", "cape town": "ZA", johannesburg: "ZA", durban: "ZA", marrakech: "MA", marrakesh: "MA", casablanca: "MA", cairo: "EG",
  dakar: "SN", kampala: "UG", "addis ababa": "ET", "victoria falls": "ZW", bali: "ID", bangkok: "TH", phuket: "TH", dubai: "AE", "abu dhabi": "AE", lisbon: "PT", porto: "PT",
  paris: "FR", london: "GB", istanbul: "TR", "new york": "US", seychelles: "SC", mauritius: "MU", "cape verde": "CV", "sal island": "CV",
};
const VIBE_WORDS: [Vibe, RegExp][] = [
  ["party", /party|club|nightlife|turn up|rave|festival|concert/], ["nature", /nature|hike|hiking|safari|wildlife|mountain|forest|waterfall/],
  ["culture", /culture|history|museum|art|heritage/], ["food", /food|eat|restaurant|market|street food/], ["reset", /relax|chill|spa|wellness|rest|beach|slow/],
  ["adventure", /adventure|skydiv|bungee|rafting|dive|diving|surf|road trip/], ["romance", /romantic|honeymoon|couple|anniversary|proposal|partner|bae/],
];

/** Reads the basics from a description without AI. */
export function quickParse(text: string, profile: Profile): TripAnswers {
  const t = ` ${text.toLowerCase()} `;
  let country = Object.entries(CITY).find(([k]) => t.includes(k))?.[1] ?? "";
  if (!country) country = [...COUNTRIES.map((c) => ({ code: c.code, name: c.name })), ...WORLD].find((c) => new RegExp(`\\b${c.name.toLowerCase()}\\b`).test(t))?.code ?? "";
  const mIdx = MONTHS.findIndex((m) => new RegExp(`\\b(?:${m})\\b`).test(t));
  const occasion = OCCASION_WORDS.find(([, re]) => re.test(t))?.[0] ?? "none";
  const groupMatch = t.match(/(with\s+)?(\d+)\s*(?:of us|people|friends|girls|guys|ladies|lads|pax|adults)/);
  const nPeople = groupMatch ? Number(groupMatch[2]) + (groupMatch[1] ? 1 : 0) : 0;
  const company: TripDoc["company"] = /\bsolo\b|\balone\b|\bmyself\b/.test(t) ? "solo" : /partner|husband|wife|boyfriend|girlfriend|bae|honeymoon|couple/.test(t) ? "couple" : /kids|family|children|mum|mom|dad/.test(t) ? "family" : nPeople > 0 || /friends|girls|squad|crew|guys/.test(t) ? "friends" : profile.company;
  const people = nPeople || (company === "solo" ? 1 : company === "couple" ? 2 : 4);
  const money = t.match(/(?:kes|ksh|usd|\$|ngn|₦|ghs|zar|r|€|eur|£)?\s?(\d[\d,.]*)\s?(k|000)?\s*(?:each|per person|pp|budget)?/g)?.map((m) => {
    const n = Number(m.replace(/[^\d.]/g, "")) * (/\dk\b|\dk\s/.test(m + " ") ? 1000 : 1);
    return /each|per person|pp|budget|kes|ksh|usd|\$|€|£|ngn|ghs|zar/.test(m) ? n : 0;
  }).filter((n) => n >= 50) ?? [];
  const vibes = VIBE_WORDS.filter(([, re]) => re.test(t)).map(([v]) => v);
  return {
    country, vibes: vibes.length ? vibes : profile.vibes, occasion, company, people,
    month: mIdx >= 0 ? mIdx + 1 : undefined, budgetPerPerson: money[0] ?? 0, currency: profile.currency ?? "USD",
  };
}

/** A trip from Aviora's plan, with every day, cost and tip. */
export function tripFromPlan(plan: AiPlan, profile: Profile, ownerUserId?: string): TripDoc {
  const answers: TripAnswers = {
    name: plan.trip_name, country: plan.country_code.toUpperCase(), vibes: plan.vibes, occasion: plan.occasion, company: plan.company,
    people: Math.max(1, plan.people), start: plan.start || undefined, end: plan.end || undefined, month: plan.month > 0 ? plan.month : undefined,
    budgetPerPerson: Math.max(0, Math.round(plan.budget_per_person)), currency: profile.currency ?? "USD", friends: plan.friends,
  };
  const trip = buildTrip(answers, profile, ownerUserId);
  let n = 0;
  const items: PlanItem[] = plan.days.flatMap((d) => d.items.map((i) => ({
    id: `${trip.id.slice(0, 8)}-${n++}`, day: Math.max(1, d.day), time: i.time || undefined, title: i.title, kind: i.kind, note: i.note || undefined, cost: i.cost > 0 ? Math.round(i.cost) : undefined,
  })));
  const brief: TripBrief = { summary: plan.summary, budget: plan.budget.map((b) => ({ label: b.label, amount: Math.round(b.amount) })), tips: plan.tips, packing: plan.packing, by: "aviora" };
  return { ...trip, items: items.length ? items : trip.items, brief };
}

/** A starter trip from the quick reading, used when Aviora can't be reached. */
export function tripFromText(text: string, profile: Profile, ownerUserId?: string): TripDoc | null {
  const a = quickParse(text, profile);
  if (!a.country) return null;
  const trip = buildTrip(a, profile, ownerUserId);
  const c = COUNTRIES.find((x) => x.code === a.country);
  const days = tripDays(a);
  const brief: TripBrief = {
    summary: `A ${days}-day starter plan with places that fit your vibe. Aviora can fill in times and costs when she's back online.`,
    budget: a.budgetPerPerson > 0 ? [{ label: "Your budget", amount: a.budgetPerPerson }] : [],
    tips: c ? [`Typical spend in ${c.name}: about $${c.dailyBudget[1]} a day per person for a comfortable trip.`, c.moneyTip] : [], packing: [], by: "quick",
  };
  return { ...trip, brief };
}
