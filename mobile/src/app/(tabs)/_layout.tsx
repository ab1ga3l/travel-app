import { router } from "expo-router";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppTabs from "@/components/AppTabs";
import { tap } from "@/components/ui";
import { APP } from "@/shared/site";
import { FONT, useTheme } from "@/theme";

/** The tabs, plus Aviora as a floating button on the right, one tap away on every tab. */
export default function TabsLayout() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const above = Platform.OS === "ios" ? 62 : Platform.OS === "android" ? 88 : 72;
  return (
    <View style={{ flex: 1 }}>
      <AppTabs />
      <Pressable accessibilityRole="button" accessibilityLabel={`Ask ${APP.assistant}, your travel assistant`} onPress={() => { tap(); router.push("/ask"); }}
        style={({ pressed }) => ({
          position: "absolute", right: 16, bottom: insets.bottom + above, flexDirection: "row", alignItems: "center", gap: 6,
          backgroundColor: t.brand, borderRadius: 999, paddingVertical: 12, paddingLeft: 14, paddingRight: 16,
          shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 8,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}>
        <Text style={{ fontSize: 17 }}>✨</Text>
        <Text style={{ fontFamily: FONT.displayBold, fontSize: 15, color: t.onBrand }}>{APP.assistant}</Text>
      </Pressable>
    </View>
  );
}
