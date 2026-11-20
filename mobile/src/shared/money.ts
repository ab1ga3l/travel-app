// GENERATED from src/lib/money.ts by scripts/sync-shared.js. Do not edit here.
// Money in the traveller's own currency. Prices in the guides are stored in USD and shown
// converted with cached live rates (see getRates in geo.ts). People can pick any currency.
import { convert, currencyOf, fmtMoney } from "./geo";
import type { TripDoc } from "./tripTypes";

const NAMES: Record<string, string> = {
  KES: "Kenyan shilling", NGN: "Nigerian naira", GHS: "Ghanaian cedi", ZAR: "South African rand", UGX: "Ugandan shilling",
  TZS: "Tanzanian shilling", RWF: "Rwandan franc", ETB: "Ethiopian birr", EGP: "Egyptian pound", MAD: "Moroccan dirham",
  ZMW: "Zambian kwacha", MWK: "Malawian kwacha", MZN: "Mozambican metical", BWP: "Botswana pula", NAD: "Namibian dollar",
  XOF: "West African CFA franc", XAF: "Central African CFA franc", TND: "Tunisian dinar", DZD: "Algerian dinar", MUR: "Mauritian rupee",
  CDF: "Congolese franc", SLE: "Sierra Leonean leone", GMD: "Gambian dalasi", LRD: "Liberian dollar", CVE: "Cape Verdean escudo",
  SCR: "Seychellois rupee", AOA: "Angolan kwanza", USD: "US dollar", EUR: "Euro", GBP: "British pound", CAD: "Canadian dollar",
  AUD: "Australian dollar", AED: "UAE dirham", SAR: "Saudi riyal", QAR: "Qatari riyal", INR: "Indian rupee", CNY: "Chinese yuan",
  JPY: "Japanese yen", THB: "Thai baht", IDR: "Indonesian rupiah", MYR: "Malaysian ringgit", SGD: "Singapore dollar", TRY: "Turkish lira",
  CHF: "Swiss franc", SEK: "Swedish krona", NOK: "Norwegian krone", DKK: "Danish krone", BRL: "Brazilian real", MXN: "Mexican peso",
};
/** Currencies offered in pickers: African currencies first, then the most-used travel currencies. */
export const CURRENCIES = Object.keys(NAMES);
export const currencyName = (code: string) => NAMES[code] ?? code;

/** The traveller's currency: their choice, or the one where they live. */
export const currencyFor = (p: { currency?: string; home?: string; passport: string }) => p.currency ?? currencyOf(p.home ?? p.passport);

/** Rounds to a friendly number: 11,617 → 11,600; 87 → 87. */
export const nice = (n: number) => {
  if (n < 100) return Math.round(n);
  const step = 10 ** (Math.floor(Math.log10(n)) - 2);
  return Math.round(n / step) * step;
};

/** A USD amount shown in the traveller's currency; plain dollars until rates are available. */
export function fmtUsd(usd: number, cur: string, rates: Record<string, number> | null) {
  if (cur === "USD" || !rates) return fmtMoney(usd, "USD");
  const v = convert(usd, "USD", cur, rates);
  return v == null ? fmtMoney(usd, "USD") : fmtMoney(nice(v), cur);
}

/** Converts every amount in a trip to another currency. Returns null when rates aren't available. */
export function convertTrip(t: TripDoc, to: string, rates: Record<string, number> | null): TripDoc | null {
  if (to === t.currency) return t;
  if (!rates?.[t.currency] || !rates[to]) return null;
  const f = rates[to] / rates[t.currency];
  const m = (n: number) => Math.round(n * f);
  return {
    ...t,
    currency: to,
    budgetPerPerson: m(t.budgetPerPerson),
    items: t.items.map((i) => (i.cost ? { ...i, cost: m(i.cost) } : i)),
    pot: { ...t.pot, target: m(t.pot.target), contributions: t.pot.contributions.map((c) => ({ ...c, amount: m(c.amount) })), spends: t.pot.spends.map((s) => ({ ...s, amount: m(s.amount) })) },
    expenses: t.expenses.map((e) => ({ ...e, amount: m(e.amount), split: e.split === "equal" ? "equal" : Object.fromEntries(Object.entries(e.split).map(([k, v]) => [k, m(v)])) })),
    brief: t.brief ? { ...t.brief, budget: t.brief.budget.map((b) => ({ ...b, amount: m(b.amount) })) } : undefined,
  };
}
