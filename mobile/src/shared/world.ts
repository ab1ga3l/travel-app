// GENERATED from src/lib/world.ts by scripts/sync-shared.js. Do not edit here.
// Country names and codes for every country (ISO 3166). Safe to use on the client.
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

export interface WorldCountry {
  code: string; // ISO alpha-2, upper case
  name: string;
  numeric: string; // ISO numeric, used by the world map
}

const SHORT: Record<string, string> = {
  US: "United States", GB: "United Kingdom", RU: "Russia", KR: "South Korea", KP: "North Korea", IR: "Iran",
  VN: "Vietnam", LA: "Laos", SY: "Syria", TZ: "Tanzania", BO: "Bolivia", VE: "Venezuela", MD: "Moldova",
  CD: "DR Congo", CG: "Congo", CZ: "Czechia", TR: "Türkiye", PS: "Palestine", FM: "Micronesia", BN: "Brunei",
  TW: "Taiwan", CI: "Côte d'Ivoire", CV: "Cape Verde", SZ: "Eswatini", MK: "North Macedonia", VA: "Vatican City",
};

export const WORLD: WorldCountry[] = Object.keys(countries.getAlpha2Codes())
  .map((code) => ({
    code,
    name: SHORT[code] ?? (countries.getName(code, "en", { select: "official" }) as string) ?? code,
    numeric: countries.alpha2ToNumeric(code) ?? "",
  }))
  .filter((c) => c.name && c.numeric)
  .sort((a, b) => a.name.localeCompare(b.name));

export const nameOf = (code: string) => WORLD.find((c) => c.code === code.toUpperCase())?.name ?? code.toUpperCase();
export const codeFromNumeric = (n: string | number) => countries.numericToAlpha2(String(n).padStart(3, "0")) ?? null;

export const flag = (code: string) =>
  /^[A-Za-z]{2}$/.test(code) ? String.fromCodePoint(...[...code.toUpperCase()].map((x) => 127397 + x.charCodeAt(0))) : "🌍";

/** Visa status codes used across the app (from the open Passport Index dataset). */
export type VisaCode = number | "vf" | "voa" | "eta" | "ev" | "vr" | "na";

export function visaLabel(v: VisaCode | undefined | null): { label: string; tone: "free" | "easy" | "hard" | "none" | "unknown" } {
  if (v == null) return { label: "Check rules", tone: "unknown" };
  if (typeof v === "number") return { label: `Visa-free · ${v} days`, tone: "free" };
  switch (v) {
    case "vf": return { label: "Visa-free", tone: "free" };
    case "voa": return { label: "Visa on arrival", tone: "free" };
    case "eta": return { label: "Online travel authorisation", tone: "easy" };
    case "ev": return { label: "eVisa online", tone: "easy" };
    case "vr": return { label: "Visa required", tone: "hard" };
    case "na": return { label: "Entry not permitted", tone: "none" };
  }
}

export const VISA_SOURCE = {
  name: "Passport Index open dataset",
  url: "https://github.com/imorte/passport-index-data",
  updated: "17 Feb 2026",
};
