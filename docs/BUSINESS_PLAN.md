# Soft Passport: plan to reach $5,000 a month

## The opportunity

Travelers with African passports face the hardest visa process in the world, and most travel sites ignore it.

- **Schengen refusal rates in 2025:** about 48% for Nigeria, 47% for Ghana and 52% for Senegal.
- **Fees lost to refusals:** African applicants paid 42% of all fees kept on refused Schengen applications while making up only 24% of applicants (LAGO Collective analysis of European Commission data).
- **Travel inside Africa is hard too:** only Rwanda and The Gambia let every African passport in visa-free (Africa Visa Openness Index 2025).
- **Flights inside Africa** cost 30–50% more than similar routes elsewhere.
- **Fake visa agents** are common enough that VFS Global issues public warnings in Nigeria and Kenya.

People search for exactly this, for example "Schengen visa for Nigerians" or "UK visa requirements Ghana". These are high-intent searches, and the people searching are about to spend €90–£127 on a fee and much more on the trip.

## How the site makes money

| Revenue stream | How it works | Realistic month-12 target |
|---|---|---|
| **Visa Ready membership** | $9/month or $49/year: unlimited AI agent, personal checklists, cover letter outline, rule-change alerts | 220 members ≈ **$1,900** |
| **Application Review** | $29 one-off: written feedback on completeness within 72 hours (you or a trained assistant do the review) | 45 reviews ≈ **$1,300** |
| **Travel insurance affiliates** | Every Schengen applicant needs €30,000 medical cover, so the insurance offer sits on every Schengen route page | ≈ **$700** |
| **Hotels, tours, eSIM and flights affiliates** | Booking (about 4% of booking value through most programs), GetYourGuide (about 8%), Viator (about 10%), eSIM partners | ≈ **$500** |
| **Sponsored listings** | Vetted, licensed travel agencies and insurers pay for a clearly labeled spot on route pages | 2 sponsors ≈ **$600** |
| **Total** | | **≈ $5,000 / month** |

### What that needs

- **Traffic:** about 40,000–60,000 visits a month, mostly from search and social.
- **Conversion:** at 50,000 visits, 0.5% joining Visa Ready is 250 members, and 0.1% buying a review is 50 reviews.
- **Display ads:** only add them past 50,000 sessions. Travel ad RPMs are about $5–18, which is too little to matter before then and makes the site feel less trustworthy.

### Costs (monthly)

- Hosting: Vercel Hobby or Pro, $0–20.
- Supabase: free tier at first, then about $25.
- Claude API: limited by daily question caps for free users. Watch usage in the Claude Console and adjust `AGENT_DAILY_LIMIT`.
- Domain: about $1.
- Stripe: 2.9% + 30¢ per payment.

## Growth plan

1. **Months 0–2: search pages.** The site ships with 100 route pages (10 passports × 10 destinations) and 36 country guides. Add Asian passports (India, Pakistan, Bangladesh, Philippines) next, since they face similar problems.
2. **Months 0–6: community.** Personally collect the first 50 visa stories from friends, WhatsApp groups and travel communities. Real approval and refusal data is the moat no competitor has.
3. **Short video on TikTok, Instagram and YouTube.** Post one "visa myth vs fact" or "what got me approved" video a day. Every video ends with "check your route on Soft Passport". This is where the Attention Media skills come in.
4. **Email list.** Visa rule changes (EES, ETIAS, fee rises) are news people act on. Send one short email per change, with partner offers.
5. **Partnerships.** Offer travel agencies and student-recruitment agencies a referral fee for Application Reviews.

## What we deliberately left out

- **Booking engines and flight search.** They're expensive to build and impossible to beat Google Flights on. Use affiliate links instead.
- **"Visa approval guaranteed" claims or paid appointment slots.** These are illegal or scam-adjacent in many places, and they destroy trust.
- **Generic "top 10 beaches" content.** It doesn't rank, and it isn't our edge.
- **Stock photo galleries on every page.** They slow the site and don't build trust. Real traveler photos come later through the community.

## Risks and how we handle them

- **Wrong visa information:** every rule shows an "as of" date and an official link, and the AI is told to say "check the embassy" rather than guess. Review the data in `src/lib/visa.ts` every quarter.
- **Legal:** we're not a visa agent or law firm. The disclaimer is on every page, and the legal page needs a lawyer's review before launch.
- **AI costs:** free users get a daily question cap. Move the cap to a shared store such as Supabase or Upstash before traffic grows.

## Sources

- LAGO Collective / European Commission Schengen statistics 2025 (via CNN, Africanews, Mappr)
- Africa Visa Openness Index 2025 (AfDB, African Union)
- AFRAA and African airline industry reporting on intra-African fares
- VFS Global public fraud advisories (Nigeria, Kenya)
- Affiliate commission benchmarks: Travelpayouts, Stay22, program pages (verify current terms in each partner dashboard)
- Travel blog income and RPM reports, 2025–2026
