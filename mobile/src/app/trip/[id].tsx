// A trip's dashboard: Plan · Ready · Vote · Pot · Split · Safety · Crew.
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Poster } from "@/components/Poster";
import { tripPill } from "@/components/TripCard";
import { CrewTab } from "@/components/trip/CrewTab";
import { PlanTab } from "@/components/trip/PlanTab";
import { PotTab } from "@/components/trip/PotTab";
import { ReadyTab } from "@/components/trip/ReadyTab";
import { SafetyPanel } from "@/components/trip/SafetyPanel";
import { SplitTab } from "@/components/trip/SplitTab";
import { VoteTab } from "@/components/trip/VoteTab";
import { Empty, Row, Screen, Segments, Stat } from "@/components/ui";
import { useApp } from "@/lib/store";
import { countryByCode } from "@/shared/countries";
import { OCCASIONS } from "@/shared/site";
import { potRaised, READY_ITEMS, type TripDoc } from "@/shared/tripTypes";
import { nameOf } from "@/shared/world";
import { FONT } from "@/theme";
import { Text } from "react-native";

const TABS = [["plan", "🗓️ Plan"], ["ready", "✅ Ready"], ["vote", "🗳️ Vote"], ["pot", "💰 Pot"], ["split", "🧾 Split"], ["safety", "🛡️ Safety"], ["crew", "👥 Crew"]] as [Tab, string][];
type Tab = "plan" | "ready" | "vote" | "pot" | "split" | "safety" | "crew";

export default function TripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tripDocs, session, saveTrip } = useApp();
  const trip = tripDocs.find((x) => x.id === id);
  const [tab, setTab] = useState<Tab>("plan");
  const latest = useRef(tripDocs);
  useEffect(() => { latest.current = tripDocs; }, [tripDocs]);

  const update = useCallback(async (fn: (t: TripDoc) => TripDoc) => {
    const cur = latest.current.find((x) => x.id === id);
    if (!cur) return;
    const next = fn(cur);
    latest.current = latest.current.map((x) => (x.id === id ? next : x));
    await saveTrip(next);
  }, [id, saveTrip]);

  if (!trip) return <Screen header><Stack.Screen options={{ title: "Trip" }} /><Empty emoji="🧭" title="We can't find that trip." text="It may have been deleted, or it lives on another device." /></Screen>;

  const uid = session?.user.id;
  const me = trip.members.find((m) => uid && m.userId === uid) ?? trip.members.find((m) => m.role === "owner") ?? trip.members[0];
  const canManage = me.role === "owner" || me.role === "treasurer";
  const readyPct = Math.round((trip.members.reduce((a, m) => a + READY_ITEMS.filter((i) => trip.checklist[m.id]?.[i.id]).length, 0) / Math.max(1, trip.members.length * READY_ITEMS.length)) * 100);
  const occ = OCCASIONS.find((o) => o.id === trip.occasion);
  const props = { trip, me, canManage, update };

  return (
    <Screen header padBottom={60}>
      <Stack.Screen options={{ title: trip.name }} />
      <Poster code={trip.country} seedKey={trip.country + trip.id.slice(0, 4)} region={countryByCode(trip.country)?.region ?? "africa"} title={trip.name} pill={tripPill(trip)} height={190}
        sub={<Text style={{ fontFamily: FONT.bodyMedium, fontSize: 13.5, color: "rgba(244,241,234,0.85)" }}>{nameOf(trip.country)}{trip.start ? ` · ${trip.start}${trip.end ? ` → ${trip.end}` : ""}` : ""}{occ && occ.id !== "none" ? ` · ${occ.emoji} ${occ.label}` : ""}</Text>} />
      <Row gap={10}>
        <Stat value={trip.members.length} label="in the crew" />
        <Stat value={`${readyPct}%`} label="ready to fly" />
        <Stat value={trip.pot.target ? `${Math.round((potRaised(trip) / trip.pot.target) * 100)}%` : "—"} label="pot filled" />
      </Row>
      <View style={{ marginRight: -18 }}><Segments items={TABS} value={tab} onChange={setTab} /></View>
      {tab === "plan" && <PlanTab {...props} />}
      {tab === "ready" && <ReadyTab {...props} />}
      {tab === "vote" && <VoteTab {...props} />}
      {tab === "pot" && <PotTab {...props} />}
      {tab === "split" && <SplitTab {...props} />}
      {tab === "safety" && <SafetyPanel trip={trip} update={update} />}
      {tab === "crew" && <CrewTab {...props} />}
    </Screen>
  );
}
