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

export const INTERESTS = [
  { id: "festivals", label: "Festivals & events", emoji: "🎉" },
  { id: "tech", label: "Tech & nomad life", emoji: "💻" },
  { id: "crypto", label: "Crypto-friendly travel", emoji: "₿" },
  { id: "sports", label: "Sports trips", emoji: "⚽" },
  { id: "faith", label: "Faith & pilgrimage", emoji: "🕌" },
  { id: "foodie", label: "Foodie", emoji: "🍲" },
  { id: "wellness", label: "Wellness", emoji: "🧘🏾" },
  { id: "family", label: "Travelling with kids", emoji: "👨‍👩‍👧" },
  { id: "access", label: "Accessibility", emoji: "♿" },
  { id: "firsttime", label: "First trip abroad", emoji: "✈️" },
] as const;
export type Interest = (typeof INTERESTS)[number]["id"];

export const OCCASIONS = [
  { id: "none", label: "Just because", emoji: "🌍" },
  { id: "birthday", label: "Birthday", emoji: "🎂" },
  { id: "honeymoon", label: "Honeymoon", emoji: "💍" },
  { id: "proposal", label: "Proposal", emoji: "💐" },
  { id: "wedding", label: "Destination wedding", emoji: "👰🏾" },
  { id: "anniversary", label: "Anniversary", emoji: "🥂" },
  { id: "bachelor", label: "Bachelorette / bachelor", emoji: "🎊" },
  { id: "graduation", label: "Graduation trip", emoji: "🎓" },
  { id: "festival", label: "Festival or concert", emoji: "🎶" },
  { id: "sport", label: "Match or race", emoji: "🏟️" },
  { id: "work", label: "Conference or workation", emoji: "💼" },
] as const;
export type Occasion = (typeof OCCASIONS)[number]["id"];

/** Countries that suit each special occasion (from the in-app guides). */
export const OCCASION_PICKS: Partial<Record<Occasion, { countries: string[]; tip: string }>> = {
  honeymoon: { countries: ["MU", "TZ", "ID", "CV", "GR", "MA", "LK"], tip: "Book a room with a view and one 'wow' experience: a private dhow, a desert camp or a sunset sail." },
  proposal: { countries: ["GR", "MA", "ZA", "PT", "TZ", "IT"], tip: "Pick golden hour at a viewpoint, book a photographer, and have a rainy-day plan B." },
  wedding: { countries: ["MU", "ZA", "MA", "PT", "KE", "GR", "TZ"], tip: "Check legal requirements for marrying abroad early; many couples do the legal part at home." },
  birthday: { countries: ["NG", "GH", "ZA", "AE", "ES", "TH"], tip: "Plan one big night and one recovery day. Reserve tables early in December." },
  anniversary: { countries: ["MU", "PT", "IT", "MA", "JP", "ZA"], tip: "Recreate a first-date moment somewhere new." },
  bachelor: { countries: ["ZA", "ES", "GH", "AE", "TH", "NG"], tip: "Use the group pot early and vote on the big activities." },
  graduation: { countries: ["TH", "ID", "VN", "MA", "ZA", "KE"], tip: "Stretch the budget with hostels and street food; save for one splurge." },
  festival: { countries: ["GH", "NG", "PT", "ZA", "TZ"], tip: "Flights and stays sell out: book as soon as dates are announced." },
  work: { countries: ["KE", "RW", "PT", "AE", "SG", "ZA"], tip: "Check business-visa rules; some tourist visas don't allow conferences." },
};

/**
 * The one "What's your vibe?" list people pick from. Each pick feeds the 7 core vibes
 * (used to score countries and gems) and/or an interest (events, tips, assistant).
 */
export const VIBE_PICKS: { id: string; label: string; emoji: string; core?: Vibe[]; interest?: Interest }[] = [
  { id: "party", label: "Nightlife & clubbing", emoji: "🪩", core: ["party"] },
  { id: "music", label: "Music & festivals", emoji: "🎶", core: ["party", "culture"], interest: "festivals" },
  { id: "beach", label: "Beach & islands", emoji: "🏝️", core: ["reset", "romance"] },
  { id: "nature", label: "Nature & hikes", emoji: "🌿", core: ["nature"] },
  { id: "safari", label: "Safari & wildlife", emoji: "🦁", core: ["nature", "adventure"] },
  { id: "adventure", label: "Adrenaline", emoji: "🪂", core: ["adventure"] },
  { id: "roadtrip", label: "Road trips", emoji: "🚐", core: ["adventure", "nature"] },
  { id: "culture", label: "Culture & history", emoji: "🏛️", core: ["culture"] },
  { id: "art", label: "Art, design & fashion", emoji: "🎨", core: ["culture"] },
  { id: "food", label: "Food & markets", emoji: "🍲", core: ["food"], interest: "foodie" },
  { id: "luxury", label: "Luxury & treat yourself", emoji: "🥂", core: ["romance", "reset"] },
  { id: "reset", label: "Wellness & reset", emoji: "🧘🏾", core: ["reset"], interest: "wellness" },
  { id: "romance", label: "Romance & couples", emoji: "💞", core: ["romance"] },
  { id: "content", label: "Content & photo spots", emoji: "📸", core: ["nature", "culture"] },
  { id: "shopping", label: "Shopping & thrifting", emoji: "🛍️", core: ["culture", "food"] },
  { id: "tech", label: "Tech & nomad life", emoji: "💻", interest: "tech" },
  { id: "crypto", label: "Crypto-friendly", emoji: "₿", interest: "crypto" },
  { id: "sports", label: "Sports & big matches", emoji: "⚽", interest: "sports" },
  { id: "faith", label: "Faith & pilgrimage", emoji: "🕌", interest: "faith" },
  { id: "family", label: "Travelling with kids", emoji: "👨‍👩‍👧", interest: "family" },
  { id: "access", label: "Accessible travel", emoji: "♿", interest: "access" },
  { id: "firsttime", label: "First trip abroad", emoji: "✈️", interest: "firsttime" },
];

/** Turns picks into core vibes and interests. */
export function fromPicks(picks: string[]) {
  const chosen = VIBE_PICKS.filter((p) => picks.includes(p.id));
  return {
    vibes: Array.from(new Set(chosen.flatMap((p) => p.core ?? []))) as Vibe[],
    interests: Array.from(new Set(chosen.flatMap((p) => (p.interest ? [p.interest] : [])))) as Interest[],
  };
}
/** Best guess at picks for profiles saved before picks existed. */
export function picksFrom(vibes: string[] = [], interests: string[] = []) {
  return VIBE_PICKS.filter((p) => (p.core?.length === 1 && vibes.includes(p.core[0]) && p.id === p.core[0]) || (p.interest && interests.includes(p.interest))).map((p) => p.id);
}
/** Label for a pick or a core vibe. */
export const pickInfo = (id: string) => VIBE_PICKS.find((p) => p.id === id) ?? vibeInfo(id);

export const ASSISTANT_STYLES = [
  { id: "warm", label: "Warm & fun", emoji: "💖", hint: "Friendly, hyped, a few emojis" },
  { id: "direct", label: "Straight to the point", emoji: "⚡", hint: "Short answers, no fluff" },
  { id: "detailed", label: "Detailed", emoji: "📚", hint: "Full explanations and steps" },
] as const;
export type AssistantStyle = (typeof ASSISTANT_STYLES)[number]["id"];
