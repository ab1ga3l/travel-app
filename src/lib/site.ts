// Site-wide settings. Monetization links come from environment variables so you can
// swap partners without touching code. Leave a variable empty to hide that offer.

export const SITE = {
  name: "Soft Passport",
  tagline: "Travel the world on an African passport, without the guesswork.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  agentName: "Ama",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
};

export const PLANS = {
  free: { name: "Free", price: "$0", agentDailyLimit: 5 },
  visaReady: {
    name: "Visa Ready",
    price: "$9",
    period: "per month",
    yearly: "$49 per year",
    checkoutUrl: process.env.NEXT_PUBLIC_STRIPE_VISA_READY_URL || "",
  },
  review: {
    name: "Application Review",
    price: "$29",
    period: "one-time",
    checkoutUrl: process.env.NEXT_PUBLIC_STRIPE_REVIEW_URL || "",
  },
};

export type AffiliateKind = "insurance" | "esim" | "hotels" | "tours" | "flights";

export const AFFILIATES: Record<AffiliateKind, { label: string; blurb: string; url: string }> = {
  insurance: {
    label: "Visa-compliant travel insurance",
    blurb: "Schengen needs at least €30,000 medical cover. Get a policy document you can attach to your application.",
    url: process.env.NEXT_PUBLIC_AFF_INSURANCE_URL || "",
  },
  esim: {
    label: "eSIM data for your trip",
    blurb: "Land with mobile data and skip airport SIM queues.",
    url: process.env.NEXT_PUBLIC_AFF_ESIM_URL || "",
  },
  hotels: {
    label: "Free-cancellation hotels",
    blurb: "Book a refundable stay to show in your visa application.",
    url: process.env.NEXT_PUBLIC_AFF_HOTELS_URL || "",
  },
  tours: {
    label: "Tours and activities",
    blurb: "Book guided tours with free cancellation.",
    url: process.env.NEXT_PUBLIC_AFF_TOURS_URL || "",
  },
  flights: {
    label: "Flight deals",
    blurb: "Compare airlines, including regional African carriers.",
    url: process.env.NEXT_PUBLIC_AFF_FLIGHTS_URL || "",
  },
};
