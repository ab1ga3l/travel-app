import { Suspense } from "react";
import type { Metadata } from "next";
import { Discover } from "./Discover";

export const metadata: Metadata = { title: "Discover", description: "Countries and hidden gems that match your vibe, your passport and the season." };

export default function Page() {
  return (
    <Suspense fallback={<div className="muted">Loading…</div>}>
      <Discover />
    </Suspense>
  );
}
