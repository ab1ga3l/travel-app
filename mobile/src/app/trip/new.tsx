// New trip: describe it in your own words and Aviora builds the whole trip.
// "Fill it in myself" stays as a quiet option for people who know exactly what they want.
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { CountryPicker } from "@/components/CountryPicker";
import { DateField } from "@/components/DateField";
import { Button, Card, Eyebrow, Field, H1, Hi, Label, Muted, Row, Screen, tap } from "@/components/ui";
import { useApp } from "@/lib/store";
import { API_URL, apiReady } from "@/lib/supabase";
import { APP } from "@/shared/site";
import { buildTrip, type TripAnswers } from "@/shared/tripBuild";
import { tripFromPlan, tripFromText, type AiPlan } from "@/shared/tripText";
import { nameOf } from "@/shared/world";
import { FONT, R, useTheme } from "@/theme";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const EXAMPLES = [
  "My 25th birthday in Zanzibar with 4 girls in February. Beach, boat parties and good food, about KES 80,000 each.",
  "A cheap solo week somewhere visa-free in East Africa next month. I love hiking and coffee.",
  "Honeymoon for 7 nights in May, somewhere romantic with a pool villa, budget $3,000 each.",
];

export default function NewTrip() {
  const t = useTheme();
  const q = useLocalSearchParams<{ country?: string; month?: string; name?: string }>();
  const { profile, session, saveTrip } = useApp();
  const seed = q.country || q.name ? [q.name ? `A trip for ${q.name}` : "A trip", q.country ? `to ${nameOf(q.country)}` : "", q.month ? `in ${MONTHS[Number(q.month) - 1]}` : ""].filter(Boolean).join(" ") + ". " : "";
  const [text, setText] = useState(seed);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [manual, setManual] = useState(false);
  const [a, setA] = useState<TripAnswers>({ country: q.country?.toUpperCase() ?? "", vibes: profile?.vibes ?? [], occasion: "none", company: profile?.company ?? "friends", people: 2, budgetPerPerson: 0, currency: profile?.currency ?? "USD" });
  if (!profile) return null;

  const build = async () => {
    if (text.trim().length < 10) { setMsg("Tell Aviora a little more: where, when, who and your budget."); return; }
    setBusy(true); setMsg("");
    let trip = null;
    if (apiReady) {
      try {
        const r = await fetch(`${API_URL}/api/plan-trip`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, currency: profile.currency ?? "USD", passport: profile.passport, home: profile.home, vibes: profile.vibes, budget: profile.budget, pace: profile.pace }),
        });
        const j = await r.json().catch(() => ({}));
        if (r.ok && j.plan?.country_code) trip = tripFromPlan(j.plan as AiPlan, profile, session?.user.id);
      } catch { /* offline: fall back below */ }
    }
    if (!trip) trip = tripFromText(text, profile, session?.user.id);
    setBusy(false);
    if (!trip) { setMsg("Aviora is offline right now and couldn't spot a destination. Add a country or city, e.g. \"Zanzibar\"."); return; }
    await saveTrip(trip);
    router.replace(`/trip/${trip.id}`);
  };

  const createManual = async () => {
    if (!a.country) { setMsg("Pick a destination first."); return; }
    const trip = buildTrip(a, profile, session?.user.id);
    await saveTrip(trip);
    router.replace(`/trip/${trip.id}`);
  };

  if (manual) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Screen header>
          <Eyebrow>Fill it in yourself</Eyebrow>
          <H1>Set up <Hi>your trip</Hi></H1>
          <Card style={{ gap: 14 }}>
            <Field label="Trip name" value={a.name ?? ""} onChangeText={(name) => setA({ ...a, name })} placeholder="Zanzibar with the girls" maxLength={60} />
            <CountryPicker label="Destination" value={a.country || undefined} onChange={(country) => setA({ ...a, country })} />
            <Row gap={10}><DateField label="Start" value={a.start} onChange={(start) => setA({ ...a, start, end: a.end && a.end < start ? start : a.end })} /><DateField label="End" value={a.end} min={a.start} onChange={(end) => setA({ ...a, end })} /></Row>
            <Row gap={10}>
              <Field label="People" value={String(a.people)} onChangeText={(v) => setA({ ...a, people: Math.max(1, Number(v.replace(/\D/g, "")) || 1) })} keyboardType="number-pad" />
              <Field label={`Budget each (${a.currency})`} value={a.budgetPerPerson ? String(a.budgetPerPerson) : ""} onChangeText={(v) => setA({ ...a, budgetPerPerson: Number(v.replace(/\D/g, "")) || 0 })} keyboardType="number-pad" />
            </Row>
          </Card>
          {msg ? <Muted>{msg}</Muted> : null}
          <Row gap={10}><Button label="Back" kind="ghost" onPress={() => setManual(false)} /><Button label="Create trip" onPress={createManual} /></Row>
        </Screen>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen header padBottom={60}>
        <Eyebrow>New trip</Eyebrow>
        <H1>Tell {APP.assistant} about <Hi>your trip.</Hi></H1>
        <Muted>Where, when, who&apos;s coming, the occasion and your budget, in your own words. {APP.assistant} builds the whole trip: every day, costs, a budget, tips and what to pack.</Muted>
        <Card glow style={{ gap: 12 }}>
          <TextInput multiline value={text} onChangeText={setText} autoFocus maxLength={2000} editable={!busy}
            placeholder="e.g. My 25th birthday in Zanzibar with 4 girls in February. Beach, boat parties and good food, about KES 80,000 each."
            placeholderTextColor={t.muted}
            style={{ minHeight: 150, textAlignVertical: "top", backgroundColor: t.surface2, borderRadius: R.sm, borderWidth: 1, borderColor: t.line, color: t.ink, fontFamily: FONT.body, fontSize: 16, lineHeight: 23, padding: 14 }} />
          <Button label={busy ? `${APP.assistant} is building your trip…` : "✨ Build my trip"} onPress={build} disabled={busy} style={{ alignSelf: "stretch" }} />
          {busy && <Row gap={10} style={{ justifyContent: "center" }}><ActivityIndicator color={t.brandText} /><Muted>Planning days, costs and tips. This takes about 20 seconds.</Muted></Row>}
          {msg ? <Muted>{msg}</Muted> : null}
        </Card>
        {!text && (
          <View style={{ gap: 8 }}>
            <Label>Need an idea? Tap one</Label>
            {EXAMPLES.map((e) => (
              <Pressable key={e} onPress={() => { tap(); setText(e); }} style={{ borderRadius: R.sm, borderWidth: 1, borderColor: t.line, backgroundColor: t.surface, padding: 12 }}>
                <Text style={{ fontFamily: FONT.body, fontSize: 14, lineHeight: 20, color: t.ink }}>{e}</Text>
              </Pressable>
            ))}
          </View>
        )}
        <Row gap={10}>
          <Button label="🔑 Join a friend's trip" kind="ghost" small onPress={() => router.replace("/join")} />
          <Button label="Fill it in myself" kind="ghost" small onPress={() => setManual(true)} />
        </Row>
      </Screen>
    </KeyboardAvoidingView>
  );
}
