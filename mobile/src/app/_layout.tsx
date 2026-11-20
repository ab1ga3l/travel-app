// Import only the font weights we use, so the app stays small.
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque/700Bold";
import { BricolageGrotesque_800ExtraBold } from "@expo-google-fonts/bricolage-grotesque/800ExtraBold";
import { DMSans_400Regular } from "@expo-google-fonts/dm-sans/400Regular";
import { DMSans_500Medium } from "@expo-google-fonts/dm-sans/500Medium";
import { DMSans_600SemiBold } from "@expo-google-fonts/dm-sans/600SemiBold";
import { DMSans_700Bold } from "@expo-google-fonts/dm-sans/700Bold";
import { JetBrainsMono_600SemiBold } from "@expo-google-fonts/jetbrains-mono/600SemiBold";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { AppProvider, useApp } from "@/lib/store";
import { FONT, useTheme } from "@/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

// Browser preview only: show country flags on Windows with the Twemoji flag font the website hosts.
if (Platform.OS === "web" && typeof document !== "undefined" && !document.getElementById("tk-flags")) {
  const style = document.createElement("style");
  style.id = "tk-flags";
  style.textContent = `@font-face{font-family:"Twemoji Country Flags";unicode-range:U+1F1E6-1F1FF,U+1F3F4,U+E0062-E0063,U+E0065,U+E0067,U+E006C,U+E006E,U+E0073-E0074,U+E0077,U+E007F;src:url("/fonts/TwemojiCountryFlags.woff2") format("woff2");font-display:swap}`;
  document.head.appendChild(style);
}

function Root() {
  const t = useTheme();
  const { ready, session, guest, seenIntro, profile } = useApp();
  const [fonts] = useFonts({
    BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold,
    DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold, JetBrainsMono_600SemiBold,
  });
  const loaded = ready && fonts;
  useEffect(() => {
    if (!loaded) return;
    SplashScreen.hideAsync().catch(() => {});
    // Browser preview: remove the "Loading Tokende…" screen from index.html (see scripts/postexport.js).
    if (Platform.OS === "web" && typeof document !== "undefined") {
      (window as unknown as { __tkStarted?: boolean }).__tkStarted = true;
      document.getElementById("tk-boot")?.remove();
    }
  }, [loaded]);
  if (!loaded) return null;

  // First run: create account or log in → intro slides → about you. Then the app.
  const stage = !session && !guest ? "auth" : !seenIntro ? "intro" : !profile?.onboarded ? "setup" : "app";
  const base = t.scheme === "dark" ? DarkTheme : DefaultTheme;
  const nav = { ...base, colors: { ...base.colors, background: t.bg, card: t.bg, text: t.ink, border: t.line, primary: t.brandText } };

  return (
    <ThemeProvider value={nav}>
      <StatusBar style={t.scheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{
        headerShown: false, contentStyle: { backgroundColor: t.bg },
        headerStyle: { backgroundColor: t.bg }, headerTintColor: t.ink, headerShadowVisible: false,
        headerTitleStyle: { fontFamily: FONT.displayBold }, headerBackButtonDisplayMode: "minimal",
      }}>
        <Stack.Protected guard={stage === "auth"}><Stack.Screen name="auth" /></Stack.Protected>
        <Stack.Protected guard={stage === "intro"}><Stack.Screen name="welcome" /></Stack.Protected>
        <Stack.Protected guard={stage === "setup"}><Stack.Screen name="setup" /></Stack.Protected>
        <Stack.Protected guard={stage === "app"}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="trip/[id]" options={{ headerShown: true, title: "" }} />
          <Stack.Screen name="trip/new" options={{ headerShown: true, title: "New trip", presentation: "modal" }} />
          <Stack.Screen name="join" options={{ headerShown: true, title: "Join a trip", presentation: "modal" }} />
          <Stack.Screen name="country/[code]" options={{ headerShown: true, title: "" }} />
          <Stack.Screen name="profile" options={{ headerShown: true, title: "Profile" }} />
          <Stack.Screen name="safety" options={{ headerShown: true, title: "Safety" }} />
          <Stack.Screen name="ask" options={{ headerShown: true, title: "Aviora" }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

export default function Layout() {
  return <AppProvider><Root /></AppProvider>;
}
