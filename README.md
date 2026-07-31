# Nikoo Aesthetics — Website

A premium, medically-led aesthetics website built with Next.js 15 (App Router),
TypeScript and Tailwind CSS. Content is stored as structured JSON/Markdown so
it can be edited without touching code, and every booking button points to a
single configurable booking URL.

## Tech Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS
- Static JSON/Markdown content (no CMS/database required)
- Netlify-ready deployment

## Project Structure

```
src/
  app/            Routes (pages), layout, sitemap.ts, robots.ts, icon.png, apple-icon.png
  components/     Reusable UI (Header, Footer, Logo, BookingButton, cards, etc.)
  data/           JSON content — treatments, pricing, FAQs, testimonials, gallery, site settings
  content/        Markdown content — about.md
  hooks/          useInView (scroll-reveal animation hook)
  lib/            data.ts (content access), env.ts (booking URL), seo.ts (metadata/schema), types.ts
public/
  images/
    logo/         Brand logo — nikoo-logo.png (light bg) + nikoo-logo-reversed.png (dark bg)
    hero/         Homepage hero imagery
    treatments/   One image per treatment, filename matches the treatment slug
    gallery/      Before & after gallery imagery
    team/         Practitioner / clinic portrait imagery
    og-cover.jpg  Social share image (1200×630)
generate_images.py  Regenerates the placeholder brand imagery (not needed once real photography is added)
```

## Running Locally

Requires Node.js 18.18+ (Node 20 LTS recommended).

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Replacing the Logo

Drop your official logo files in:

```
public/images/logo/nikoo-logo.png            (for light backgrounds — header, most pages)
public/images/logo/nikoo-logo-reversed.png   (for dark backgrounds — footer, hero)
```

Both are consumed by the single `Logo` component (`src/components/Logo.tsx`)
used in the Header and Footer — no other code changes are required. For best
results use a square or near-square mark (the monogram renders at 36×36px
next to the wordmark). The favicon (`src/app/icon.png`) and Apple touch icon
(`src/app/apple-icon.png`) are separate files — replace those too once you
have a finished brand mark.

## Editing Content (no code required)

All editable content lives in `src/data/*.json` and `src/content/*.md`:

| What to edit              | File                          |
|----------------------------|-------------------------------|
| Treatments, prices, benefits, procedure/recovery/results copy, FAQs | `src/data/treatments.json` |
| Site-wide FAQs             | `src/data/faqs.json`          |
| Testimonials                | `src/data/testimonials.json` |
| Before & after gallery      | `src/data/gallery.json`      |
| Clinic details, hours, address | `src/data/site.json`      |
| About page biography        | `src/content/about.md`       |

To add a new treatment, copy an existing object in `treatments.json`
(including `overview`, `procedure`, `recovery`, `results` and `faqs`), give
it a unique `slug`, and add a matching image at
`public/images/treatments/<slug>.jpg`. It will automatically get its own
page at `/treatments/[slug]`, and appear in the Treatments grid and Pricing
— no other changes needed.

## Where to Add the Booking URL

Every "Book Consultation" button on the site uses the reusable
`<BookingButton />` component (`src/components/BookingButton.tsx`), which
reads its destination from a single environment variable:

```
NEXT_PUBLIC_BOOKING_URL=https://booking.consentz.com/nikoo-aesthetics
```

Set this in:
- **Local development:** `.env.local` (copy from `.env.example`)
- **Netlify:** Site settings → Environment variables (see below)

Update the URL in one place and every booking button across the site updates
automatically. If the variable isn't set, the site falls back to the default
URL defined in `src/lib/env.ts`.

The same file also defines `NEXT_PUBLIC_SITE_URL`, used for canonical links,
OpenGraph tags, `sitemap.xml` and `robots.txt` — set this to your live domain
before launch.

## Deploying to Netlify

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/nikoo-aesthetics.git
   git push -u origin main
   ```

2. **Connect GitHub to Netlify**
   - Log in to [Netlify](https://app.netlify.com)
   - Click **Add new site → Import an existing project**
   - Choose **GitHub** and authorize access, then select the `nikoo-aesthetics` repository

3. **Build settings** (Netlify auto-detects these from `netlify.toml`, included in this project)
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Install the [`@netlify/plugin-nextjs`](https://github.com/netlify/netlify-plugin-nextjs) plugin (already declared in `netlify.toml`)

4. **Environment variables**
   In Netlify: **Site settings → Environment variables**, add:
   - `NEXT_PUBLIC_BOOKING_URL` → your real booking platform link
   - `NEXT_PUBLIC_SITE_URL` → your live production domain

5. **Deploy**
   Click **Deploy site**. Every push to `main` will automatically trigger a new deployment.

## SEO

- Per-page metadata, canonical URLs, OpenGraph and Twitter card tags via `src/lib/seo.ts`
- Combined `MedicalBusiness` + `LocalBusiness` JSON-LD structured data injected in `src/app/layout.tsx`
- Auto-generated `sitemap.xml` (`src/app/sitemap.ts`) and `robots.txt` (`src/app/robots.ts`), both driven by the treatments data and `NEXT_PUBLIC_SITE_URL`
- `public/images/og-cover.jpg` (1200×630) is used as the default share image — replace with real branded artwork before launch

## Accessibility

- Skip-to-content link, semantic landmarks, and a heading structure with no level skips (h1 → h2 → h3 throughout)
- Visible keyboard focus states on every interactive element
- Alt text on all images, ARIA labels/`aria-current` on navigation and interactive controls (accordions, filters, carousel, mobile menu)
- External links (booking, Instagram) announce "opens in a new tab" to screen readers
- Colour palette checked against WCAG AA contrast (4.5:1) for body and label text
- Respects `prefers-reduced-motion`

## Quality Tooling

```bash
npm run lint    # ESLint (next/core-web-vitals + next/typescript), zero warnings
npm run build   # Type-checks, lints, and produces the production build
```

Both run clean with zero errors/warnings as of this version.

## Contact Form

`src/components/ContactForm.tsx` is presentational by default (it shows a
confirmation state on submit but doesn't send anywhere). Connect it to a real
form handler before launch — e.g. [Netlify Forms](https://docs.netlify.com/forms/setup/)
(add a `data-netlify="true"` attribute to the `<form>` and a hidden
`form-name` input) or a service like Formspree.

## Images

Hero, treatment, gallery and team images are currently original, abstract,
on-brand placeholder artwork generated locally (see `generate_images.py`) —
soft gradients in the brand palette with a gold line motif, not stock
photography. This avoids any licensing/attribution issues and any
misrepresentation of the clinic. Replace the files under `public/images/`
with real photography before launch — filenames and folders are already
wired up, so no code changes are required, only file swaps.

## Future Improvements

See `PROJECT_ROADMAP.md` for the full list of completed features, suggested
future features, known issues and the pre-launch checklist.

