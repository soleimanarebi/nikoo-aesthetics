import Reveal from "@/components/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  const alignClass = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <Reveal className={`flex flex-col gap-4 max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <span className="text-xs tracking-widest2 uppercase text-gold-dark font-body">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink text-balance leading-[1.1]">
        {title}
      </h2>
      <span className="gold-thread w-16" />
      {description && (
        <p className="text-ink/70 font-body text-base sm:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </Reveal>
  );
}
