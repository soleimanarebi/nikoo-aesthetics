import { getTreatmentFamilies, getFamilyPriceFrom } from "@/lib/data";
import FamilyCard from "@/components/FamilyCard";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Link from "next/link";

export default function FeaturedTreatments() {
  const families = getTreatmentFamilies();

  return (
    <section className="max-w-content mx-auto px-6 lg:px-10 py-24">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
        <SectionHeading
          eyebrow="Signature Treatments"
          title="Considered enhancement, treatment by treatment."
        />
        <Reveal delay={150}>
          <Link
            href="/treatments"
            className="text-sm font-body text-ink underline decoration-gold decoration-1 underline-offset-4 hover:text-gold-dark transition-colors whitespace-nowrap"
          >
            View All Treatments →
          </Link>
        </Reveal>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {families.map((family, i) => (
          <Reveal key={family.slug} delay={i * 80}>
            <FamilyCard
              family={family}
              priceFrom={getFamilyPriceFrom(family.slug)}
              priority={i < 3}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
