import { Suspense } from "react";
import type { Metadata } from "next";
import { Community } from "./Community";

export const metadata: Metadata = { title: "Community", description: "Ask travellers with your passport, share visa wins, money tips, safety notes and hidden gems." };

export default function Page() {
  return <Suspense fallback={<div className="muted">Loading…</div>}><Community /></Suspense>;
}
