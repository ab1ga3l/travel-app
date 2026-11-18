import "server-only";
import matrix from "@/data/visa-matrix.json";
import type { VisaCode } from "./world";

const DATA = (matrix as unknown as { data: Record<string, Record<string, VisaCode>> }).data;

export function visaFor(passport: string, destination: string): VisaCode | null {
  return DATA[passport.toUpperCase()]?.[destination.toUpperCase()] ?? null;
}

export function visaRow(passport: string): Record<string, VisaCode> {
  return DATA[passport.toUpperCase()] ?? {};
}

/** How many destinations a passport can enter without a visa in advance. */
export function passportPower(passport: string) {
  const row = visaRow(passport);
  const vals = Object.values(row);
  const easy = vals.filter((v) => typeof v === "number" || v === "vf" || v === "voa").length;
  const online = vals.filter((v) => v === "eta" || v === "ev").length;
  return { easy, online, total: vals.length };
}
