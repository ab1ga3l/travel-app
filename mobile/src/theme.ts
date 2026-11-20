// "Go Signal" design system, same as the web app.
// Go lime = brand, visa-free, paid, safe. Amber = prepare first. Coral = stop. Violet = people.
import { useColorScheme } from "react-native";

const dark = {
  bg: "#0d0d0f",
  bg2: "#121215",
  surface: "#18181c",
  surface2: "#222228",
  line: "#2c2c33",
  lineStrong: "#44444d",
  ink: "#f4f1ea",
  muted: "#9c9aa3",
  brand: "#c6f24e",
  brandText: "#c6f24e",
  onBrand: "#0d0d0f",
  go: "#c6f24e",
  ready: "#ffb23e",
  stop: "#ff5a5f",
  crew: "#9d8cff",
  glass: "rgba(18,18,21,0.92)",
};
const light: typeof dark = {
  bg: "#f6f3ec",
  bg2: "#efebe1",
  surface: "#ffffff",
  surface2: "#f3efe6",
  line: "#e4dfd4",
  lineStrong: "#cfc8b9",
  ink: "#111114",
  muted: "#6b6872",
  brand: "#c6f24e",
  brandText: "#3f7d0a",
  onBrand: "#0d0d0f",
  go: "#3f7d0a",
  ready: "#a66300",
  stop: "#d9363d",
  crew: "#5b46d9",
  glass: "rgba(246,243,236,0.95)",
};
export type Palette = typeof dark;
export const PALETTES = { dark, light };

export function useTheme(): Palette & { scheme: "dark" | "light" } {
  const s = useColorScheme() === "light" ? "light" : "dark";
  return { ...PALETTES[s], scheme: s };
}

export const FONT = {
  display: "BricolageGrotesque_800ExtraBold",
  displayBold: "BricolageGrotesque_700Bold",
  body: "DMSans_400Regular",
  bodyMedium: "DMSans_500Medium",
  bodySemi: "DMSans_600SemiBold",
  bodyBold: "DMSans_700Bold",
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
