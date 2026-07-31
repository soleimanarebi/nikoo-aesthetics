# Nikoo Aesthetics — Project Roadmap

Status as of Version 1.0 (pre-launch). This document tracks what's built,
what's intentionally deferred, known limitations, and what to do before this
goes live.

---

## ✅ Completed Features (V1.0)

**Pages**
- Homepage (hero, trust bar, featured treatments, about teaser, gallery preview, why choose us, testimonials, FAQ preview, CTA)
- About (biography, qualifications, clinic philosophy)
- Treatments listing + 10 individual treatment pages (Overview, Benefits, Procedure, Recovery, Results, treatment-specific FAQs, CTA)
- Gallery (filterable masonry, lightbox)
- Pricing (per-treatment cards + consultation callout)
- FAQ (grouped by Safety / Recovery / Results / Booking)
- Contact (embedded map, clinic details, contact form)
- Privacy Policy, Terms & Conditions, Cookie Policy
- Custom 404 page

**Design & Branding**
- Brand palette (ink, warm white, champagne gold) applied consistently
- Playfair Display + Inter type system
- Reusable `Logo` component (light/dark variants) driving Header, Footer, favicon and Apple touch icon
- Scroll-aware header (light text over the dark hero, dark text once scrolled — fixed a real contrast bug)
- Signature "gold thread" scroll-reveal animation used across section headings
- Fully original, on-brand placeholder imagery (no stock photography) across hero, treatments, gallery and team folders

**Content**
- All copy written in UK English, medical-luxury tone, focused on safety/natural results/personalised care
- Structured JSON/Markdown content model — treatments, FAQs, testimonials, gallery, site settings, about bio — editable without touching code

**Booking**
- Single reusable `BookingButton` component, always reading from `NEXT_PUBLIC_BOOKING_URL`, never a hard-coded URL

**SEO**
- Per-page metadata, canonical URLs, OpenGraph + Twitter cards
- Combined `MedicalBusiness` + `LocalBusiness` JSON-LD schema
- `sitemap.xml` and `robots.txt`, both auto-generated from live content

**Accessibility**
- Skip-to-content link
- No heading-level skips anywhere in the site (h1 → h2 → h3)
- WCAG AA colour contrast pass (darkened the gold accent for text use, brightened low-opacity label text)
- Visible keyboard focus states, ARIA labels/`aria-current`, "opens in new tab" announcements on external links
- `prefers-reduced-motion` respected

**Engineering Quality**
- `npm run build` — zero errors
- `npm run lint` (ESLint, `next/core-web-vitals` + `next/typescript`) — zero warnings
- No unused components; every file in `src/components` is referenced
- Netlify-ready (`netlify.toml`, `@netlify/plugin-nextjs`)

---

## 🔜 Future Features (post-V1.0, suggested)

- Real practitioner photography and clinic interior photography
- Real logo (currently a placeholder monogram — see "Manual steps" below)
- Live connection for the contact form (Netlify Forms or Formspree)
- Google Reviews API integration to pull live testimonials instead of static JSON
- Treatment "before & after" slider comparison component on individual treatment pages
- Blog/journal section (explicitly excluded from this brief, but common on competitor sites — revisit if content marketing becomes a priority)
- Multi-location support if Nikoo Aesthetics expands beyond one clinic
- Online gift voucher purchase flow
- Loyalty/referral programme page

---

## ⚠️ Known Issues / Limitations

- **Logo is a placeholder.** No logo file was received in this build session — a generated monogram is in place at `public/images/logo/`. Swap in the real files (see README → "Replacing the Logo").
- **All photography is abstract placeholder art**, not real clinic photos. Intentional (see README → "Images"), but must be replaced before launch.
- **Legal pages contain placeholder policy text.** Privacy Policy, Terms & Conditions and Cookie Policy are structurally complete but explicitly flagged as drafts — a qualified professional should review before launch.
- **Contact form does not send anywhere yet** — currently shows a confirmation state without a backend.
- **Google Fonts are loaded via a `<link>` tag** rather than `next/font/google`, because the sandbox this was built in has no network access to fonts.googleapis.com at build time. Functionally identical once deployed (fonts load at runtime either way), but if you prefer self-hosted fonts for a small performance/privacy improvement, migrating to `next/font/google` locally is a quick follow-up.
- **No automated tests** (unit/e2e) exist yet.

---

## 🚀 Deployment Checklist

- [ ] Set `NEXT_PUBLIC_BOOKING_URL` to the real booking platform link (Netlify env vars)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the live production domain (Netlify env vars)
- [ ] Connect the GitHub repo to Netlify and confirm the `@netlify/plugin-nextjs` build succeeds
- [ ] Confirm custom domain + HTTPS are configured in Netlify
- [ ] Verify `sitemap.xml` and `robots.txt` resolve correctly on the live domain

## ✅ Launch Checklist

- [ ] Replace placeholder logo with the official Nikoo Aesthetics logo (light + dark variants)
- [ ] Replace placeholder imagery in `public/images/{hero,treatments,gallery,team}` with real photography
- [ ] Replace `public/images/og-cover.jpg` with a branded social share image
- [ ] Have Privacy Policy, Terms & Conditions and Cookie Policy reviewed by a qualified professional
- [ ] Connect the contact form to a real handler (Netlify Forms/Formspree) and test submission
- [ ] Confirm all treatment prices, durations and downtime figures against the clinic's actual price list
- [ ] Proofread all copy one final time against the clinic's brand voice guidelines
- [ ] Run Google Lighthouse against the live URL and confirm 95+ across Performance/Accessibility/Best Practices/SEO
- [ ] Test the booking button end-to-end against the live Consentz (or chosen platform) URL
- [ ] Test on real iOS and Android devices, not just browser emulation
- [ ] Set up analytics (e.g. Plausible, GA4) if required
- [ ] Confirm GDPR/cookie consent requirements are met for the live cookie policy in use
