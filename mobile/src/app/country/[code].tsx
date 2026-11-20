// Country guide: visa for your passport, when to go, money, things to do, gems, etiquette, living there.
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { Poster } from "@/components/Poster";
import { Badge, Between, Body, Button, Card, Empty, H2, H3, Muted, Row, Screen, Stat, Strong } from "@/components/ui";
import { useApp, useVisaRow } from "@/lib/store";
import { countryByCode } from "@/shared/countries";
import { EXTRAS } from "@/shared/countryExtras";
import { gemsFor } from "@/shared/gems";
import { vibeInfo } from "@/shared/site";
import { nameOf, visaLabel, type VisaCode } from "@/shared/world";
import { FONT, useTheme, withAlpha } from "@/theme";

const M = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function CountryScreen() {
  const t = useTheme();
  const { code = "" } = useLocalSearchParams<{ code: string }>();
  const cc = code.toUpperCase();
  const { profile } = useApp();
  const row = useVisaRow(profile?.passport);
  const c = countryByCode(cc);
  const ex = EXTRAS[cc];
  const v = visaLabel(row[cc] as VisaCode);
  const now = new Date().getMonth() + 1;

  if (!c) {
    return (
      <Screen header>
        <Stack.Screen options={{ title: nameOf(cc) }} />
        <Poster code={cc} region="africa" title={nameOf(cc)} height={160} />
        {profile && cc !== profile.passport && <Card style={{ gap: 8 }}><Strong>Visa for your {nameOf(profile.passport)} passport</Strong><Badge label={v.label} t={v.tone} /></Card>}
        <Empty emoji="🗺️" title="Full guide coming soon" text="We're writing guides Africa first. You can still plan a trip here." action={<Button label="Plan a trip" onPress={() => router.push(`/trip/new?country=${cc}`)} />} />
      </Screen>
    );
  }
  const gems = gemsFor(cc);
  return (
    <Screen header padBottom={60}>
      <Stack.Screen options={{ title: c.name }} />
      <Poster code={cc} region={c.region} title={c.name} pill={`$${c.dailyBudget[1]}/day`} height={200}
        sub={ex ? <Text style={{ fontFamily: FONT.body, fontSize: 13.5, color: "rgba(244,241,234,0.85)" }}>{ex.tagline}</Text> : undefined} />
      {profile && cc !== profile.passport && (
        <Card glow style={{ gap: 8 }}>
          <Between><Strong>Visa for your passport</Strong><Badge label={v.label} t={v.tone} /></Between>
          <Button label="Full visa checklist" kind="ghost" small onPress={() => router.push("/visa")} />
        </Card>
      )}
      <Row gap={10}><Button label="＋ Plan a trip here" onPress={() => router.push(`/trip/new?country=${cc}`)} /></Row>

      <H2>When to go</H2>
      <Card style={{ gap: 10 }}>
        <Row gap={4}>
          {M.map((m, i) => {
            const best = c.bestMonths.includes(i + 1), ok = c.okMonths.includes(i + 1);
            return (
              <View key={i} style={{ flex: 1, alignItems: "center", gap: 4 }}>
                <View style={{ width: "100%", height: 28, borderRadius: 6, backgroundColor: best ? t.go : ok ? withAlpha(t.ready, 0.7) : t.surface2, borderWidth: i + 1 === now ? 2 : 0, borderColor: t.ink }} />
                <Text style={{ fontFamily: FONT.mono, fontSize: 10, color: t.muted }}>{m}</Text>
              </View>
            );
          })}
        </Row>
        <Body>{c.weather}</Body>
      </Card>

      <H2>Money</H2>
      <Row gap={10}>
        <Stat value={`$${c.dailyBudget[0]}`} label="backpacker / day" />
        <Stat value={`$${c.dailyBudget[1]}`} label="comfy / day" color={t.go} />
        <Stat value={`$${c.dailyBudget[2]}`} label="treat / day" />
      </Row>
      <Card style={{ gap: 6 }}><Strong>💳 {c.currency}</Strong><Body>{c.moneyTip}</Body><Muted style={{ fontSize: 13 }}>🗣️ {c.languages} · 🔌 Plug type {c.plugs} · 🏛️ {c.capital}</Muted></Card>

      {ex && (
        <View style={{ gap: 12 }}>
          <H2>Things to do</H2>
          <Card style={{ gap: 10 }}>
            {ex.things.map((x) => <Row key={x.t} gap={10}><Text style={{ fontSize: 18 }}>{vibeInfo(x.v).emoji}</Text><Body style={{ flex: 1 }}>{x.t}</Body></Row>)}
          </Card>
        </View>
      )}

      {gems.length > 0 && (
        <View style={{ gap: 12 }}>
          <H2>💎 Hidden gems</H2>
          {gems.map((g) => (
            <Card key={g.id} style={{ gap: 6 }}>
              <Between><H3>{g.name}</H3><Badge label={g.kind === "hidden" ? "Hidden gem" : "Famous"} t={g.kind === "hidden" ? "lilac" : "unknown"} /></Between>
              <Muted style={{ fontSize: 13 }}>{g.area}{g.alt ? ` · quieter than ${g.alt}` : ""}</Muted>
              <Body>{g.desc}</Body>
              <Row gap={6} wrap>{g.feel.words.map((w) => <Badge key={w} label={w} />)}</Row>
            </Card>
          ))}
        </View>
      )}

      {ex && (
        <View style={{ gap: 12 }}>
          <H2>Do&apos;s and don&apos;ts</H2>
          <Card style={{ gap: 8 }}>
            {ex.dos.map((d) => <Body key={d}>👍🏾  {d}</Body>)}
            {ex.donts.map((d) => <Body key={d}>🙅🏾  {d}</Body>)}
          </Card>
          <H2>Could you live here?</H2>
          <Card style={{ gap: 8 }}>
            <Between><Strong>Typical monthly cost</Strong><Strong style={{ color: t.brandText }}>${ex.living.monthlyUSD.toLocaleString()}</Strong></Between>
            <Body>{ex.living.note}</Body>
            {ex.living.routes.map((r) => <Body key={r}>•  {r}</Body>)}
            <Muted style={{ fontSize: 12 }}>Routes are real programmes as of November 2026. Confirm on the official immigration site.</Muted>
          </Card>
        </View>
      )}
    </Screen>
  );
}
