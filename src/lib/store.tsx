"use client";
// App state: traveller profile and trips. Saved on the device first (works offline and
// without an account), and synced to the traveller's account when they sign in.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Vibe } from "./site";
import { sb } from "./supabaseBrowser";

export type TripStatus = "been" | "going" | "dream";
export interface Trip { id: string; country: string; status: TripStatus; start?: string; end?: string; note?: string }
export interface Profile {
  name: string;
  passport: string; // ISO2
  home?: string; // ISO2, where you live
  vibes: Vibe[];
  budget: "backpacker" | "comfy" | "treat";
  company: "solo" | "couple" | "friends" | "family";
  pace: "slow" | "balanced" | "packed";
}

interface Ctx {
  ready: boolean;
  profile: Profile | null;
  trips: Trip[];
  session: Session | null;
  saveProfile: (p: Profile) => void;
  upsertTrip: (t: Trip) => void;
  removeTrip: (id: string) => void;
  signOut: () => Promise<void>;
  resetDevice: () => void;
}

const AppCtx = createContext<Ctx | null>(null);
const K_PROFILE = "tk-profile-v1";
const K_TRIPS = "tk-trips-v1";

const read = <T,>(k: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* storage blocked: keep working in memory */
  }
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setProfile(read<Profile | null>(K_PROFILE, null));
    setTrips(read<Trip[]>(K_TRIPS, []));
    setReady(true);
    const c = sb();
    if (!c) return;
    c.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = c.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  // On sign-in: pull the account's data, or push this device's data if the account is new.
  useEffect(() => {
    const c = sb();
    const uid = session?.user.id;
    if (!c || !uid) return;
    (async () => {
      const [{ data: prof }, { data: cloudTrips }] = await Promise.all([
        c.from("profiles").select("data").eq("id", uid).maybeSingle(),
        c.from("trips").select("id,country,status,start_date,end_date,note").eq("user_id", uid),
      ]);
      if (prof?.data) {
        setProfile(prof.data as Profile);
        write(K_PROFILE, prof.data);
      } else {
        const local = read<Profile | null>(K_PROFILE, null);
        if (local) await c.from("profiles").upsert({ id: uid, data: local });
      }
      if (cloudTrips && cloudTrips.length) {
        const t = cloudTrips.map((r) => ({ id: r.id, country: r.country, status: r.status, start: r.start_date ?? undefined, end: r.end_date ?? undefined, note: r.note ?? undefined })) as Trip[];
        setTrips(t);
        write(K_TRIPS, t);
      } else {
        const local = read<Trip[]>(K_TRIPS, []);
        if (local.length) await c.from("trips").upsert(local.map((t) => toRow(t, uid)));
      }
    })().catch((e) => console.error("sync", e));
  }, [session?.user.id]);

  const saveProfile = useCallback((p: Profile) => {
    setProfile(p);
    write(K_PROFILE, p);
    const c = sb();
    const uid = session?.user.id;
    if (c && uid) c.from("profiles").upsert({ id: uid, data: p }).then(({ error }) => error && console.error(error.message));
  }, [session?.user.id]);

  const upsertTrip = useCallback((t: Trip) => {
    setTrips((prev) => {
      const next = prev.some((x) => x.id === t.id) ? prev.map((x) => (x.id === t.id ? t : x)) : [...prev, t];
      write(K_TRIPS, next);
      return next;
    });
    const c = sb();
    const uid = session?.user.id;
    if (c && uid) c.from("trips").upsert(toRow(t, uid)).then(({ error }) => error && console.error(error.message));
  }, [session?.user.id]);

  const removeTrip = useCallback((id: string) => {
    setTrips((prev) => {
      const next = prev.filter((x) => x.id !== id);
      write(K_TRIPS, next);
      return next;
    });
    const c = sb();
    if (c && session?.user.id) c.from("trips").delete().eq("id", id).then(({ error }) => error && console.error(error.message));
  }, [session?.user.id]);

  const signOut = useCallback(async () => {
    await sb()?.auth.signOut();
  }, []);

  const resetDevice = useCallback(() => {
    try {
      localStorage.removeItem(K_PROFILE);
      localStorage.removeItem(K_TRIPS);
    } catch {}
    setProfile(null);
    setTrips([]);
  }, []);

  const value = useMemo(() => ({ ready, profile, trips, session, saveProfile, upsertTrip, removeTrip, signOut, resetDevice }), [ready, profile, trips, session, saveProfile, upsertTrip, removeTrip, signOut, resetDevice]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

function toRow(t: Trip, uid: string) {
  return { id: t.id, user_id: uid, country: t.country, status: t.status, start_date: t.start || null, end_date: t.end || null, note: t.note || null };
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}

export const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));

/** Visa status row for the traveller's passport, fetched once and cached. */
const visaCache = new Map<string, Promise<Record<string, number | string>>>();
export function useVisaRow(passport: string | undefined) {
  const [row, setRow] = useState<Record<string, number | string> | null>(null);
  useEffect(() => {
    if (!passport) return;
    let p = visaCache.get(passport);
    if (!p) {
      p = fetch(`/api/visa?passport=${passport}`).then((r) => (r.ok ? r.json() : {})).then((j: { row?: Record<string, number | string> }) => j.row ?? {});
      visaCache.set(passport, p);
    }
    let live = true;
    p.then((r) => live && setRow(r)).catch(() => live && setRow({}));
    return () => { live = false; };
  }, [passport]);
  return row;
}
