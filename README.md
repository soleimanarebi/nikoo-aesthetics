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
   - `RESEND_API_KEY` → from your Resend dashboard
   - `ADMIN_EMAIL` → clinic inbox that should receive booking/enquiry notifications
   - `FROM_EMAIL` → the verified sending address (see "Email System" below)

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

## Email System (Booking & Contact Forms)

Both the Booking form (`/booking`) and the Contact form (`/contact`) send
real emails via [Resend](https://resend.com) through server-side Next.js
API routes — nothing runs in the browser, and no key is ever exposed to
visitors.

### How it works

```
src/lib/email/
  layout.ts          Shared branded HTML wrapper (logo, cream/white palette,
                      footer) used by every email — the single place to
                      change the look of all clinic emails at once
  templates.ts        One function per email: booking/contact/cancellation/
                       reschedule × admin/client — each returns { subject, html }
  resend.ts            Resend client + low-level sendEmail() wrapper. Reads
                        RESEND_API_KEY / ADMIN_EMAIL / FROM_EMAIL from env vars
  send.ts               sendBookingEmails() / sendContactEmails() /
                         sendBookingCancellationEmails() /
                         sendBookingRescheduleEmails() — each sends the
                         admin notification + client confirmation (BCC'd to
                         admin) in parallel via the shared sendMirroredPair()
  booking-token.ts       Encodes booking details into the "Manage Your
                          Booking" email link (no database required)

src/lib/validation.ts   zod schemas for all four forms + spam detection
                        (honeypot field + minimum fill-time check)

src/app/api/booking/route.ts              POST — new booking
src/app/api/booking/cancel/route.ts       POST — cancellation
src/app/api/booking/reschedule/route.ts   POST — reschedule request
src/app/api/contact/route.ts              POST — contact form

src/app/booking/manage/page.tsx      "Manage Your Booking" page (linked
src/components/BookingManage.tsx     from the confirmation email) — cancel
                                      or request a reschedule
```

Every submission:
1. Is validated server-side with zod (the real gate — client-side
   validation is just for UX, since anyone can POST to these routes
   directly)
2. Is checked for spam signals (a hidden honeypot field bots tend to fill
   in, and a minimum time-since-page-load check) — spam submissions get a
   normal-looking success response but no email is sent, so bots can't
   tell they were filtered
3. Triggers two emails in parallel: one to `ADMIN_EMAIL` with all the
   submitted details (and `Reply-To` set to the visitor's email, so you
   can hit "reply" directly), and one branded confirmation to the visitor
4. Returns a clear success/error JSON response, which the form displays

Both forms in `src/components/BookingCalendar.tsx` and
`src/components/ContactForm.tsx` show a loading state while submitting,
and a specific error message (not a generic failure) if sending fails —
e.g. "please call or WhatsApp us directly" — so a visitor is never left
wondering if their booking went through.

### Cancellation & Reschedule

Every booking confirmation email includes a **"Manage Your Booking"** link
that takes the client to `/booking/manage`, where they can:
- **Cancel** their appointment (with an optional reason)
- **Request a reschedule** (they enter a preferred new date/time)

Both actions send a confirmation to the client and a dedicated
notification to the clinic (`/api/booking/cancel` and
`/api/booking/reschedule`), following the exact same validated,
spam-protected, error-handled pattern as the original booking and contact
routes.

The booking details are encoded directly into the "Manage Your Booking"
link (`src/lib/email/booking-token.ts`) rather than looked up from a
database — there's no live calendar/PMS behind this site yet (see
`PROJECT_ROADMAP.md`), so a cancellation or reschedule request here always
results in an email to the clinic for manual confirmation; it doesn't
automatically alter a real appointment. If this site is later connected to
a real booking backend (e.g. Consentz), swap this token for a real
booking-ID lookup.

### Every Client Email Is Mirrored to the Clinic

In addition to its own dedicated "action needed" notification (New
Booking, New Enquiry, Cancellation, Reschedule Request), **every email
sent to a client is also BCC'd to `ADMIN_EMAIL`** — booking confirmations,
contact confirmations, cancellation confirmations, and reschedule
confirmations alike. This means the clinic always has an exact record of
what every client received, not just a summary. This is handled centrally
in `sendMirroredPair()` (`src/lib/email/send.ts`), so any future email
type automatically inherits the same mirroring — nothing extra to
remember when adding new email flows.

### Adding future email types

The system is deliberately structured so reminder emails, cancellation
emails, or an "appointment approved" email can be added without touching
existing code:

1. Add a new template function to `templates.ts` (reuse `emailLayout`,
   `detailRow`, `paragraph`, `ctaButton` from `layout.ts` so it
   automatically matches the existing branding)
2. Add a thin `sendXEmail(data)` function to `send.ts`
3. Call it from wherever that event happens (e.g. a future admin action,
   or a scheduled Netlify Function for reminders)

### Environment Variables

Add these three **in addition to** the existing `NEXT_PUBLIC_*` variables:

| Variable | Example | Notes |
|---|---|---|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxxxxxxx` | From your Resend dashboard. Server-only — never prefixed `NEXT_PUBLIC_`. |
| `ADMIN_EMAIL` | `nikooaesthetics@gmail.com` | Where new booking/enquiry notifications are sent. |
| `FROM_EMAIL` | `Nikoo Aesthetics <bookings@nikooaesthetics.co.uk>` | Must be on a domain you've verified in Resend — see below. |

**Local development:** add them to `.env.local` (copy from `.env.example`,
which documents each one).

**Netlify (production):** Site settings → Environment variables → Add a
variable, for each of the three. **Do not** add these to `netlify.toml` —
that file is committed to git, and secrets must never live there (this is
why `NEXT_PUBLIC_SITE_URL` is safe to keep in `netlify.toml` but
`RESEND_API_KEY` is not).

### Setting Up Resend (step by step)

1. **Create a free account** at [resend.com](https://resend.com) — the
   free tier includes 3,000 emails/month and 100/day, comfortably enough
   for a single clinic's bookings and enquiries.
2. **Verify your sending domain** (required to send from an address like
   `bookings@nikooaesthetics.co.uk` instead of a shared test domain):
   - In the Resend dashboard, go to **Domains → Add Domain**
   - Enter your domain (e.g. `nikooaesthetics.co.uk`)
   - Resend will show you 3–4 DNS records to add (SPF, DKIM, and
     optionally DMARC) — add these in whichever service manages your
     domain's DNS (your domain registrar, or Netlify DNS if you use it)
   - Back in Resend, click **Verify** — this can take a few minutes to a
     few hours depending on DNS propagation
   - Until verification completes, you can still test using Resend's
     shared test address `onboarding@resend.dev` as `FROM_EMAIL`, which
     works immediately with no domain setup — useful for local testing
3. **Create an API key**: Dashboard → **API Keys → Create API Key**. Give
   it a name like "Nikoo Aesthetics Production", and copy the key
   immediately (Resend only shows it once) — this becomes `RESEND_API_KEY`.
4. **Set your three environment variables** locally and on Netlify as
   described above.

### Testing

**Locally:**
```bash
cp .env.example .env.local
# fill in RESEND_API_KEY, ADMIN_EMAIL, FROM_EMAIL
npm run dev
```
Then submit the Contact form or complete a Booking at
http://localhost:3000 — check both the admin inbox (`ADMIN_EMAIL`) and the
email address you submitted the form with for the two emails.

You can also test the API routes directly without the UI:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"you@example.com","message":"Testing the contact form."}'
```
A successful response looks like `{"success":true,"message":"..."}`.

**On Netlify:** once the three environment variables are set and the site
is redeployed, test the same way against your live URL. Netlify's
**Functions** tab in the site dashboard shows logs for `/api/booking` and
`/api/contact` if anything needs debugging — errors are logged with enough
detail to see whether it's a validation issue, a missing env var, or a
Resend API error.

## Temporarily Blocking Dates (Admin)

A private admin page lets you close a specific date (e.g. a day you're
unavailable) without touching your normal weekly opening hours in
`src/data/site.json`. Blocked dates apply to every visitor immediately —
they're stored in [Netlify Blobs](https://docs.netlify.com/blobs/overview/),
a key-value store included with your Netlify site (no separate account,
no extra cost at this scale).

### How it works

```
src/lib/blocked-dates.ts       Netlify Blobs read/write for the blocked-
                                dates list (get/add/remove)
src/lib/admin-session.ts       Signed, expiring session tokens (HMAC-
                                SHA256) — no database, no raw password
                                ever stored in a cookie

src/app/api/admin/login/route.ts    POST — verifies the admin password,
                                     sets an HttpOnly session cookie
src/app/api/admin/logout/route.ts   POST — clears the session cookie
src/app/api/blocked-dates/route.ts  GET (public) / POST + DELETE (admin-only)

src/app/admin/blocked-dates/page.tsx        The admin page itself
src/components/admin/AdminLoginForm.tsx     Password form (shown when logged out)
src/components/admin/BlockedDatesManager.tsx Block/unblock UI (shown when logged in)
```

Blocking a date does **not** modify `site.json` or your recurring weekly
hours in any way — it's a separate, small exception list layered on top.
Unblocking removes the exception; the date simply reverts to whatever your
normal weekly hours say.

### Using the admin page

1. Go to `https://<your-site>/admin/blocked-dates`
2. Enter your admin password (see `ADMIN_SECRET` below) and log in
3. Pick a date and click **Block Date** — it appears in the "Currently
   Blocked Dates" list immediately, struck through
4. To reopen a date, find it in the list and click **Unblock**
5. Click **Log Out** when you're done (sessions also auto-expire after 8
   hours regardless)

The public booking calendar picks up changes the next time a visitor loads
the `/booking` page — there's nothing else to do.

### Security

- The admin page itself is a **server component**: it checks your session
  cookie on the server before deciding whether to render the login form or
  the management UI, so the page's protected content never even reaches
  the browser for an unauthenticated visitor.
- Logging in does **not** store your password anywhere. `ADMIN_SECRET` is
  read once, server-side, to verify what you typed — then a signed,
  time-limited session token is generated and set as an **HttpOnly**
  cookie (JavaScript cannot read it, even via XSS) that's also `Secure`
  (HTTPS-only in production) and `SameSite=Strict`.
- `POST`/`DELETE /api/blocked-dates` (the only endpoints that can change
  anything) independently re-check that session cookie server-side on
  every request — there is no way to add or remove a blocked date without
  a valid session, regardless of how the request is made.
- `GET /api/blocked-dates` is intentionally public with no admin
  information in its response — it only returns a plain list of dates, so
  the booking calendar can grey them out for every visitor.
- The admin page is excluded from `robots.txt` and marked `noindex`, and
  is not linked from any navigation or sitemap — it's reachable only by
  URL, on top of the password gate.

### Environment variable

Add **one** new variable, alongside the email ones:

| Variable | Notes |
|---|---|
| `ADMIN_SECRET` | The password for `/admin/blocked-dates`. Choose a long, random value — this is the only thing protecting your booking calendar's availability. Set it in `.env.local` for local development and in Netlify's **Site settings → Environment variables** for production (never in `netlify.toml` — see the note already in that file). |

### Local development note

Netlify Blobs needs a real Netlify deployment context to authenticate,
which plain `next dev`/`next start` doesn't have. When that context is
missing, `src/lib/blocked-dates.ts` automatically falls back to a small
temporary file on your machine so you can still fully test blocking,
unblocking, and the booking rejection locally — **this fallback is never
used on Netlify itself**, where real Netlify Blobs takes over
automatically with zero configuration.

## Images

Hero, treatment, gallery and team images are original photography and
branded artwork supplied by the client, stored under `public/images/`.
`generate_images.py` (kept for reference) can regenerate the original
abstract placeholder art this project started with, if ever needed again.

## Future Improvements

See `PROJECT_ROADMAP.md` for the full list of completed features, suggested
future features, known issues and the pre-launch checklist.

