// Step 2: five swipeable intro slides about what the app does. Skippable.
import { useRef, useState } from "react";
import { type NativeScrollEvent, type NativeSyntheticEvent, Pressable, ScrollView, type ScrollViewInstance, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge, Between, Body, Button, Card, H1, Muted, Progress, Row, Strong, tap } from "@/components/ui";
import { useApp } from "@/lib/store";
import { FONT, R, useTheme, withAlpha } from "@/theme";

function Slide1() {
  return (
    <Card style={{ gap: 10 }}>
      <Muted style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.4 }}>🇰🇪 KENYA PASSPORT</Muted>
      {[["🇹🇿 Tanzania", "Visa-free", "free"], ["🇿🇦 South Africa", "Visa-free · 90d", "free"], ["🇹🇭 Thailand", "eVisa online", "easy"], ["🇫🇷 France", "Visa required", "hard"]].map(([c, l, k]) => (
        <Between key={c}><Strong>{c}</Strong><Badge label={l} t={k as "free"} /></Between>
      ))}
    </Card>
  );
}
function Slide2() {
  const t = useTheme();
  return (
    <Card style={{ gap: 12, alignItems: "center" }}>
      <Muted style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.4 }}>ZANZIBAR GIRLS&apos; TRIP 🌴</Muted>
      <Row gap={-8}>{["A", "W", "Z", "N"].map((x, i) => <View key={x} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.crew, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: t.surface, marginLeft: i ? -10 : 0 }}><Text style={{ fontFamily: FONT.display, color: t.onBrand }}>{x}</Text></View>)}</Row>
      <View style={{ borderWidth: 1, borderStyle: "dashed", borderColor: t.brandText, borderRadius: R.sm, paddingVertical: 10, paddingHorizontal: 18 }}><Text style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: 6, color: t.brandText }}>KJMWTA</Text></View>
      <Muted>Share the code. Friends join in seconds.</Muted>
    </Card>
  );
}
function Slide3() {
  const t = useTheme();
  return (
    <Card style={{ gap: 10 }}>
      <Between><Muted style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.4 }}>GROUP POT</Muted><Badge label="75% in" t="free" /></Between>
      <Text style={{ fontFamily: FONT.display, fontSize: 30, color: t.ink }}>KES 135,000</Text>
      <Progress value={75} />
      {[["Amina", "Paid ✓", "free"], ["Wanjiru", "Paid ✓", "free"], ["Zawadi", "Pending", "easy"], ["Nia", "Not yet", "hard"]].map(([n, l, k]) => <Between key={n}><Body>{n}</Body><Badge label={l} t={k as "free"} /></Between>)}
    </Card>
  );
}
function Slide4() {
  const t = useTheme();
  return (
    <Card style={{ gap: 12 }}>
      <Muted style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.4 }}>🗳️ SUNSET DHOW CRUISE?</Muted>
      {[["Yes", 80, t.go], ["No", 20, t.stop]].map(([l, v, c]) => (
        <Row key={l as string} gap={10}><Body style={{ width: 34 }}>{l}</Body><View style={{ flex: 1 }}><Progress value={v as number} color={c as string} /></View></Row>
      ))}
      <Muted>🔒 Votes stay sealed until the deadline.</Muted>
    </Card>
  );
}
function Slide5() {
  const t = useTheme();
  return (
    <Card style={{ gap: 12 }}>
      <Between><Muted style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.4 }}>💎 WATAMU, KENYA</Muted><Badge label="Worth it" t="free" /></Between>
      <View style={{ backgroundColor: withAlpha(t.go, 0.12), borderRadius: R.sm, padding: 12 }}><Body>✅ I&apos;ve arrived safely. Shared with Mum.</Body></View>
      <Row gap={8}>{["🇹🇿", "🇷🇼", "🇿🇦", "🇹🇭", "🇬🇭"].map((f) => <Text key={f} style={{ fontSize: 26 }}>{f}</Text>)}</Row>
      <Muted>5 countries · 2.6% of the world</Muted>
    </Card>
  );
}

const SLIDES = [
  { title: "Your passport, decoded.", text: "See every place you can go visa-free, on arrival or with an eVisa, and exactly what the rest need.", Art: Slide1 },
  { title: "Plan it with your people.", text: "Start a trip, share a code, and everyone gets their own checklist for their own passport.", Art: Slide2 },
  { title: "One pot. Zero chasing.", text: "Track who's paid by M-Pesa or bank, and see exactly how the group money is spent.", Art: Slide3 },
  { title: "Vote. Decide. Go.", text: "Propose plans, vote in secret, reveal together. No more endless group chats.", Art: Slide4 },
  { title: "Feel it first. Travel safe. Collect the world.", text: "Hidden gems rated by real travellers, one-tap safety check-ins, and a map of everywhere you've been.", Art: Slide5 },
];

export default function Welcome() {
  const t = useTheme();
  const { markIntroSeen } = useApp();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const ref = useRef<ScrollViewInstance>(null);
  const [i, setI] = useState(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => setI(Math.round(e.nativeEvent.contentOffset.x / width));
  const go = (n: number) => { ref.current?.scrollTo({ x: n * width, animated: true }); setI(n); };
  const last = i === SLIDES.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 18 }}>
        <Button label="Skip" kind="ghost" small onPress={markIntroSeen} />
      </View>
      <ScrollView ref={ref} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onScroll} onScroll={onScroll} scrollEventThrottle={64} style={{ flex: 1 }}>
        {SLIDES.map(({ title, text, Art }) => (
          <View key={title} style={{ width, paddingHorizontal: 22, justifyContent: "center", gap: 26 }}>
            <View style={{ borderRadius: R.lg, borderWidth: 1, borderColor: t.line, padding: 20, backgroundColor: withAlpha(t.crew, 0.08) }}><Art /></View>
            <View style={{ gap: 10 }}>
              <H1 style={{ fontSize: 31, lineHeight: 34 }}>{title}</H1>
              <Body style={{ color: t.muted }}>{text}</Body>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: 22, gap: 18 }}>
        <Row gap={6} style={{ justifyContent: "center" }}>
          {SLIDES.map((_, n) => <Pressable key={n} onPress={() => { tap(); go(n); }} hitSlop={8} style={{ width: n === i ? 26 : 8, height: 8, borderRadius: 4, backgroundColor: n === i ? t.brand : t.line }} />)}
        </Row>
        <Button label={last ? "Let's go →" : "Next"} onPress={() => (last ? markIntroSeen() : go(i + 1))} style={{ alignSelf: "stretch" }} />
      </View>
    </View>
  );
}
