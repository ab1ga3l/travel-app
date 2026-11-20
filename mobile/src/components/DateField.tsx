// A date field with a calendar sheet. Works the same on iPhone, Android and web.
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FONT, R, useTheme } from "@/theme";
import { Label, tap } from "./ui";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const prettyDate = (s?: string) => (s ? new Date(`${s}T12:00:00`).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "");

export function DateField({ label, value, onChange, min }: { label: string; value?: string; onChange: (v: string) => void; min?: string }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const start = value ? new Date(`${value}T12:00:00`) : min ? new Date(`${min}T12:00:00`) : new Date();
  const [cursor, setCursor] = useState(new Date(start.getFullYear(), start.getMonth(), 1));
  const today = iso(new Date());
  const floor = min && min > today ? min : today;
  const days = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const lead = (new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay() + 6) % 7; // Monday first
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <View style={{ gap: 6, flexGrow: 1, flexShrink: 1, minWidth: 110 }}>
      <Label>{label}</Label>
      <Pressable accessibilityRole="button" onPress={() => { tap(); setOpen(true); }}
        style={{ backgroundColor: t.surface2, borderRadius: R.sm, borderWidth: 1, borderColor: t.line, paddingHorizontal: 14, paddingVertical: 13 }}>
        <Text style={{ fontFamily: FONT.bodyMedium, fontSize: 15.5, color: value ? t.ink : t.muted }}>{value ? prettyDate(value) : "Pick a date"}</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)" }} onPress={() => setOpen(false)} />
        <View style={{ backgroundColor: t.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20, paddingBottom: insets.bottom + 20, gap: 14 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Pressable hitSlop={12} onPress={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><Text style={{ fontSize: 22, color: t.ink }}>‹</Text></Pressable>
            <Text style={{ fontFamily: FONT.displayBold, fontSize: 18, color: t.ink }}>{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</Text>
            <Pressable hitSlop={12} onPress={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><Text style={{ fontSize: 22, color: t.ink }}>›</Text></Pressable>
          </View>
          <View style={{ flexDirection: "row" }}>{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <Text key={i} style={{ width: "14.28%", textAlign: "center", fontFamily: FONT.mono, fontSize: 11, color: t.muted }}>{d}</Text>)}</View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {cells.map((d, i) => {
              if (!d) return <View key={i} style={{ width: "14.28%", height: 44 }} />;
              const v = iso(new Date(cursor.getFullYear(), cursor.getMonth(), d));
              const off = v < floor, on = v === value;
              return (
                <Pressable key={i} disabled={off} onPress={() => { tap(); onChange(v); setOpen(false); }} style={{ width: "14.28%", height: 44, alignItems: "center", justifyContent: "center" }}>
                  <View style={{ width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: on ? t.brand : "transparent", borderWidth: v === today ? 1 : 0, borderColor: t.lineStrong }}>
                    <Text style={{ fontFamily: on ? FONT.bodyBold : FONT.body, fontSize: 15, color: on ? t.onBrand : off ? t.lineStrong : t.ink }}>{d}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}
