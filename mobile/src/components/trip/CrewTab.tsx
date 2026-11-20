import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Pressable, Share, Text, View } from "react-native";
import { Avatars } from "@/components/TripCard";
import { CountryPicker } from "@/components/CountryPicker";
import { Between, Body, Button, Card, Field, H3, Muted, Row, tap } from "@/components/ui";
import { useApp } from "@/lib/store";
import { APP } from "@/shared/site";
import type { Member } from "@/shared/tripTypes";
import { flag, nameOf } from "@/shared/world";
import { FONT, R, useTheme } from "@/theme";
import { type TabProps, openWhatsApp, uid } from "./shared";

export function CrewTab({ trip, me, canManage, update }: TabProps) {
  const t = useTheme();
  const { deleteTrip } = useApp();
  const [name, setName] = useState("");
  const [passport, setPassport] = useState(me.passport);
  const [copied, setCopied] = useState(false);
  const isOwner = me.role === "owner";
  const invite = `✈️ Join "${trip.name}" (${nameOf(trip.country)}) on ${APP.name}! Plan, vote and track the pot together. Open the app → Trips → Join, and use code ${trip.code}.`;

  const setRole = (id: string, role: Member["role"]) => update((x) => ({ ...x, members: x.members.map((m) => (m.id === id ? { ...m, role } : m.role === "treasurer" && role === "treasurer" ? { ...m, role: "member" } : m)) }));
  const confirmDelete = () => {
    const go = async () => { await deleteTrip(trip.id); router.back(); };
    if (Platform.OS === "web") { if (confirm(`Delete "${trip.name}" for everyone?`)) go(); return; }
    Alert.alert("Delete trip?", `"${trip.name}" will be deleted for everyone. This can't be undone.`, [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: go }]);
  };

  return (
    <View style={{ gap: 14 }}>
      <Card glow style={{ gap: 12, alignItems: "center" }}>
        <Muted style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.4 }}>INVITE YOUR PEOPLE</Muted>
        <Pressable onPress={async () => { tap(); await Clipboard.setStringAsync(trip.code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          style={{ borderWidth: 1.5, borderStyle: "dashed", borderColor: t.brandText, borderRadius: R.md, paddingVertical: 12, paddingHorizontal: 22 }}>
          <Text style={{ fontFamily: FONT.mono, fontSize: 30, letterSpacing: 8, color: t.brandText }}>{trip.code}</Text>
        </Pressable>
        <Muted>{copied ? "Copied!" : "Tap to copy"}</Muted>
        <Row gap={10}>
          <Button label="Share on WhatsApp" onPress={() => openWhatsApp(invite)} />
          <Button label="More" kind="ghost" onPress={() => Share.share({ message: invite })} />
        </Row>
      </Card>
      <Card style={{ gap: 4 }}>
        <H3>The crew ({trip.members.length})</H3>
        {trip.members.map((m) => (
          <View key={m.id} style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: t.line, gap: 8 }}>
            <Row gap={10}>
              <Avatars names={[m.name]} size={36} />
              <View style={{ flex: 1 }}>
                <Body>{m.name}{m.id === me.id ? " (you)" : ""}</Body>
                <Muted style={{ fontSize: 12.5 }}>{flag(m.passport)} {nameOf(m.passport)} · {m.role === "owner" ? "organiser" : m.role === "treasurer" ? "🏦 treasurer" : "member"}{m.userId ? "" : " · not on the app yet"}</Muted>
              </View>
            </Row>
            {isOwner && m.role !== "owner" && (
              <Row gap={8}>
                <Button label={m.role === "treasurer" ? "Remove treasurer" : "Make treasurer"} kind="soft" small onPress={() => setRole(m.id, m.role === "treasurer" ? "member" : "treasurer")} />
                <Button label="Remove" kind="ghost" small onPress={() => update((x) => ({ ...x, members: x.members.filter((y) => y.id !== m.id) }))} />
              </Row>
            )}
          </View>
        ))}
      </Card>
      {canManage && (
        <Card style={{ gap: 12 }}>
          <H3>Add someone who isn&apos;t on the app</H3>
          <Field label="Name" value={name} onChangeText={setName} placeholder="Wanjiru" />
          <CountryPicker label="Their passport" value={passport} onChange={setPassport} />
          <Button label="Add to crew" kind="soft" disabled={!name.trim()} onPress={() => { update((x) => ({ ...x, members: [...x.members, { id: uid(), name: name.trim(), passport, role: "member" }] })); setName(""); }} />
        </Card>
      )}
      {isOwner && <Between><Muted>Organiser only</Muted><Button label="Delete trip" kind="danger" small onPress={confirmDelete} /></Between>}
    </View>
  );
}
