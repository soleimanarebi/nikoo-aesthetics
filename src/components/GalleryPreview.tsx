import { getGallery } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";
import GalleryGrid from "@/components/GalleryGrid";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function GalleryPreview() {
  const gallery = getGallery().slice(0, 6);

  return (
    <section className="bg-warm">
      <div className="max-w-content mx-auto px-6 lg:px-10 py-24">
        <SectionHeading
          eyebrow="Before &amp; After"
          title="Results, not promises."
          align="center"
        />
        <div className="mt-14">
          <GalleryGrid images={gallery} />
        </div>
        <Reveal delay={150} className="text-center mt-12">
          <Link
            href="/gallery"
            className="text-sm font-body text-ink underline decoration-gold decoration-1 underline-offset-4 hover:text-gold-dark transition-colors"
          >
            View Full Gallery →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
