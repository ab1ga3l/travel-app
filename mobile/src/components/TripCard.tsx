import { router } from "expo-router";
import { Text, View } from "react-native";
import { countryByCode } from "@/shared/countries";
import { daysUntil, potRaised, tripPhase, type TripDoc } from "@/shared/tripTypes";
import { nameOf } from "@/shared/world";
import { FONT, useTheme } from "@/theme";
import { Poster } from "./Poster";
import { Badge, Between, Card, Muted, Progress, Row } from "./ui";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const initials = (n: string) => n.split(/\s+/).map((x) => x[0]).join("").slice(0, 2).toUpperCase() || "?";

export function Avatars({ names, size = 30 }: { names: string[]; size?: number }) {
  const t = useTheme();
  return (
    <Row gap={0}>
      {names.slice(0, 5).map((n, i) => (
        <View key={i} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: t.crew, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: t.surface, marginLeft: i ? -8 : 0 }}>
          <Text style={{ fontFamily: FONT.display, fontSize: size * 0.36, color: "#0d0d0f" }}>{initials(n)}</Text>
        </View>
      ))}
    </Row>
  );
}

export function tripPill(t: TripDoc) {
  const phase = tripPhase(t), d = daysUntil(t.start);
  return phase === "now" ? "On the trip 🎉" : phase === "past" ? "Done ✓" : d != null ? `${d} days to go` : t.month ? `${MONTHS[t.month - 1]} · flexible` : "Planning";
}

export function TripCard({ t }: { t: TripDoc }) {
  const raised = potRaised(t);
  const pct = t.pot.target ? Math.min(100, Math.round((raised / t.pot.target) * 100)) : 0;
  return (
    <Card onPress={() => router.push(`/trip/${t.id}`)} style={{ padding: 0, overflow: "hidden", gap: 0 }}>
      <Poster code={t.country} seedKey={t.country + t.id.slice(0, 4)} region={countryByCode(t.country)?.region ?? "africa"} title={t.name} pill={tripPill(t)} height={130} style={{ borderRadius: 0 }} />
      <View style={{ padding: 16, gap: 10 }}>
        <Between><Muted>{nameOf(t.country)}{t.start ? ` · ${t.start}` : ""}</Muted><Avatars names={t.members.map((m) => m.name)} /></Between>
        {t.members.length > 1 && t.pot.target > 0 && (
          <View style={{ gap: 6 }}>
            <Between><Muted style={{ fontSize: 13 }}>💰 Pot</Muted><Muted style={{ fontSize: 13 }}>{pct}% · {t.currency} {raised.toLocaleString()} / {t.pot.target.toLocaleString()}</Muted></Between>
            <Progress value={pct} />
          </View>
        )}
        {t.proposals.length > 0 && <Badge label={`🗳️ ${t.proposals.length} to vote on`} t="lilac" />}
      </View>
    </Card>
  );
}
