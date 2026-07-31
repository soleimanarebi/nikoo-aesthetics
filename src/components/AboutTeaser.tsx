import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

const FOCUS_POINTS = ["Safety", "Confidence", "Natural Beauty", "Skin care and Aesthetic Professionalism"];

export default function AboutTeaser() {
  return (
    <section className="bg-white">
      <div className="max-w-content mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-2 gap-14 items-center">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] rounded-xl2 overflow-hidden shadow-soft">
            <Image
              src="/images/team/nikoo-portrait.jpg"
              alt="Elin, practitioner at Nikoo Aesthetics"
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden sm:block bg-ink text-warm rounded-xl2 px-8 py-6 shadow-soft">
            <p className="font-display text-3xl text-gold">5+</p>
            <p className="text-xs tracking-widest2 uppercase font-body mt-1">
              Years Experience
            </p>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2 flex flex-col gap-6">
          <SectionHeading
            eyebrow="About Elin"
            title="Appearance and health, treated as one."
            description="Elin's practice is built on the belief that how you look is deeply connected to how well you feel. Every treatment plan is grounded in clinical precision, guided by an eye for natural proportion, and delivered with the professionalism of a GDC-registered practitioner."
          />
          <Reveal delay={150} className="grid grid-cols-2 gap-3 max-w-md">
            {FOCUS_POINTS.map((point) => (
              <div
                key={point}
                className="flex items-center gap-2 py-2 border-b border-ink/10"
              >
                <span className="h-1 w-1 rounded-full bg-gold" />
                <span className="text-sm font-body text-ink/75">{point}</span>
              </div>
            ))}
          </Reveal>
          <Reveal delay={250}>
            <Link
              href="/about"
              className="inline-block mt-2 text-sm font-body text-ink underline decoration-gold decoration-1 underline-offset-4 hover:text-gold-dark transition-colors"
            >
              Read Elin&apos;s Story →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
