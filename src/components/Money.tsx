"use client";
// Money widgets for the website: USD guide prices shown in the traveller's currency, and a currency picker.
import { CURRENCIES, currencyName } from "@/lib/money";
import { useMoney } from "@/lib/useMoney";

export function Usd({ n, suffix = "" }: { n: number; suffix?: string }) {
  const { usd } = useMoney();
  return <>{usd(n)}{suffix}</>;
}

export function CurrencySelect({ id, value, onChange }: { id: string; value: string; onChange: (code: string) => void }) {
  const list = CURRENCIES.includes(value) ? CURRENCIES : [value, ...CURRENCIES];
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      {list.map((c) => <option key={c} value={c}>{c} · {currencyName(c)}</option>)}
    </select>
  );
}
