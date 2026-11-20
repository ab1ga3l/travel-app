// Explore countries and hidden gems by vibe, region and how easy the visa is for you.
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Poster } from "@/components/Poster";
import { Badge, Chip, Empty, Eyebrow, Field, H1, Hi, Muted, Row, Screen, Segments, tap } from "@/components/ui";
import { useApp, useVisaRow } from "@/lib/store";
import { useMoney } from "@/lib/useMoney";
import { COUNTRIES } from "@/shared/countries";
import { EXTRAS } from "@/shared/countryExtras";
import { GEMS } from "@/shared/gems";
import { matchScore } from "@/shared/match";
import { VIBES, type Vibe } from "@/shared/site";
import { nameOf, visaLabel, type VisaCode } from "@/shared/world";
import { FONT } from "@/theme";

type Region = "all" | "africa" | "asia" | "europe";

export default function Explore() {
  const { profile } = useApp();
  const row = useVisaRow(profile?.passport);
  const { usd } = useMoney();
  const [what, setWhat] = useState<"countries" | "gems">("countries");
  const [q, setQ] = useState("");
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [region, setRegion] = useState<Region>("all");
  const [easy, setEasy] = useState(false);
  const month = new Date().getMonth() + 1;

  const countries = useMemo(() => {
    const s = q.trim().toLowerCase();
    return COUNTRIES.filter((c) => (region === "all" || c.region === region) && (!vibe || (EXTRAS[c.code]?.vibes[vibe] ?? 0) >= 2)
      && (!easy || ["free", "easy"].includes(visaLabel(row[c.code] as VisaCode).tone))
      && (!s || `${c.name} ${c.capital} ${c.highlights.join(" ")}`.toLowerCase().includes(s)))
      .sort((a, b) => matchScore(b, vibe ? [vibe] : profile?.vibes ?? [], month) - matchScore(a, vibe ? [vibe] : profile?.vibes ?? [], month));
  }, [q, vibe, region, easy, row, profile, month]);
  const gems = useMemo(() => {
    const s = q.trim().toLowerCase();
    return GEMS.filter((g) => (!vibe || g.vibes.includes(vibe)) && (region === "all" || COUNTRIES.find((c) => c.code === g.c)?.region === region)
      && (!s || `${g.name} ${g.area} ${g.desc} ${nameOf(g.c)}`.toLowerCase().includes(s)));
  }, [q, vibe, region]);

  return (
    <Screen>
      <Eyebrow>Explore</Eyebrow>
      <H1>Find your <Hi>kind of place.</Hi></H1>
      <Field value={q} onChangeText={setQ} placeholder="Zanzibar, waterfalls, Lisbon, street food…" returnKeyType="search" />
      <Segments items={[["countries", "🌍 Countries"], ["gems", "💎 Hidden gems"]]} value={what} onChange={setWhat} />
      <Row gap={8} wrap>
        {VIBES.map((v) => <Chip key={v.id} label={`${v.emoji} ${v.label.split(" & ")[0]}`} on={vibe === v.id} onPress={() => setVibe(vibe === v.id ? null : v.id)} />)}
      </Row>
      <Row gap={8} wrap>
        {(["all", "africa", "asia", "europe"] as Region[]).map((r) => <Chip key={r} label={r === "all" ? "All regions" : r[0].toUpperCase() + r.slice(1)} on={region === r} onPress={() => setRegion(r)} />)}
        {what === "countries" && <Chip label="🛂 Easy visa for me" on={easy} onPress={() => setEasy(!easy)} />}
      </Row>

      {what === "countries" ? (
        countries.length === 0 ? <Empty emoji="🧭" title="Nothing matches." text="Try fewer filters." /> : countries.map((c) => {
          const v = visaLabel(row[c.code] as VisaCode);
          const great = c.bestMonths.includes(month);
          return (
            <Pressable key={c.code} onPress={() => { tap(); router.push(`/country/${c.code}`); }}>
              <Poster code={c.code} region={c.region} title={c.name} pill={`${usd(c.dailyBudget[1])}/day`} height={200}
                sub={<View style={{ gap: 8 }}>
                  <Text numberOfLines={2} style={{ fontFamily: FONT.body, fontSize: 13.5, color: "rgba(244,241,234,0.82)" }}>{EXTRAS[c.code]?.tagline}</Text>
                  <Row gap={6}><Badge label={v.label} t={v.tone} onDark />{great && <Badge label="☀️ Great this month" t="easy" onDark />}</Row>
                </View>} />
            </Pressable>
          );
        })
      ) : (
        gems.length === 0 ? <Empty emoji="💎" title="No gems match." /> : gems.map((g) => (
          <Pressable key={g.id} onPress={() => { tap(); router.push(`/country/${g.c}`); }}>
            <Poster code={g.c} seedKey={g.id} region={COUNTRIES.find((c) => c.code === g.c)?.region ?? "africa"} title={g.name} pill={g.kind === "hidden" ? "💎 Hidden gem" : "⭐ Famous"} height={190}
              sub={<View style={{ gap: 4 }}>
                <Text style={{ fontFamily: FONT.bodySemi, fontSize: 12.5, color: "rgba(244,241,234,0.75)" }}>{g.area} · {nameOf(g.c)}</Text>
                <Text numberOfLines={2} style={{ fontFamily: FONT.body, fontSize: 13.5, color: "rgba(244,241,234,0.85)" }}>{g.desc}</Text>
              </View>} />
          </Pressable>
        ))
      )}
      <Muted style={{ fontSize: 12 }}>Prices are typical daily mid-range budgets per person, converted at today&apos;s rate.</Muted>
    </Screen>
  );
}
