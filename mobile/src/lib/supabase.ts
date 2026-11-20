// Supabase client for accounts, group trips, votes and the community.
// Without EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY the app runs in "on this phone" mode.
import "expo-sqlite/localStorage/install";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
export function sb(): SupabaseClient | null {
  if (!url || !anon) return null;
  if (!client) client = createClient(url, anon, { auth: { storage: localStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } });
  return client;
}
export const cloudEnabled = Boolean(url && anon);

/** The web app's API (Aviora chat, trip text parsing). */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");
