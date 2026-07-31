"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/types";
import SectionHeading from "@/components/SectionHeading";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1 text-gold" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export default function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  const goTo = (i: number) => setIndex(((i % testimonials.length) + testimonials.length) % testimonials.length);

  return (
    <section className="bg-white">
      <div className="max-w-content mx-auto px-6 lg:px-10 py-24">
        <SectionHeading eyebrow="Client Stories" title="Loved on Google Reviews." align="center" />

        <div className="mt-14 max-w-2xl mx-auto">
          <div
            className="relative overflow-hidden rounded-xl2 bg-warm shadow-card px-8 py-12 sm:px-12 sm:py-14 text-center"
            role="region"
            aria-live="polite"
            aria-label="Client testimonial"
          >
            <div className="flex justify-center mb-5">
              <Stars count={testimonials[index].rating} />
            </div>
            <p className="font-display text-xl sm:text-2xl text-ink leading-relaxed text-balance">
              &ldquo;{testimonials[index].text}&rdquo;
            </p>
            <p className="mt-6 text-sm font-body tracking-widest2 uppercase text-gold-dark">
              {testimonials[index].name}
            </p>
          </div>

          <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Select testimonial">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                role="tab"
                aria-selected={i === index}
                aria-label={`Testimonial from ${t.name}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-gold" : "w-1.5 bg-ink/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
