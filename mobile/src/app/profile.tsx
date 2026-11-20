import { router } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Switch, View } from "react-native";
import { Between, Body, Button, Card, Chip, Field, H1, H3, Hi, Muted, Row, Screen, Strong, Tile } from "@/components/ui";
import { useApp } from "@/lib/store";
import { cloudEnabled } from "@/lib/supabase";
import { APP, ASSISTANT_STYLES, VIBE_PICKS, fromPicks, picksFrom } from "@/shared/site";
import { flag, nameOf } from "@/shared/world";
import { useTheme } from "@/theme";

export default function Profile() {
  const t = useTheme();
  const { profile, places, tripDocs, session, saveProfile, signOut, resetDevice, exitGuest } = useApp();
  const [nick, setNick] = useState(profile?.assistantNickname ?? "");
  if (!profile) return null;
  const picks = profile.picks ?? picksFrom(profile.vibes, profile.interests);
  const toggle = (id: string) => {
    const next = picks.includes(id) ? picks.filter((x) => x !== id) : [...picks, id];
    if (next.length) saveProfile({ ...profile, picks: next, ...fromPicks(next) });
  };
  const reset = () => {
    if (Platform.OS === "web") { resetDevice(); return; }
    Alert.alert("Clear this phone?", "Your profile, trips and map on this phone will be deleted.", [{ text: "Cancel", style: "cancel" }, { text: "Clear", style: "destructive", onPress: resetDevice }]);
  };

  return (
    <Screen header padBottom={60}>
      <H1>Hey, <Hi>{profile.name || "traveller"}</Hi></H1>
      <Card style={{ gap: 10 }}>
        <Between><H3>About you</H3><Button label="Edit" kind="soft" small onPress={() => { saveProfile({ ...profile, onboarded: false }); }} /></Between>
        {[["Passport", `${flag(profile.passport)} ${nameOf(profile.passport)}`], ...(profile.home && profile.home !== profile.passport ? [["Lives in", `${flag(profile.home)} ${nameOf(profile.home)}`]] : []), ["Currency", profile.currency ?? "USD"], ["Style", `${profile.budget} · ${profile.company} · ${profile.pace}`], ["Trips · map", `${tripDocs.length} trips · ${places.filter((p) => p.status === "been").length} countries`]].map(([k, v]) => (
          <Between key={k}><Muted>{k}</Muted><Strong>{v}</Strong></Between>
        ))}
      </Card>
      <Card style={{ gap: 12 }}>
        <H3>Your vibe</H3>
        <Row gap={6} wrap>{VIBE_PICKS.map((v) => <Chip key={v.id} label={`${v.emoji} ${v.label}`} on={picks.includes(v.id)} onPress={() => toggle(v.id)} />)}</Row>
      </Card>
      <Card style={{ gap: 12 }}>
        <H3>Your assistant</H3>
        <View style={{ flexDirection: "row", gap: 8 }}>{ASSISTANT_STYLES.map((s) => <Tile key={s.id} emoji={s.emoji} label={s.label} on={(profile.assistantStyle ?? "warm") === s.id} onPress={() => saveProfile({ ...profile, assistantStyle: s.id })} style={{ flex: 1, minHeight: 90 }} />)}</View>
        <Row gap={10}><View style={{ flex: 1 }}><Field label="Nickname" value={nick} onChangeText={setNick} placeholder={APP.assistant} maxLength={20} /></View></Row>
        <Button label="Save name" kind="soft" small onPress={() => saveProfile({ ...profile, assistantNickname: nick.trim() || undefined })} />
      </Card>
      <Card style={{ gap: 10 }}>
        <Between><H3 style={{ flex: 1 }}>&quot;Been there&quot; badge</H3><Switch value={!!profile.publicMap} disabled={!session} onValueChange={(v) => saveProfile({ ...profile, publicMap: v })} trackColor={{ true: t.brand, false: t.line }} thumbColor="#fff" /></Between>
        <Muted>Show the countries you&apos;ve been to on your community posts so people planning a trip can ask you. Only your first name is shown.{!session ? " Needs an account." : ""}</Muted>
      </Card>
      <Card style={{ gap: 10 }}>
        <H3>Account</H3>
        {!cloudEnabled ? <Muted>Accounts switch on soon. Until then, everything is saved on this phone.</Muted>
          : session ? <><Body>Signed in as <Strong>{session.user.phone ? `+${session.user.phone}` : session.user.email}</Strong></Body><Button label="Sign out" kind="ghost" onPress={signOut} /></>
          : <><Muted>You&apos;re using {APP.name} as a guest, so everything stays on this phone. Create a free account to sync your trips, invite friends and vote together.</Muted><Button label="Create account or log in" onPress={exitGuest} /></>}
      </Card>
      <Card style={{ gap: 10 }}>
        <H3>Your data</H3>
        <Muted>{APP.name} never sells your data.</Muted>
        <Button label="Clear this phone" kind="danger" small onPress={reset} />
      </Card>
      <Button label="Safety check-in" kind="ghost" onPress={() => router.push("/safety")} />
    </Screen>
  );
}
