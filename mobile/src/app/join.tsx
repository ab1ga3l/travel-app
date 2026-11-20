import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput } from "react-native";
import { Button, Card, Eyebrow, H1, Hi, Muted, Note, Screen } from "@/components/ui";
import { useApp } from "@/lib/store";
import { cloudEnabled } from "@/lib/supabase";
import { FONT, R, useTheme } from "@/theme";

export default function Join() {
  const t = useTheme();
  const { profile, session, joinTrip } = useApp();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const go = async () => {
    setBusy(true); setMsg("");
    const trip = await joinTrip(code, { name: profile?.name ?? "Traveller", passport: profile?.passport ?? "KE" });
    setBusy(false);
    if (trip) router.replace(`/trip/${trip.id}`); else setMsg("We couldn't find a trip with that code. Check it with whoever sent it.");
  };
  return (
    <Screen header>
      <Eyebrow>Join a trip</Eyebrow>
      <H1>Got a <Hi>code?</Hi></H1>
      <Muted>Ask the organiser for the 6-letter code from their Crew tab.</Muted>
      {!cloudEnabled || !session ? (
        <Note>{!cloudEnabled ? "Joining friends' trips switches on with accounts, very soon." : "Create an account first so your friends can see you: Profile → Create account."}</Note>
      ) : (
        <Card style={{ gap: 14, alignItems: "center" }}>
          <TextInput value={code} onChangeText={(v) => setCode(v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))} autoCapitalize="characters" autoCorrect={false} placeholder="KJMWTA" placeholderTextColor={t.lineStrong}
            style={{ fontFamily: FONT.mono, fontSize: 32, letterSpacing: 8, color: t.brandText, textAlign: "center", borderWidth: 1.5, borderStyle: "dashed", borderColor: t.line, borderRadius: R.md, paddingVertical: 12, alignSelf: "stretch" }} />
          <Button label="Join trip" busy={busy} disabled={code.length < 6} onPress={go} style={{ alignSelf: "stretch" }} />
          {msg ? <Text style={{ fontFamily: FONT.body, color: t.stop }}>{msg}</Text> : null}
        </Card>
      )}
    </Screen>
  );
}
