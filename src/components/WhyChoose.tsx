import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

const REASONS = [
  {
    title: "Experienced Practitioner",
    text: "Years of medical and aesthetic training behind every treatment plan.",
  },
  {
    title: "Evidence-Based Treatments",
    text: "Techniques grounded in clinical research, not passing trends.",
  },
  {
    title: "Premium Products",
    text: "Only regulated, clinically approved products are ever used.",
  },
  {
    title: "Personalised Plans",
    text: "No templated treatments — every plan is built around your face.",
  },
  {
    title: "Modern Techniques",
    text: "Refined injection technique for comfort and precision.",
  },
  {
    title: "Excellent Aftercare",
    text: "Direct access to your practitioner throughout your recovery.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-warm border-y border-ink/10">
      <div className="max-w-content mx-auto px-6 lg:px-10 py-24">
        <SectionHeading
          eyebrow="Why Choose Nikoo"
          title="Because precision earns trust."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 mt-16">
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={i * 70} className="border-t border-ink/10 pt-6">
              <h3 className="font-display text-xl text-ink mb-2">{r.title}</h3>
              <p className="text-ink/60 font-body text-sm leading-relaxed">{r.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
