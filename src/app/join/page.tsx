"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import { cloudEnabled } from "@/lib/supabaseBrowser";

function Join() {
  const sp = useSearchParams();
  const router = useRouter();
  const { profile, session, joinTrip } = useApp();
  const [code, setCode] = useState((sp.get("code") ?? "").toUpperCase());
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const go = async () => {
    if (!profile) return;
    setBusy(true); setMsg("");
    const t = await joinTrip(code, { name: profile.name, passport: profile.passport });
    setBusy(false);
    if (t) router.replace(`/trips/${t.id}`);
    else setMsg("No trip found with that code. Check it with your friend and try again.");
  };

  return (
    <div className="stack-lg fade-in" style={{ maxWidth: 520 }}>
      <div className="stack" style={{ gap: 8 }}><span className="eyebrow">Join a trip</span><h1>Got a <span className="gradient-text">code?</span></h1>
        <p className="muted">Your friend can find it in their trip under &ldquo;Crew&rdquo;.</p></div>
      {!cloudEnabled ? (
        <div className="empty"><strong>Joining friends needs accounts, which are switching on soon.</strong><span>Until then, the trip owner can add you by name inside their trip.</span></div>
      ) : !session ? (
        <div className="card" style={{ gap: 10 }}><p>Sign in first so the trip can sync between you and your crew.</p><Link href={`/auth?next=${encodeURIComponent(`/join?code=${code}`)}`} className="btn btn-sun" style={{ justifySelf: "start" }}>Sign in or create account</Link></div>
      ) : (
        <form className="card" style={{ gap: 12 }} onSubmit={(e) => { e.preventDefault(); go(); }}>
          <label className="lbl" htmlFor="jc">Trip code</label>
          <input id="jc" className="otp" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))} placeholder="KJMWTA" autoCapitalize="characters" />
          <button className="btn btn-sun" type="submit" disabled={busy || code.length !== 6}>{busy ? "Joining…" : "Join trip"}</button>
          <span role="status" className="muted">{msg}</span>
        </form>
      )}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={null}><Join /></Suspense>;
}
