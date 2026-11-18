"use client";
// Browser Supabase client for accounts, trip sync, community posts and spot ratings.
// Without these env vars the app runs in "on this device" mode.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
export function sb(): SupabaseClient | null {
  if (!url || !anon) return null;
  if (!client) client = createClient(url, anon);
  return client;
}
export const cloudEnabled = Boolean(url && anon);
