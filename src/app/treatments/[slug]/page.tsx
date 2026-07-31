import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CtaSection from "@/components/CtaSection";
import FamilyDetailView from "@/components/FamilyDetailView";
import TreatmentDetailView from "@/components/TreatmentDetailView";
import {
  getTreatments,
  getTreatmentBySlug,
  getTreatmentFamilies,
  getTreatmentFamilyBySlug,
  getCategoriesForFamily,
  getFamilyPriceFrom,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const familySlugs = getTreatmentFamilies().map((f) => ({ slug: f.slug }));
  const treatmentSlugs = getTreatments().map((t) => ({ slug: t.slug }));
  return [...familySlugs, ...treatmentSlugs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const family = getTreatmentFamilyBySlug(slug);
  if (family) {
    return buildMetadata({
      title: `${family.name} | Nikoo Aesthetics`,
      description: family.description,
      path: `/treatments/${family.slug}`,
    });
  }

  const treatment = getTreatmentBySlug(slug);
  if (treatment) {
    return buildMetadata({
      title: `${treatment.name} | Nikoo Aesthetics`,
      description: treatment.shortDescription,
      path: `/treatments/${treatment.slug}`,
    });
  }

  return buildMetadata({ title: "Treatment", description: "" });
}

export default async function TreatmentOrFamilyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const family = getTreatmentFamilyBySlug(slug);
  if (family) {
    const categories = getCategoriesForFamily(family.slug);
    const priceFrom = getFamilyPriceFrom(family.slug);
    return (
      <>
        <FamilyDetailView family={family} categories={categories} priceFrom={priceFrom} />
        <CtaSection />
      </>
    );
  }

  const treatment = getTreatmentBySlug(slug);
  if (treatment) {
    const related = getTreatments()
      .filter((t) => t.slug !== treatment.slug && t.category === treatment.category)
      .slice(0, 3);
    return (
      <>
        <TreatmentDetailView treatment={treatment} related={related} />
        <CtaSection />
      </>
    );
  }

  notFound();
}
