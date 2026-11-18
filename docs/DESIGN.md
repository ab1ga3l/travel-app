# Design

## Colors: "Harmattan Dusk"

| Token | Color | Meaning |
|---|---|---|
| `--ink` | `#14213D` deep indigo | Trust and seriousness, like a passport cover. Hero, footer and text. |
| `--sun` | `#F2A541` sunset gold | Warmth and optimism, the African sun. Highlights and the main "Check visa" action. |
| `--forest` | `#0F5C4D` savanna green | Approved and safe. Good months, approvals and official links. |
| `--hibiscus` | `#C8306E` hibiscus | Energy and the brand mark. Primary buttons such as Ask and Join. |
| `--bg` / `--surface` | cool off-white / white | Calm, readable pages. |

Red is used only for "not ideal" months and refusals, so it always means something. Every color has a dark-mode version that follows the visitor's system setting.

## Type

- **Bricolage Grotesque** for headings: friendly, modern, a bit of personality.
- **Figtree** for body text: very readable on small phones.
- **JetBrains Mono** for small labels and "stamps", which echoes passport stamps and airport codes.

## Layout principles

1. **One job per page.** The homepage gets people to check a route or ask Ama. A route page gets them to prepare (checklist), learn (stories) and act (review or insurance).
2. **Hard facts first, then community, then offers.** Trust comes before selling.
3. **Every fact has a date and an official link.**
4. **Mobile-first.** Most visitors will be on phones and mobile data, so there are no heavy images or video by default.
5. **Clear labels on money.** Partner links say they're partner links. Paid plans say exactly what's included.

## Page map

```
/                         Hero (visa checker + Ama), problems, popular routes, in-season countries, how it works, plans, email
/visa                     Picker, routes by passport, visa types, playbook
/visa/[passport]-to-[dest] Requirements, checklist, community stats and stories, share form, official links, review offer, partners
/countries                Africa → Asia → Europe grids with month strips
/countries/[slug]         Best months, weather, itinerary, facts, budget, money tip, partners
/agent                    Full chat with Ama
/pricing                  Free, Visa Ready, Application Review
/about, /legal            Trust pages
```
