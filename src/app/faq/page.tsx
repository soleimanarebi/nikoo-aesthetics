import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import FaqAccordion from "@/components/FaqAccordion";
import Reveal from "@/components/Reveal";
import CtaSection from "@/components/CtaSection";
import { getFaqs } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "FAQ | Nikoo Aesthetics",
  description:
    "Answers to common questions about safety, recovery, results and booking at Nikoo Aesthetics.",
  path: "/faq",
});

export default function FaqPage() {
  const groups = getFaqs();

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered honestly."
        description="Everything you need to know before your consultation, grouped by topic."
      />

      <section className="max-w-content mx-auto px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-[220px_1fr] gap-14">
          <div className="hidden lg:flex flex-col gap-2 sticky top-28 h-fit">
            {groups.map((g) => (
              <a
                key={g.group}
                href={`#${g.group.toLowerCase()}`}
                className="text-sm font-body text-ink/60 hover:text-ink transition-colors py-2 border-l-2 border-ink/10 pl-4 hover:border-gold"
              >
                {g.group}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-16">
            {groups.map((g) => (
              <Reveal key={g.group} id={g.group.toLowerCase()}>
                <h2
                  id={g.group.toLowerCase()}
                  className="font-display text-2xl sm:text-3xl text-ink mb-6 scroll-mt-28"
                >
                  {g.group}
                </h2>
                <FaqAccordion items={g.items} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
