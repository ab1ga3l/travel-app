import { useState } from "react";
import { CountryPicker } from "@/components/CountryPicker";
import { SafetyPanel } from "@/components/trip/SafetyPanel";
import { Eyebrow, H1, Hi, Muted, Screen } from "@/components/ui";
import { useApp } from "@/lib/store";
import { tripPhase } from "@/shared/tripTypes";

export default function Safety() {
  const { profile, tripDocs } = useApp();
  const next = tripDocs.filter((t) => tripPhase(t) !== "past").sort((a, b) => (a.start ?? "9").localeCompare(b.start ?? "9"))[0];
  const [country, setCountry] = useState(next?.country ?? profile?.home ?? profile?.passport ?? "KE");
  return (
    <Screen header>
      <Eyebrow>Safety</Eyebrow>
      <H1>Travel brave. <Hi>Stay connected.</Hi></H1>
      <Muted>Built with solo women travellers in mind, useful for everyone. One tap tells someone you trust that you&apos;re safe.</Muted>
      <CountryPicker label="Where are you?" value={country} onChange={setCountry} />
      <SafetyPanel key={country} country={country} />
    </Screen>
  );
}
