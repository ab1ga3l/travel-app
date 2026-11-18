import { Suspense } from "react";
import type { Metadata } from "next";
import { APP } from "@/lib/site";
import { WaziChat } from "./WaziChat";

export const metadata: Metadata = { title: `Ask ${APP.assistant}`, description: "Your AI travel companion for visas, budgets, vibes and hidden gems." };

export default function Page() {
  return <Suspense fallback={<div className="muted">Loading…</div>}><WaziChat /></Suspense>;
}
