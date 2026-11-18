# Images: what to use and where to get them

The site ships with **no stock photos** on purpose. It uses an original geometric band (`src/components/Band.tsx`), color and typography so it loads fast on mobile data and feels like a product, not a brochure. Add photos only where they build trust.

## Where photos help (add these first)

| Spot | What to show | Why |
|---|---|---|
| Homepage hero (right side, behind the card, optional) | A young African traveler at an airport or holding a passport, smiling, natural light | People trust faces like their own |
| Country guide headers | One honest photo per country: a real street, market or landscape, not a filtered postcard | Sets the mood; helps social sharing |
| About page | You, the founder, on a real trip | The biggest trust signal on the site |
| Visa stories (later) | Optional traveler photos, no documents visible | Social proof |
| Social share image (`/public/og.png`, 1200×630) | Logo, tagline and the geometric band | Shows up when links are shared on WhatsApp, X and LinkedIn |

## Where photos hurt

- **Visa pages:** keep them text-first and fast. A photo of a passport stamp adds nothing.
- **Passport or document images:** never show real documents. They invite misuse and look like scam sites.
- **Stock "happy tourists" images** that look nothing like your audience.

## Where to get them legally

- **Your own photos and your community's**, with written permission. This is the best option.
- **Unsplash** (unsplash.com) and **Pexels** (pexels.com): free for commercial use. Credit the photographer anyway; it's good practice.
- **African photographers and agencies:** for example, browse African photography collectives and commission a small set of trusted images. This also gives you social content.
- **Avoid** images pulled from Google, Instagram or TikTok without permission.

## How to add one

1. Save the file in `public/images/` (WebP or JPG, under 300 KB, at least 1600 px wide for headers).
2. Use Next.js `<Image>` so it's resized automatically:

```tsx
import Image from "next/image";
<Image src="/images/kenya.jpg" alt="Matatu street in Nairobi at dusk" width={1600} height={900} priority />
```

3. Always write real alt text that describes the photo.

`next.config.ts` already allows images hosted on `images.unsplash.com` and `images.pexels.com` if you'd rather link than download.
