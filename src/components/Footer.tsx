import Link from "next/link";
import { getSiteSettings, getAddressLines } from "@/lib/data";
import BookingButton from "@/components/BookingButton";
import Logo from "@/components/Logo";

export default function Footer() {
  const site = getSiteSettings();
  const addressLines = getAddressLines(site);

  return (
    <footer className="bg-warm text-ink border-t border-ink/10">
      <div className="max-w-content mx-auto px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 flex flex-col gap-4">
          <Logo variant="dark" />
          <p className="text-ink/60 font-body text-sm max-w-sm leading-relaxed">
            {site.description}
          </p>
          <div className="pt-2">
            <BookingButton variant="outline" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-display text-lg text-gold-dark">Opening Hours</h3>
          <ul className="text-ink/70 text-sm font-body space-y-1.5">
            {site.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-display text-lg text-gold-dark">Visit &amp; Contact</h3>
          <address className="not-italic text-ink/70 text-sm font-body space-y-2 leading-relaxed">
            <p>
              {addressLines.map((line, i) => (
                <span key={line}>
                  {line}
                  {i < addressLines.length - 1 && <br />}
                </span>
              ))}
            </p>
            <p>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-gold-dark transition-colors">
                {site.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-gold-dark transition-colors">
                {site.email}
              </a>
            </p>
            <p>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-dark transition-colors"
              >
                {site.instagramHandle ?? "Instagram"}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="max-w-content mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-ink/50 font-body">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-gold-dark transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold-dark transition-colors">
              Terms
            </Link>
            <Link href="/cookie-policy" className="hover:text-gold-dark transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
