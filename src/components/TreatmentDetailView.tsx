import Image from "next/image";
import Link from "next/link";
import BookingButton from "@/components/BookingButton";
import Reveal from "@/components/Reveal";
import TreatmentCard from "@/components/TreatmentCard";
import SectionHeading from "@/components/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";
import type { Treatment } from "@/lib/types";

export default function TreatmentDetailView({
  treatment,
  related,
}: {
  treatment: Treatment;
  related: Treatment[];
}) {
  return (
    <>
      <section className="pt-32 pb-20 bg-warm">
        <div className="max-w-content mx-auto px-6 lg:px-10">
          <nav className="text-xs font-body text-ink/65 mb-8" aria-label="Breadcrumb">
            <Link href="/treatments" className="hover:text-ink transition-colors">
              Treatments
            </Link>{" "}
            / <span className="text-ink">{treatment.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <Reveal className="relative aspect-[4/5] rounded-xl2 overflow-hidden shadow-soft">
              <Image
                src={treatment.image}
                alt={`${treatment.name} treatment`}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </Reveal>

            <div className="flex flex-col gap-8">
              <div>
                <span className="text-xs tracking-widest2 uppercase text-gold-dark font-body">
                  {treatment.category}
                </span>
                <h1 className="font-display text-4xl sm:text-5xl text-ink mt-3 text-balance">
                  {treatment.name}
                </h1>
                <p className="mt-5 text-ink/70 font-body leading-relaxed">
                  {treatment.shortDescription}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-6 border-t border-ink/10 pt-6">
                <div>
                  <dt className="text-xs tracking-widest2 uppercase text-ink/60 font-body">Duration</dt>
                  <dd className="font-display text-lg text-ink mt-1">{treatment.duration}</dd>
                </div>
                <div>
                  <dt className="text-xs tracking-widest2 uppercase text-ink/60 font-body">Downtime</dt>
                  <dd className="font-display text-lg text-ink mt-1">{treatment.downtime}</dd>
                </div>
                <div>
                  <dt className="text-xs tracking-widest2 uppercase text-ink/60 font-body">Results Last</dt>
                  <dd className="font-display text-lg text-ink mt-1">{treatment.resultsLast}</dd>
                </div>
                <div>
                  <dt className="text-xs tracking-widest2 uppercase text-ink/60 font-body">Price From</dt>
                  <dd className="font-display text-lg text-gold-dark mt-1">£{treatment.priceFrom}</dd>
                </div>
              </dl>

              <div>
                <h2 className="font-display text-xl text-ink mb-4">Benefits</h2>
                <ul className="flex flex-col gap-3">
                  {treatment.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-ink/70 font-body text-sm leading-relaxed">
                      <span className="mt-2 h-1 w-1 rounded-full bg-gold shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <BookingButton size="lg" treatment={treatment.name} className="w-fit" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-ink/10">
        <div className="max-w-content mx-auto px-6 lg:px-10 py-24">
          <SectionHeading eyebrow="Overview" title="What to expect" description={treatment.overview} />

          <div className="grid md:grid-cols-3 gap-10 mt-16">
            <Reveal className="border-t border-ink/10 pt-6">
              <h3 className="font-display text-xl text-ink mb-3">Procedure</h3>
              <p className="text-ink/65 font-body text-sm leading-relaxed">{treatment.procedure}</p>
            </Reveal>
            <Reveal delay={100} className="border-t border-ink/10 pt-6">
              <h3 className="font-display text-xl text-ink mb-3">Recovery</h3>
              <p className="text-ink/65 font-body text-sm leading-relaxed">{treatment.recovery}</p>
            </Reveal>
            <Reveal delay={200} className="border-t border-ink/10 pt-6">
              <h3 className="font-display text-xl text-ink mb-3">Results</h3>
              <p className="text-ink/65 font-body text-sm leading-relaxed">{treatment.results}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {treatment.faqs?.length > 0 && (
        <section className="bg-warm">
          <div className="max-w-content mx-auto px-6 lg:px-10 py-24">
            <SectionHeading eyebrow="FAQs" title={`Questions about ${treatment.name.toLowerCase()}`} />
            <div className="mt-12 max-w-3xl">
              <FaqAccordion items={treatment.faqs} />
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="max-w-content mx-auto px-6 lg:px-10 py-24">
          <h2 className="font-display text-3xl text-ink mb-10">You May Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {related.map((t) => (
              <TreatmentCard key={t.slug} treatment={t} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
