import Image from "next/image";
import BookingButton from "@/components/BookingButton";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-end overflow-hidden bg-warm">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero.jpg"
          alt="A woman with radiant, healthy skin in soft natural light, reflecting the calm confidence of Nikoo Aesthetics' natural results"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm via-warm/70 to-warm/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-content mx-auto w-full px-6 lg:px-10 pb-20 pt-52">
        <span className="inline-block text-xs tracking-widest2 uppercase text-ink/60 font-body mb-6 animate-fadeUp">
          Medically-led aesthetic clinic — London
        </span>
        <h1 className="font-display text-ink text-[25px] sm:text-[34px] md:text-[42px] lg:text-[50px] leading-[1.15] max-w-4xl text-balance animate-fadeUp [animation-delay:150ms] opacity-0">
          Appearance Linked to Health
          <br />
          Natural Confidence. Personalised.
        </h1>
        <p className="mt-6 max-w-xl text-ink/70 font-body text-base sm:text-lg leading-relaxed animate-fadeUp [animation-delay:300ms] opacity-0">
          Premium medical aesthetics focused on enhancing confidence through
          safe, personalised treatments.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 animate-fadeUp [animation-delay:450ms] opacity-0">
          <BookingButton variant="solid" size="lg" />
          <Link
            href="/treatments"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-ink/30 text-ink text-base font-body hover:bg-ink hover:text-warm transition-all duration-300"
          >
            View Treatments
          </Link>
        </div>
      </div>
    </section>
  );
}
