// Community data (visa stories) lives in Supabase. If the env vars are missing, the site
// still works and shows an empty state that invites people to share.
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = url && serviceKey ? createClient(url, serviceKey, { auth: { persistSession: false } }) : null;

export interface VisaStory {
  id: string;
  passport: string;
  destination: string;
  visa_type: string;
  outcome: "approved" | "refused" | "pending";
  applied_at: string | null;
  days_waited: number | null;
  total_cost_usd: number | null;
  documents: string[];
  refusal_reason: string | null;
  advice: string | null;
  created_at: string;
}

export async function getStories(passport: string, destination: string): Promise<VisaStory[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("visa_stories")
    .select("*")
    .eq("passport", passport)
    .eq("destination", destination)
    .eq("approved_for_display", true)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error("getStories", error.message);
    return [];
  }
  return (data ?? []) as VisaStory[];
}
