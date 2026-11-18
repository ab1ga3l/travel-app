// Visa knowledge base. Curated for the destinations African travelers ask about most.
// Every rule carries an "as of" date and an official link. Never present this as legal advice.

export const AS_OF = "November 2026";

export const PASSPORTS: { code: string; name: string; slug: string }[] = [
  ["NG", "Nigeria"], ["GH", "Ghana"], ["KE", "Kenya"], ["ZA", "South Africa"], ["UG", "Uganda"],
  ["TZ", "Tanzania"], ["RW", "Rwanda"], ["ET", "Ethiopia"], ["EG", "Egypt"], ["MA", "Morocco"],
  ["SN", "Senegal"], ["CM", "Cameroon"], ["CI", "Côte d'Ivoire"], ["ZW", "Zimbabwe"], ["ZM", "Zambia"],
  ["MW", "Malawi"], ["BW", "Botswana"], ["NA", "Namibia"], ["SL", "Sierra Leone"], ["LR", "Liberia"],
  ["GM", "The Gambia"], ["BJ", "Benin"], ["TG", "Togo"], ["CD", "DR Congo"], ["SD", "Sudan"],
  ["IN", "India"], ["PK", "Pakistan"], ["BD", "Bangladesh"], ["PH", "Philippines"],
].map(([code, name]) => ({ code, name, slug: slugify(name) }));

export function slugify(n: string) {
  return n.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export type VisaGroup = "schengen" | "uk" | "us" | "canada" | "uae";

export interface DestinationRule {
  code: string;
  name: string;
  slug: string;
  group: VisaGroup;
}

export const DESTINATIONS: DestinationRule[] = [
  ["FR", "France", "schengen"], ["DE", "Germany", "schengen"], ["ES", "Spain", "schengen"], ["IT", "Italy", "schengen"],
  ["PT", "Portugal", "schengen"], ["NL", "Netherlands", "schengen"], ["GR", "Greece", "schengen"], ["CZ", "Czechia", "schengen"],
  ["CH", "Switzerland", "schengen"], ["SE", "Sweden", "schengen"],
  ["GB", "United Kingdom", "uk"], ["US", "United States", "us"], ["CA", "Canada", "canada"], ["AE", "United Arab Emirates", "uae"],
].map(([code, name, group]) => ({ code, name, slug: slugify(name), group: group as VisaGroup }));

export interface GroupRule {
  visaName: string;
  stay: string;
  fee: string;
  processing: string;
  howToApply: string;
  documents: string[];
  tips: string[];
  official: { label: string; url: string }[];
  appliesTo: string;
  /** What "proof of funds" usually means for this visa. */
  money: string;
  /** Can you stay longer once you're there? */
  extension: string;
  /** How the government fee is paid. */
  payment: string;
}

const COMMON_DOCS = [
  "Passport valid for at least 3–6 months after your return, with blank pages",
  "Recent passport photos in the required size",
  "Bank statements for the last 6 months showing steady income",
  "Employer letter with approved leave, or business registration if self-employed",
  "Flight reservation and accommodation booking (reservations, not paid tickets)",
  "Day-by-day itinerary for the trip",
];

export const GROUP_RULES: Record<VisaGroup, GroupRule> = {
  schengen: {
    visaName: "Schengen short-stay visa (type C)",
    stay: "Up to 90 days in any 180-day period, across all 29 Schengen countries",
    fee: "€90 for adults, €45 for children aged 6–11, plus the visa centre's service fee",
    processing: "Usually 15 calendar days; can take up to 45. Apply 3–6 months before you travel.",
    howToApply:
      "Apply to the consulate of the country where you will spend the most nights (or enter first if equal), usually through its visa centre (VFS Global, TLScontact or BLS). You give fingerprints in person.",
    documents: [
      ...COMMON_DOCS,
      "Travel medical insurance valid in all Schengen countries with at least €30,000 cover",
      "Invitation letter and host's ID or residence permit if staying with family or friends",
    ],
    tips: [
      "In 2025 refusal rates were around 48% for Nigerian, 47% for Ghanaian and 52% for Senegalese applicants, so prepare carefully.",
      "Apply where you'll truly spend most nights. 'Visa shopping' through an easier consulate is a common refusal reason.",
      "Since 10 April 2026 the EU Entry/Exit System records fingerprints and a photo at the border instead of passport stamps.",
      "ETIAS is not running yet and does not apply to visa holders. Ignore sites selling it.",
    ],
    official: [
      { label: "European Commission: Schengen visa", url: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en" },
      { label: "EU travel portal (EES and ETIAS)", url: "https://travel-europe.europa.eu/" },
    ],
    appliesTo: "Most African passports need this visa. Mauritius and Seychelles passports are visa-free.",
    money: "Most consulates want 3–6 months of bank statements showing regular income and enough to cover the trip. Many publish a daily minimum (for example France asks for about €120 a day without a hotel booking). Statements should be recent, stamped or verifiable, and match your payslips.",
    extension: "Rarely. Only for exceptional reasons (force majeure, illness, serious personal reasons), applied for at the local immigration office before your visa ends.",
    payment: "Paid when you submit at the visa centre, usually in local currency by card, bank transfer or cash, depending on the country's provider.",
  },
  uk: {
    visaName: "UK Standard Visitor visa",
    stay: "Up to 6 months per visit",
    fee: "£127 for a 6-month visa (longer 2, 5 and 10-year visas cost more)",
    processing: "Usually about 3 weeks after your biometrics appointment; priority options exist in many countries",
    howToApply:
      "Apply online on GOV.UK, pay, then book a biometrics appointment at the visa application centre (usually VFS Global).",
    documents: [...COMMON_DOCS, "Evidence of ties at home: job, property, family, studies", "Previous UK and other visas, if any"],
    tips: [
      "A clear cover letter explaining purpose, who pays and your ties at home helps a borderline application.",
      "Declare every previous refusal from any country. Not disclosing one can lead to a 10-year ban.",
      "Don't put large unexplained deposits into your account just before applying.",
    ],
    official: [{ label: "GOV.UK: Standard Visitor visa", url: "https://www.gov.uk/standard-visitor" }],
    appliesTo: "Most African passports need a visa. Mauritius and Seychelles passport holders use the UK ETA instead.",
    money: "Show you can pay for the trip without working or public funds: usually 6 months of statements and payslips. There is no fixed minimum; what matters is that your income, savings and trip cost make sense together.",
    extension: "Generally no. Visitors can't switch or extend beyond 6 months except in narrow cases such as private medical treatment.",
    payment: "Paid online by card on GOV.UK when you apply. Priority services cost extra.",
  },
  us: {
    visaName: "US B1/B2 visitor visa",
    stay: "Set by the officer at the border, often up to 6 months",
    fee: "US$185 application fee. A separate 'visa integrity fee' was approved in 2025; check whether it is being charged when you apply.",
    processing: "Interview wait times vary a lot by embassy, from weeks to many months",
    howToApply:
      "Fill in the DS-160 form online, pay the fee, then book and attend an interview at the US embassy or consulate.",
    documents: ["DS-160 confirmation page", "Interview appointment letter", "Fee payment receipt", ...COMMON_DOCS.slice(0, 4)],
    tips: [
      "The interview matters most. Answer briefly and honestly about why you'll return home.",
      "Check the official wait-time tool before booking anything.",
      "Some countries currently pay a visa bond or face extra limits; check the embassy page for your country.",
    ],
    official: [
      { label: "US State Department: visitor visa", url: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html" },
      { label: "Visa appointment wait times", url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/global-visa-wait-times.html" },
    ],
    appliesTo: "All African passports need a visa for the US.",
    money: "There's no fixed amount. The officer judges whether your income, job and family ties mean you'll return. Bring recent bank statements, a job letter and payslips to the interview in case they ask.",
    extension: "Yes, sometimes: file Form I-539 with USCIS before your permitted stay ends. Approval isn't guaranteed.",
    payment: "Pay the application fee before booking your interview, using the payment methods listed for your country on the official appointment site.",
  },
  canada: {
    visaName: "Canada visitor visa (temporary resident visa)",
    stay: "Up to 6 months, decided at the border",
    fee: "CA$100 plus CA$85 for biometrics",
    processing: "Varies by country; check the official processing-times tool",
    howToApply: "Apply online through IRCC, then give biometrics at a visa application centre.",
    documents: [...COMMON_DOCS, "Purpose-of-travel letter", "Proof of ties: job, property, family"],
    tips: [
      "Upload clear, complete documents; missing items cause refusals.",
      "Previous travel to the US, UK or Schengen helps show you return home.",
    ],
    official: [{ label: "Government of Canada: visit Canada", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html" }],
    appliesTo: "Most African passports need a visitor visa. Some may qualify for an eTA if they had a Canadian visa in the last 10 years or hold a valid US visa; check eligibility.",
    money: "Upload recent bank statements, payslips or a job letter showing you can cover your stay. There's no single minimum; show funds that match your trip length and cost.",
    extension: "Yes: apply online for a visitor record at least 30 days before your status ends.",
    payment: "Paid online by card through your IRCC account, including the biometrics fee.",
  },
  uae: {
    visaName: "UAE tourist visa or visa on arrival (depends on passport)",
    stay: "Usually 30 or 60 days",
    fee: "Varies by visa type and who issues it",
    processing: "Often a few working days when applied through an airline, hotel or licensed agent",
    howToApply:
      "Some passports get a visa on arrival. Others apply before flying, often through Emirates, flydubai, Etihad or a hotel. Rules for some nationalities change often.",
    documents: ["Passport scan", "Photo", "Return ticket", "Hotel booking", "Bank statement (sometimes)"],
    tips: [
      "Book visas through your airline or the official ICP or GDRFA portals rather than social media agents.",
      "Nationality-specific restrictions have changed several times since 2023; check right before applying.",
    ],
    official: [
      { label: "UAE government: visas", url: "https://u.ae/en/information-and-services/visa-and-emirates-id" },
      { label: "ICP smart services", url: "https://icp.gov.ae/en/" },
    ],
    appliesTo: "Depends strongly on your passport. Check the official portal for yours.",
    money: "Some visa routes ask for a recent bank statement; airline and hotel sponsors usually ask for less. Have a statement ready just in case.",
    extension: "Many tourist visas can be extended once inside the UAE for a fee, through ICP or GDRFA. Check the rules for your visa type.",
    payment: "Paid online by card through the airline, hotel or official ICP/GDRFA portal that issues your visa.",
  },
};

export const GUIDE = {
  bestChance: [
    "Show strong ties to home: a job letter with approved leave, a business registration, property, or family who depend on you.",
    "Bank statements should show steady income over about 6 months. Sudden large deposits raise questions.",
    "Write a short cover letter: who you are, why you're going, who pays and when you return.",
    "Use flight and hotel reservations, not paid non-refundable tickets, until your visa is approved.",
    "Build travel history step by step: visit easier countries first. Old visas and stamps help, even expired ones.",
    "If you were refused before, say so honestly and explain what changed.",
  ],
  scams: [
    "No agent can guarantee an appointment, faster processing or approval. VFS Global says this itself.",
    "Pay fees only on official embassy or visa centre websites, never to a personal bank account.",
    "Be careful with WhatsApp or Instagram 'visa agents' who sell appointment slots.",
  ],
  easier: [
    "Rwanda and The Gambia let every African passport in without a visa (Africa Visa Openness Index 2025).",
    "Kenya, Ghana, Senegal and Sierra Leone have opened up more for African travelers. Check current rules before you go.",
    "Flights within Africa cost 30–50% more than similar routes elsewhere, so compare regional airlines and buses.",
  ],
};

export const passportBySlug = (s: string) => PASSPORTS.find((p) => p.slug === s);
export const destinationBySlug = (s: string) => DESTINATIONS.find((d) => d.slug === s);
export const passportByCode = (c: string) => PASSPORTS.find((p) => p.code === c.toUpperCase());
export const destinationByCode = (c: string) => DESTINATIONS.find((d) => d.code === c.toUpperCase());

/** Route slug like "nigeria-to-france". */
export function routeSlug(passportSlug: string, destSlug: string) {
  return `${passportSlug}-to-${destSlug}`;
}
export function parseRoute(slug: string) {
  const i = slug.indexOf("-to-");
  if (i < 0) return null;
  const p = passportBySlug(slug.slice(0, i));
  const d = destinationBySlug(slug.slice(i + 4));
  return p && d ? { passport: p, destination: d, rule: GROUP_RULES[d.group] } : null;
}

/** The routes we pre-build as pages (most searched by African travelers). */
export const TOP_ROUTES = PASSPORTS.filter((p) => ["NG", "GH", "KE", "ZA", "UG", "CM", "ET", "EG", "ZW", "SN"].includes(p.code))
  .flatMap((p) => DESTINATIONS.filter((d) => ["FR", "DE", "ES", "IT", "PT", "NL", "GB", "US", "CA", "AE"].includes(d.code)).map((d) => routeSlug(p.slug, d.slug)));

export const DOCUMENT_KEYS = [
  "bank", "employer", "business", "property", "history", "invite", "hotel", "flight", "insurance", "cover", "sponsor", "tax",
] as const;
export type DocumentKey = (typeof DOCUMENT_KEYS)[number];
export const DOCUMENT_LABELS: Record<DocumentKey, string> = {
  bank: "6 months of bank statements", employer: "Employer letter / approved leave", business: "Business registration",
  property: "Property or ties at home", history: "Previous travel or old visas", invite: "Invitation letter",
  hotel: "Hotel booking", flight: "Flight reservation", insurance: "Travel insurance", cover: "Cover letter",
  sponsor: "Sponsor letter", tax: "Tax records",
};
