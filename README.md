# Tokende

*Working name for the app ("Let's go!" in Lingala); change it in `src/lib/site.ts`. The AI assistant is called **Aviora**.*

A travel app built Africa-first: know before you go, then go.

## What it does
**First run:** intro slides (skippable) → create an account (phone, email, Google or Apple, or try as a guest) → About you (name, passport, where you live, currency and local payment methods are set automatically) → vibe → interests → how you travel → your assistant (style and a nickname). Then the first trip.

- **Home:** for your passport, a world map and lists of where you can go **visa-free, on arrival, with an eVisa, or with a visa**, plus your trips, go-now picks, events for your interests and hidden gems.
- **New trip:** a big **✨ Guide me step by step** (what, occasion, who, where, when, budget), or type a paragraph and Aviora fills in the answers, or create it manually.
- **Trip dashboard:** **Plan** (days, gems, route in Maps) · **Ready** (a checklist and visa status for each member's passport) · **Vote** (propose, vote yes/no/abstain, sealed until the deadline, reveal) · **Pot** (a group money tracker: pay the treasurer by M-Pesa, bank or card, mark paid, treasurer confirms, see how the money is spent) · **Split** (expenses, settle up with the fewest transfers) · **Safety** · **Crew** (invite code, WhatsApp share, roles).
- **Occasions:** birthday, honeymoon, proposal, wedding, anniversary, bachelorette, graduation, festival, match, workation, with suggested destinations.
- **My map:** Been-style map of where you've been, are going and dream of, % of the world, continents, passport stamps, badges, travel streaks, a shareable image, and a "where my passport can go" mode.
- **Safety check-in:** trusted contact, "I've arrived safely", share my plan and SOS via WhatsApp, emergency numbers, tips for solo women travellers.
- **Pocket (offline):** your next trip's plan, emergency numbers, currency converter, phrases and checklist, cached for no signal.
- **Events:** festivals and events by month and interest, with "plan a trip around this".
- **Move abroad:** a few questions, then a move plan: routes for your reason, timeline, costs in your currency, settling in, culture, scams to avoid, scouting trip, compare countries.
- **Discover:** 36 country guides with best months, budgets, things to do by vibe, dos and don'ts and "Could you live here?".
- **Hidden gems you can feel:** 55 spots with generated scenes and soundscapes and **Worth it / Skip it** verdicts.
- **Visa centre:** entry rules for every passport and country (Passport Index open dataset, Feb 2026), deep guides for Schengen, UK, US, Canada and UAE, and community visa stories.
- **Community:** posts by topic and country, and **people who've been there** (opt-in "been there" badges from their map).
- **Aviora**, the AI assistant (Claude): knows your passport, interests and chosen tone, uses the app's data and live web search.
- **Deals and partners** keep the app free for travellers. **Installable** as an app (PWA).

## The phone app
The native iPhone and Android app lives in [`mobile/`](mobile/README.md) (Expo / React Native). It shares the data and logic in `src/lib` and uses the same backend.

## Run it
```bash
npm install
cp .env.example .env.local   # add the keys you have; all are optional
npm run dev                  # http://localhost:3000
```

## Turn features on
| Feature | What to add |
|---|---|
| Aviora | `ANTHROPIC_API_KEY` |
| Accounts, group trips, votes, community, verdicts | Supabase project + run `supabase/schema.sql` + `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; enable Phone, Email, Google and Apple sign-in; turn on Realtime for `trips` |
| Visa stories, newsletter | `SUPABASE_SERVICE_ROLE_KEY` (server only). Approve stories by setting `approved_for_display = true` |
| Deals | Your partner links (`NEXT_PUBLIC_AFF_*`) |
| Paid review | `NEXT_PUBLIC_REVIEW_URL` |

## Deploy
Import the repo on [vercel.com/new](https://vercel.com/new), add the same environment variables, and deploy.

## Where things live
| Path | What |
|---|---|
| `src/lib/countries.ts`, `countryExtras.ts` | Country guides, vibes, things to do, etiquette, living there |
| `src/lib/gems.ts` | Hidden gems and their "feel" profile |
| `src/lib/visa.ts` | Curated visa rules (review every quarter) |
| `src/data/visa-matrix.json` | Entry rules for 199 passports (refresh from github.com/imorte/passport-index-data) |
| `src/lib/assistant.ts` | The AI assistant: prompt and tools |
| `src/lib/store.tsx` | Device + cloud state: profile, map, trips, votes |
| `src/lib/tripTypes.ts`, `tripBuild.ts`, `src/components/trip/` | Group trips: plan, ready, vote, pot, split, safety, crew |
| `src/lib/geo.ts`, `events.ts`, `badges.ts` | Continents, currencies, payment methods, emergency numbers, events, badges |
| `public/sw.js` | Offline cache (production only) |
| `src/lib/soundscape.ts`, `src/components/FeelIt.tsx` | Feel it: generated sound and scenes |
| `docs/` | Design system, business plan, image guide |

## Before launch
- Money: the Pot is a **tracker** only; money goes person to person. Holding or paying out group money needs a licensed partner (e.g. M-Pesa/Paystack/Flutterwave collections, or a regulated wallet) before it is built in.
- Group trips save the whole trip at once; if two people edit at the same second, the later save wins. Move busy parts (pot, votes) to their own tables when usage grows.
- Have a lawyer review `/legal`.
- Move Aviora's daily limit to a shared store (Supabase or Upstash).
- Re-check fees and rules in `src/lib/visa.ts` against the official links.
- Agree the final name and update `APP.name`.
