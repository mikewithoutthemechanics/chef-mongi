# Mongi Fana — Private Chef

An Afro-global private-chef site built for lead generation: a cinematic,
scroll-driven landing page plus a full set of inner pages and a validated
multi-step booking flow.

## Stack

- **React 19 + TypeScript + Vite 6**
- **GSAP 3** — ScrollTrigger, SplitText (both free in GSAP 3.13+)
- **Lenis** — smooth scrolling, driven from the GSAP ticker so ScrollTrigger stays in sync
- **React Router 7** — client-side routing
- **Vitest + Testing Library** — 16 render/behaviour tests
- **Playwright + Chromium** — 26 real-browser tests

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production bundle
npm test           # unit / render tests (jsdom)
npm run test:e2e   # real-browser tests (Chromium)
```

## Pages

| Route          | Purpose                                                         |
| -------------- | --------------------------------------------------------------- |
| `/`            | Landing page — the main conversion surface                        |
| `/menu`        | Tasting menus + filterable à la carte repertoire                |
| `/experience`  | Services, career journey, process, testimonials                  |
| `/about`       | Chef biography, kitchen record, philosophy                       |
| `/gallery`     | Filterable plate grid with keyboard-navigable lightbox           |
| `/booking`     | 4-step validated booking form with a live cost summary           |
| `/contact`     | Direct channels, service areas, message composer                |
| `/privacy`     | Privacy policy                                                   |
| `/terms`       | Booking terms                                                    |
| `*`            | Branded 404                                                      |

## Motion system

All animation is declarative and self-cleaning via `gsap.context()` + `ctx.revert()`,
so React StrictMode double-mounting never leaves orphaned tweens or triggers.

- **Smooth scroll** — `src/components/SmoothScroll.tsx`
- **Split-text masked reveals** — `src/components/anim/SplitReveal.tsx`
- **Scroll-scrubbed word highlighting** — `Philosophy` section lights word-by-word
- **Pinned scroll narrative** — `SignatureDishes` pins and advances courses on scrub
- **Pinned horizontal gallery** — `GalleryRail` translates a strip on vertical scroll
- **Magnetic buttons**, **custom cursor**, **scroll progress bar**, **preloader**
- **Micro-animations** — card tilt with cursor spotlight, infinite marquees,
  counters, process-timeline draw, accordion height tweens, toast-free confirmations

Everything respects `prefers-reduced-motion`: Lenis and the custom cursor disable
themselves and durations collapse to ~0ms.

## Booking flow

Four steps (occasion → menu → details → contact) with per-step validation,
inline error messaging, URL prefill via `?service=`, a live price estimate and a
confirmation summary. No backend is wired up — submission is client-side only,
so connect `submit()` in `src/pages/Booking.tsx` to your CRM or form endpoint.

## Imagery

There are no bitmap assets. Every visual — plated dishes, the chef portrait,
Kente bands and Adinkra marks — is generated SVG (`src/components/art/`), so the
site is crisp at any resolution and has no image-loading cost. Swap these for
photography by replacing the components; the layouts already accommodate it.

## Project layout

```
src/
  components/
    anim/        SplitReveal, Reveal, Magnetic, Cursor, Counter
    art/         DishArt, ChefPortrait, Patterns (SVG generators)
    sections/    Hero, Philosophy, SignatureDishes, GalleryRail, …
  data/          dishes.ts, content.ts, gallery.ts  (all copy in one place)
  hooks/         useDocumentMeta.ts
  lib/           gsap.ts, scroll-context.ts
  pages/         one file per route
  styles/        tokens.css, global.css, components.css, sections.css
  test/          smoke.test.tsx, setup.ts
e2e/             site.spec.ts (Chromium)
```

## Testing approach

Two layers, because they catch different things:

- **jsdom (16 tests)** — component render, copy, filtering and the booking
  form's validation state. Fast, but jsdom has no layout engine, so it
  cannot verify anything that depends on real geometry.
- **Chromium (26 tests)** — the layer that actually matters here. It proves
  the pinned ScrollTrigger sections pin and advance, the horizontal gallery
  translates, the philosophy words colour in, no route throws a console
  error, and nothing intercepts clicks on interactive elements.

The browser suite has already caught two real bugs that jsdom could not:
a decorative element swallowing footer clicks, and `/terms` rendering the
privacy copy. Keep the hit-test and per-route assertions when editing.

## Notes

- `vite.config.ts` splits GSAP and React into separate chunks for caching.
- SPA fallback configs are included: `public/_redirects` (Netlify) and
  `vercel.json` (Vercel). For nginx use `try_files $uri /index.html`.
- The preloader has a 6s failsafe so a stalled animation can never leave
  the page locked behind an overlay with `overflow: hidden`.
