import type { Member, TripDoc } from "@/lib/tripTypes";

export interface TabProps {
  trip: TripDoc;
  me: Member;
  canManage: boolean; // owner or treasurer
  update: (fn: (t: TripDoc) => TripDoc) => Promise<void>;
}

export const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
export const memberName = (t: TripDoc, id: string) => t.members.find((m) => m.id === id)?.name ?? "Someone";
export const money = (t: TripDoc, n: number) => `${t.currency} ${Math.round(n).toLocaleString()}`;
export const waLink = (text: string, phone?: string) => `https://wa.me/${(phone ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
