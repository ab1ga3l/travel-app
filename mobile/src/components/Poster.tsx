// Night-card art for trips, countries and gems: soft regional glow, contour rings, lime route.
import type { ReactNode } from "react";
import { Text, View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { flag } from "@/shared/world";
import { FONT } from "@/theme";

const TINT: Record<string, string> = { africa: "#ff8a3d", asia: "#5ad1c9", europe: "#9d8cff" };

function seed(s: string) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507)), ((h >>> 0) % 1000) / 1000);
}

export function PosterArt({ code, region }: { code: string; region: string }) {
  const tint = TINT[region] ?? TINT.africa;
  const r = seed(code);
  // Keep the art in the upper middle so the flag, the pill and the title stay clear.
  const cx = 120 + r() * 45, cy = 70 + r() * 25;
  const y1 = 30 + r() * 30, y2 = 75 + r() * 25, y3 = 50 + r() * 30;
  const id = code.replace(/[^a-zA-Z0-9]/g, "");
  return (
    <Svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
      <Defs>
        <LinearGradient id={`b${id}`} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#1e1e24" /><Stop offset="1" stopColor="#0f0f12" /></LinearGradient>
        <RadialGradient id={`g${id}`} cx={cx} cy={cy} rx="150" ry="150" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={tint} stopOpacity="0.3" /><Stop offset="0.6" stopColor={tint} stopOpacity="0.06" /><Stop offset="1" stopColor={tint} stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#0f0f12" stopOpacity="0" /><Stop offset="1" stopColor="#0f0f12" stopOpacity="0.85" /></LinearGradient>
      </Defs>
      <Rect width="200" height="200" fill={`url(#b${id})`} />
      <Rect width="200" height="200" fill={`url(#g${id})`} />
      {Array.from({ length: 6 }, (_, i) => <Circle key={i} cx={cx} cy={cy} r={12 + i * 16} fill="none" stroke="#f4f1ea" strokeOpacity={0.14 - i * 0.018} strokeWidth={0.8} />)}
      <Path d={`M-5 ${y1} C 40 ${y1 + 10}, 55 ${y2}, 90 ${y2} S 110 ${y3}, ${cx} ${cy}`} fill="none" stroke="#c6f24e" strokeOpacity={0.75} strokeWidth={1.4} strokeDasharray="4 4" strokeLinecap="round" />
      <Circle cx={cx} cy={cy} r={3.2} fill="#c6f24e" />
      <Circle cx={cx} cy={cy} r={7} fill="none" stroke="#c6f24e" strokeOpacity={0.35} />
      <Rect y="110" width="200" height="90" fill={`url(#f${id})`} />
    </Svg>
  );
}

/** A poster block: art behind, flag + pill on top, title at the bottom. */
export function Poster({ code, seedKey, region, title, pill, sub, height = 170, style }: { code: string; seedKey?: string; region: string; title: string; pill?: string; sub?: ReactNode; height?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ height, borderRadius: 20, overflow: "hidden", padding: 16, justifyContent: "space-between", backgroundColor: "#0f0f12" }, style]}>
      <PosterArt code={seedKey ?? code} region={region} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Text style={{ fontSize: 28 }}>{flag(code)}</Text>
        {pill ? <Pill label={pill} /> : null}
      </View>
      <View style={{ gap: 4 }}>
        <Text style={{ fontFamily: FONT.display, fontSize: 24, lineHeight: 26, letterSpacing: -0.8, color: "#f4f1ea" }}>{title}</Text>
        {sub}
      </View>
    </View>
  );
}

export function Pill({ label }: { label: string }) {
  return (
    <View style={{ backgroundColor: "rgba(244,241,234,0.1)", borderWidth: 1, borderColor: "rgba(244,241,234,0.16)", borderRadius: 99, paddingVertical: 4, paddingHorizontal: 10 }}>
      <Text style={{ fontFamily: FONT.bodyBold, fontSize: 11.5, color: "#f4f1ea" }}>{label}</Text>
    </View>
  );
}
