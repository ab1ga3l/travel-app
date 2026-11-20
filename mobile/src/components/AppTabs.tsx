// The system tab bar on iPhone and Android (Liquid Glass on iOS 26).
import { NativeTabs } from "expo-router/native-tabs";
import { FONT, useTheme } from "@/theme";

export default function AppTabs() {
  const t = useTheme();
  return (
    <NativeTabs tintColor={t.brandText} backgroundColor={t.bg} indicatorColor={t.surface2}
      iconColor={{ default: t.muted, selected: t.brandText }}
      labelStyle={{ default: { fontFamily: FONT.bodySemi, color: t.muted }, selected: { fontFamily: FONT.bodyBold, color: t.ink } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="safari" md="explore" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="trips">
        <NativeTabs.Trigger.Label>Trips</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "suitcase", selected: "suitcase.fill" }} md="luggage" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="map">
        <NativeTabs.Trigger.Label>My map</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "map", selected: "map.fill" }} md="map" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="visa">
        <NativeTabs.Trigger.Label>Visa</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "person.text.rectangle", selected: "person.text.rectangle.fill" }} md="badge" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
