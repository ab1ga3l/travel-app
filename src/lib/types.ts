// Shared types for the web app and the mobile app. No imports from React, Next or Expo here.
import type { AssistantStyle, Interest, Vibe } from "./site";

export type PlaceStatus = "been" | "going" | "dream";
export interface Place { id: string; country: string; status: PlaceStatus; start?: string; end?: string; note?: string }
export interface Profile {
  name: string;
  passport: string; // ISO2: where you're from
  home?: string; // ISO2: where you live now
  currency?: string;
  vibes: Vibe[];
  interests?: Interest[];
  picks?: string[]; // what they chose on "What's your vibe?" (vibes + interests are derived from these)
  budget: "backpacker" | "comfy" | "treat";
  company: "solo" | "couple" | "friends" | "family";
  pace: "slow" | "balanced" | "packed";
  assistantStyle?: AssistantStyle;
  assistantNickname?: string;
  onboarded?: boolean;
  publicMap?: boolean;
}
export type Vote = "yes" | "no" | "abstain";
