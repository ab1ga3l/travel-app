// Step 1: create an account or log in. Phone first (a code by SMS), email, Google or Apple.
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Body, Button, Card, Field, H1, Hi, Muted, Row, Screen, Segments } from "@/components/ui";
import { CountryPicker } from "@/components/CountryPicker";
import { Logo } from "@/components/Logo";
import { useApp } from "@/lib/store";
import { cloudEnabled, sb } from "@/lib/supabase";

const DIAL: Record<string, string> = {
  KE: "254", NG: "234", GH: "233", ZA: "27", UG: "256", TZ: "255", RW: "250", ET: "251", EG: "20", MA: "212", SN: "221", CM: "237",
  CI: "225", ZW: "263", ZM: "260", MW: "265", MZ: "258", BW: "267", NA: "264", GB: "44", US: "1", CA: "1", IN: "91", PK: "92",
  BD: "880", PH: "63", AE: "971", DE: "49", FR: "33", NL: "31", IT: "39", ES: "34", PT: "351", AU: "61", CN: "86", BR: "55",
};

WebBrowser.maybeCompleteAuthSession();

export default function Auth() {
  const { continueAsGuest } = useApp();
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [country, setCountry] = useState("KE");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const dial = DIAL[country] ?? "";
  const fullPhone = `+${dial}${phone.replace(/\D/g, "").replace(/^0+/, "")}`;
  const send = async () => {
    const c = sb(); if (!c) return;
    setBusy(true); setMsg("");
    const { error } = mode === "phone" ? await c.auth.signInWithOtp({ phone: fullPhone }) : await c.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
    setBusy(false);
    if (error) setMsg(mode === "phone" ? "Couldn't send the SMS. Check the number, or use email instead." : "Couldn't send the email. Check the address and try again.");
    else { setSent(true); setMsg(`We sent a 6-digit code to ${mode === "phone" ? fullPhone : email.trim()}.`); }
  };
  const verify = async () => {
    const c = sb(); if (!c) return;
    setBusy(true);
    const { error } = mode === "phone" ? await c.auth.verifyOtp({ phone: fullPhone, token: code.trim(), type: "sms" }) : await c.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "email" });
    setBusy(false);
    if (error) setMsg("That code didn't work. Check it, or send a new one.");
  };
  const oauth = async (provider: "google" | "apple") => {
    const c = sb(); if (!c) return;
    const redirectTo = Linking.createURL("/auth");
    const { data, error } = await c.auth.signInWithOAuth({ provider, options: { redirectTo, skipBrowserRedirect: true } });
    if (error || !data.url) return setMsg(`${provider === "google" ? "Google" : "Apple"} sign-in isn't switched on yet. Use your phone or email.`);
    const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (res.type !== "success") return;
    const params = new URLSearchParams(res.url.split("#")[1] ?? res.url.split("?")[1] ?? "");
    const access_token = params.get("access_token"), refresh_token = params.get("refresh_token");
    if (access_token && refresh_token) await c.auth.setSession({ access_token, refresh_token });
    else if (params.get("code")) await c.auth.exchangeCodeForSession(params.get("code")!);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen padBottom={40}>
        <Logo />
        <View style={{ gap: 10, marginTop: 8 }}>
          <H1>Create your account <Hi>or log in.</Hi></H1>
          <Muted>One account for your trips, your crew and your world map, on every device.</Muted>
        </View>

        {!cloudEnabled ? (
          <Card style={{ gap: 14 }}>
            <Body>Accounts are switching on soon. For now, everything is saved on this phone.</Body>
            <Button label="Continue on this phone" onPress={continueAsGuest} />
          </Card>
        ) : (
          <Card style={{ gap: 16 }}>
            <Segments items={[["phone", "📱 Phone"], ["email", "✉️ Email"]]} value={mode} onChange={(m) => { setMode(m); setSent(false); setMsg(""); }} />
            {!sent ? (
              mode === "phone" ? (
                <Row gap={10} wrap>
                  <CountryPicker label="Country" value={country} onChange={setCountry} />
                  <Field label={`Phone (+${dial})`} value={phone} onChangeText={setPhone} placeholder="712 345 678" keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />
                </Row>
              ) : (
                <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
              )
            ) : (
              <Field label="6-digit code" value={code} onChangeText={(v) => setCode(v.replace(/\D/g, "").slice(0, 6))} placeholder="••••••" keyboardType="number-pad" autoComplete="one-time-code" textContentType="oneTimeCode"
                style={{ fontSize: 26, letterSpacing: 10, textAlign: "center" }} />
            )}
            {!sent
              ? <Button label="Send me a code" busy={busy} disabled={mode === "phone" ? phone.replace(/\D/g, "").length < 6 : !email.includes("@")} onPress={send} style={{ alignSelf: "stretch" }} />
              : <View style={{ gap: 10 }}>
                  <Button label="Continue" busy={busy} disabled={code.length < 6} onPress={verify} style={{ alignSelf: "stretch" }} />
                  <Button label="Use a different number or email" kind="ghost" small onPress={() => { setSent(false); setCode(""); }} />
                </View>}
            {msg ? <Muted>{msg}</Muted> : null}
            <Muted style={{ textAlign: "center" }}>or</Muted>
            <Button label="Continue with Apple" kind="ghost" icon="" onPress={() => oauth("apple")} style={{ alignSelf: "stretch" }} />
            <Button label="Continue with Google" kind="ghost" icon="G" onPress={() => oauth("google")} style={{ alignSelf: "stretch" }} />
          </Card>
        )}
        {cloudEnabled && <Button label="Try it first without an account" kind="ghost" small onPress={continueAsGuest} style={{ alignSelf: "center" }} />}
        <Muted style={{ fontSize: 12, textAlign: "center" }}>By continuing you agree to the terms and privacy policy.</Muted>
      </Screen>
    </KeyboardAvoidingView>
  );
}
