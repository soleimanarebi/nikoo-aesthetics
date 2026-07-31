import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { TreatmentFamily, BookingServiceCategory } from "@/lib/types";

function formatPrice(price: number | null): string {
  if (price === null) return "POA";
  return price === 0 ? "Free" : `£${price.toFixed(2)}`;
}

export default function FamilyDetailView({
  family,
  categories,
  priceFrom,
}: {
  family: TreatmentFamily;
  categories: BookingServiceCategory[];
  priceFrom: number | null;
}) {
  return (
    <>
      <section className="pt-32 pb-20 bg-warm">
        <div className="max-w-content mx-auto px-6 lg:px-10">
          <nav className="text-xs font-body text-ink/65 mb-8" aria-label="Breadcrumb">
            <Link href="/treatments" className="hover:text-ink transition-colors">
              Treatments
            </Link>{" "}
            / <span className="text-ink">{family.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <Reveal className="relative aspect-[4/5] rounded-xl2 overflow-hidden shadow-soft">
              <Image
                src={family.image}
                alt={`${family.name} treatments at Nikoo Aesthetics`}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </Reveal>

            <div className="flex flex-col gap-8">
              <div>
                <h1 className="font-display text-4xl sm:text-5xl text-ink text-balance">
                  {family.name}
                </h1>
                <p className="mt-5 text-ink/70 font-body leading-relaxed">
                  {family.description}
                </p>
              </div>

              <div className="border-t border-ink/10 pt-6">
                <span className="text-xs tracking-widest2 uppercase text-ink/60 font-body">
                  Price From
                </span>
                <p className="font-display text-2xl text-gold-dark mt-1">
                  {formatPrice(priceFrom)}
                </p>
              </div>

              <a
                href="#treatments-pricing"
                className="text-sm font-body text-ink underline decoration-gold decoration-1 underline-offset-4 hover:text-gold-dark transition-colors w-fit"
              >
                Choose your treatment below →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="treatments-pricing" className="bg-white border-t border-ink/10 scroll-mt-28">
        <div className="max-w-content mx-auto px-6 lg:px-10 py-24">
          <h2 className="font-display text-3xl text-ink mb-12">Treatments &amp; Pricing</h2>

          <div className="flex flex-col gap-14">
            {categories.map((cat) => (
              <Reveal key={cat.id}>
                <h3 className="font-display text-xl text-ink mb-1">{cat.category}</h3>
                {cat.note && (
                  <p className="text-ink/45 font-body text-xs mb-4">{cat.note}</p>
                )}
                <div className="flex flex-col divide-y divide-ink/10 border-t border-b border-ink/10">
                  {cat.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <span className="font-body text-sm text-ink">{item.name}</span>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-body text-sm text-gold-dark w-20 text-right">
                          {formatPrice(item.price)}
                        </span>
                        <Link
                          href={`/booking?category=${cat.id}&item=${encodeURIComponent(item.name)}`}
                          className="px-4 py-1.5 rounded-full text-xs font-body border border-ink/20 text-ink hover:bg-ink hover:text-warm hover:border-ink transition-colors whitespace-nowrap"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
