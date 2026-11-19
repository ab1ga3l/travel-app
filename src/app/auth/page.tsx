"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { APP } from "@/lib/site";
import { useApp } from "@/lib/store";
import { cloudEnabled, sb } from "@/lib/supabaseBrowser";
import { flag } from "@/lib/world";

// Dialling codes for the countries we expect most; the user can pick any country.
const DIAL: Record<string, string> = {
  KE: "254", NG: "234", GH: "233", ZA: "27", UG: "256", TZ: "255", RW: "250", ET: "251", EG: "20", MA: "212", SN: "221", CM: "237",
  CI: "225", ZW: "263", ZM: "260", MW: "265", MZ: "258", BW: "267", NA: "264", GB: "44", US: "1", CA: "1", IN: "91", PK: "92",
  BD: "880", PH: "63", AE: "971", DE: "49", FR: "33", NL: "31", IT: "39", ES: "34", PT: "351", AU: "61", CN: "86", BR: "55",
};
const DIAL_COUNTRIES = Object.keys(DIAL);

function Auth() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const { session, continueAsGuest } = useApp();
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [country, setCountry] = useState("KE");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const go = () => router.push(`/welcome?from=${country}${next ? `&next=${encodeURIComponent(next)}` : ""}`);

  useEffect(() => { if (session) go(); }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  const fullPhone = `+${DIAL[country]}${phone.replace(/\D/g, "").replace(/^0+/, "")}`;
  const send = async () => {
    const c = sb(); if (!c) return;
    setBusy(true); setMsg("");
    const { error } = mode === "phone"
      ? await c.auth.signInWithOtp({ phone: fullPhone })
      : await c.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    setBusy(false);
    if (error) setMsg(mode === "phone" ? "Couldn't send the SMS. Check the number, or use email instead." : "Couldn't send the email. Check the address and try again.");
    else { setSent(true); setMsg(mode === "phone" ? `We sent a 6-digit code to ${fullPhone}.` : `We sent a 6-digit code to ${email}.`); }
  };
  const verify = async () => {
    const c = sb(); if (!c) return;
    setBusy(true);
    const { error } = mode === "phone"
      ? await c.auth.verifyOtp({ phone: fullPhone, token: code.trim(), type: "sms" })
      : await c.auth.verifyOtp({ email, token: code.trim(), type: "email" });
    setBusy(false);
    if (error) setMsg("That code didn't work. Check it, or send a new one.");
  };
  const oauth = async (provider: "google" | "apple") => {
    const c = sb(); if (!c) return;
    const { error } = await c.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/welcome?from=${country}${next ? `&next=${encodeURIComponent(next)}` : ""}` } });
    if (error) setMsg(`${provider === "google" ? "Google" : "Apple"} sign-in isn't switched on yet. Use your phone or email.`);
  };
  const guest = () => { continueAsGuest(); go(); };

  return (
    <div className="onb fade-in">
      <span className="logo" style={{ padding: 0 }}><span className="logo-mark">TK</span>{APP.name}</span>
      <div className="stack" style={{ gap: 8 }}>
        <h1 style={{ fontSize: "clamp(1.8rem,7vw,2.4rem)" }}>Create your account <span className="gradient-text">or log in.</span></h1>
        <p className="muted">One account for your trips, your crew, your money pot and your world map, on every device.</p>
      </div>

      {!cloudEnabled ? (
        <div className="card" style={{ gap: 12 }}>
          <p>Accounts are switching on soon. For now, everything is saved on this device.</p>
          <button type="button" className="btn btn-sun" onClick={guest}>Continue on this device</button>
        </div>
      ) : (
        <div className="card" style={{ gap: 14 }}>
          <div className="tabs-row" role="tablist">
            <button type="button" role="tab" className="tab-pill" aria-selected={mode === "phone"} onClick={() => { setMode("phone"); setSent(false); setMsg(""); }}>📱 Phone</button>
            <button type="button" role="tab" className="tab-pill" aria-selected={mode === "email"} onClick={() => { setMode("email"); setSent(false); setMsg(""); }}>✉️ Email</button>
          </div>
          {!sent ? (
            <>
              {mode === "phone" ? (
                <div className="field-row">
                  <div style={{ flex: "0 0 150px" }}><label className="lbl" htmlFor="cc">Country</label>
                    <select id="cc" value={country} onChange={(e) => setCountry(e.target.value)}>
                      {DIAL_COUNTRIES.map((c) => <option key={c} value={c}>{flag(c)} +{DIAL[c]}</option>)}
                    </select></div>
                  <div><label className="lbl" htmlFor="ph">Phone number</label><input id="ph" inputMode="tel" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="712 345 678" /></div>
                </div>
              ) : (
                <div><label className="lbl" htmlFor="em">Email</label><input id="em" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
              )}
              <button type="button" className="btn btn-sun" disabled={busy || (mode === "phone" ? phone.replace(/\D/g, "").length < 6 : !email.includes("@"))} onClick={send}>{busy ? "Sending…" : "Send me a code"}</button>
            </>
          ) : (
            <>
              <div><label className="lbl" htmlFor="otp">6-digit code</label><input id="otp" className="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} /></div>
              <button type="button" className="btn btn-sun" disabled={busy || code.length < 6} onClick={verify}>{busy ? "Checking…" : "Continue"}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setSent(false); setCode(""); }}>Use a different number or email</button>
            </>
          )}
          <p role="status" className="muted" style={{ fontSize: "0.88rem" }}>{msg}</p>
          <div className="row" style={{ justifyContent: "center", gap: 8 }}>
            <span className="muted" style={{ fontSize: "0.85rem" }}>or</span>
          </div>
          <div className="grid-2">
            <button type="button" className="btn btn-ghost" onClick={() => oauth("google")}>Continue with Google</button>
            <button type="button" className="btn btn-ghost" onClick={() => oauth("apple")}>Continue with Apple</button>
          </div>
        </div>
      )}
      {cloudEnabled && <button type="button" className="btn btn-ghost btn-sm" style={{ justifySelf: "center" }} onClick={guest}>Try it first without an account</button>}
      <p className="muted" style={{ fontSize: "0.78rem", textAlign: "center" }}>By continuing you agree to our terms and privacy policy. We never sell your data.</p>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={null}><Auth /></Suspense>;
}

