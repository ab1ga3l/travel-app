// Pick a currency from a sheet. African currencies first, then common travel currencies.
import { useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CURRENCIES, currencyName } from "@/shared/money";
import { FONT, R, useTheme } from "@/theme";
import { Label, tap } from "./ui";

export function CurrencyPicker({ label, value, onChange, hint }: { label?: string; value: string; onChange: (code: string) => void; hint?: string }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const list = CURRENCIES.includes(value) ? CURRENCIES : [value, ...CURRENCIES];
  return (
    <View style={{ gap: 6, flexGrow: 1, flexShrink: 1, minWidth: 130 }}>
      {label ? <Label>{label}</Label> : null}
      <Pressable accessibilityRole="button" onPress={() => { tap(); setOpen(true); }}
        style={{ backgroundColor: t.surface2, borderRadius: R.sm, borderWidth: 1, borderColor: t.line, paddingHorizontal: 14, paddingVertical: 13, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontFamily: FONT.bodyMedium, fontSize: 16, color: t.ink }}>{value} · {currencyName(value)}</Text>
        <Text style={{ color: t.muted }}>▾</Text>
      </Pressable>
      {hint ? <Text style={{ fontFamily: FONT.body, fontSize: 12.5, color: t.muted }}>{hint}</Text> : null}
      <Modal visible={open} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: 16 }}>
          <View style={{ paddingHorizontal: 18, paddingBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontFamily: FONT.displayBold, fontSize: 20, color: t.ink }}>{label ?? "Currency"}</Text>
            <Pressable onPress={() => setOpen(false)} hitSlop={12}><Text style={{ fontFamily: FONT.bodyBold, color: t.brandText, fontSize: 16 }}>Done</Text></Pressable>
          </View>
          <FlatList data={list} keyExtractor={(c) => c} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            renderItem={({ item }) => (
              <Pressable onPress={() => { tap(); onChange(item); setOpen(false); }}
                style={({ pressed }) => ({ paddingHorizontal: 18, paddingVertical: 14, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: pressed || item === value ? t.surface : "transparent" })}>
                <Text style={{ fontFamily: FONT.mono, fontSize: 14, color: t.brandText, width: 44 }}>{item}</Text>
                <Text style={{ fontFamily: item === value ? FONT.bodyBold : FONT.body, fontSize: 16, color: t.ink, flex: 1 }}>{currencyName(item)}</Text>
                {item === value && <Text style={{ color: t.brandText, fontSize: 16 }}>✓</Text>}
              </Pressable>
            )} />
        </View>
      </Modal>
    </View>
  );
}
