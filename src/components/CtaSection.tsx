import BookingButton from "@/components/BookingButton";
import Reveal from "@/components/Reveal";

export default function CtaSection() {
  return (
    <section className="relative bg-warm overflow-hidden border-t border-ink/10">
      <div className="relative max-w-content mx-auto px-6 lg:px-10 py-28 text-center flex flex-col items-center gap-8">
        <Reveal>
          <span className="text-xs tracking-widest2 uppercase text-gold-dark font-body">
            Begin Today
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="font-display text-ink text-4xl sm:text-5xl md:text-6xl text-balance max-w-2xl">
            Ready to Begin Your Journey?
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <BookingButton size="lg" />
        </Reveal>
      </div>
    </section>
  );
}
