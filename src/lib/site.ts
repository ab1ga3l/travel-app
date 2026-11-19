// App-wide settings. "Tokende" is a working name: change it here and it updates everywhere.
// Partner links come from environment variables so you can swap partners without code changes.

export const APP = {
  name: "Tokende",
  meaning: "Lingala for “Let's go!”",
  tagline: "Know before you go. Then go.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  assistant: "Aviora",
  assistantMeaning: "your travel companion",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  reviewUrl: process.env.NEXT_PUBLIC_REVIEW_URL || "",
  freeQuestionsPerDay: 5,
};

export type DealKind = "stays" | "flights" | "rides" | "esim" | "insurance" | "tours";

export const DEALS: Record<DealKind, { title: string; emoji: string; blurb: string; url: string }> = {
  stays: { title: "Stays", emoji: "🛏️", blurb: "Hotels and guesthouses with free cancellation, handy for visa applications too.", url: process.env.NEXT_PUBLIC_AFF_HOTELS_URL || "" },
  flights: { title: "Flights", emoji: "✈️", blurb: "Compare airlines, including regional African carriers.", url: process.env.NEXT_PUBLIC_AFF_FLIGHTS_URL || "" },
  rides: { title: "Rides", emoji: "🚕", blurb: "Airport pickups and ride credits so you never haggle at arrivals.", url: process.env.NEXT_PUBLIC_AFF_RIDES_URL || "" },
  esim: { title: "eSIM data", emoji: "📶", blurb: "Land connected. No airport SIM queue.", url: process.env.NEXT_PUBLIC_AFF_ESIM_URL || "" },
  insurance: { title: "Travel insurance", emoji: "🛟", blurb: "Visa-compliant cover, including Schengen's €30,000 minimum.", url: process.env.NEXT_PUBLIC_AFF_INSURANCE_URL || "" },
  tours: { title: "Tours & spots", emoji: "🎟️", blurb: "Book experiences with free cancellation.", url: process.env.NEXT_PUBLIC_AFF_TOURS_URL || "" },
};

export const VIBES = [
  { id: "party", label: "Nightlife & clubbing", emoji: "🪩" },
  { id: "nature", label: "Nature & outdoors", emoji: "🌿" },
  { id: "culture", label: "Culture & history", emoji: "🏛️" },
  { id: "food", label: "Food & markets", emoji: "🍲" },
  { id: "reset", label: "Slow & reset", emoji: "🧘🏾" },
  { id: "adventure", label: "Adventure & thrills", emoji: "🪂" },
  { id: "romance", label: "Romance & couples", emoji: "💞" },
] as const;
export type Vibe = (typeof VIBES)[number]["id"];
export const vibeInfo = (v: string) => VIBES.find((x) => x.id === v) ?? VIBES[0];
