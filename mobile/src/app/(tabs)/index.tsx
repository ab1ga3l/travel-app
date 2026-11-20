// Home: your passport's map, your trips, places that fit you, events and hidden gems.
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Poster } from "@/components/Poster";
import { TripCard } from "@/components/TripCard";
import { Badge, Between, Body, Button, Card, Chip, Eyebrow, H1, H2, H3, Hi, Muted, Row, Screen, Segments, Stat, Strong, tap } from "@/components/ui";
import { WorldMap } from "@/components/WorldMap";
import { useApp, useVisaRow } from "@/lib/store";
import { COUNTRIES } from "@/shared/countries";
import { EVENTS } from "@/shared/events";
import { GEMS } from "@/shared/gems";
import { continentOf } from "@/shared/geo";
import { tagsFor } from "@/shared/interestTags";
import { matchScore } from "@/shared/match";
import { APP, pickInfo } from "@/shared/site";
import { tripPhase } from "@/shared/tripTypes";
import { flag, nameOf, visaLabel, VISA_SOURCE, type VisaCode } from "@/shared/world";
import { FONT, tone, useTheme } from "@/theme";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
  const [group, setGroup] = useState<G>("free");
  const [africa, setAfrica] = useState(true);
  const nick = profile?.assistantNickname || APP.assistant;

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
    if (profile?.passport) m[profile.passport] = t.crew;
    return m;
  }, [row, profile?.passport, t]);

  const picks = useMemo(() => COUNTRIES.filter((c) => c.code !== profile?.passport)
    .map((c) => ({ c, s: matchScore(c, profile?.vibes ?? []) + ease(row[c.code] as VisaCode) * 12 + (c.region === "africa" ? 4 : 0) }))
    .sort((a, b) => b.s - a.s).slice(0, 10).map((x) => x.c), [profile, row]);
  const gems = useMemo(() => GEMS.filter((g) => g.kind === "hidden" && (!profile?.vibes.length || g.vibes.some((v) => profile.vibes.includes(v)))).slice(0, 10), [profile]);
  const events = useMemo(() => {
    const tags = tagsFor(profile?.interests), now = new Date().getMonth() + 1;
    const soon = (m: number[]) => Math.min(...m.map((x) => (x - now + 12) % 12));
    return EVENTS.filter((e) => !tags.length || e.tags.some((x) => tags.includes(x))).sort((a, b) => soon(a.months) - soon(b.months)).slice(0, 8);
  }, [profile?.interests]);

  if (!profile) return null;
  const active = tripDocs.filter((x) => tripPhase(x) !== "past").sort((a, b) => (a.start ?? "9").localeCompare(b.start ?? "9"));
  const shown = lists[group].filter((x) => !africa || continentOf(x.code) === "Africa");

  return (
    <Screen>
      <Between>
        <Eyebrow>Hey {profile.name || "traveller"} {flag(profile.passport)}</Eyebrow>
        <Pressable onPress={() => { tap(); router.push("/profile"); }} hitSlop={10} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: t.surface2, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: t.line }}>
          <Text style={{ fontFamily: FONT.display, color: t.ink }}>{(profile.name || "?")[0].toUpperCase()}</Text>
        </Pressable>
      </Between>
      <H1>Where are we <Hi>going next?</Hi></H1>
      <Row gap={6} wrap>{(profile.picks ?? profile.vibes).slice(0, 4).map((v) => <Badge key={v} label={`${pickInfo(v).emoji} ${pickInfo(v).label}`} t="lilac" />)}</Row>
      <Row gap={10}>
        <Button label="＋ Plan a trip" onPress={() => router.push("/trip/new")} />
        <Button label={`✨ Ask ${nick}`} kind="ghost" onPress={() => router.push("/ask")} />
      </Row>

      <Row gap={10}>
        <Stat value={lists.free.length + lists.voa.length} label={`countries visa-free or on arrival`} color={t.go} />
        <Stat value={lists.online.length} label="more with an eVisa" color={t.ready} />
        <Stat value={places.filter((p) => p.status === "been").length} label="on your map" onPress={() => router.push("/map")} />
      </Row>

      {active.length > 0 && (
        <View style={{ gap: 12 }}>
          <Between><H2>Coming up</H2><Button label="All trips" kind="ghost" small onPress={() => router.push("/trips")} /></Between>
          {active.slice(0, 2).map((x) => <TripCard key={x.id} t={x} />)}
        </View>
      )}

      <View style={{ gap: 12 }}>
        <Eyebrow>{flag(profile.passport)} Your passport</Eyebrow>
        <H2>Where you can go</H2>
        <Card style={{ padding: 10 }}>
          <WorldMap colors={colors} onPick={(c) => router.push(`/country/${c}`)} />
          <Row gap={12} wrap style={{ paddingHorizontal: 6 }}>
            {[[t.go, "Visa-free / on arrival"], [t.ready, "eVisa"], [t.stop, "Visa needed"], [t.crew, "Home"]].map(([c, l]) => (
              <Row key={l} gap={5}><View style={{ width: 9, height: 9, borderRadius: 3, backgroundColor: c }} /><Muted style={{ fontSize: 12 }}>{l}</Muted></Row>
            ))}
          </Row>
        </Card>
        <Segments items={GROUPS.map((g) => [g.id, `${g.title} · ${lists[g.id].length}`] as [G, string])} value={group} onChange={setGroup} />
        <Row gap={8}><Chip label="🌍 Africa" on={africa} onPress={() => setAfrica(true)} /><Chip label="Whole world" on={!africa} onPress={() => setAfrica(false)} /></Row>
        <Card style={{ gap: 0, paddingVertical: 6 }}>
          <Muted style={{ paddingVertical: 8 }}>{GROUPS.find((g) => g.id === group)?.hint}</Muted>
          {shown.length === 0 ? <Muted style={{ paddingVertical: 10 }}>None here.</Muted> : shown.map((x, i) => (
            <Pressable key={x.code} onPress={() => { tap(); router.push(`/country/${x.code}`); }} style={({ pressed }) => ({ paddingVertical: 11, borderTopWidth: i ? 1 : 0, borderTopColor: t.line, opacity: pressed ? 0.6 : 1 })}>
              <Between><Body>{flag(x.code)}  {nameOf(x.code)}</Body><Muted style={{ fontSize: 13 }}>{typeof x.v === "number" ? `${x.v} days` : "›"}</Muted></Between>
            </Pressable>
          ))}
        </Card>
        <Muted style={{ fontSize: 12 }}>Data: {VISA_SOURCE.name}, updated {VISA_SOURCE.updated}. Always confirm with the official source before you book.</Muted>
      </View>

      <View style={{ gap: 12 }}>
        <Eyebrow>Picked for your vibe and passport</Eyebrow>
        <H2>Go now</H2>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 18 }} style={{ marginHorizontal: -18, paddingHorizontal: 18 }}>
          {picks.map((c) => {
            const v = visaLabel(row[c.code] as VisaCode);
            return (
              <Pressable key={c.code} onPress={() => { tap(); router.push(`/country/${c.code}`); }} style={{ width: 230 }}>
                <Poster code={c.code} region={c.region} title={c.name} pill={`$${c.dailyBudget[1]}/day`} height={190} sub={<Badge label={v.label} t={v.tone} onDark />} />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {events.length > 0 && (
        <View style={{ gap: 12 }}>
          <Eyebrow>For your interests</Eyebrow>
          <H2>Festivals & events</H2>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 18 }} style={{ marginHorizontal: -18, paddingHorizontal: 18 }}>
            {events.map((e) => (
              <Card key={e.name} style={{ width: 240, gap: 6 }} onPress={() => router.push(`/trip/new?country=${e.country}&month=${e.months[0]}&occasion=festival&name=${encodeURIComponent(e.name)}`)}>
                <Text style={{ fontSize: 26 }}>{flag(e.country)}</Text>
                <H3 numberOfLines={1}>{e.name}</H3>
                <Muted style={{ fontSize: 13 }}>{e.city} · {e.months.map((m) => MONTHS[m - 1]).join(", ")}</Muted>
                <Muted numberOfLines={3} style={{ fontSize: 13 }}>{e.blurb}</Muted>
                <Strong style={{ color: t.brandText, fontSize: 13 }}>Plan a trip around it →</Strong>
              </Card>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={{ gap: 12 }}>
        <Eyebrow>Worth it?</Eyebrow>
        <H2>Hidden gems for you</H2>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 18 }} style={{ marginHorizontal: -18, paddingHorizontal: 18 }}>
          {gems.map((g) => (
            <Pressable key={g.id} onPress={() => { tap(); router.push(`/country/${g.c}`); }} style={{ width: 240 }}>
              <Poster code={g.c} seedKey={g.id} region={COUNTRIES.find((c) => c.code === g.c)?.region ?? "africa"} title={g.name} pill="💎 Hidden gem" height={170}
                sub={<Text style={{ fontFamily: FONT.bodyMedium, fontSize: 12.5, color: "rgba(244,241,234,0.8)" }} numberOfLines={1}>{g.area} · {nameOf(g.c)}</Text>} />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Row gap={10}>
        <Card style={{ flex: 1, gap: 6 }} onPress={() => router.push("/safety")}><Text style={{ fontSize: 24 }}>🛡️</Text><Strong>Safety check-in</Strong><Muted style={{ fontSize: 13 }}>One tap: &quot;I arrived safely&quot;.</Muted></Card>
        <Card style={{ flex: 1, gap: 6 }} onPress={() => router.push("/join")}><Text style={{ fontSize: 24 }}>🔑</Text><Strong>Got a code?</Strong><Muted style={{ fontSize: 13 }}>Join a friend&apos;s trip.</Muted></Card>
      </Row>
    </Screen>
  );
}
