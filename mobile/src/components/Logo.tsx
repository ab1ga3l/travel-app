import { Text, View } from "react-native";
import { APP } from "@/shared/site";
import { FONT, useTheme, withAlpha } from "@/theme";

export function Logo({ size = 36 }: { size?: number }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View style={{ width: size, height: size, borderRadius: size * 0.32, backgroundColor: t.brand, alignItems: "center", justifyContent: "center", shadowColor: t.brand, shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, boxShadow: `0 6px 20px ${withAlpha(t.brand, 0.35)}` }}>
        <Text style={{ fontFamily: FONT.display, fontSize: size * 0.36, color: t.onBrand }}>TK</Text>
      </View>
      <Text style={{ fontFamily: FONT.display, fontSize: size * 0.56, color: t.ink, letterSpacing: -0.5 }}>{APP.name}</Text>
    </View>
  );
}
