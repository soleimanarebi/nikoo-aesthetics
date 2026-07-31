import Reveal from "@/components/Reveal";

export default function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-warm pt-52 pb-20 border-b border-ink/10">
      <div className="max-w-content mx-auto px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <span className="text-xs tracking-widest2 uppercase text-gold-dark font-body">
            {eyebrow}
          </span>
          <h1 className="font-display text-ink text-4xl sm:text-5xl md:text-6xl mt-4 text-balance leading-[1.1]">
            {title}
          </h1>
          {description && (
            <p className="mt-6 text-ink/65 font-body text-base sm:text-lg leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
