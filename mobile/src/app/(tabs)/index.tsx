// Home: your passport's map, your trips, places that fit you, events and hidden gems.
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Poster } from "@/components/Poster";
import { TripCard } from "@/components/TripCard";
import { Badge, Between, Button, Card, Eyebrow, H1, H2, Hi, Muted, Row, Screen, tap } from "@/components/ui";
import { WorldMap } from "@/components/WorldMap";
import { useApp, useVisaRow } from "@/lib/store";
import { COUNTRIES } from "@/shared/countries";
import { matchScore } from "@/shared/match";
import { tripPhase } from "@/shared/tripTypes";
import { flag, nameOf, visaLabel, VISA_SOURCE, type VisaCode } from "@/shared/world";
import { FONT, tone, useTheme } from "@/theme";

const GROUPS = [
  { id: "free", title: "Visa-free", hint: "Just your passport", test: (v: VisaCode) => typeof v === "number" || v === "vf" },
  { id: "voa", title: "On arrival", hint: "Get it at the airport", test: (v: VisaCode) => v === "voa" },
  { id: "online", title: "eVisa", hint: "Apply online before you go", test: (v: VisaCode) => v === "ev" || v === "eta" },
  { id: "vr", title: "Visa needed", hint: "Apply at an embassy or visa centre", test: (v: VisaCode) => v === "vr" },
] as const;
type G = (typeof GROUPS)[number]["id"];
const ease = (v: VisaCode | undefined) => (v == null ? 1 : typeof v === "number" || v === "vf" || v === "voa" ? 3 : v === "eta" || v === "ev" ? 2 : v === "vr" ? 1 : 0);

export default function Home() {
  const t = useTheme();
  const { profile, tripDocs, places } = useApp();
  const row = useVisaRow(profile?.passport);

  const lists = useMemo(() => {
    const out: Record<G, { code: string; v: VisaCode }[]> = { free: [], voa: [], online: [], vr: [] };
    for (const [code, v] of Object.entries(row) as [string, VisaCode][]) {
      if (code === profile?.passport) continue;
      const g = GROUPS.find((x) => x.test(v));
      if (g) out[g.id].push({ code, v });
    }
    for (const k of Object.keys(out) as G[]) out[k].sort((a, b) => nameOf(a.code).localeCompare(nameOf(b.code)));
    return out;
  }, [row, profile?.passport]);

  const colors = useMemo(() => {
    const m: Record<string, string> = {};
    for (const [code, v] of Object.entries(row) as [string, VisaCode][]) m[code] = tone(t, visaLabel(v).tone);
    if (profile?.passport) m[profile.passport] = t.ink;
    return m;
  }, [row, profile?.passport, t]);

  const picks = useMemo(() => COUNTRIES.filter((c) => c.code !== profile?.passport)
    .map((c) => ({ c, s: matchScore(c, profile?.vibes ?? []) + ease(row[c.code] as VisaCode) * 12 + (c.region === "africa" ? 4 : 0) }))
    .sort((a, b) => b.s - a.s).slice(0, 10).map((x) => x.c), [profile, row]);

  if (!profile) return null;
  const active = tripDocs.filter((x) => tripPhase(x) !== "past").sort((a, b) => (a.start ?? "9").localeCompare(b.start ?? "9"));

  return (
    <Screen>
      <Between>
        <Eyebrow>Hey {profile.name.split(" ")[0] || "traveller"} {flag(profile.passport)}</Eyebrow>
        <Pressable onPress={() => { tap(); router.push("/profile"); }} hitSlop={10} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: t.surface2, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: t.line }}>
          <Text style={{ fontFamily: FONT.display, color: t.ink }}>{(profile.name || "?")[0].toUpperCase()}</Text>
        </Pressable>
      </Between>
      <H1>Where are we <Hi>going next?</Hi></H1>
      <Button label="＋ Plan a trip" onPress={() => router.push("/trip/new")} />

      {active[0] && <TripCard t={active[0]} />}

      <View style={{ gap: 10 }}>
        <Between>
          <H2>Where you can go</H2>
          <Muted style={{ fontSize: 13 }}><Text style={{ color: t.go, fontFamily: FONT.bodyBold }}>{lists.free.length + lists.voa.length}</Text> visa-free</Muted>
        </Between>
        <Card style={{ padding: 10 }}>
          <WorldMap colors={colors} onPick={(c) => router.push(`/country/${c}`)} />
          <Row gap={12} wrap style={{ paddingHorizontal: 6 }}>
            {[[t.go, "Visa-free"], [t.ready, "eVisa"], [t.stop, "Visa needed"], [t.ink, "Home"]].map(([c, l]) => (
              <Row key={l} gap={5}><View style={{ width: 9, height: 9, borderRadius: 3, backgroundColor: c }} /><Muted style={{ fontSize: 12 }}>{l}</Muted></Row>
            ))}
          </Row>
        </Card>
        <Muted style={{ fontSize: 12 }}>Tap a country for details. {VISA_SOURCE.name}, {VISA_SOURCE.updated}. Always confirm before you book.</Muted>
      </View>

      <View style={{ gap: 12 }}>
        <H2>Go now</H2>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 18 }} style={{ marginHorizontal: -18, paddingHorizontal: 18 }}>
          {picks.slice(0, 6).map((c) => {
            const v = visaLabel(row[c.code] as VisaCode);
            return (
              <Pressable key={c.code} onPress={() => { tap(); router.push(`/country/${c.code}`); }} style={{ width: 230 }}>
                <Poster code={c.code} region={c.region} title={c.name} pill={`$${c.dailyBudget[1]}/day`} height={190} sub={<Badge label={v.label} t={v.tone} onDark />} />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Screen>
  );
}
