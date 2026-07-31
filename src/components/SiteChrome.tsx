"use client";

import { useEffect, useRef, useState } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";

/**
 * Combines TopBar and Header into a single fixed unit that:
 * - gains a shadow once the page is scrolled
 * - slides up out of view when the visitor scrolls down (past a small
 *   threshold, so it doesn't flicker on tiny scroll jitters)
 * - slides back into view the moment they scroll up, or on any scroll
 *   position near the very top of the page
 *
 * Kept as one component (rather than TopBar/Header each managing their own
 * fixed positioning) so both bars move together as a single visual unit.
 */
export default function SiteChrome() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);

      // Never hide the bar while the mobile menu is open, or right at the
      // top of the page — only once there's real scroll distance to judge
      // direction from.
      if (open) {
        setHidden(false);
      } else if (y < 120) {
        setHidden(false);
      } else if (y > lastY.current + 4) {
        setHidden(true); // scrolling down
      } else if (y < lastY.current - 4) {
        setHidden(false); // scrolling up
      }

      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <div
      className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <TopBar />
      <Header scrolled={scrolled} open={open} onToggleOpen={() => setOpen((v) => !v)} />
    </div>
  );
}
