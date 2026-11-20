import { Linking, Pressable, Text, View } from "react-native";
import { useState } from "react";
import { Between, Button, Card, Chip, Field, H3, Muted, Row, Strong, tap } from "@/components/ui";
import { gemsFor } from "@/shared/gems";
import { tripDays } from "@/shared/tripBuild";
import type { ItemKind, PlanItem } from "@/shared/tripTypes";
import { nameOf } from "@/shared/world";
import { useTheme } from "@/theme";
import { type TabProps, uid } from "./shared";

const KINDS: [ItemKind, string][] = [["activity", "🎟️"], ["food", "🍲"], ["stay", "🛏️"], ["flight", "✈️"], ["transport", "🚌"], ["event", "🎉"], ["note", "📝"]];
const icon = (k: ItemKind) => KINDS.find(([x]) => x === k)?.[1] ?? "•";

export function PlanTab({ trip, update }: TabProps) {
  const t = useTheme();
  const days = Math.max(tripDays(trip), ...trip.items.map((i) => i.day), 1);
  const [form, setForm] = useState<{ day: number; time: string; title: string; kind: ItemKind }>({ day: 1, time: "", title: "", kind: "activity" });
  const gems = gemsFor(trip.country).filter((g) => !trip.items.some((i) => i.gemId === g.id));
  const add = (item: Omit<PlanItem, "id">) => update((x) => ({ ...x, items: [...x.items, { ...item, id: uid() }] }));
  const remove = (id: string) => update((x) => ({ ...x, items: x.items.filter((i) => i.id !== id) }));
  const move = (id: string, day: number) => update((x) => ({ ...x, items: x.items.map((i) => (i.id === id ? { ...i, day: Math.max(1, day) } : i)) }));
  const route = (list: PlanItem[]) => {
    const stops = list.filter((i) => i.kind !== "note").map((i) => `${i.title}, ${nameOf(trip.country)}`);
    if (!stops.length) return;
    const url = stops.length < 2 ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops[0])}`
      : `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(stops[0])}&destination=${encodeURIComponent(stops[stops.length - 1])}&waypoints=${encodeURIComponent(stops.slice(1, -1).join("|"))}`;
    Linking.openURL(url);
  };

  return (
    <View style={{ gap: 14 }}>
      {Array.from({ length: days }, (_, k) => k + 1).map((d) => {
        const list = trip.items.filter((i) => i.day === d).sort((a, b) => (a.time ?? "99").localeCompare(b.time ?? "99"));
        return (
          <Card key={d} style={{ gap: 4 }}>
            <Between>
              <H3>Day {d}{trip.start ? ` · ${new Date(Date.parse(trip.start) + (d - 1) * 864e5).toDateString().slice(0, 10)}` : ""}</H3>
              {list.length > 0 && <Button label="🗺️ Route" kind="ghost" small onPress={() => route(list)} />}
            </Between>
            {list.length ? list.map((i) => (
              <View key={i.id} style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: t.line, flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Text style={{ fontSize: 20 }}>{icon(i.kind)}</Text>
                <View style={{ flex: 1 }}>
                  <Strong>{i.title}</Strong>
                  {(i.time || i.note) ? <Muted style={{ fontSize: 13 }}>{[i.time, i.note].filter(Boolean).join(" · ")}</Muted> : null}
                </View>
                <Row gap={4}>
                  <Pressable hitSlop={8} onPress={() => { tap(); move(i.id, d - 1); }} disabled={d === 1}><Text style={{ fontSize: 18, color: d === 1 ? t.line : t.muted, paddingHorizontal: 4 }}>↑</Text></Pressable>
                  <Pressable hitSlop={8} onPress={() => { tap(); move(i.id, d + 1); }}><Text style={{ fontSize: 18, color: t.muted, paddingHorizontal: 4 }}>↓</Text></Pressable>
                  <Pressable hitSlop={8} onPress={() => { tap(); remove(i.id); }}><Text style={{ fontSize: 16, color: t.muted, paddingHorizontal: 4 }}>✕</Text></Pressable>
                </Row>
              </View>
            )) : <Muted>Nothing planned yet. Free day?</Muted>}
          </Card>
        );
      })}
      <Card style={{ gap: 12 }}>
        <H3>Add to the plan</H3>
        <Row gap={6} wrap>{KINDS.map(([k, e]) => <Chip key={k} label={`${e} ${k}`} on={form.kind === k} onPress={() => setForm({ ...form, kind: k })} />)}</Row>
        <Field value={form.title} onChangeText={(title) => setForm({ ...form, title })} placeholder="Sunset dhow cruise" maxLength={100} />
        <Row gap={10}>
          <Field label="Day" value={String(form.day)} onChangeText={(v) => setForm({ ...form, day: Math.max(1, Number(v.replace(/\D/g, "")) || 1) })} keyboardType="number-pad" />
          <Field label="Time" value={form.time} onChangeText={(time) => setForm({ ...form, time })} placeholder="18:30" />
        </Row>
        <Button label="Add" disabled={!form.title.trim()} onPress={() => { add({ day: form.day, time: form.time || undefined, title: form.title.trim(), kind: form.kind }); setForm({ ...form, title: "" }); }} />
      </Card>
      {gems.length > 0 && (
        <Card style={{ gap: 10 }}>
          <H3>💎 Gems you haven&apos;t added</H3>
          <Row gap={6} wrap>{gems.map((g) => <Chip key={g.id} label={`＋ ${g.name}`} onPress={() => add({ day: 1, title: g.name, kind: "activity", gemId: g.id, note: g.area })} />)}</Row>
        </Card>
      )}
    </View>
  );
}
