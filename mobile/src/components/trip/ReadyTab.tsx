import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Badge, Between, Button, Card, H3, Muted, Note, Progress, tap } from "@/components/ui";
import { visaRow } from "@/lib/store";
import { READY_ITEMS } from "@/shared/tripTypes";
import { flag, nameOf, visaLabel, type VisaCode } from "@/shared/world";
import { FONT, useTheme } from "@/theme";
import type { TabProps } from "./shared";

export function ReadyTab({ trip, update }: TabProps) {
  const t = useTheme();
  const toggle = (mid: string, key: string) => update((x) => ({ ...x, checklist: { ...x.checklist, [mid]: { ...(x.checklist[mid] ?? {}), [key]: !x.checklist[mid]?.[key] } } }));
  const allReady = trip.members.every((m) => READY_ITEMS.every((i) => trip.checklist[m.id]?.[i.id]));
  return (
    <View style={{ gap: 14 }}>
      <Muted>Everyone&apos;s passport is different, so everyone gets their own checklist.</Muted>
      {allReady && <Note>🎉 The whole crew is ready to fly!</Note>}
      {trip.members.map((m) => {
        const done = READY_ITEMS.filter((i) => trip.checklist[m.id]?.[i.id]).length;
        const home = m.passport === trip.country;
        const v = visaLabel(visaRow(m.passport)[trip.country] as VisaCode);
        return (
          <Card key={m.id} style={{ gap: 10 }}>
            <Between><H3>{m.name}</H3><Badge label={`${flag(m.passport)} ${nameOf(m.passport)}`} /></Between>
            {home ? <Badge label="Home country" t="free" /> : (
              <Between><Badge label={v.label} t={v.tone} /><Button label="Visa details" kind="ghost" small onPress={() => router.push("/visa")} /></Between>
            )}
            <Progress value={(done / READY_ITEMS.length) * 100} color={t.go} />
            <Muted style={{ fontSize: 13 }}>{done} of {READY_ITEMS.length} ready</Muted>
            {READY_ITEMS.map((i) => {
              const on = !!trip.checklist[m.id]?.[i.id];
              return (
                <Pressable key={i.id} onPress={() => { tap(); toggle(m.id, i.id); }} style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 4 }}>
                  <View style={{ width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: on ? t.go : t.lineStrong, backgroundColor: on ? t.go : "transparent", alignItems: "center", justifyContent: "center" }}>
                    {on && <Text style={{ color: t.onBrand, fontFamily: FONT.bodyBold, fontSize: 13 }}>✓</Text>}
                  </View>
                  <Text style={{ flex: 1, fontFamily: FONT.body, fontSize: 14.5, color: on ? t.muted : t.ink, textDecorationLine: on ? "line-through" : "none" }}>{i.label}</Text>
                </Pressable>
              );
            })}
          </Card>
        );
      })}
    </View>
  );
}
