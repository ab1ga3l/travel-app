// GENERATED from src/lib/tripTypes.ts by scripts/sync-shared.js. Do not edit here.
// A planned trip, solo or group. Stored as one document so it works the same on the device
// and in the cloud (where every member of the trip can read and update it).
import type { Occasion, Vibe } from "./site";

export interface Member {
  id: string;
  name: string;
  passport: string; // ISO2
  userId?: string; // set when the member has an account and joined with the code
  role: "owner" | "treasurer" | "member";
}

export type ItemKind = "activity" | "stay" | "flight" | "transport" | "food" | "event" | "note";
export interface PlanItem { id: string; day: number; time?: string; title: string; kind: ItemKind; note?: string; gemId?: string; cost?: number }

export interface Contribution { id: string; memberId: string; amount: number; method: string; ref?: string; status: "pending" | "confirmed"; at: string }
export interface Spend { id: string; label: string; amount: number; category: string; byMemberId: string; at: string }
export interface Expense { id: string; label: string; amount: number; paidBy: string; split: "equal" | Record<string, number>; at: string }
export interface Proposal { id: string; title: string; detail?: string; kind: "activity" | "place" | "date" | "other"; deadline?: string; sealed: boolean; revealed?: boolean; createdBy: string; at: string; localVote?: "yes" | "no" | "abstain" }
export interface CheckIn { id: string; at: string; message: string }

export interface TripDoc {
  id: string;
  code: string; // 6-letter invite code
  name: string;
  country: string; // ISO2 destination
  start?: string;
  end?: string;
  month?: number; // flexible month (1–12)
  vibes: Vibe[];
  occasion: Occasion;
  company: "solo" | "couple" | "friends" | "family";
  budgetPerPerson: number;
  currency: string;
  members: Member[];
  items: PlanItem[];
  checklist: Record<string, Record<string, boolean>>; // memberId → item → done
  pot: { target: number; payTo?: string; payNote?: string; contributions: Contribution[]; spends: Spend[] };
  expenses: Expense[];
  proposals: Proposal[];
  safety: { contactName?: string; contactPhone?: string; checkIns: CheckIn[] };
  createdAt: string;
  updatedAt: string;
}

export const READY_ITEMS = [
  { id: "passport", label: "Passport valid 6+ months after the trip" },
  { id: "visa", label: "Visa / eVisa / entry approval sorted" },
  { id: "insurance", label: "Travel insurance" },
  { id: "health", label: "Vaccines & yellow fever certificate (if required)" },
  { id: "money", label: "Card that works abroad + some cash" },
  { id: "flights", label: "Flights booked" },
  { id: "stay", label: "Where you'll stay" },
  { id: "esim", label: "Phone data / eSIM" },
  { id: "copies", label: "Copies of documents saved offline" },
] as const;

const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
export const makeCode = () => Array.from({ length: 6 }, () => LETTERS[Math.floor(Math.random() * LETTERS.length)]).join("");

/** Who owes whom, from shared expenses. Returns minimal transfers. */
export function settleUp(trip: TripDoc) {
  const net: Record<string, number> = Object.fromEntries(trip.members.map((m) => [m.id, 0]));
  for (const e of trip.expenses) {
    net[e.paidBy] = (net[e.paidBy] ?? 0) + e.amount;
    if (e.split === "equal") {
      const share = e.amount / Math.max(1, trip.members.length);
      trip.members.forEach((m) => (net[m.id] -= share));
    } else {
      for (const [mid, amt] of Object.entries(e.split)) net[mid] = (net[mid] ?? 0) - amt;
    }
  }
  const debt = Object.entries(net).filter(([, v]) => v < -0.5).map(([k, v]) => [k, -v] as [string, number]).sort((a, b) => b[1] - a[1]);
  const cred = Object.entries(net).filter(([, v]) => v > 0.5).sort((a, b) => b[1] - a[1]);
  const out: { from: string; to: string; amount: number }[] = [];
  let i = 0, j = 0;
  while (i < debt.length && j < cred.length) {
    const x = Math.min(debt[i][1], cred[j][1]);
    out.push({ from: debt[i][0], to: cred[j][0], amount: x });
    debt[i][1] -= x; cred[j][1] -= x;
    if (debt[i][1] < 0.5) i++;
    if (cred[j][1] < 0.5) j++;
  }
  return out;
}

export const daysUntil = (iso?: string) => (iso ? Math.ceil((Date.parse(iso) - Date.now()) / 864e5) : null);
export const tripPhase = (t: TripDoc): "planning" | "upcoming" | "now" | "past" => {
  const s = daysUntil(t.start), e = daysUntil(t.end ?? t.start);
  if (s == null) return "planning";
  if (e != null && e < 0) return "past";
  if (s <= 0) return "now";
  return "upcoming";
};
export const potRaised = (t: TripDoc) => t.pot.contributions.filter((c) => c.status === "confirmed").reduce((a, c) => a + c.amount, 0);
/** Each person's share of the pot: the planned budget per person, or the target split across the crew. */
export const potShare = (t: TripDoc) => (t.budgetPerPerson > 0 ? t.budgetPerPerson : t.pot.target / Math.max(1, t.members.length));
export const potSpent = (t: TripDoc) => t.pot.spends.reduce((a, s) => a + s.amount, 0);
