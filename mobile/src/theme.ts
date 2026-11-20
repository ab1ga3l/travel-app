// Black, burgundy and white. Burgundy is the brand (buttons, highlights, your own places).
// Status colours follow traffic lights so they read instantly: green = go, amber = get ready, red = stop.
import { Platform, useColorScheme } from "react-native";

const dark = {
  bg: "#000000",
  bg2: "#0a0a0a",
  surface: "#111113",
  surface2: "#1b1b1e",
  line: "#26262a",
  lineStrong: "#3a3a40",
  ink: "#ffffff",
  muted: "#a3a3ab",
  brand: "#8b1e3f",
  brandText: "#e0577d",
  onBrand: "#ffffff",
  go: "#34c759",
  ready: "#ffb340",
  stop: "#ff453a",
  crew: "#e0577d",
  glass: "rgba(0,0,0,0.92)",
};
const light: typeof dark = {
  bg: "#ffffff",
  bg2: "#f6f6f7",
  surface: "#ffffff",
  surface2: "#f3f3f5",
  line: "#e6e6ea",
  lineStrong: "#cfcfd6",
  ink: "#0a0a0a",
  muted: "#6b6b73",
  brand: "#8b1e3f",
  brandText: "#8b1e3f",
  onBrand: "#ffffff",
  go: "#1f9d47",
  ready: "#b86e00",
  stop: "#d70015",
  crew: "#8b1e3f",
  glass: "rgba(255,255,255,0.95)",
};
export type Palette = typeof dark;
export const PALETTES = { dark, light };

export function useTheme(): Palette & { scheme: "dark" | "light" } {
  const s = useColorScheme() === "light" ? "light" : "dark";
  return { ...PALETTES[s], scheme: s };
}

// In the browser preview, flags come from the Twemoji flag font (Windows has no flag emoji).
// Phones show their own emoji, so this only applies on the web.
const F = (name: string) => (Platform.OS === "web" ? `"Twemoji Country Flags", ${name}` : name);
export const FONT = {
  display: F("BricolageGrotesque_800ExtraBold"),
  displayBold: F("BricolageGrotesque_700Bold"),
  body: F("DMSans_400Regular"),
  bodyMedium: F("DMSans_500Medium"),
  bodySemi: F("DMSans_600SemiBold"),
  bodyBold: F("DMSans_700Bold"),
  mono: "JetBrainsMono_600SemiBold",
};

export const R = { sm: 14, md: 20, lg: 28, pill: 999 };

/** Tone colours for visa status and other signals. */
export const tone = (p: Palette, t: "free" | "easy" | "hard" | "none" | "unknown" | "lilac") =>
  t === "free" ? p.go : t === "easy" ? p.ready : t === "hard" ? p.stop : t === "lilac" ? p.crew : p.muted;

/** Same tone, as a soft background. */
export const toneBg = (p: Palette, t: Parameters<typeof tone>[1]) => withAlpha(tone(p, t), t === "none" || t === "unknown" ? 0.12 : 0.16);

export function withAlpha(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
