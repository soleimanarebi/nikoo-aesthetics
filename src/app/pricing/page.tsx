import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BookingButton from "@/components/BookingButton";
import Reveal from "@/components/Reveal";
import CtaSection from "@/components/CtaSection";
import {
  getCategoriesGroupedByFamily,
  getUnfamiliedCategories,
  getSiteSettings,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Price List | Nikoo Aesthetics",
  description:
    "Full, transparent price list for every treatment at Nikoo Aesthetics, organised by treatment family.",
  path: "/pricing",
});

function formatPrice(price: number | null): string {
  if (price === null) return "POA";
  return price === 0 ? "Free" : `£${price.toFixed(2)}`;
}

function slugAnchor(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function PricingPage() {
  const familyGroups = getCategoriesGroupedByFamily();
  const extraCategories = getUnfamiliedCategories();
  const site = getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Price List"
        title="Clear pricing. No surprises."
        description="Every price below is a starting point — your practitioner will confirm your exact plan and cost during consultation."
      />

      <section className="max-w-content mx-auto px-6 lg:px-10 py-16">
        <Reveal className="rounded-xl2 bg-warm border border-ink/10 p-8 max-w-3xl">
          <h2 className="font-display text-xl text-ink mb-3">Special Offers &amp; Discounts</h2>
          <p className="text-ink/70 font-body text-sm leading-relaxed">
            <strong className="text-ink">£20 off — book with a friend.</strong> If you book and
            attend with a friend who is new to Nikoo Aesthetics, we&apos;ll take £20 off both of your
            treatments when you have them done together. Get in touch at{" "}
            <a href={`mailto:${site.email}`} className="underline decoration-gold decoration-1 underline-offset-4 hover:text-gold-dark transition-colors">
              {site.email}
            </a>{" "}
            to arrange.
          </p>
        </Reveal>
      </section>

      <section className="max-w-content mx-auto px-6 lg:px-10 pb-24">
        <div className="grid lg:grid-cols-[240px_1fr] gap-14">
          <div className="hidden lg:flex flex-col gap-2 sticky top-28 h-fit">
            {familyGroups.map(({ family }) => (
              <a
                key={family.slug}
                href={`#${slugAnchor(family.name)}`}
                className="text-sm font-body text-ink/60 hover:text-ink transition-colors py-2 border-l-2 border-ink/10 pl-4 hover:border-gold"
              >
                {family.name}
              </a>
            ))}
            {extraCategories.length > 0 && (
              <a
                href="#other-treatments"
                className="text-sm font-body text-ink/60 hover:text-ink transition-colors py-2 border-l-2 border-ink/10 pl-4 hover:border-gold"
              >
                Other Treatments
              </a>
            )}
          </div>

          <div className="flex flex-col gap-20">
            {familyGroups.map(({ family, categories }) => {
              const anchor = slugAnchor(family.name);
              return (
                <div key={family.slug}>
                  <h2 id={anchor} className="font-display font-bold text-2xl sm:text-3xl text-ink mb-8 scroll-mt-28">
                    {family.name}
                  </h2>
                  <div className="flex flex-col gap-12">
                    {categories.map((cat) => (
                      <Reveal key={cat.id}>
                        <h3 className="font-display text-lg text-ink mb-1">{cat.category}</h3>
                        {cat.note && (
                          <p className="text-ink/45 font-body text-xs mb-3">{cat.note}</p>
                        )}
                        <div className="flex flex-col divide-y divide-ink/10 border-t border-b border-ink/10">
                          {cat.items.map((item) => (
                            <div
                              key={item.name}
                              className="flex items-center justify-between gap-4 py-2.5"
                            >
                              <span className="font-body text-sm text-ink/80">{item.name}</span>
                              <span className="font-body text-sm text-gold-dark whitespace-nowrap">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              );
            })}

            {extraCategories.length > 0 && (
              <div>
                <h2 id="other-treatments" className="font-display font-bold text-2xl sm:text-3xl text-ink mb-8 scroll-mt-28">
                  Other Treatments
                </h2>
                <div className="flex flex-col gap-12">
                  {extraCategories.map((cat) => (
                    <Reveal key={cat.id}>
                      <h3 className="font-display text-lg text-ink mb-1">{cat.category}</h3>
                      {cat.note && (
                        <p className="text-ink/45 font-body text-xs mb-3">{cat.note}</p>
                      )}
                      <div className="flex flex-col divide-y divide-ink/10 border-t border-b border-ink/10">
                        {cat.items.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between gap-4 py-2.5"
                          >
                            <span className="font-body text-sm text-ink/80">{item.name}</span>
                            <span className="font-body text-sm text-gold-dark whitespace-nowrap">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Reveal className="mt-20 rounded-xl2 border-2 border-ink text-ink p-10 text-center max-w-2xl mx-auto">
          <h3 className="font-display text-2xl mb-3">Consultation</h3>
          <p className="text-ink/65 font-body text-sm leading-relaxed mb-6">
            Every new client begins with a thorough, medically-led consultation to
            discuss goals, medical history and suitability. Consultation fees are
            redeemable against treatment on the day.
          </p>
          <BookingButton variant="solid" />
        </Reveal>
      </section>

      <CtaSection />
    </>
  );
}
