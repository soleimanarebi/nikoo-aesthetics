import { getSiteSettings } from "@/lib/data";

/**
 * Slim utility bar shown above the main Header on larger screens.
 * Surfaces just the clinic's phone, email and Instagram — each paired
 * with a small icon on its left — the quiet trust signals premium
 * clinics lead with before you even reach the primary navigation.
 * Hidden on mobile to keep the header compact where space is at a
 * premium; the same details live in the Footer for smaller screens.
 */

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

export default function TopBar() {
  const site = getSiteSettings();
  const telHref = `tel:${site.phone.replace(/\s/g, "")}`;

  return (
    <div className="hidden lg:block bg-warm text-ink/70 border-b border-ink/10">
      <div className="max-w-content mx-auto px-6 lg:px-10 h-10 flex items-center justify-center gap-8 text-xs font-body tracking-wide">
        <a href={telHref} className="flex items-center gap-2 hover:text-gold-dark transition-colors">
          <PhoneIcon />
          {site.phone}
        </a>
        <span className="h-3 w-px bg-ink/15" aria-hidden="true" />
        <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-gold-dark transition-colors">
          <MailIcon />
          {site.email}
        </a>
        <span className="h-3 w-px bg-ink/15" aria-hidden="true" />
        <a
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-gold-dark transition-colors tracking-wide"
        >
          <InstagramIcon />
          {site.instagramHandle ?? "Instagram"}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
