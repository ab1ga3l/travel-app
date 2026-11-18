// "Ama", the Soft Passport travel agent. Runs on the Claude API with the SDK's tool runner.
// Tools read from the site's own curated data so answers stay grounded.
import Anthropic from "@anthropic-ai/sdk";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { COUNTRIES, countryByCode } from "./countries";
import { AS_OF, DESTINATIONS, GROUP_RULES, GUIDE, PASSPORTS } from "./visa";
import { SITE } from "./site";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getCountryGuide = betaZodTool({
  name: "get_country_guide",
  description:
    "Get Soft Passport's guide for one country: best months, weather, currency, languages, plugs, daily budget, money tips, highlights and a sample itinerary if one exists. Use ISO 3166 alpha-2 codes.",
  inputSchema: z.object({ country_code: z.string().length(2).describe("ISO alpha-2 code, e.g. KE for Kenya") }),
  run: async ({ country_code }) => {
    const c = countryByCode(country_code);
    if (!c) return `No Soft Passport guide for ${country_code} yet. Available: ${COUNTRIES.map((x) => x.code).join(", ")}.`;
    return JSON.stringify({
      ...c,
      bestMonths: c.bestMonths.map((m) => MONTHS[m - 1]),
      okMonths: c.okMonths.map((m) => MONTHS[m - 1]),
      dailyBudgetUSD: { backpacker: c.dailyBudget[0], comfortable: c.dailyBudget[1], treat: c.dailyBudget[2] },
      factsAsOf: AS_OF,
      page: `${SITE.url}/countries/${c.slug}`,
    });
  },
});

const findCountries = betaZodTool({
  name: "find_countries",
  description:
    "Find countries in Soft Passport's guides that are good to visit in a given month, optionally filtered by region and a maximum comfortable daily budget in USD.",
  inputSchema: z.object({
    month: z.number().int().min(1).max(12).describe("1 = January"),
    region: z.enum(["africa", "asia", "europe"]).optional(),
    max_daily_budget_usd: z.number().positive().optional(),
  }),
  run: async ({ month, region, max_daily_budget_usd }) => {
    const hits = COUNTRIES.filter((c) => c.bestMonths.includes(month))
      .filter((c) => !region || c.region === region)
      .filter((c) => !max_daily_budget_usd || c.dailyBudget[1] <= max_daily_budget_usd)
      .map((c) => ({ code: c.code, name: c.name, region: c.region, comfortableDailyUSD: c.dailyBudget[1], highlights: c.highlights.slice(0, 2) }));
    return JSON.stringify(hits.length ? hits : { note: "No guide matches; suggest widening the filters." });
  },
});

const getVisaRoute = betaZodTool({
  name: "get_visa_route",
  description:
    "Get Soft Passport's curated visa information for a destination (Schengen countries, UK, US, Canada, UAE): visa name, stay, fee, processing, how to apply, documents, tips and official links. For destinations not covered, it says so.",
  inputSchema: z.object({
    passport_code: z.string().length(2).describe("Traveler's passport, ISO alpha-2"),
    destination_code: z.string().length(2).describe("Destination, ISO alpha-2"),
  }),
  run: async ({ passport_code, destination_code }) => {
    const d = DESTINATIONS.find((x) => x.code === destination_code.toUpperCase());
    const p = PASSPORTS.find((x) => x.code === passport_code.toUpperCase());
    if (!d) {
      return JSON.stringify({
        covered: false,
        note: "Not in the curated list. Share general guidance only, say rules vary by passport, and point the traveler to the destination's official immigration website.",
      });
    }
    return JSON.stringify({ covered: true, passport: p?.name ?? passport_code, destination: d.name, asOf: AS_OF, ...GROUP_RULES[d.group] });
  },
});

const getVisaPlaybook = betaZodTool({
  name: "get_visa_playbook",
  description: "Get Soft Passport's general advice: how to give a visa application the best chance, how to avoid visa scams, and easier trips for African passports.",
  inputSchema: z.object({}),
  run: async () => JSON.stringify(GUIDE),
});

const SYSTEM = `You are ${SITE.agentName}, the travel assistant on ${SITE.name}, a travel platform built Africa-first.
You help people plan trips, understand visas and prepare strong applications, especially travelers with African passports, who face higher visa refusal rates.

How you work:
- Use your tools for country facts and visa details. Prefer the tools' data over memory, and mention the "as of" date for visa facts.
- For visa fees, rules and processing times you can't confirm from a tool, say you're not certain and point to the official government or embassy site. Never invent fees, requirements or approval odds.
- You are not a lawyer or a visa agent, and nobody can guarantee approval. Say so when someone asks for a guarantee.
- Never help create false documents, fake bank statements, fake bookings, fake invitation letters or anything meant to mislead an embassy. Offer honest ways to strengthen the application instead.
- Warn about scams: no agent can guarantee appointments or approvals, and fees go only through official sites.
- Be warm, practical and concise. Use short paragraphs or short bullet lists. Use the traveler's language if they write in one other than English.
- When it helps, link to Soft Passport pages from the tool results (country guide pages).`;

export type ChatTurn = { role: "user" | "assistant"; content: string };

export async function runAgent(history: ChatTurn[]): Promise<string> {
  const client = new Anthropic();
  const final = await client.beta.messages.toolRunner({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium" },
    system: SYSTEM,
    tools: [getCountryGuide, findCountries, getVisaRoute, getVisaPlaybook],
    messages: history.map((m) => ({ role: m.role, content: m.content })),
    max_iterations: 6,
  });

  if (final.stop_reason === "refusal") {
    return "I can't help with that one. I'm happy to help you plan a trip or prepare an honest, strong visa application.";
  }
  const text = final.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  return text || "Sorry, I couldn't put an answer together. Could you rephrase your question?";
}
