import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import GalleryGrid from "@/components/GalleryGrid";
import CtaSection from "@/components/CtaSection";
import { getGallery } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Before & After Gallery | Nikoo Aesthetics",
  description: "Browse real before and after results from Nikoo Aesthetics.",
  path: "/gallery",
});

export default function GalleryPage() {
  const gallery = getGallery();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Before & After"
        description="A selection of real client results. Select an image to view it larger."
      />

      <section className="max-w-content mx-auto px-6 lg:px-10 py-24">
        <h2 className="sr-only">Before and after gallery</h2>
        <GalleryGrid images={gallery} />
      </section>

      <CtaSection />
    </>
  );
}
