# Tokende

*"Let's go!" in Lingala. Working name: change it in `src/lib/site.ts`.*

A travel app built Africa-first: know before you go, then go.

## What it does
- **Your travel style:** a quick quiz (passport, vibes like clubbing or nature, budget, who's coming, pace) personalises everything.
- **Discover:** 36 country guides (Africa, Asia, Europe) with the best months, weather, currency, plugs, budgets, things to do by vibe, dos and don'ts, and **"Could you live here?"**, which covers cost of living and residence routes.
- **Hidden gems you can feel:** 55 spots with an animated scene and a generated soundscape, links to look around in 360° and watch walk-throughs (or use VR), and **Worth it / Skip it** verdicts with what people paid, how busy it was, the best time and whether women felt safe.
- **Visa centre:** an entry rule for **every passport and every country**, from the open Passport Index dataset (Feb 2026). For Schengen, the UK, the US, Canada and the UAE it adds documents, bank statements, fees, how to pay, processing, extensions and official links. Community visa stories show approval rates, waits and costs.
- **My trips:** a world map of where you've been, are going and dream of, plus trip cards linked to visa checklists.
- **Community:** posts and replies by topic and country, with source links to TikTok, Instagram, X or blogs.
- **Wazi** ("open, clear" in Swahili): an AI assistant on Claude that knows your passport and vibe, uses the app's data, and checks official sites with live web search.
- **Deals and partners:** affiliate and partner slots so the app stays free.
- **Installable:** add it to your home screen like an app. Ready to wrap for the app stores later.

## Run it
```bash
npm install
cp .env.example .env.local   # add the keys you have; all are optional
npm run dev                  # http://localhost:3000
```

## Turn features on
| Feature | What to add |
|---|---|
| Wazi | `ANTHROPIC_API_KEY` |
| Accounts, trip sync, community, verdicts | Supabase project + run `supabase/schema.sql` + `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; enable Email (magic link) sign-in |
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
| `src/lib/wazi.ts` | The AI assistant: prompt and tools |
| `src/lib/soundscape.ts`, `src/components/FeelIt.tsx` | Feel it: generated sound and scenes |
| `docs/` | Design system, business plan, image guide |

## Before launch
- Have a lawyer review `/legal`.
- Move Wazi's daily limit to a shared store (Supabase or Upstash).
- Re-check fees and rules in `src/lib/visa.ts` against the official links.
- Agree the final name and update `APP.name`.
