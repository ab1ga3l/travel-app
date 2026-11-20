// Web preview of the app: a bottom tab bar styled like the phone app.
import { TabList, TabSlot, TabTrigger, Tabs, type TabTriggerSlotProps } from "expo-router/ui";
import { Pressable, Text, View } from "react-native";
import { FONT, useTheme } from "@/theme";

const TABS = [["index", "/", "✦", "Home"], ["explore", "/explore", "🧭", "Explore"], ["trips", "/trips", "🧳", "Trips"], ["map", "/map", "🗺️", "My map"], ["visa", "/visa", "🛂", "Visa"]] as const;

function TabButton({ isFocused, ico, label, ref: _ref, ...props }: TabTriggerSlotProps & { ico: string; label: string }) {
  const t = useTheme();
  return (
    <Pressable {...props} style={{ flex: 1, alignItems: "center", gap: 2, paddingVertical: 6 }}>
      <Text style={{ fontSize: 20, opacity: isFocused ? 1 : 0.6 }}>{ico}</Text>
      <Text style={{ fontFamily: isFocused ? FONT.bodyBold : FONT.bodySemi, fontSize: 11, color: isFocused ? t.ink : t.muted }}>{label}</Text>
    </Pressable>
  );
}

export default function AppTabs() {
  const t = useTheme();
  return (
    <Tabs>
      <TabSlot style={{ height: "100%" }} />
      <TabList asChild>
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", backgroundColor: t.bg, borderTopWidth: 1, borderTopColor: t.line, paddingBottom: 8, paddingTop: 4 }}>
          {TABS.map(([name, href, ico, label]) => (
            <TabTrigger key={name} name={name} href={href} asChild><TabButton ico={ico} label={label} /></TabTrigger>
          ))}
        </View>
      </TabList>
    </Tabs>
  );
}
