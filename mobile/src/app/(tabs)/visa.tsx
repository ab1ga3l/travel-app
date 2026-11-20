// Visa checker: any passport to any country, with deep guides for Schengen, UK, US, Canada and UAE.
import { router } from "expo-router";
import { useState } from "react";
import { Linking, View } from "react-native";
import { CountryPicker } from "@/components/CountryPicker";
import { Badge, Between, Body, Button, Card, Eyebrow, H1, H2, H3, Hi, Muted, Row, Screen, Strong } from "@/components/ui";
import { useApp, visaRow } from "@/lib/store";
import { DESTINATIONS, GROUP_RULES, GUIDE } from "@/shared/visa";
import { flag, nameOf, visaLabel, VISA_SOURCE, type VisaCode } from "@/shared/world";
import { useTheme } from "@/theme";

export default function Visa() {
  const t = useTheme();
  const { profile } = useApp();
  const [from, setFrom] = useState(profile?.passport ?? "KE");
  const [to, setTo] = useState<string | undefined>("FR");
  const v = to ? (visaRow(from)[to] as VisaCode | undefined) : undefined;
  const label = visaLabel(v);
  const deep = to ? DESTINATIONS.find((d) => d.code === to) : undefined;
  const rule = deep ? GROUP_RULES[deep.group] : undefined;
  const needsVisa = v === "vr" || v === "ev" || v === "eta";

  return (
    <Screen>
      <Eyebrow>Visa centre</Eyebrow>
      <H1>Know before <Hi>you go.</Hi></H1>
      <Card style={{ gap: 14 }}>
        <CountryPicker label="My passport" value={from} onChange={setFrom} />
        <CountryPicker label="Going to" value={to} onChange={setTo} />
      </Card>

      {to && to !== from && (
        <Card glow style={{ gap: 12 }}>
          <Between><H3>{flag(from)} → {flag(to)}  {nameOf(to)}</H3></Between>
          <Badge label={label.label} t={label.tone} />
          <Body>
            {label.tone === "free" ? `Good news: ${nameOf(from)} passport holders can visit ${nameOf(to)} without applying in advance${typeof v === "number" ? ` for up to ${v} days` : ""}. You'll still need a valid passport, a return ticket and proof of where you're staying.`
              : label.tone === "easy" ? `Apply online before you fly. Only use the official government site: fake visa sites charge several times the real fee.`
              : label.tone === "hard" ? `You need a visa before you travel. Start 2–3 months early, and use the checklist below.`
              : label.tone === "none" ? "Entry isn't currently permitted for this passport. Check the official site for exceptions." : "Check the rules with the embassy before you book."}
          </Body>
          <Muted style={{ fontSize: 12 }}>{VISA_SOURCE.name}, updated {VISA_SOURCE.updated}. Rules change: confirm with the embassy.</Muted>
          <Row gap={10}>
            <Button label="Plan a trip" small onPress={() => router.push(`/trip/new?country=${to}`)} />
            <Button label="Country guide" small kind="ghost" onPress={() => router.push(`/country/${to}`)} />
          </Row>
        </Card>
      )}

      {rule && needsVisa && (
        <View style={{ gap: 12 }}>
          <H2>{rule.visaName}</H2>
          <Card style={{ gap: 10 }}>
            {[["Stay", rule.stay], ["Fee", rule.fee], ["How you pay", rule.payment], ["Processing", rule.processing], ["Proof of money", rule.money], ["Extending", rule.extension]].map(([k, val]) => (
              <View key={k} style={{ gap: 2 }}><Strong style={{ fontSize: 13, color: t.muted }}>{k}</Strong><Body>{val}</Body></View>
            ))}
          </Card>
          <Card style={{ gap: 8 }}><Strong>How to apply</Strong><Body>{rule.howToApply}</Body></Card>
          <Card style={{ gap: 8 }}>
            <Strong>📄 Documents</Strong>
            {rule.documents.map((d) => <Body key={d}>☐  {d}</Body>)}
          </Card>
          <Card style={{ gap: 8 }}><Strong>💡 Tips</Strong>{rule.tips.map((d) => <Body key={d}>•  {d}</Body>)}</Card>
          <Card style={{ gap: 8 }}>
            <Strong>🔗 Official sites</Strong>
            {rule.official.map((o) => <Button key={o.url} label={`${o.label} ↗`} kind="ghost" small onPress={() => Linking.openURL(o.url)} />)}
          </Card>
        </View>
      )}

      <H2>Best chance of approval</H2>
      <Card style={{ gap: 8 }}>{GUIDE.bestChance.map((d) => <Body key={d}>✓  {d}</Body>)}</Card>
      <H2>Avoid scams</H2>
      <Card style={{ gap: 8 }}>{GUIDE.scams.map((d) => <Body key={d}>🚩  {d}</Body>)}</Card>
    </Screen>
  );
}
