# Tokende for iPhone and Android

The native app, built with Expo (React Native). It shares its data and logic with the website
in the folder above, and uses the same Supabase backend and the same Aviora assistant.

## What's in it
- **First run:** create an account or log in (phone code, email code, Google, Apple, or try as a guest) → intro slides → about you → your vibe → how you travel → your assistant.
- **Tabs:** Home (where your passport can go, with a map and lists), Explore, Trips, My map, Visa.
- **Trips:** guided "Guide me step by step" (or describe it in one sentence), manual, or join with a code.
  Each trip has Plan, Ready (a checklist per passport), Vote (sealed votes), Pot (group money tracker),
  Split, Safety (check-ins, SOS, emergency numbers) and Crew (invite code, treasurer).
- **My map:** been / going / dream, % of the world, continents, passport stamps, badges, streaks, share.
- **Works offline:** your profile, trips and the visa data for every passport live on the phone.

## Try it on your phone
1. Install **Expo Go** from the App Store or Google Play.
2. On your computer:
   ```bash
   cd mobile
   npm install
   cp .env.example .env   # optional: add your keys
   npx expo start
   ```
3. Scan the QR code with your phone's camera (iPhone) or with Expo Go (Android).

## Preview it in a browser
The website serves a web preview of this app at **/app** (for example `https://your-site.vercel.app/app`).
After changing the app, rebuild the preview and commit it:
```bash
npm run preview:site
```
This writes to `../public/app`. The real phone app (Expo Go or a store build) feels smoother and uses the phone's own tab bar.

## Build for the App Store and Google Play
Builds run in the cloud with Expo, so you don't need a Mac for the iPhone version.
```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform all --profile production
npx eas-cli@latest submit --platform all
```
You need an Apple Developer account ($99/year) and a Google Play developer account ($25 once).
`--profile preview` makes an installable test version to share with friends first.

## Shared code
`src/shared/` is copied from `../src/lib` (countries, gems, visa rules, trips, badges and more).
Edit the originals there, then run `npm run sync`. Never edit `src/shared` by hand.

## Check your changes
```bash
npm run typecheck
npx expo lint
```
