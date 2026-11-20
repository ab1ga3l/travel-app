// Phone app state (ported from the web store). Everything is saved on the phone first (works offline and without an account)
// and synced to the traveller's account when they're signed in. Group trips are shared with
// every member of the trip in the cloud.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { AppState } from "react-native";
import { sb } from "./supabase";
import type { TripDoc } from "@/shared/tripTypes";
import matrix from "@/shared/visa-matrix.json";

export type { Place, PlaceStatus, Profile, Vote } from "@/shared/types";
import type { Place, Profile, Vote } from "@/shared/types";

interface Ctx {
  ready: boolean;
  profile: Profile | null;
  places: Place[];
  tripDocs: TripDoc[];
  session: Session | null;
  seenIntro: boolean;
  guest: boolean;
  markIntroSeen: () => void;
  continueAsGuest: () => void;
  exitGuest: () => void;
  saveProfile: (p: Profile) => void;
  upsertPlace: (t: Place) => void;
  removePlace: (id: string) => void;
  saveTrip: (t: TripDoc) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  joinTrip: (code: string, me: { name: string; passport: string }) => Promise<TripDoc | null>;
  castVote: (trip: TripDoc, proposalId: string, v: Vote) => Promise<void>;
  myVotes: (tripId: string) => Promise<Record<string, Vote>>;
  voteResults: (tripId: string) => Promise<Record<string, { yes: number; no: number; abstain: number }>>;
  signOut: () => Promise<void>;
  resetDevice: () => void;
}

const AppCtx = createContext<Ctx | null>(null);
const K = { profile: "tk-profile-v1", places: "tk-trips-v1", trips: "tk-tripdocs-v1", intro: "tk-intro-v1", guest: "tk-guest-v1" };

const read = <T,>(k: string, fallback: T): T => {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
};
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } };

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [tripDocs, setTripDocs] = useState<TripDoc[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [seenIntro, setSeenIntro] = useState(false);
  const [guest, setGuest] = useState(false);
  const tripsRef = useRef<TripDoc[]>([]);
  tripsRef.current = tripDocs;

  useEffect(() => {
    setProfile(read<Profile | null>(K.profile, null));
    setPlaces(read<Place[]>(K.places, []));
    setTripDocs(read<TripDoc[]>(K.trips, []));
    setSeenIntro(read<boolean>(K.intro, false));
    setGuest(read<boolean>(K.guest, false));
    setReady(true);
    const c = sb();
    if (!c) return;
    c.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = c.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const uid = session?.user.id;

  const loadCloudTrips = useCallback(async () => {
    const c = sb();
    if (!c || !uid) return;
    const { data, error } = await c.from("trips").select("id,data").order("updated_at", { ascending: false });
    if (error) return console.error("trips", error.message);
    const docs = (data ?? []).map((r) => ({ ...(r.data as TripDoc), id: r.id as string }));
    setTripDocs(docs);
    write(K.trips, docs);
  }, [uid]);

  // On sign-in: pull the account's data, or push this device's data if the account is new.
  useEffect(() => {
    const c = sb();
    if (!c || !uid) return;
    (async () => {
      const [{ data: prof }, { data: cloudPlaces }] = await Promise.all([
        c.from("profiles").select("data").eq("id", uid).maybeSingle(),
        c.from("places").select("id,country,status,start_date,end_date,note").eq("user_id", uid),
      ]);
      if (prof?.data) { setProfile(prof.data as Profile); write(K.profile, prof.data); }
      else { const local = read<Profile | null>(K.profile, null); if (local) await c.from("profiles").upsert({ id: uid, data: local }); }
      if (cloudPlaces?.length) {
        const t = cloudPlaces.map((r) => ({ id: r.id, country: r.country, status: r.status, start: r.start_date ?? undefined, end: r.end_date ?? undefined, note: r.note ?? undefined })) as Place[];
        setPlaces(t); write(K.places, t);
      } else {
        const local = read<Place[]>(K.places, []);
        if (local.length) await c.from("places").upsert(local.map((t) => placeRow(t, uid)));
      }
      // Trips made on this device before signing in move into the account.
      const localTrips = read<TripDoc[]>(K.trips, []);
      const { data: existing } = await c.from("trips").select("id");
      const have = new Set((existing ?? []).map((r) => r.id));
      for (const t of localTrips.filter((x) => !have.has(x.id))) {
        const doc = { ...t, members: t.members.map((m) => (m.role === "owner" ? { ...m, userId: uid } : m)) };
        const { error } = await c.from("trips").insert({ id: t.id, code: t.code, owner: uid, data: doc });
        if (!error) await c.from("trip_members").insert({ trip_id: t.id, user_id: uid, member_id: doc.members.find((m) => m.role === "owner")?.id });
      }
      await loadCloudTrips();
    })().catch((e) => console.error("sync", e));
    const ch = c.channel("trips-live").on("postgres_changes", { event: "*", schema: "public", table: "trips" }, () => loadCloudTrips()).subscribe();
    const sub = AppState.addEventListener("change", (st) => { if (st === "active") loadCloudTrips(); });
    return () => { c.removeChannel(ch); sub.remove(); };
  }, [uid, loadCloudTrips]);

  const saveProfile = useCallback((p: Profile) => {
    setProfile(p); write(K.profile, p);
    const c = sb();
    if (c && uid) {
      c.from("profiles").upsert({ id: uid, data: p }).then(({ error }) => error && console.error(error.message));
      if (p.publicMap !== undefined) c.from("public_profiles").upsert({ user_id: uid, display_name: p.name || "Traveller", home_country: p.passport, is_public: !!p.publicMap }).then(({ error }) => error && console.error(error.message));
    }
  }, [uid]);

  // Keep the public "been there" list in sync when the traveller opted in.
  const beenKey = places.filter((x) => x.status === "been").map((x) => x.country).sort().join(",");
  useEffect(() => {
    const c = sb();
    if (!c || !uid || !profile?.publicMap) return;
    c.from("public_profiles").upsert({ user_id: uid, display_name: profile.name || "Traveller", home_country: profile.passport, is_public: true, been: beenKey ? beenKey.split(",") : [] })
      .then(({ error }) => error && console.error(error.message));
  }, [uid, profile?.publicMap, profile?.name, profile?.passport, beenKey]);

  const upsertPlace = useCallback((t: Place) => {
    setPlaces((prev) => { const next = prev.some((x) => x.id === t.id) ? prev.map((x) => (x.id === t.id ? t : x)) : [...prev, t]; write(K.places, next); return next; });
    const c = sb();
    if (c && uid) c.from("places").upsert(placeRow(t, uid)).then(({ error }) => error && console.error(error.message));
  }, [uid]);

  const removePlace = useCallback((id: string) => {
    setPlaces((prev) => { const next = prev.filter((x) => x.id !== id); write(K.places, next); return next; });
    const c = sb();
    if (c && uid) c.from("places").delete().eq("id", id).then(({ error }) => error && console.error(error.message));
  }, [uid]);

  const saveTrip = useCallback(async (t: TripDoc) => {
    const doc = { ...t, updatedAt: new Date().toISOString() };
    const exists = tripsRef.current.some((x) => x.id === doc.id);
    const next = exists ? tripsRef.current.map((x) => (x.id === doc.id ? doc : x)) : [doc, ...tripsRef.current];
    setTripDocs(next); write(K.trips, next);
    const c = sb();
    if (!c || !uid) return;
    if (exists) {
      const { error } = await c.from("trips").update({ data: doc, updated_at: doc.updatedAt }).eq("id", doc.id);
      if (error) console.error("save trip", error.message);
    } else {
      const { error } = await c.from("trips").insert({ id: doc.id, code: doc.code, owner: uid, data: doc });
      if (error) return console.error("create trip", error.message);
      await c.from("trip_members").insert({ trip_id: doc.id, user_id: uid, member_id: doc.members.find((m) => m.role === "owner")?.id });
    }
  }, [uid]);

  const deleteTrip = useCallback(async (id: string) => {
    const next = tripsRef.current.filter((x) => x.id !== id);
    setTripDocs(next); write(K.trips, next);
    const c = sb();
    if (c && uid) await c.from("trips").delete().eq("id", id);
  }, [uid]);

  const joinTrip = useCallback(async (code: string, me: { name: string; passport: string }) => {
    const c = sb();
    if (!c || !uid) return null;
    const { data, error } = await c.rpc("join_trip", { p_code: code.trim().toUpperCase(), p_name: me.name || "Traveller", p_passport: me.passport });
    if (error || !data) { console.error("join", error?.message); return null; }
    await loadCloudTrips();
    return { ...(data as TripDoc) };
  }, [uid, loadCloudTrips]);

  const castVote = useCallback(async (trip: TripDoc, proposalId: string, v: Vote) => {
    const c = sb();
    if (c && uid) {
      const { error } = await c.from("trip_votes").upsert({ trip_id: trip.id, proposal_id: proposalId, user_id: uid, choice: v });
      if (error) console.error("vote", error.message);
      return;
    }
    await saveTrip({ ...trip, proposals: trip.proposals.map((p) => (p.id === proposalId ? { ...p, localVote: v } : p)) });
  }, [uid, saveTrip]);

  const myVotes = useCallback(async (tripId: string) => {
    const c = sb();
    if (!c || !uid) return {};
    const { data } = await c.from("trip_votes").select("proposal_id,choice").eq("trip_id", tripId).eq("user_id", uid);
    return Object.fromEntries((data ?? []).map((r) => [r.proposal_id, r.choice])) as Record<string, Vote>;
  }, [uid]);

  const voteResults = useCallback(async (tripId: string) => {
    const c = sb();
    if (!c || !uid) return {};
    const { data } = await c.rpc("trip_vote_results", { p_trip: tripId });
    return Object.fromEntries(((data ?? []) as { proposal_id: string; yes: number; no: number; abstain: number }[]).map((r) => [r.proposal_id, { yes: r.yes, no: r.no, abstain: r.abstain }]));
  }, [uid]);

  const signOut = useCallback(async () => { await sb()?.auth.signOut(); }, []);
  const markIntroSeen = useCallback(() => { setSeenIntro(true); write(K.intro, true); }, []);
  const continueAsGuest = useCallback(() => { setGuest(true); write(K.guest, true); }, []);
  const exitGuest = useCallback(() => { setGuest(false); write(K.guest, false); }, []);
  const resetDevice = useCallback(() => {
    try { Object.values(K).forEach((k) => localStorage.removeItem(k)); } catch {}
    setProfile(null); setPlaces([]); setTripDocs([]); setSeenIntro(false); setGuest(false);
  }, []);

  const value = useMemo<Ctx>(() => ({
    ready, profile, places, tripDocs, session, seenIntro, guest, markIntroSeen, continueAsGuest, exitGuest, saveProfile, upsertPlace, removePlace,
    saveTrip, deleteTrip, joinTrip, castVote, myVotes, voteResults, signOut, resetDevice,
  }), [ready, profile, places, tripDocs, session, seenIntro, guest, markIntroSeen, continueAsGuest, exitGuest, saveProfile, upsertPlace, removePlace, saveTrip, deleteTrip, joinTrip, castVote, myVotes, voteResults, signOut, resetDevice]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

function placeRow(t: Place, uid: string) {
  return { id: t.id, user_id: uid, country: t.country, status: t.status, start_date: t.start || null, end_date: t.end || null, note: t.note || null };
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}

export const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));

/** Visa status row for a passport, from the bundled open dataset: works offline. */
const DATA = (matrix as unknown as { data: Record<string, Record<string, number | string>> }).data;
export const visaRow = (passport: string | undefined): Record<string, number | string> => (passport ? DATA[passport.toUpperCase()] ?? {} : {});
export const useVisaRow = (passport: string | undefined) => useMemo(() => visaRow(passport), [passport]);
