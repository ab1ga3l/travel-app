import { useEffect, useState } from "react";
import { Linking, View } from "react-native";
import { Between, Body, Button, Card, Field, H3, Muted, Row, Stat } from "@/components/ui";
import { emergencyFor } from "@/shared/geo";
import type { TripDoc } from "@/shared/tripTypes";
import { nameOf } from "@/shared/world";
import { useTheme } from "@/theme";
import { openWhatsApp, uid } from "./shared";

export const SAFETY_TIPS = [
  "Share your live location with your trusted contact for taxi rides and late nights.",
  "Use registered ride apps or hotel taxis after dark, and check the plate before you get in.",
  "Keep a copy of your passport photo page offline and in your email.",
  "Book your first night before you land, ideally somewhere with 24-hour reception.",
  "Agree a check-in time with your contact. If you go quiet, they know when to act.",
  "Trust your gut. Leaving a place early is always allowed.",
  "Women-only hostel rooms and well-reviewed female-run stays are worth the small premium.",
  "Carry a little cash in a second place in case your wallet goes missing.",
];
const KEY = "tk-safety-contact";

export function SafetyPanel({ trip, update, country }: { trip?: TripDoc; update?: (fn: (t: TripDoc) => TripDoc) => Promise<void>; country?: string }) {
  const t = useTheme();
  const dest = trip?.country ?? country ?? "KE";
  const sos = emergencyFor(dest);
  const [contact, setContact] = useState({ name: trip?.safety.contactName ?? "", phone: trip?.safety.contactPhone ?? "" });
  const [where, setWhere] = useState("");
  const [saved, setSaved] = useState("");
  useEffect(() => {
    if (trip) return;
    try { const c = JSON.parse(localStorage.getItem(KEY) ?? "null"); if (c?.phone || c?.name) setContact(c); } catch { /* none */ }
  }, [trip]);

  const save = () => {
    if (update) update((x) => ({ ...x, safety: { ...x.safety, contactName: contact.name.trim() || undefined, contactPhone: contact.phone.trim() || undefined } }));
    else try { localStorage.setItem(KEY, JSON.stringify(contact)); } catch { /* blocked */ }
    setSaved("Saved.");
  };
  const msg = (kind: "arrived" | "plan" | "help") => {
    const place = where.trim() ? ` at ${where.trim()}` : "";
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (kind === "arrived") return `✅ I've arrived safely${place}, ${nameOf(dest)} (${time}).`;
    if (kind === "help") return `🆘 I need help${place}, ${nameOf(dest)}. Please call me now. Local police: ${sos.police}.`;
    return `🧭 My plan${trip ? ` for ${trip.name}` : ""}: ${nameOf(dest)}${trip?.start ? ` from ${trip.start}` : ""}${trip?.end ? ` to ${trip.end}` : ""}.${where ? ` Staying at ${where}.` : ""} I'll check in daily. If you don't hear from me in 24 hours, please call me, then my stay.`;
  };
  const send = (kind: "arrived" | "plan" | "help") => {
    const m = msg(kind);
    update?.((x) => ({ ...x, safety: { ...x.safety, checkIns: [{ id: uid(), at: new Date().toISOString(), message: m }, ...x.safety.checkIns].slice(0, 30) } }));
    openWhatsApp(m, contact.phone);
  };
  const call = (n: string) => Linking.openURL(`tel:${n.replace(/[^\d+]/g, "")}`).catch(() => {});

  return (
    <View style={{ gap: 14 }}>
      <Card style={{ gap: 12 }}>
        <H3>🛡️ Your trusted contact</H3>
        <Muted>Someone back home who gets your check-ins. Messages open in WhatsApp, so we never see them.</Muted>
        <Row gap={10}>
          <Field label="Name" value={contact.name} onChangeText={(name) => setContact({ ...contact, name })} placeholder="Mum" />
          <Field label="WhatsApp number" value={contact.phone} onChangeText={(phone) => setContact({ ...contact, phone })} placeholder="+254 712 345 678" keyboardType="phone-pad" />
        </Row>
        <Row gap={10}><Button label="Save contact" kind="soft" onPress={save} />{saved ? <Muted>{saved}</Muted> : null}</Row>
      </Card>
      <Card style={{ gap: 12 }}>
        <H3>Check in</H3>
        <Field label="Where are you? (optional)" value={where} onChangeText={setWhere} placeholder="Hotel name, area" />
        <Button label="✅ I've arrived safely" onPress={() => send("arrived")} style={{ alignSelf: "stretch" }} />
        <Row gap={10}>
          <Button label="🧭 Share my plan" kind="ghost" onPress={() => send("plan")} style={{ flex: 1 }} />
          <Button label="🆘 I need help" kind="danger" onPress={() => send("help")} style={{ flex: 1 }} />
        </Row>
        {trip && trip.safety.checkIns.length > 0 && (
          <View style={{ gap: 4 }}>{trip.safety.checkIns.slice(0, 5).map((c) => <Muted key={c.id} style={{ fontSize: 12.5 }} numberOfLines={1}>{new Date(c.at).toLocaleString()} · {c.message}</Muted>)}</View>
        )}
      </Card>
      <H3>🚨 Emergency in {nameOf(dest)}</H3>
      <Row gap={10}>
        <Stat value={sos.police} label="Police · tap to call" color={t.stop} onPress={() => call(sos.police)} />
        <Stat value={sos.ambulance} label="Ambulance · tap to call" color={t.stop} onPress={() => call(sos.ambulance)} />
      </Row>
      {sos.note ? <Muted>{sos.note}</Muted> : null}
      <Card style={{ gap: 8 }}>
        <H3>Travelling solo? Tips from women who&apos;ve done it</H3>
        {SAFETY_TIPS.map((x) => <Between key={x}><Body style={{ flex: 1 }}>•  {x}</Body></Between>)}
      </Card>
    </View>
  );
}
