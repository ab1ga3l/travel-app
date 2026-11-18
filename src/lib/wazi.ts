import "server-only";
// Wazi ("open, clear" in Swahili): the in-app travel assistant, on the Claude API with the SDK tool runner.
// Its tools read the app's own data, and live web search lets it check official sources for the latest rules.
import Anthropic from "@anthropic-ai/sdk";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { COUNTRIES, countryByCode } from "./countries";
import { EXTRAS } from "./countryExtras";
import { gemsFor } from "./gems";
import { APP, VIBES } from "./site";
import { AS_OF, DESTINATIONS, GROUP_RULES, GUIDE } from "./visa";
import { visaFor } from "./visaMatrix";
import { VISA_SOURCE, nameOf, visaLabel } from "./world";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const vibeIds = VIBES.map((v) => v.id) as [string, ...string[]];

const countryGuide = betaZodTool({
  name: "get_country_guide",
  description: "Get the app's guide for a country: best months, weather, currency, plugs, budgets, money tips, things to do by vibe, dos and don'ts, hidden gems, and notes on living there. Use ISO alpha-2 codes.",
  inputSchema: z.object({ country_code: z.string().length(2) }),
  run: async ({ country_code }) => {
    const c = countryByCode(country_code);
    if (!c) return `No in-app guide for ${country_code}. Use general knowledge carefully and web search for facts.`;
    return JSON.stringify({
      ...c, extras: EXTRAS[c.code], bestMonths: c.bestMonths.map((m) => MONTHS[m - 1]), okMonths: c.okMonths.map((m) => MONTHS[m - 1]),
      gems: gemsFor(c.code).map((g) => ({ name: g.name, area: g.area, kind: g.kind, quieterThan: g.alt, vibes: g.vibes, desc: g.desc, page: `${APP.url}/gems/${g.id}` })),
      page: `${APP.url}/discover/${c.slug}`, factsAsOf: AS_OF,
    });
  },
});

const findDestinations = betaZodTool({
  name: "find_destinations",
  description: "Suggest countries from the app's guides by month, vibe, region, comfortable daily budget and, if a passport is given, how easy entry is for that passport.",
  inputSchema: z.object({
    month: z.number().int().min(1).max(12).optional(),
    vibe: z.enum(vibeIds).optional(),
    region: z.enum(["africa", "asia", "europe"]).optional(),
    max_daily_budget_usd: z.number().positive().optional(),
    passport_code: z.string().length(2).optional(),
    easy_entry_only: z.boolean().optional().describe("Only visa-free, visa on arrival, eTA or eVisa"),
  }),
  run: async ({ month, vibe, region, max_daily_budget_usd, passport_code, easy_entry_only }) => {
    const out = COUNTRIES.filter((c) => !month || c.bestMonths.includes(month))
      .filter((c) => !region || c.region === region)
      .filter((c) => !vibe || (EXTRAS[c.code]?.vibes[vibe as keyof (typeof EXTRAS)[string]["vibes"]] ?? 0) >= 2)
      .filter((c) => !max_daily_budget_usd || c.dailyBudget[1] <= max_daily_budget_usd)
      .map((c) => {
        const v = passport_code ? visaLabel(visaFor(passport_code, c.code)) : null;
        return { code: c.code, name: c.name, comfortableDailyUSD: c.dailyBudget[1], tagline: EXTRAS[c.code]?.tagline, entry: v?.label, entryTone: v?.tone };
      })
      .filter((x) => !easy_entry_only || x.entryTone === "free" || x.entryTone === "easy");
    return JSON.stringify(out.length ? out : { note: "No match in the app's guides; widen the filters." });
  },
});

const visaInfo = betaZodTool({
  name: "get_visa_info",
  description: "Get the entry requirement for a passport and destination from the open Passport Index dataset, plus the app's detailed checklist (documents, proof of funds, fee, payment, extension, official links) when the destination is curated. Use ISO alpha-2 codes.",
  inputSchema: z.object({ passport_code: z.string().length(2), destination_code: z.string().length(2) }),
  run: async ({ passport_code, destination_code }) => {
    const status = visaFor(passport_code, destination_code);
    const d = DESTINATIONS.find((x) => x.code === destination_code.toUpperCase());
    return JSON.stringify({
      passport: nameOf(passport_code), destination: nameOf(destination_code),
      entry: visaLabel(status).label, dataset: `${VISA_SOURCE.name}, updated ${VISA_SOURCE.updated}`,
      details: d ? { ...GROUP_RULES[d.group], checked: AS_OF } : "No curated checklist; verify details with web search on official government sites.",
      page: `${APP.url}/visa/${passport_code.toLowerCase()}/${destination_code.toLowerCase()}`,
    });
  },
});

const playbook = betaZodTool({
  name: "get_visa_playbook",
  description: "The app's general advice for strong visa applications, avoiding visa scams, and easier trips for African passports.",
  inputSchema: z.object({}),
  run: async () => JSON.stringify(GUIDE),
});

function systemPrompt(profile?: TravelerContext) {
  const me = profile
    ? `\n\nThe traveller: ${profile.name || "unnamed"}, ${nameOf(profile.passport)} passport${profile.vibes?.length ? `, vibes: ${profile.vibes.join(", ")}` : ""}${profile.budget ? `, budget: ${profile.budget}` : ""}${profile.company ? `, travelling ${profile.company}` : ""}${profile.pace ? `, pace: ${profile.pace}` : ""}. Use their passport for visa answers unless they say otherwise.`
    : "";
  return `You are ${APP.assistant}, the travel companion inside ${APP.name}, an app built Africa-first for people whose passports make travel harder.
You help people choose where to go for their vibe, understand visas, prepare strong applications, budget, stay safe, find hidden gems, and think through moving abroad.

How you work:
- Use your tools for the app's country, gem and visa data. For anything that may have changed (fees, rules, processing times, new visas), use web search and prefer official government, embassy and immigration sites. Say where facts come from and when they were checked.
- Never invent fees, requirements or approval odds. If you can't confirm something, say so and point to the official site.
- You are not a lawyer or visa agent, and nobody can guarantee approval.
- Never help create false documents, fake bank statements, fake bookings or misleading applications. Offer honest ways to strengthen an application instead.
- Warn about scams: no agent can guarantee appointments or approval; pay fees only on official sites.
- Match the traveller's vibe: if they want clubbing, don't push hikes. Be warm, fun and concise: short paragraphs or tight bullet lists. Reply in the language they write in.
- When useful, link to app pages returned by your tools.${me}`;
}

export interface TravelerContext { name?: string; passport: string; vibes?: string[]; budget?: string; company?: string; pace?: string }
export type Turn = { role: "user" | "assistant"; content: string };

export async function askWazi(history: Turn[], profile?: TravelerContext): Promise<string> {
  const client = new Anthropic();
  const final = await client.beta.messages.toolRunner({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium" },
    system: systemPrompt(profile),
    tools: [countryGuide, findDestinations, visaInfo, playbook, { type: "web_search_20260209", name: "web_search", max_uses: 4 }],
    messages: history.map((m) => ({ role: m.role, content: m.content })),
    max_iterations: 8,
  });
  if (final.stop_reason === "refusal") return "I can't help with that one. Happy to help you plan a trip or prepare an honest, strong visa application.";
  const text = final.content.filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text").map((b) => b.text).join("").trim();
  return text || "Sorry, I couldn't put an answer together. Could you rephrase?";
}
