// My map: where you've been, are going and dream of. Stats, stamps, badges and streaks.
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Modal, Pressable, Share, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CountryPicker } from "@/components/CountryPicker";
import { Badge, Between, Button, Card, Chip, Eyebrow, Field, H1, H2, H3, Hi, Muted, Progress, Row, Screen, Segments, Stat } from "@/components/ui";
import { WorldMap } from "@/components/WorldMap";
import { newId, useApp, useVisaRow, type PlaceStatus } from "@/lib/store";
import { badgesFor, travelStreak } from "@/shared/badges";
import { CONTINENTS, continentOf } from "@/shared/geo";
import { APP } from "@/shared/site";
import { flag, nameOf, visaLabel, type VisaCode } from "@/shared/world";
import { FONT, tone, useTheme, withAlpha } from "@/theme";

const STATUS: [PlaceStatus, string][] = [["been", "✅ Been"], ["going", "🧳 Going"], ["dream", "✨ Dream"]];

export default function MyMap() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { profile, places, tripDocs, upsertPlace, removePlace } = useApp();
  const row = useVisaRow(profile?.passport);
  const [mode, setMode] = useState<"travels" | "passport">("travels");
  const [picked, setPicked] = useState<string | null>(null);
  const [year, setYear] = useState("");

  const been = useMemo(() => Array.from(new Set(places.filter((p) => p.status === "been").map((p) => p.country))), [places]);
  const streak = travelStreak(places);
  const badges = badgesFor(places, tripDocs, streak);
  const pct = ((been.length / 195) * 100).toFixed(1);
  const statusColor = { been: t.go, going: t.ready, dream: t.crew };

  const colors = useMemo(() => {
    const m: Record<string, string> = {};
    if (mode === "travels") for (const s of ["dream", "going", "been"] as PlaceStatus[]) for (const p of places.filter((x) => x.status === s)) m[p.country] = statusColor[s];
    else { for (const [c, v] of Object.entries(row) as [string, VisaCode][]) m[c] = tone(t, visaLabel(v).tone); for (const c of been) m[c] = t.crew; }
    if (profile?.passport && !m[profile.passport]) m[profile.passport] = withAlpha(t.crew, 0.6);
    return m;
  }, [mode, places, row, been, profile?.passport, t]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!profile) return null;
  const existing = picked ? places.find((p) => p.country === picked) : undefined;
  const setStatus = (code: string, status: PlaceStatus) => upsertPlace({ id: existing?.id ?? newId(), country: code, status, start: status === "been" && /^\d{4}$/.test(year) ? `${year}-01-01` : existing?.start });
  const conts = Object.entries(CONTINENTS).map(([name, list]) => ({ name, n: been.filter((c) => continentOf(c) === name).length, of: list.length }));
  const share = () => Share.share({ message: `I've been to ${been.length} countries (${pct}% of the world) 🌍 ${been.map(flag).join("")}\nMapped on ${APP.name}.` });

  return (
    <Screen>
      <Eyebrow>My map</Eyebrow>
      <H1>{been.length ? <>You&apos;ve seen <Hi>{pct}%</Hi> of the world</> : <>Start your <Hi>map</Hi></>}</H1>
      <Row gap={10}>
        <Stat value={been.length} label="countries visited" color={t.go} />
        <Stat value={`${conts.filter((c) => c.n).length}/6`} label="continents" color={t.ready} />
        <Stat value={streak ? `🔥${streak}` : "—"} label={streak ? "years in a row" : "add years for streaks"} />
      </Row>
      <Segments items={[["travels", "🗺️ My travels"], ["passport", "🛂 Where I can go"]]} value={mode} onChange={setMode} />
      <Card style={{ padding: 10 }}>
        <WorldMap colors={colors} onPick={setPicked} />
        <Row gap={12} wrap style={{ paddingHorizontal: 6 }}>
          {(mode === "travels" ? [[t.go, "Been"], [t.ready, "Going"], [t.crew, "Dream"]] : [[t.go, "Visa-free"], [t.ready, "eVisa"], [t.stop, "Visa needed"], [t.crew, "Been"]]).map(([c, l]) => (
            <Row key={l} gap={5}><View style={{ width: 9, height: 9, borderRadius: 3, backgroundColor: c }} /><Muted style={{ fontSize: 12 }}>{l}</Muted></Row>
          ))}
        </Row>
      </Card>
      <Row gap={10}>
        <View style={{ flex: 1 }}><CountryPicker value={undefined} placeholder="＋ Add a country" onChange={setPicked} /></View>
        <Button label="Share" kind="soft" onPress={share} disabled={!been.length} />
      </Row>

      <H2>Continents</H2>
      <View style={{ gap: 10 }}>
        {conts.map((c) => (
          <View key={c.name} style={{ gap: 6 }}>
            <Between><Text style={{ fontFamily: FONT.bodySemi, color: t.ink }}>{c.name}</Text><Muted>{c.n}/{c.of}</Muted></Between>
            <Progress value={(c.n / c.of) * 100} />
          </View>
        ))}
      </View>

      {been.length > 0 && (
        <View style={{ gap: 12 }}>
          <H2>Passport stamps</H2>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {been.map((c, i) => {
              const col = [t.go, t.ready, t.stop, t.crew][i % 4];
              const p = places.find((x) => x.country === c && x.status === "been");
              return (
                <View key={c} style={{ width: "30%", aspectRatio: 1, borderRadius: 18, borderWidth: 2, borderStyle: "dashed", borderColor: col, alignItems: "center", justifyContent: "center", transform: [{ rotate: `${((i * 37) % 13) - 6}deg` }] }}>
                  <Text style={{ fontSize: 22 }}>{flag(c)}</Text>
                  <Text style={{ fontFamily: FONT.display, fontSize: 20, color: col }}>{c}</Text>
                  <Text style={{ fontFamily: FONT.mono, fontSize: 9, color: col }}>{p?.start?.slice(0, 4) ?? "ARRIVED"}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <H2>Badges · {badges.filter((b) => b.earned).length}/{badges.length}</H2>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {badges.map((b) => (
          <View key={b.id} style={{ width: "31%", borderRadius: 18, borderWidth: 1, borderColor: t.line, backgroundColor: t.surface, padding: 10, alignItems: "center", gap: 3, opacity: b.earned ? 1 : 0.38 }}>
            <Text style={{ fontSize: 26 }}>{b.emoji}</Text>
            <Text style={{ fontFamily: FONT.bodyBold, fontSize: 12, color: t.ink, textAlign: "center" }}>{b.name}</Text>
            <Text style={{ fontFamily: FONT.body, fontSize: 10.5, color: t.muted, textAlign: "center" }}>{b.how}{!b.earned && b.progress ? ` · ${b.progress}` : ""}</Text>
          </View>
        ))}
      </View>

      <Modal visible={!!picked} transparent animationType="slide" onRequestClose={() => setPicked(null)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)" }} onPress={() => setPicked(null)} />
        {picked && (
          <View style={{ backgroundColor: t.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20, paddingBottom: insets.bottom + 20, gap: 14, borderWidth: 1, borderColor: t.line }}>
            <View style={{ alignSelf: "center", width: 40, height: 5, borderRadius: 3, backgroundColor: t.lineStrong }} />
            <Between><H3>{flag(picked)}  {nameOf(picked)}</H3>{picked !== profile.passport && <Badge label={visaLabel(row[picked] as VisaCode).label} t={visaLabel(row[picked] as VisaCode).tone} />}</Between>
            <Row gap={8} wrap>
              {STATUS.map(([s, l]) => <Chip key={s} label={l} on={existing?.status === s} onPress={() => setStatus(picked, s)} />)}
              {existing && <Chip label="Remove" onPress={() => { removePlace(existing.id); setPicked(null); }} />}
            </Row>
            <Field label="Year you went (for streaks)" value={year} onChangeText={(v) => setYear(v.replace(/\D/g, "").slice(0, 4))} placeholder={existing?.start?.slice(0, 4) ?? String(new Date().getFullYear())} keyboardType="number-pad" />
            <Row gap={10}>
              <Button label="Plan a trip" kind="soft" small onPress={() => { const c = picked; setPicked(null); router.push(`/trip/new?country=${c}`); }} />
              <Button label="Country guide" kind="ghost" small onPress={() => { const c = picked; setPicked(null); router.push(`/country/${c}`); }} />
              <Button label="Done" small onPress={() => setPicked(null)} />
            </Row>
          </View>
        )}
      </Modal>
    </Screen>
  );
}
