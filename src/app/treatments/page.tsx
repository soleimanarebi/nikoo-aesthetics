import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import FamilyCard from "@/components/FamilyCard";
import Reveal from "@/components/Reveal";
import CtaSection from "@/components/CtaSection";
import { getTreatmentFamilies, getFamilyPriceFrom } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Treatments | Nikoo Aesthetics",
  description:
    "Explore our treatments at Nikoo Aesthetics — Consultation & Review, Botox, Filler, Profhilo / Skin Boosters, Fat Dissolving, and Mesotherapy and Microneedling.",
  path: "/treatments",
});

export default function TreatmentsPage() {
  const families = getTreatmentFamilies();

  return (
    <>
      <PageHero
        eyebrow="Treatments"
        title="Every treatment, considered carefully."
        description="Each plan begins with a full consultation. Choose a treatment family below to see the full range and pricing."
      />

      <section className="max-w-content mx-auto px-6 lg:px-10 py-24">
        <h2 className="sr-only">All treatment families</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {families.map((family, i) => (
            <Reveal key={family.slug} delay={(i % 3) * 80}>
              <FamilyCard
                family={family}
                priceFrom={getFamilyPriceFrom(family.slug)}
                priority={i < 3}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
