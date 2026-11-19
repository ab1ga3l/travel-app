// Continents, currencies, local payment methods and emergency numbers.
// Emergency numbers checked Nov 2026; always confirm locally. Not a substitute for official sources.

const C = (s: string) => s.split(" ");
export const CONTINENTS: Record<string, string[]> = {
  Africa: C("DZ AO BJ BW BF BI CV CM CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW EH RE YT SH"),
  Asia: C("AF AM AZ BH BD BT BN KH CN GE HK IN ID IR IQ IL JP JO KZ KW KG LA LB MO MY MV MN MM NP KP OM PK PS PH QA SA SG KR LK SY TW TJ TH TL AE UZ VN YE IO"),
  Europe: C("AL AD AT BY BE BA BG HR CY CZ DK EE FI FR DE GR HU IS IE IT XK LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SE CH UA GB VA TR FO GI GG JE IM AX SJ"),
  "North America": C("AG BS BB BZ CA CR CU DM DO SV GD GT HT HN JM MX NI PA KN LC VC TT US PR GL BM KY TC VG VI AW CW SX BQ MS AI MQ GP BL MF PM"),
  "South America": C("AR BO BR CL CO EC GY PY PE SR UY VE FK GF"),
  Oceania: C("AU FJ KI MH FM NR NZ PW PG WS SB TO TV VU NC PF GU AS MP CK NU TK WF NF PN"),
};
export const continentOf = (code: string) => Object.entries(CONTINENTS).find(([, l]) => l.includes(code.toUpperCase()))?.[0] ?? null;

const EUR = C("AT BE HR CY EE FI FR DE GR IE IT LV LT LU MT NL PT SK SI ES AD MC SM VA ME XK");
const XOF = C("SN CI BJ BF ML NE TG GW");
const XAF = C("CM GA CG TD CF GQ");
const CUR: Record<string, string> = {
  KE: "KES", NG: "NGN", GH: "GHS", ZA: "ZAR", UG: "UGX", TZ: "TZS", RW: "RWF", ET: "ETB", EG: "EGP", MA: "MAD", ZW: "USD", ZM: "ZMW",
  MW: "MWK", MZ: "MZN", BW: "BWP", NA: "NAD", DZ: "DZD", TN: "TND", CD: "CDF", SD: "SDG", SO: "SOS", SL: "SLE", LR: "LRD", GM: "GMD",
  MU: "MUR", CV: "CVE", SC: "SCR", AO: "AOA", LY: "LYD", LS: "LSL", SZ: "SZL", BI: "BIF", DJ: "DJF", ER: "ERN", MG: "MGA", KM: "KMF",
  MR: "MRU", SS: "SSP", ST: "STN", GN: "GNF", GB: "GBP", US: "USD", CA: "CAD", AU: "AUD", NZ: "NZD", IN: "INR", PK: "PKR", BD: "BDT",
  PH: "PHP", AE: "AED", CN: "CNY", JP: "JPY", KR: "KRW", TH: "THB", ID: "IDR", VN: "VND", MY: "MYR", SG: "SGD", LK: "LKR", TR: "TRY",
  CZ: "CZK", CH: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", PL: "PLN", HU: "HUF", RO: "RON", BR: "BRL", MX: "MXN", SA: "SAR", QA: "QAR",
  IL: "ILS", JO: "JOD", NP: "NPR",
};
export const currencyOf = (code: string) => {
  const c = code.toUpperCase();
  if (EUR.includes(c)) return "EUR";
  if (XOF.includes(c)) return "XOF";
  if (XAF.includes(c)) return "XAF";
  return CUR[c] ?? "USD";
};

const PAY: Record<string, string[]> = {
  KE: ["M-Pesa", "Airtel Money", "Bank transfer"], TZ: ["M-Pesa", "Tigo Pesa", "Airtel Money"], UG: ["MTN MoMo", "Airtel Money"],
  RW: ["MTN MoMo", "Airtel Money"], GH: ["MTN MoMo", "Telecel Cash", "Bank transfer"], NG: ["Bank transfer", "OPay", "Card"],
  ZA: ["EFT", "SnapScan", "Card"], SN: ["Wave", "Orange Money"], CI: ["Wave", "Orange Money", "MTN MoMo"], CM: ["MTN MoMo", "Orange Money"],
  ZM: ["MTN MoMo", "Airtel Money"], ET: ["telebirr", "Bank transfer"], EG: ["InstaPay", "Bank transfer"], MA: ["Bank transfer", "Card"],
};
export const payMethodsOf = (code: string) => [...(PAY[code.toUpperCase()] ?? ["Bank transfer", "Card"]), "Cash"];

/** Police / ambulance / general. "112" works on many mobile networks even where the local number differs. */
export const EMERGENCY: Record<string, { police: string; ambulance: string; note?: string }> = {
  KE: { police: "999 / 112", ambulance: "999" }, TZ: { police: "112", ambulance: "112 / 114" }, RW: { police: "112", ambulance: "912" },
  UG: { police: "999 / 112", ambulance: "911" }, ET: { police: "991", ambulance: "907" }, EG: { police: "122", ambulance: "123", note: "Tourist police: 126" },
  MA: { police: "19 (112 from mobiles)", ambulance: "15" }, SN: { police: "17", ambulance: "15" }, GH: { police: "191 / 112", ambulance: "193" },
  NG: { police: "112 / 199", ambulance: "112" }, ZA: { police: "10111", ambulance: "10177 (112 from mobiles)" }, NA: { police: "10111", ambulance: "211111 (Windhoek)" },
  MU: { police: "999 / 112", ambulance: "114" }, CV: { police: "132", ambulance: "130" },
  TH: { police: "191", ambulance: "1669", note: "Tourist police: 1155" }, ID: { police: "110 / 112", ambulance: "118 / 119" }, VN: { police: "113", ambulance: "115" },
  MY: { police: "999", ambulance: "999" }, SG: { police: "999", ambulance: "995" }, PH: { police: "911", ambulance: "911" },
  JP: { police: "110", ambulance: "119" }, KR: { police: "112", ambulance: "119" }, IN: { police: "112", ambulance: "112 / 108" },
  LK: { police: "119", ambulance: "1990" }, AE: { police: "999", ambulance: "998" }, CN: { police: "110", ambulance: "120" },
  GB: { police: "999 / 112", ambulance: "999 / 112" }, TR: { police: "112", ambulance: "112" }, US: { police: "911", ambulance: "911" },
};
export const emergencyFor = (code: string) => EMERGENCY[code.toUpperCase()] ?? (CONTINENTS.Europe.includes(code.toUpperCase()) ? { police: "112", ambulance: "112", note: "112 works across the EU" } : { police: "112 (try from a mobile)", ambulance: "Ask your hotel for the local number" });

/** Live exchange rates (free, no key), cached on the device so the converter works offline. */
export async function getRates(): Promise<{ base: string; rates: Record<string, number>; at: string } | null> {
  const KEY = "tk-rates-v1";
  try {
    const cached = JSON.parse(localStorage.getItem(KEY) || "null");
    if (cached && Date.now() - Date.parse(cached.at) < 12 * 3600e3) return cached;
    const r = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!r.ok) throw new Error();
    const j = await r.json();
    const out = { base: "USD", rates: j.rates as Record<string, number>, at: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(out));
    return out;
  } catch {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
  }
}
export const convert = (amount: number, from: string, to: string, rates: Record<string, number>) =>
  rates[from] && rates[to] ? (amount / rates[from]) * rates[to] : null;
export const fmtMoney = (n: number, cur: string) => {
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency: cur, maximumFractionDigits: n >= 100 ? 0 : 2 }).format(n); }
  catch { return `${cur} ${Math.round(n).toLocaleString()}`; }
};
