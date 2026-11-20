import { Linking } from "react-native";
import type { Member, TripDoc } from "@/shared/tripTypes";

export interface TabProps {
  trip: TripDoc;
  me: Member;
  canManage: boolean; // organiser or treasurer
  update: (fn: (t: TripDoc) => TripDoc) => Promise<void>;
}
export const uid = () => String(Date.now()) + Math.random().toString(16).slice(2);
export const memberName = (t: TripDoc, id: string) => t.members.find((m) => m.id === id)?.name ?? "Someone";
export const money = (t: TripDoc, n: number) => `${t.currency} ${Math.round(n).toLocaleString()}`;
export const waLink = (text: string, phone?: string) => `https://wa.me/${(phone ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
export const openWhatsApp = (text: string, phone?: string) => Linking.openURL(waLink(text, phone)).catch(() => {});
