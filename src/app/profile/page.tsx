"use client";
import Link from "next/link";
import { useState } from "react";
import { APP, vibeInfo } from "@/lib/site";
import { useApp } from "@/lib/store";
import { cloudEnabled, sb } from "@/lib/supabaseBrowser";
import { flag, nameOf } from "@/lib/world";

export default function ProfilePage() {
  const { ready, profile, trips, session, signOut, resetDevice } = useApp();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  const signIn = async () => {
    const c = sb();
    if (!c) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setMsg("Enter a valid email address.");
    const { error } = await c.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/profile` } });
    setMsg(error ? "Couldn't send the link. Please try again." : "Check your email for a sign-in link.");
  };

  if (!ready) return <div className="muted">Loading…</div>;

  return (
    <div className="stack-lg fade-in" style={{ maxWidth: 860 }}>
      <div className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">Profile</span>
        <h1>{profile?.name ? <>Hey, <span className="gradient-text">{profile.name}</span></> : "Your profile"}</h1>
      </div>

      {profile ? (
        <section className="card" style={{ gap: 14 }}>
          <div className="between"><h2>Your travel style</h2><Link href="/start" className="btn btn-soft btn-sm">Edit</Link></div>
          <div className="ledger">
            <div className="ledger-row"><span className="muted">Passport</span><span>{flag(profile.passport)} {nameOf(profile.passport)}</span></div>
            <div className="ledger-row"><span className="muted">Vibe</span><span>{profile.vibes.map((v) => vibeInfo(v).emoji).join(" ")} {profile.vibes.map((v) => vibeInfo(v).label.split(" ")[0]).join(", ")}</span></div>
            <div className="ledger-row"><span className="muted">Budget</span><span>{profile.budget}</span></div>
            <div className="ledger-row"><span className="muted">Travelling</span><span>{profile.company}</span></div>
            <div className="ledger-row"><span className="muted">Pace</span><span>{profile.pace}</span></div>
            <div className="ledger-row"><span className="muted">Trips saved</span><span>{trips.length}</span></div>
          </div>
        </section>
      ) : (
        <div className="empty"><strong>No travel style yet.</strong><Link href="/start" className="btn btn-sun">Find my travel vibe</Link></div>
      )}

      <section className="card" style={{ gap: 14 }}>
        <h2>Account</h2>
        {!cloudEnabled ? (
          <p className="muted">Accounts switch on when the database is connected. Until then, everything is saved on this device only.</p>
        ) : session ? (
          <>
            <p>Signed in as <strong>{session.user.email}</strong>. Your profile and trips sync to every device you sign in on.</p>
            <button type="button" className="btn btn-ghost" style={{ justifySelf: "start" }} onClick={signOut}>Sign out</button>
          </>
        ) : (
          <>
            <p className="muted">Create an account with just your email: no password. Your trips and profile follow you to any phone or laptop, and you can post in the community and rate gems.</p>
            <div className="field-row" style={{ alignItems: "end" }}>
              <div><label className="lbl" htmlFor="em">Email</label><input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></div>
              <button type="button" className="btn btn-sun" onClick={signIn} style={{ flex: "0 0 auto" }}>Email me a sign-in link</button>
            </div>
            <span role="status" className="muted">{msg}</span>
          </>
        )}
      </section>

      <section className="card" style={{ gap: 12 }}>
        <h2>Your data</h2>
        <p className="muted">{APP.name} never sells your data. You can clear what&apos;s saved on this device at any time.</p>
        {confirmReset ? (
          <div className="row">
            <span>Clear your profile and trips from this device?</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { resetDevice(); setConfirmReset(false); }}>Yes, clear</button>
            <button type="button" className="btn btn-soft btn-sm" onClick={() => setConfirmReset(false)}>Cancel</button>
          </div>
        ) : (
          <button type="button" className="btn btn-ghost" style={{ justifySelf: "start" }} onClick={() => setConfirmReset(true)}>Clear this device</button>
        )}
      </section>

      <div className="row"><Link href="/about" className="btn btn-ghost btn-sm">About {APP.name}</Link><Link href="/legal" className="btn btn-ghost btn-sm">Terms & privacy</Link><Link href="/partners" className="btn btn-ghost btn-sm">Partner with us</Link></div>
    </div>
  );
}
