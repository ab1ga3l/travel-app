// New trip: "Guide me step by step" (questions or one paragraph), create manually, or just explore.
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CountryPicker } from "@/components/CountryPicker";
import { DateField } from "@/components/DateField";
import { Badge, Between, Body, Button, Card, Chip, Eyebrow, Field, H1, H3, Hi, Label, Muted, Progress, Row, Screen, Strong, Tile, tap } from "@/components/ui";
import { useApp, useVisaRow } from "@/lib/store";
import { API_URL } from "@/lib/supabase";
import { COUNTRIES } from "@/shared/countries";
import { matchScore } from "@/shared/match";
import { OCCASION_PICKS, OCCASIONS, VIBES, type Occasion, type Vibe } from "@/shared/site";
import { buildTrip, type TripAnswers } from "@/shared/tripBuild";
import { flag, nameOf, visaLabel, type VisaCode } from "@/shared/world";
import { FONT, R, useTheme, withAlpha } from "@/theme";

const STEPS = ["What", "Occasion", "Who", "Where", "When", "Budget", "Review"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const COMPANY: [TripAnswers["company"], string, string, number][] = [["solo", "🧍🏾", "Just me", 1], ["couple", "💑", "Me + partner", 2], ["friends", "👯", "Friends", 4], ["family", "👨‍👩‍👧", "Family", 4]];

export default function NewTrip() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const q = useLocalSearchParams<{ country?: string; month?: string; occasion?: string; name?: string }>();
  const { profile, session, saveTrip } = useApp();
  const row = useVisaRow(profile?.passport);
  const [mode, setMode] = useState<"choose" | "guide" | "manual">(q.country ? "guide" : "choose");
  const [step, setStep] = useState(q.country ? 4 : 0);
  const [a, setA] = useState<TripAnswers>({
    country: q.country?.toUpperCase() ?? "", vibes: profile?.vibes ?? [], occasion: (q.occasion as Occasion) || "none", name: q.name,
    company: profile?.company ?? "friends", people: profile?.company === "solo" ? 1 : profile?.company === "couple" ? 2 : 4,
    month: q.month ? Number(q.month) : undefined, budgetPerPerson: 0, currency: profile?.currency ?? "USD", friends: [],
  });
  const [flex, setFlex] = useState(!!q.month);
  const [text, setText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [msg, setMsg] = useState("");
  const [friend, setFriend] = useState("");

  const suggestions = useMemo(() => {
    const occ = OCCASION_PICKS[a.occasion]?.countries ?? [];
    const month = a.month ?? (a.start ? new Date(a.start).getMonth() + 1 : undefined);
    return COUNTRIES.filter((c) => c.code !== profile?.passport).map((c) => {
      const v = visaLabel(row[c.code] as VisaCode).tone;
      return { c, v, s: matchScore(c, a.vibes, month) + (v === "free" ? 25 : v === "easy" ? 12 : 0) + (occ.includes(c.code) ? 20 : 0) };
    }).sort((x, y) => y.s - x.s).slice(0, 6);
  }, [a.vibes, a.occasion, a.month, a.start, row, profile?.passport]);

  if (!profile) return null;
  const create = async () => {
    if (!a.country) { setMsg("Pick a destination first."); return; }
    const trip = buildTrip(a, profile, session?.user.id);
    await saveTrip(trip);
    router.replace(`/trip/${trip.id}`);
  };
  const parse = async () => {
    if (!API_URL) { setMsg("Describing your trip needs Aviora to be connected. Answer the questions instead."); return; }
    setParsing(true); setMsg("");
    try {
      const r = await fetch(`${API_URL}/api/plan-parse`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, currency: a.currency }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      const x = j.answers;
      setA((p) => ({ ...p, name: x.trip_name || p.name, country: /^[A-Z]{2}$/.test(x.country_code) ? x.country_code : p.country, vibes: x.vibes?.length ? x.vibes : p.vibes, occasion: x.occasion ?? p.occasion, company: x.company ?? p.company, people: x.people > 0 ? x.people : p.people, month: x.month > 0 ? x.month : p.month, start: x.start || p.start, end: x.end || p.end, budgetPerPerson: x.budget_per_person > 0 ? x.budget_per_person : p.budgetPerPerson }));
      if (x.month > 0) setFlex(true);
      setStep(STEPS.length - 1);
    } catch (e) { setMsg(e instanceof Error && e.message ? e.message : "Couldn't read that. Try the questions."); }
    finally { setParsing(false); }
  };

  if (mode === "choose") {
    return (
      <Screen header>
        <Eyebrow>Welcome, {profile.name || "traveller"} 👋🏾</Eyebrow>
        <H1>Where to <Hi>next?</Hi></H1>
        <Pressable onPress={() => { tap(); setMode("guide"); }} style={({ pressed }) => ({ backgroundColor: t.brand, borderRadius: 24, padding: 22, gap: 8, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
          <Text style={{ fontSize: 30 }}>✨</Text>
          <Text style={{ fontFamily: FONT.display, fontSize: 24, color: t.onBrand, letterSpacing: -0.6 }}>Guide me step by step</Text>
          <Text style={{ fontFamily: FONT.body, fontSize: 15, lineHeight: 21, color: t.onBrand }}>Answer a few quick questions, or just describe your dream trip. We&apos;ll build the first draft.</Text>
        </Pressable>
        <Card onPress={() => setMode("manual")}><Text style={{ fontSize: 26 }}>✍🏾</Text><H3>Create manually</H3><Muted>You know where and when. Just set it up.</Muted></Card>
        <Card onPress={() => router.replace("/explore")}><Text style={{ fontSize: 26 }}>🧭</Text><H3>Just exploring</H3><Muted>Browse places, gems and events first.</Muted></Card>
        <Button label="🔑 Got a code? Join a friend's trip" kind="ghost" onPress={() => router.replace("/join")} />
      </Screen>
    );
  }

  if (mode === "manual") {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Screen header>
          <Eyebrow>Create manually</Eyebrow>
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
          <Row gap={10}><Button label="Back" kind="ghost" onPress={() => setMode("choose")} /><Button label="Create trip" onPress={create} /></Row>
        </Screen>
      </KeyboardAvoidingView>
    );
  }

  const occ = OCCASION_PICKS[a.occasion];
  const canNext = step === 3 ? !!a.country : true;
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen header padBottom={130}>
        <View style={{ gap: 10 }}><Eyebrow>Step {step + 1} of {STEPS.length} · {STEPS[step]}</Eyebrow><Progress value={((step + 1) / STEPS.length) * 100} /></View>

        {step === 0 && (
          <View style={{ gap: 14 }}>
            <H1>What kind of <Hi>trip?</Hi></H1>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {VIBES.map((v) => <Tile key={v.id} emoji={v.emoji} label={v.label} on={a.vibes.includes(v.id)} onPress={() => setA({ ...a, vibes: a.vibes.includes(v.id) ? a.vibes.filter((x) => x !== v.id) : [...a.vibes, v.id as Vibe] })} style={{ width: "31.6%", minHeight: 88 }} />)}
            </View>
            <Card style={{ gap: 10, borderStyle: "dashed" }}>
              <Strong>Or just tell us ✍🏾</Strong>
              <TextInput multiline value={text} onChangeText={setText} placeholder="e.g. My 25th birthday in Zanzibar with 4 friends in February, around KES 60k each, beaches and parties" placeholderTextColor={t.muted}
                style={{ minHeight: 96, textAlignVertical: "top", backgroundColor: t.surface2, borderRadius: R.sm, borderWidth: 1, borderColor: t.line, color: t.ink, fontFamily: FONT.body, fontSize: 15, padding: 12 }} />
              <Button label="✨ Build it from this" kind="soft" small busy={parsing} disabled={text.trim().length < 10} onPress={parse} />
              {msg ? <Muted>{msg}</Muted> : null}
            </Card>
          </View>
        )}

        {step === 1 && (
          <View style={{ gap: 14 }}>
            <H1>Is it for <Hi>something special?</Hi></H1>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {OCCASIONS.map((o) => <Tile key={o.id} emoji={o.emoji} label={o.label} on={a.occasion === o.id} onPress={() => setA({ ...a, occasion: o.id })} style={{ width: "31.6%", minHeight: 88 }} />)}
            </View>
            {occ && <Card style={{ gap: 6 }}><Strong>💡 Tip</Strong><Body>{occ.tip}</Body></Card>}
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: 14 }}>
            <H1>Who&apos;s <Hi>coming?</Hi></H1>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {COMPANY.map(([c, e, l, n]) => <Tile key={c} emoji={e} label={l} on={a.company === c} onPress={() => setA({ ...a, company: c, people: c === "solo" ? 1 : c === "couple" ? 2 : Math.max(a.people, n) })} style={{ flex: 1, minHeight: 88 }} />)}
            </View>
            {(a.company === "friends" || a.company === "family") && (
              <Card style={{ gap: 10 }}>
                <Field label="How many people, including you?" value={String(a.people)} onChangeText={(v) => setA({ ...a, people: Math.max(1, Number(v.replace(/\D/g, "")) || 1) })} keyboardType="number-pad" />
                <Row gap={8}><View style={{ flex: 1 }}><Field label="Add friends by name (optional)" value={friend} onChangeText={setFriend} placeholder="Wanjiru" onSubmitEditing={() => { if (friend.trim()) { setA({ ...a, friends: [...(a.friends ?? []), friend.trim()] }); setFriend(""); } }} /></View></Row>
                <Row gap={6} wrap>{(a.friends ?? []).map((f, i) => <Chip key={i} label={`${f} ✕`} onPress={() => setA({ ...a, friends: (a.friends ?? []).filter((_, j) => j !== i) })} />)}</Row>
                <Muted style={{ fontSize: 13 }}>You&apos;ll also get an invite code to share on WhatsApp.</Muted>
              </Card>
            )}
          </View>
        )}

        {step === 3 && (
          <View style={{ gap: 14 }}>
            <H1>Where <Hi>to?</Hi></H1>
            <Muted>Picked for your vibe, {a.occasion !== "none" ? "the occasion, " : ""}and how easy the visa is with your {nameOf(profile.passport)} passport.</Muted>
            {suggestions.map(({ c, v }) => (
              <Pressable key={c.code} onPress={() => { tap(); setA({ ...a, country: c.code }); }}
                style={{ borderRadius: R.md, borderWidth: 1.5, borderColor: a.country === c.code ? t.brandText : t.line, backgroundColor: a.country === c.code ? withAlpha(t.brand, 0.1) : t.surface, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Text style={{ fontSize: 28 }}>{flag(c.code)}</Text>
                <View style={{ flex: 1, gap: 4 }}><Strong>{c.name}</Strong><Badge label={visaLabel(row[c.code] as VisaCode).label} t={v} /></View>
                <Muted>${c.dailyBudget[1]}/day</Muted>
              </Pressable>
            ))}
            <CountryPicker label="Somewhere else" value={a.country && !suggestions.some((x) => x.c.code === a.country) ? a.country : undefined} placeholder="Search any country" onChange={(country) => setA({ ...a, country })} />
          </View>
        )}

        {step === 4 && (
          <View style={{ gap: 14 }}>
            <H1>When are you <Hi>going?</Hi></H1>
            <Row gap={8}><Chip label="📅 Exact dates" on={!flex} onPress={() => setFlex(false)} /><Chip label="🤷🏾 I'm flexible" on={flex} onPress={() => setFlex(true)} /></Row>
            {!flex ? (
              <Row gap={10}><DateField label="Start" value={a.start} onChange={(start) => setA({ ...a, start, month: undefined, end: a.end && a.end < start ? start : a.end })} /><DateField label="End" value={a.end} min={a.start} onChange={(end) => setA({ ...a, end })} /></Row>
            ) : (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {MONTHS.map((m, i) => {
                  const c = COUNTRIES.find((x) => x.code === a.country);
                  const best = c?.bestMonths.includes(i + 1);
                  return <Chip key={m} label={`${m}${best ? " ☀️" : ""}`} on={a.month === i + 1} onPress={() => setA({ ...a, month: i + 1, start: undefined, end: undefined })} style={{ width: "22.5%" }} />;
                })}
              </View>
            )}
            {a.country ? <Muted>☀️ = best weather in {nameOf(a.country)}</Muted> : null}
          </View>
        )}

        {step === 5 && (
          <View style={{ gap: 14 }}>
            <H1>Budget <Hi>per person?</Hi></H1>
            <Field label={`Amount (${a.currency})`} value={a.budgetPerPerson ? String(a.budgetPerPerson) : ""} onChangeText={(v) => setA({ ...a, budgetPerPerson: Number(v.replace(/\D/g, "")) || 0 })} keyboardType="number-pad" placeholder="e.g. 60000" />
            {(() => {
              const c = COUNTRIES.find((x) => x.code === a.country);
              return c ? <Card style={{ gap: 6 }}><Strong>Typical daily spend in {c.name}</Strong><Body>Backpacker ${c.dailyBudget[0]} · Comfy ${c.dailyBudget[1]} · Treat ${c.dailyBudget[2]} (per person, USD)</Body></Card> : null;
            })()}
            {a.people > 1 && a.budgetPerPerson > 0 && <Note2 text={`Group pot target: ${a.currency} ${(a.budgetPerPerson * a.people).toLocaleString()} for ${a.people} people.`} />}
          </View>
        )}

        {step === 6 && (
          <View style={{ gap: 14 }}>
            <H1>Looks <Hi>good?</Hi></H1>
            <Card style={{ gap: 10 }}>
              <Field label="Trip name" value={a.name ?? ""} onChangeText={(name) => setA({ ...a, name })} placeholder={`${OCCASIONS.find((o) => o.id === a.occasion)?.label ?? ""} in ${a.country ? nameOf(a.country) : "…"}`} />
              {[["Where", a.country ? `${flag(a.country)} ${nameOf(a.country)}` : "Not picked yet"], ["When", a.start ? `${a.start}${a.end ? ` → ${a.end}` : ""}` : a.month ? `${MONTHS[a.month - 1]} (flexible)` : "Not set"], ["Who", `${a.people} ${a.people === 1 ? "person" : "people"}${a.friends?.length ? ` · ${a.friends.join(", ")}` : ""}`], ["Occasion", OCCASIONS.find((o) => o.id === a.occasion)?.label ?? ""], ["Budget each", a.budgetPerPerson ? `${a.currency} ${a.budgetPerPerson.toLocaleString()}` : "Not set"]].map(([k, v]) => (
                <Between key={k}><Muted>{k}</Muted><Strong style={{ flexShrink: 1, textAlign: "right" }}>{v}</Strong></Between>
              ))}
            </Card>
            {a.country && <Card style={{ gap: 4 }}><Label>Visa for you</Label><Badge label={visaLabel(row[a.country] as VisaCode).label} t={visaLabel(row[a.country] as VisaCode).tone} /></Card>}
            <Muted>We&apos;ll add hidden gems and things to do that fit your vibe. You can change everything after.</Muted>
            {msg ? <Muted>{msg}</Muted> : null}
          </View>
        )}
      </Screen>
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 18, paddingTop: 12, paddingBottom: insets.bottom + 14, backgroundColor: t.glass, borderTopWidth: 1, borderTopColor: t.line }}>
        <Button label="Back" kind="ghost" onPress={() => (step ? setStep(step - 1) : setMode("choose"))} />
        {step < STEPS.length - 1 ? <Button label="Next" disabled={!canNext} onPress={() => setStep(step + 1)} /> : <Button label="Create trip 🎉" onPress={create} />}
      </View>
    </KeyboardAvoidingView>
  );
}

function Note2({ text }: { text: string }) {
  const t = useTheme();
  return <View style={{ backgroundColor: withAlpha(t.go, 0.12), borderRadius: R.sm, padding: 12 }}><Text style={{ fontFamily: FONT.bodySemi, color: t.ink }}>{text}</Text></View>;
}
