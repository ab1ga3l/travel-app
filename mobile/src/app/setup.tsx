// Step 3: about you → your vibe → how you travel → your assistant.
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CountryPicker } from "@/components/CountryPicker";
import { CurrencyPicker } from "@/components/CurrencyPicker";
import { Button, Chip, Eyebrow, Field, H1, Hi, Label, Muted, Progress, Row, Screen, Tile } from "@/components/ui";
import { currencyOf } from "@/shared/geo";
import { VIBE_PICKS, fromPicks } from "@/shared/site";
import { flag, nameOf } from "@/shared/world";
import { useApp, type Profile } from "@/lib/store";
import { useTheme } from "@/theme";

const STEPS = ["About you", "Your vibe", "How you travel"];

export default function Setup() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { profile, saveProfile, session } = useApp();
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Profile>(profile ?? { name: "", passport: "KE", vibes: [], interests: [], picks: [], budget: "comfy", company: "friends", pace: "balanced", assistantStyle: "warm" });
  const [abroad, setAbroad] = useState(!!profile?.home && profile.home !== profile.passport);
  const picks = p.picks ?? [];
  const home = abroad ? p.home ?? "GB" : p.passport;
  const currency = p.currency ?? currencyOf(home);
  const can = step === 0 ? p.name.trim().length > 0 : step === 1 ? picks.length > 0 : true;
  const toggle = (id: string) => setP({ ...p, picks: picks.includes(id) ? picks.filter((x) => x !== id) : [...picks, id] });

  const finish = () => {
    saveProfile({ ...p, ...fromPicks(picks), home, currency, onboarded: true, assistantNickname: undefined });
    setTimeout(() => router.push("/trip/new"), 50);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen padBottom={130}>
        <View style={{ gap: 10 }}>
          <Eyebrow>Step {step + 1} of {STEPS.length} · {STEPS[step]}</Eyebrow>
          <Progress value={((step + 1) / STEPS.length) * 100} />
        </View>

        {step === 0 && (
          <View style={{ gap: 18 }}>
            <H1>Who&apos;s <Hi>travelling?</Hi></H1>
            {session?.user.phone || session?.user.email ? <Muted>Signed in as {session.user.phone ? `+${session.user.phone}` : session.user.email}</Muted> : null}
            <Field label="Your full name" value={p.name} onChangeText={(name) => setP({ ...p, name })} placeholder="e.g. Amina Wanjiru" autoComplete="name" textContentType="name" autoCapitalize="words" maxLength={60} />
            <CountryPicker label="Where are you from? (your passport)" value={p.passport} onChange={(passport) => setP({ ...p, passport, currency: undefined })} />
            <View style={{ gap: 8 }}>
              <Label>Where do you live now?</Label>
              <Row gap={8} wrap>
                <Chip label={`${flag(p.passport)} ${nameOf(p.passport)}`} on={!abroad} onPress={() => setAbroad(false)} />
                <Chip label="🌍 Somewhere else" on={abroad} onPress={() => setAbroad(true)} />
              </Row>
              {abroad && <CountryPicker value={p.home ?? "GB"} onChange={(h) => setP({ ...p, home: h, currency: undefined })} />}
            </View>
            <CurrencyPicker label="Your currency" value={currency} onChange={(c) => setP({ ...p, currency: c })} hint="Set from where you live. Prices and budgets show in this." />
          </View>
        )}

        {step === 1 && (
          <View style={{ gap: 14 }}>
            <H1>What&apos;s your <Hi>vibe?</Hi></H1>
            <Muted>Pick everything that sounds like you. The more you pick, the better we can match places to you.</Muted>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {VIBE_PICKS.map((v) => <Tile key={v.id} emoji={v.emoji} label={v.label} on={picks.includes(v.id)} onPress={() => toggle(v.id)} style={{ width: "31.6%", minHeight: 92 }} />)}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: 18 }}>
            <H1>How do you like to <Hi>travel?</Hi></H1>
            <Group label="Budget" value={p.budget} onChange={(budget) => setP({ ...p, budget: budget as Profile["budget"] })} options={[["backpacker", "🎒", "Backpacker"], ["comfy", "🛋️", "Comfy"], ["treat", "🥂", "Treat myself"]]} />
            <Group label="Usually with" value={p.company} onChange={(company) => setP({ ...p, company: company as Profile["company"] })} options={[["solo", "🧍🏾", "Solo"], ["couple", "💑", "Partner"], ["friends", "👯", "Friends"], ["family", "👨‍👩‍👧", "Family"]]} />
            <Group label="Pace" value={p.pace} onChange={(pace) => setP({ ...p, pace: pace as Profile["pace"] })} options={[["slow", "🐢", "Slow"], ["balanced", "⚖️", "Balanced"], ["packed", "⚡", "Pack it in"]]} />
          </View>
        )}

      </Screen>

      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 18, paddingTop: 12, paddingBottom: insets.bottom + 14, backgroundColor: t.glass, borderTopWidth: 1, borderTopColor: t.line }}>
        <Button label="Back" kind="ghost" disabled={step === 0} onPress={() => setStep(step - 1)} />
        {step < STEPS.length - 1 ? <Button label="Continue" disabled={!can} onPress={() => setStep(step + 1)} /> : <Button label="Plan my first trip →" onPress={finish} />}
      </View>
    </KeyboardAvoidingView>
  );
}

function Group({ label, value, options, onChange }: { label: string; value: string; options: [string, string, string][]; onChange: (v: string) => void }) {
  return (
    <View style={{ gap: 8 }}>
      <Label>{label}</Label>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {options.map(([v, e, l]) => <Tile key={v} emoji={e} label={l} on={value === v} onPress={() => onChange(v)} style={{ flex: 1, minHeight: 84 }} />)}
      </View>
    </View>
  );
}
