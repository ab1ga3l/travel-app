# Design: "Adire Night"

## The idea
Aviora should feel like the moment before a trip: the night sky before an early flight, the sun coming up on the way to the airport. It's built Africa-first, so the palette comes from **adire**, the indigo resist-dyed cloth of West Africa, and from the **harmattan sunrise**.

## Colors

| Token | Dark | Light | Meaning |
|---|---|---|---|
| `--bg` | `#0B1026` night indigo | `#F5F4FF` lavender white | Calm canvas. Dark mode is the signature look. |
| `--sunrise` → `--gold` | `#FF6B4A` → `#FFC24B` | deeper versions | "Let's go": main buttons, highlights, gradient headlines |
| `--mint` | `#3DDBB4` | `#0E9F7E` | Good news: visa-free, approved, been there |
| `--gold` alone | `#FFC24B` | `#B67A00` | Takes a little effort: eVisa, trips coming up, this month |
| `--sunrise` alone | `#FF6B4A` | `#E5532F` | Plan ahead: visa required, not-ideal months |
| `--lilac` | `#B79CFF` | `#7B5CE0` | People and community, dream trips, vibes |
| `--indigo` | `#5B6CF0` | `#3443B8` | Adire indigo for art and maps |

Colors always mean the same thing. Mint is always "good", gold is always "some effort", coral is always "plan ahead".

## Type
- **Unbounded** for headings: wide and confident, like a boarding pass or departure board.
- **Instrument Sans** for body text: clean and very readable on small phones.
- **IBM Plex Mono** for labels, months and stamps, like travel documents.

## Art without stock photos
- **Country posters** are generated: a sky gradient by region (Africa = sunrise, Asia = lagoon, Europe = lilac dusk) with an adire-inspired motif of concentric circles, dots and stitched lines. Each country gets its own variation. They load instantly on mobile data and never look like generic stock photos.
- **Feel it scenes** are animated illustrations (ocean, forest, city, market, waterfall, desert wind) paired with a generated soundscape.
- Real photos from travellers can come later through the community. See `IMAGES.md`.

## Layout
- **App-first:** on phones, a bottom tab bar (Home, Discover, Visa, My trips, Community) and a top bar with Wazi; on desktop, a side menu.
- **Installable:** `manifest.webmanifest` lets people add it to their home screen like an app. The same code can later be wrapped for the App Store and Google Play (for example with Capacitor), or rebuilt in React Native.
- **One job per screen.** Personal info comes first: your passport's visa status, your vibe match, your trips.
- **Facts always carry a date and a source.**
