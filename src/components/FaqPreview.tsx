import { getFaqs } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";
import Reveal from "@/components/Reveal";
import Link from "next/link";

export default function FaqPreview() {
  const faqs = getFaqs();
  const items = faqs.flatMap((g) => g.items).slice(0, 5);

  return (
    <section className="bg-warm">
      <div className="max-w-content mx-auto px-6 lg:px-10 py-24">
        <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" />
        <div className="mt-12 max-w-3xl">
          <FaqAccordion items={items} />
        </div>
        <Reveal delay={150} className="mt-8">
          <Link
            href="/faq"
            className="text-sm font-body text-ink underline decoration-gold decoration-1 underline-offset-4 hover:text-gold-dark transition-colors"
          >
            View All Questions →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
