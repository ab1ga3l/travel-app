// Building blocks for every screen: text styles, buttons, cards, chips, badges and inputs.
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import type { ReactNode } from "react";
import {
  ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
  type PressableProps, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FONT, PALETTES, R, tone, toneBg, useTheme, withAlpha } from "@/theme";

export const tap = () => { if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {}); };

type TP = { children: ReactNode; style?: StyleProp<TextStyle>; numberOfLines?: number; accent?: boolean };

export function H1({ children, style }: TP) {
  const t = useTheme();
  return <Text style={[{ fontFamily: FONT.display, fontSize: 34, lineHeight: 36, letterSpacing: -1.2, color: t.ink }, style]}>{children}</Text>;
}
export function H2({ children, style }: TP) {
  const t = useTheme();
  return <Text style={[{ fontFamily: FONT.displayBold, fontSize: 22, lineHeight: 26, letterSpacing: -0.6, color: t.ink }, style]}>{children}</Text>;
}
export function H3({ children, style, numberOfLines }: TP) {
  const t = useTheme();
  return <Text numberOfLines={numberOfLines} style={[{ fontFamily: FONT.displayBold, fontSize: 17, lineHeight: 21, letterSpacing: -0.3, color: t.ink }, style]}>{children}</Text>;
}
/** Highlighted words inside a heading. */
export function Hi({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <Text style={{ color: t.brandText }}>{children}</Text>;
}
export function Body({ children, style, numberOfLines }: TP) {
  const t = useTheme();
  return <Text numberOfLines={numberOfLines} style={[{ fontFamily: FONT.body, fontSize: 15.5, lineHeight: 22, color: t.ink }, style]}>{children}</Text>;
}
export function Muted({ children, style, numberOfLines }: TP) {
  const t = useTheme();
  return <Text numberOfLines={numberOfLines} style={[{ fontFamily: FONT.body, fontSize: 14, lineHeight: 20, color: t.muted }, style]}>{children}</Text>;
}
export function Strong({ children, style, numberOfLines }: TP) {
  const t = useTheme();
  return <Text numberOfLines={numberOfLines} style={[{ fontFamily: FONT.bodyBold, fontSize: 15, color: t.ink }, style]}>{children}</Text>;
}
export function Eyebrow({ children, style }: TP) {
  const t = useTheme();
  return <Text style={[{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase", color: t.brandText }, style]}>{children}</Text>;
}

/** A scrolling screen with the right padding for the notch and tab bar. */
export function Screen({ children, title, scroll = true, padBottom = 120, header }: { children: ReactNode; title?: string; scroll?: boolean; padBottom?: number; header?: boolean }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const top = header ? 12 : insets.top + 12;
  const content = <View style={{ paddingHorizontal: 18, paddingTop: top, paddingBottom: padBottom + insets.bottom, gap: 18 }}>{children}</View>;
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {title !== undefined && <Stack.Screen options={{ title, headerShown: true }} />}
      {scroll ? <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}
    </View>
  );
}

export function Card({ children, style, onPress, glow }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; glow?: boolean }) {
  const t = useTheme();
  const base: ViewStyle = { backgroundColor: t.surface, borderRadius: R.md, borderWidth: 1, borderColor: glow ? withAlpha(t.brand, 0.45) : t.line, padding: 18, gap: 12 };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return <Pressable onPress={() => { tap(); onPress(); }} style={({ pressed }) => [base, style, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}>{children}</Pressable>;
}

type BtnKind = "go" | "ghost" | "soft" | "danger";
export function Button({ label, onPress, kind = "go", disabled, busy, small, style, icon }: { label: string; onPress?: () => void; kind?: BtnKind; disabled?: boolean; busy?: boolean; small?: boolean; style?: StyleProp<ViewStyle>; icon?: string }) {
  const t = useTheme();
  const bg = kind === "go" ? t.brand : kind === "soft" ? t.surface2 : "transparent";
  const fg = kind === "go" ? t.onBrand : kind === "danger" ? t.stop : t.ink;
  const border = kind === "ghost" ? t.line : kind === "danger" ? withAlpha(t.stop, 0.5) : "transparent";
  return (
    <Pressable accessibilityRole="button" disabled={disabled || busy} onPress={() => { tap(); onPress?.(); }}
      style={({ pressed }) => [{ backgroundColor: bg, borderColor: border, borderWidth: 1, borderRadius: R.pill, paddingVertical: small ? 9 : 14, paddingHorizontal: small ? 14 : 22, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, opacity: disabled ? 0.45 : pressed ? 0.85 : 1, alignSelf: "flex-start" }, style]}>
      {busy ? <ActivityIndicator color={fg} /> : <Text style={{ color: fg, fontFamily: FONT.bodyBold, fontSize: small ? 13.5 : 15.5 }}>{icon ? `${icon}  ` : ""}{label}</Text>}
    </Pressable>
  );
}

export function Chip({ label, on, onPress, style }: { label: string; on?: boolean; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: !!on }} onPress={() => { tap(); onPress?.(); }}
      style={[{ borderRadius: R.pill, borderWidth: 1, borderColor: on ? t.ink : t.line, backgroundColor: on ? t.ink : t.surface, paddingVertical: 9, paddingHorizontal: 14 }, style]}>
      <Text style={{ fontFamily: FONT.bodySemi, fontSize: 13.5, color: on ? t.bg : t.ink }}>{label}</Text>
    </Pressable>
  );
}

/** A small status pill. `onDark` keeps dark-mode colours, for use on the night-card posters. */
export function Badge({ label, t: kind = "unknown", onDark }: { label: string; t?: Parameters<typeof tone>[1]; onDark?: boolean }) {
  const theme = useTheme();
  const t = onDark ? PALETTES.dark : theme;
  return (
    <View style={{ backgroundColor: toneBg(t, kind), borderRadius: R.pill, paddingVertical: 4, paddingHorizontal: 10, alignSelf: "flex-start" }}>
      <Text style={{ color: tone(t, kind), fontFamily: FONT.bodyBold, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

export function Row({ children, style, gap = 8, wrap }: { children: ReactNode; style?: StyleProp<ViewStyle>; gap?: number; wrap?: boolean }) {
  return <View style={[{ flexDirection: "row", alignItems: "center", gap, flexWrap: wrap ? "wrap" : "nowrap" }, style]}>{children}</View>;
}
export function Between({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }, style]}>{children}</View>;
}

export function Progress({ value, color }: { value: number; color?: string }) {
  const t = useTheme();
  return (
    <View style={{ height: 7, borderRadius: 99, backgroundColor: t.surface2, overflow: "hidden" }}>
      <View style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: "100%", borderRadius: 99, backgroundColor: color ?? t.brand }} />
    </View>
  );
}

export function Field({ label, style, ...props }: TextInputProps & { label?: string }) {
  const t = useTheme();
  return (
    <View style={{ gap: 6, flexGrow: 1, flexShrink: 1, minWidth: 110 }}>
      {label ? <Label>{label}</Label> : null}
      <TextInput placeholderTextColor={t.muted} {...props}
        style={[{ backgroundColor: t.surface2, borderRadius: R.sm, borderWidth: 1, borderColor: t.line, color: t.ink, fontFamily: FONT.body, fontSize: 16, paddingHorizontal: 14, paddingVertical: 12 }, style as TextStyle]} />
    </View>
  );
}
export function Label({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <Text style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.muted }}>{children}</Text>;
}

/** A big tappable tile used in pickers (vibes, styles). */
export function Tile({ emoji, label, hint, on, onPress, style }: { emoji: string; label: string; hint?: string; on?: boolean; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: !!on }} onPress={() => { tap(); onPress?.(); }}
      style={({ pressed }) => [{ borderRadius: 18, borderWidth: 1.5, borderColor: on ? t.brandText : t.line, backgroundColor: on ? withAlpha(t.brand, 0.12) : t.surface, padding: 12, gap: 4, alignItems: "center", justifyContent: "center", transform: [{ scale: pressed ? 0.97 : 1 }] }, style]}>
      <Text style={{ fontSize: 26 }}>{emoji}</Text>
      <Text style={{ fontFamily: FONT.bodyBold, fontSize: 12.5, lineHeight: 16, color: t.ink, textAlign: "center" }}>{label}</Text>
      {hint ? <Text style={{ fontFamily: FONT.body, fontSize: 11.5, color: t.muted, textAlign: "center" }}>{hint}</Text> : null}
    </Pressable>
  );
}

export function Stat({ value, label, color, onPress }: { value: string | number; label: string; color?: string; onPress?: () => void }) {
  const t = useTheme();
  return (
    <Card onPress={onPress} style={{ flex: 1, alignSelf: "stretch", padding: 14, gap: 2 }}>
      <Text style={{ fontFamily: FONT.display, fontSize: 26, color: color ?? t.ink, letterSpacing: -0.8 }}>{value}</Text>
      <Text style={{ fontFamily: FONT.body, fontSize: 12.5, lineHeight: 16, color: t.muted }}>{label}</Text>
    </Card>
  );
}

export function Empty({ emoji, title, text, action }: { emoji: string; title: string; text?: string; action?: ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ borderWidth: 1.5, borderStyle: "dashed", borderColor: t.line, borderRadius: R.md, padding: 26, alignItems: "center", gap: 10 }}>
      <Text style={{ fontSize: 34 }}>{emoji}</Text>
      <Strong style={{ textAlign: "center" }}>{title}</Strong>
      {text ? <Muted style={{ textAlign: "center" }}>{text}</Muted> : null}
      {action}
    </View>
  );
}

export function Note({ children }: { children: ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ backgroundColor: withAlpha(t.ready, 0.12), borderColor: withAlpha(t.ready, 0.3), borderWidth: 1, borderRadius: R.sm, padding: 12 }}>
      <Text style={{ fontFamily: FONT.body, fontSize: 14, lineHeight: 20, color: t.ink }}>{children}</Text>
    </View>
  );
}

/** Horizontal segmented tabs. */
export function Segments<T extends string>({ items, value, onChange }: { items: [T, string][]; value: T; onChange: (v: T) => void }) {
  const t = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 18 }}>
      {items.map(([k, l]) => (
        <Pressable key={k} accessibilityRole="tab" accessibilityState={{ selected: value === k }} onPress={() => { tap(); onChange(k); }}
          style={{ borderRadius: R.pill, borderWidth: 1, borderColor: value === k ? t.ink : t.line, backgroundColor: value === k ? t.ink : t.surface, paddingVertical: 9, paddingHorizontal: 15 }}>
          <Text style={{ fontFamily: FONT.bodyBold, fontSize: 13.5, color: value === k ? t.bg : t.muted }}>{l}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export const s = StyleSheet.create({ grow: { flex: 1 } });
