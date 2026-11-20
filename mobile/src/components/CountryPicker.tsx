// A searchable country list in a bottom sheet. Popular African passports first.
import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WORLD, flag, nameOf } from "@/shared/world";
import { FONT, R, useTheme } from "@/theme";
import { Label, tap } from "./ui";

export const POPULAR = ["KE", "NG", "GH", "ZA", "UG", "TZ", "RW", "ET", "EG", "SN", "CM", "CI", "ZW", "MA", "ZM"];

export function CountryPicker({ label, value, onChange, placeholder = "Choose a country" }: { label?: string; value?: string; onChange: (code: string) => void; placeholder?: string }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s) return WORLD.filter((c) => c.name.toLowerCase().includes(s) || c.code.toLowerCase() === s).map((c) => c.code);
    return [...POPULAR, ...WORLD.map((c) => c.code).filter((c) => !POPULAR.includes(c))];
  }, [q]);

  return (
    <View style={{ gap: 6, flexGrow: 1, flexShrink: 1, minWidth: 130 }}>
      {label ? <Label>{label}</Label> : null}
      <Pressable accessibilityRole="button" onPress={() => { tap(); setOpen(true); }}
        style={{ backgroundColor: t.surface2, borderRadius: R.sm, borderWidth: 1, borderColor: t.line, paddingHorizontal: 14, paddingVertical: 13, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontFamily: FONT.bodyMedium, fontSize: 16, color: value ? t.ink : t.muted }}>{value ? `${flag(value)}  ${nameOf(value)}` : placeholder}</Text>
        <Text style={{ color: t.muted }}>▾</Text>
      </Pressable>
      <Modal visible={open} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: 16 }}>
          <View style={{ paddingHorizontal: 18, gap: 12, paddingBottom: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontFamily: FONT.displayBold, fontSize: 20, color: t.ink }}>{label ?? "Country"}</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={12}><Text style={{ fontFamily: FONT.bodyBold, color: t.brandText, fontSize: 16 }}>Done</Text></Pressable>
            </View>
            <TextInput autoFocus value={q} onChangeText={setQ} placeholder="Search countries" placeholderTextColor={t.muted}
              style={{ backgroundColor: t.surface2, borderRadius: R.sm, borderWidth: 1, borderColor: t.line, color: t.ink, fontFamily: FONT.body, fontSize: 16, paddingHorizontal: 14, paddingVertical: 12 }} />
          </View>
          <FlatList data={list} keyExtractor={(c) => c} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => { tap(); onChange(item); setOpen(false); setQ(""); }}
                style={({ pressed }) => ({ paddingHorizontal: 18, paddingVertical: 14, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: pressed || item === value ? t.surface : "transparent", borderTopWidth: !q && index === POPULAR.length ? 6 : 0, borderTopColor: t.surface })}>
                <Text style={{ fontSize: 22 }}>{flag(item)}</Text>
                <Text style={{ fontFamily: item === value ? FONT.bodyBold : FONT.body, fontSize: 16, color: t.ink, flex: 1 }}>{nameOf(item)}</Text>
                {item === value && <Text style={{ color: t.brandText, fontSize: 16 }}>✓</Text>}
              </Pressable>
            )} />
        </View>
      </Modal>
    </View>
  );
}
