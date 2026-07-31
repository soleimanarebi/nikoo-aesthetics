import Image from "next/image";
import Link from "next/link";
import type { Treatment } from "@/lib/types";

export default function TreatmentCard({
  treatment,
  priority = false,
}: {
  treatment: Treatment;
  priority?: boolean;
}) {
  return (
    <div className="group flex flex-col rounded-xl2 overflow-hidden bg-white shadow-card hover:shadow-soft transition-shadow duration-500">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={treatment.image}
          alt={`${treatment.name} treatment at Nikoo Aesthetics`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="text-[11px] tracking-widest2 uppercase bg-warm/90 backdrop-blur-sm text-ink px-3 py-1.5 rounded-full font-body">
            {treatment.category}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="font-display text-xl text-ink">{treatment.name}</h3>
        <p className="text-ink/65 font-body text-sm leading-relaxed flex-1">
          {treatment.shortDescription}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="font-body text-sm text-gold-dark">
            From £{treatment.priceFrom}
          </span>
          <Link
            href={`/treatments/${treatment.slug}`}
            className="text-sm font-body text-ink underline decoration-gold decoration-1 underline-offset-4 hover:text-gold-dark transition-colors"
          >
            Learn More →
          </Link>
        </div>
      </div>
    </div>
  );
}
