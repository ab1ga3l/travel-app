# Soft Passport

Visa help, country guides and an AI travel assistant, built Africa-first.

- **Visa Hub**: 100 pre-built route pages (10 African passports × 10 destinations: Schengen countries, UK, US, Canada and UAE) with requirements, fees, processing times, document checklists, official links and community visa stories.
- **Country guides**: 36 countries across Africa, Asia and Europe, with best months, weather, currency, plugs, daily budgets, money tips and itineraries (all 14 African guides have one).
- **Ama, the AI agent**: answers visa and trip questions using the site's own data through tools, powered by Claude.
- **Revenue**: Visa Ready membership, paid application reviews, affiliate partners and sponsored listings. See [docs/BUSINESS_PLAN.md](docs/BUSINESS_PLAN.md).

## Tech

Next.js 16 (App Router) · TypeScript · Claude API (`@anthropic-ai/sdk` tool runner, model `claude-opus-5-5`) · Supabase (community stories, newsletter) · Stripe Payment Links.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the keys you have
npm run dev                  # http://localhost:3000
```

The site works with no keys at all. The AI agent, stories, newsletter, payments and partner offers switch on as you add each key.

## Set up the services

1. **Claude API**: create a key at [platform.claude.com](https://platform.claude.com) and set `ANTHROPIC_API_KEY`.
2. **Supabase**: create a project, run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor, and set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. New stories arrive with `approved_for_display = false`; approve them in the Supabase table editor.
3. **Stripe**: create two Payment Links (Visa Ready subscription, Application Review one-off) and paste the URLs.
4. **Affiliates**: join the partner programs you want (insurance, eSIM, hotels, tours, flights) and paste your tracking links. Offers without a link stay hidden.

## Deploy

Push to GitHub, import the repo in [Vercel](https://vercel.com/new), add the same environment variables and deploy. Set `NEXT_PUBLIC_SITE_URL` to your domain so the sitemap is correct.

## Where things live

| Path | What it is |
|---|---|
| `src/lib/visa.ts` | Visa rules, passports, destinations, playbook. **Review every quarter.** |
| `src/lib/countries.ts` | Country guide data |
| `src/lib/agent.ts` | Ama: system prompt and tools |
| `src/lib/site.ts` | Plans, prices and partner links |
| `src/app/` | Pages and API routes |
| `docs/` | Business plan, design system and image guide |

## Before launch

- [ ] Have a lawyer review `/legal` for the country you register in.
- [ ] Move the free-question limit in `src/app/api/chat/route.ts` to a shared store (Supabase or Upstash).
- [ ] Add accounts (Supabase Auth) so Visa Ready members get unlimited questions.
- [ ] Add a social share image at `public/og.png` (see `docs/IMAGES.md`).
- [ ] Re-check every fee and rule in `src/lib/visa.ts` against the official links.
