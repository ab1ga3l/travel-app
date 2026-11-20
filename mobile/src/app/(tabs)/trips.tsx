import { router } from "expo-router";
import { View } from "react-native";
import { TripCard } from "@/components/TripCard";
import { Button, Empty, Eyebrow, H1, H2, Hi, Row, Screen } from "@/components/ui";
import { useApp } from "@/lib/store";
import { tripPhase, type TripDoc } from "@/shared/tripTypes";

export default function Trips() {
  const { tripDocs } = useApp();
  const groups: [string, TripDoc[]][] = [
    ["Happening now", tripDocs.filter((t) => tripPhase(t) === "now")],
    ["Coming up", tripDocs.filter((t) => tripPhase(t) === "upcoming").sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""))],
    ["Planning", tripDocs.filter((t) => tripPhase(t) === "planning")],
    ["Past trips", tripDocs.filter((t) => tripPhase(t) === "past")],
  ];
  return (
    <Screen>
      <Eyebrow>Your trips</Eyebrow>
      <H1>Let&apos;s <Hi>go.</Hi></H1>
      <Row gap={10}>
        <Button label="＋ New trip" onPress={() => router.push("/trip/new")} />
        <Button label="🔑 Join with code" kind="ghost" onPress={() => router.push("/join")} />
      </Row>
      {tripDocs.length === 0 ? (
        <Empty emoji="🧳" title="No trips yet." text="Plan one in a minute, or join your friends with their code." action={<Button label="Plan my first trip" onPress={() => router.push("/trip/new")} />} />
      ) : groups.filter(([, l]) => l.length).map(([title, l]) => (
        <View key={title} style={{ gap: 12 }}>
          <H2>{title}</H2>
          {l.map((t) => <TripCard key={t.id} t={t} />)}
        </View>
      ))}
    </Screen>
  );
}
