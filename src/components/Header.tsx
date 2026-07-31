"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import BookingButton from "@/components/BookingButton";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/treatments", label: "Treatments" },
  { href: "/gallery", label: "Gallery" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

/**
 * Always a white header with black text/logo — this theme never places the
 * header over a dark section, so unlike other variants there's no
 * scroll-based light/dark colour flip, only a background/shadow change.
 *
 * Positioning (fixed vs. static) and the show/hide-on-scroll behaviour live
 * in the parent SiteChrome component, which also owns `scrolled`/`open` so
 * TopBar and Header can hide and show together as one unit.
 */
export default function Header({
  scrolled,
  open,
  onToggleOpen,
}: {
  scrolled: boolean;
  open: boolean;
  onToggleOpen: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) onToggleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <header
      className={`bg-warm transition-shadow duration-500 ${
        scrolled || open ? "shadow-[0_1px_0_0_rgba(0,0,0,0.08)]" : ""
      }`}
    >
      <div className="max-w-content mx-auto px-6 lg:px-10 flex items-center justify-between h-36">
        <Logo variant="dark" />

        <nav className="hidden lg:flex items-center gap-9" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`text-sm font-body tracking-wide text-ink/80 hover:text-ink transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:bg-gold after:transition-all after:duration-300 ${
                pathname === link.href
                  ? "text-ink after:w-full"
                  : "after:w-0 hover:after:w-full"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <BookingButton size="md" />
        </div>

        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={onToggleOpen}
        >
          <span
            className={`block h-px w-6 bg-ink transition-transform duration-300 ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-ink transition-transform duration-300 ${
              open ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-out bg-warm/95 backdrop-blur-md ${
          open ? "max-h-[28rem]" : "max-h-0"
        }`}
      >
        <nav
          className="flex flex-col gap-1 px-6 pb-6 pt-2"
          aria-label="Mobile"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-3 font-body text-ink/85 border-b border-ink/10 text-sm tracking-wide"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <BookingButton className="w-full" />
          </div>
        </nav>
      </div>
    </header>
  );
}
