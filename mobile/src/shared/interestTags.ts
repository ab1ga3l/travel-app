// GENERATED from src/lib/interestTags.ts by scripts/sync-shared.js. Do not edit here.
import type { EventTag } from "./events";
import type { Interest } from "./site";

/** Which event tags each interest cares about. */
export const INTEREST_TAGS: Partial<Record<Interest, EventTag[]>> = {
  festivals: ["music", "culture"],
  tech: ["tech"],
  crypto: ["tech"],
  sports: ["sports"],
  faith: ["faith"],
  foodie: ["food"],
  wellness: ["nature"],
  family: ["culture", "nature"],
};

export const tagsFor = (interests: Interest[] = []) => Array.from(new Set(interests.flatMap((i) => INTEREST_TAGS[i] ?? [])));

/** BTC Map: merchants that accept bitcoin, centred on a country. */
export const btcMapUrl = (countryName: string) => `https://btcmap.org/map#${encodeURIComponent(countryName)}`;
