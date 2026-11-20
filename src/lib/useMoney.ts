"use client";
import { useEffect, useState } from "react";
import { currencyOf, getRates } from "./geo";
import { fmtUsd } from "./money";
import { useApp } from "./store";

/** The traveller's currency and a formatter for USD guide prices. */
export function useMoney() {
  const { profile } = useApp();
  const cur = profile?.currency ?? currencyOf(profile?.home ?? profile?.passport ?? "US");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  useEffect(() => { getRates().then((r) => r && setRates(r.rates)); }, []);
  return { cur, rates, usd: (n: number) => fmtUsd(n, cur, rates) };
}
