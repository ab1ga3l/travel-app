import "server-only";
// Visa stories are written and read on the server with the service role key, and only
// stories approved by a moderator are shown publicly.
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const admin = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

export interface VisaStory {
  id: string; passport: string; destination: string; visa_type: string; outcome: "approved" | "refused" | "pending";
  applied_at: string | null; days_waited: number | null; total_cost_usd: number | null; documents: string[];
  refusal_reason: string | null; advice: string | null; created_at: string;
}

export async function getStories(passport: string, destination: string): Promise<VisaStory[]> {
  if (!admin) return [];
  const { data, error } = await admin.from("visa_stories").select("*").eq("passport", passport).eq("destination", destination)
    .eq("approved_for_display", true).order("created_at", { ascending: false }).limit(50);
  if (error) { console.error("getStories", error.message); return []; }
  return (data ?? []) as VisaStory[];
}
