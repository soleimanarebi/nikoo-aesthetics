import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import CtaSection from "@/components/CtaSection";
import AboutTabs from "@/components/AboutTabs";
import { getAftercareDocuments } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Elin | Nikoo Aesthetics",
  description:
    "Meet Elin — GDC-registered Dental Nurse and aesthetic practitioner. Qualifications, mission, clinic philosophy and downloadable aftercare documents.",
  path: "/about",
});

const QUALIFICATIONS = [
  "GDC-registered Dental Nurse (General Dental Council)",
  "Advanced Training in Facial Aesthetics",
  "Advanced Training in Injectable Treatments",
  "Advanced Training in Dermal Fillers",
  "Advanced Training in Anti-Wrinkle Treatments",
  "Committed to Continuous Professional Development (CPD)",
];

const BIO_PARAGRAPHS = [
  "With more than five years of clinical experience in dentistry, Elin is a GDC-registered Dental Nurse (General Dental Council) who has built a strong foundation in facial anatomy, clinical precision and compassionate patient care. Nikoo Aesthetics was founded on the belief that appearance is closely linked to health, wellbeing and self-confidence. Elin takes the time to understand each patient's concerns, explain every treatment option clearly and create a personalised treatment plan tailored to their unique features and goals. Rather than following trends or promoting unnecessary procedures, her focus is on subtle, balanced enhancements that help patients look refreshed, confident and naturally themselves.",
  "Alongside her clinical background, Elin has a genuine passion for aesthetics, design and facial harmony. With additional education in design and the visual arts, she believes that outstanding aesthetic results are achieved through the careful balance of scientific knowledge and artistic judgement. This combination allows her to create treatments that respect each individual's natural beauty while maintaining facial balance and authenticity.",
  "Elin has completed advanced facial aesthetics training with an approved UK aesthetics training provider and is committed to continuous professional development. By regularly updating her knowledge with the latest evidence-based techniques, products and safety standards, she ensures every treatment is delivered with professionalism, precision and the highest standard of patient care.",
  "At Nikoo Aesthetics, every consultation is centred around listening, understanding and building trust. Elin believes that aesthetic treatments should enhance confidence rather than change identity, with a focus on healthy skin, natural-looking results and long-term wellbeing. Every treatment plan is carefully tailored to the individual, ensuring patients feel informed, supported and confident throughout their aesthetic journey.",
];

export default function AboutPage() {
  const documents = getAftercareDocuments();

  const story = (
    <>
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <Reveal className="relative lg:sticky lg:top-28">
          <div className="relative aspect-[4/5] rounded-xl2 overflow-hidden shadow-soft">
            <Image
              src="/images/team/nikoo-portrait.jpg"
              alt="Elin, practitioner at Nikoo Aesthetics"
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow="Our Mission" title="Appearance linked to health." />

          <Reveal className="flex flex-col gap-5">
            {BIO_PARAGRAPHS.map((p, i) => (
              <p key={i} className="text-ink/70 font-body text-sm leading-relaxed">
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal className="grid sm:grid-cols-2 gap-6">
            {["Safety", "Confidence", "Natural Beauty", "Skin care and Aesthetic Professionalism"].map((f) => (
              <div key={f} className="border-t border-ink/10 pt-4">
                <span className="font-display text-lg text-ink">{f}</span>
              </div>
            ))}
          </Reveal>

          <Reveal>
            <h3 className="font-display text-2xl text-ink mb-4">Qualifications &amp; Training</h3>
            <ul className="flex flex-col gap-3">
              {QUALIFICATIONS.map((q) => (
                <li key={q} className="flex items-start gap-3 text-ink/70 font-body text-sm leading-relaxed">
                  <span className="mt-2 h-1 w-1 rounded-full bg-gold shrink-0" />
                  {q}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <div className="mt-24 pt-16 border-t border-ink/10">
        <SectionHeading
          eyebrow="Clinic Philosophy"
          title="Safety first. Subtlety always."
          description="Full medical history, honest guidance on suitability, and a willingness to say no when treatment isn't the right choice. Beyond that, the work is quiet and precise: small, deliberate adjustments that respect your natural anatomy rather than override it."
        />
      </div>
    </>
  );

  return (
    <>
      <PageHero
        eyebrow="About Elin"
        title="Medical precision, applied with care."
        description="A practitioner-led clinic built on the belief that aesthetic treatment should enhance, never disguise."
      />

      <section className="max-w-content mx-auto px-6 lg:px-10 py-24">
        <AboutTabs story={story} documents={documents} />
      </section>

      <CtaSection />
    </>
  );
}
