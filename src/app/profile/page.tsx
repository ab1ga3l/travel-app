"use client";
import Link from "next/link";
import { useState } from "react";
import { APP, ASSISTANT_STYLES, VIBE_PICKS, fromPicks, picksFrom } from "@/lib/site";
import { useApp } from "@/lib/store";
import { cloudEnabled } from "@/lib/supabaseBrowser";
import { flag, nameOf } from "@/lib/world";

export default function ProfilePage() {
  const { ready, profile, places, tripDocs, session, saveProfile, signOut, resetDevice } = useApp();
  const [nick, setNick] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!ready) return <div className="muted">Loading…</div>;
  if (!profile) return <div className="empty"><strong>No profile yet.</strong><Link href="/setup" className="btn btn-sun">Set up my profile</Link></div>;

  const picks = profile.picks ?? picksFrom(profile.vibes, profile.interests);
  const togglePick = (id: string) => {
    const next = picks.includes(id) ? picks.filter((x) => x !== id) : [...picks, id];
    if (next.length) saveProfile({ ...profile, picks: next, ...fromPicks(next) });
  };
  const nickname = nick ?? profile.assistantNickname ?? "";
  const user = session?.user;

  return (
    <div className="stack-lg fade-in" style={{ maxWidth: 860 }}>
      <div className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">Profile</span>
        <h1>Hey, <span className="gradient-text">{profile.name || "traveller"}</span></h1>
      </div>

      <section className="card" style={{ gap: 14 }}>
        <div className="between"><h2>About you</h2><Link href="/setup?next=/profile" className="btn btn-soft btn-sm">Edit</Link></div>
        <div className="ledger">
          <div className="ledger-row"><span className="muted">Passport</span><span>{flag(profile.passport)} {nameOf(profile.passport)}</span></div>
          {profile.home && profile.home !== profile.passport && <div className="ledger-row"><span className="muted">Lives in</span><span>{flag(profile.home)} {nameOf(profile.home)}</span></div>}
          <div className="ledger-row"><span className="muted">Currency</span><span>{profile.currency ?? "USD"}</span></div>
          <div className="ledger-row"><span className="muted">Budget · company · pace</span><span>{profile.budget} · {profile.company} · {profile.pace}</span></div>
          <div className="ledger-row"><span className="muted">Trips · places on map</span><span>{tripDocs.length} · {places.filter((p) => p.status === "been").length} been</span></div>
        </div>
      </section>

      <section className="card" style={{ gap: 12 }}>
        <h2>Your vibe</h2>
        <p className="muted" style={{ fontSize: "0.9rem" }}>We use these to match places, events, gems and tips to you.</p>
        <div className="chips">{VIBE_PICKS.map((v) => <button key={v.id} type="button" className="chip" aria-pressed={picks.includes(v.id)} onClick={() => togglePick(v.id)}>{v.emoji} {v.label}</button>)}</div>
      </section>

      <section className="card" style={{ gap: 12 }}>
        <h2>Your assistant</h2>
        <div className="chips">{ASSISTANT_STYLES.map((s) => <button key={s.id} type="button" className="chip" aria-pressed={(profile.assistantStyle ?? "warm") === s.id} onClick={() => saveProfile({ ...profile, assistantStyle: s.id })}>{s.emoji} {s.label}</button>)}</div>
        <div className="field-row" style={{ alignItems: "end" }}>
          <div><label className="lbl" htmlFor="nk">What should your assistant be called?</label><input id="nk" maxLength={20} value={nickname} placeholder={APP.assistant} onChange={(e) => setNick(e.target.value)} /></div>
          <button type="button" className="btn btn-soft" style={{ flex: "0 0 auto" }} onClick={() => { saveProfile({ ...profile, assistantNickname: nickname.trim() || undefined }); setNick(null); }}>Save name</button>
        </div>
      </section>

      <section className="card" style={{ gap: 12 }}>
        <h2>Community</h2>
        <label className="row" style={{ gap: 10, cursor: "pointer", flexWrap: "nowrap" }}>
          <input type="checkbox" checked={!!profile.publicMap} onChange={(e) => saveProfile({ ...profile, publicMap: e.target.checked })} style={{ width: 20, height: 20, accentColor: "var(--mint)", flex: "0 0 auto" }} disabled={!session} />
          <span>Show a “been there” badge on my community posts, so people planning a trip can ask me. Only your first name and the countries you&apos;ve been to are shown.</span>
        </label>
        {!session && <span className="muted" style={{ fontSize: "0.85rem" }}>Needs an account.</span>}
      </section>

      <section className="card" style={{ gap: 14 }}>
        <h2>Account</h2>
        {!cloudEnabled ? (
          <p className="muted">Accounts switch on when the database is connected. Until then, everything is saved on this device only.</p>
        ) : user ? (
          <>
            <p>Signed in as <strong>{user.phone ? `+${user.phone}` : user.email}</strong>. Your profile and trips sync to every device you sign in on.</p>
            <button type="button" className="btn btn-ghost" style={{ justifySelf: "start" }} onClick={signOut}>Sign out</button>
          </>
        ) : (
          <>
            <p className="muted">You&apos;re using {APP.name} as a guest, so everything stays on this phone. Create a free account to sync your trips, invite friends and vote together.</p>
            <Link href="/auth?next=/profile" className="btn btn-sun" style={{ justifySelf: "start" }}>Create account or sign in</Link>
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
