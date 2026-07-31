import Image from "next/image";
import Link from "next/link";
import type { TreatmentFamily } from "@/lib/types";

function formatPrice(price: number | null): string {
  if (price === null) return "POA";
  return price === 0 ? "Free" : `£${price}`;
}

export default function FamilyCard({
  family,
  priceFrom,
  priority = false,
}: {
  family: TreatmentFamily;
  priceFrom: number | null;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/treatments/${family.slug}`}
      className="group flex flex-col rounded-xl2 overflow-hidden bg-white shadow-card hover:shadow-soft transition-shadow duration-500"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={family.image}
          alt={`${family.name} treatments at Nikoo Aesthetics`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="font-display text-xl text-ink">{family.name}</h3>
        <p className="text-ink/65 font-body text-sm leading-relaxed flex-1">
          {family.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="font-body text-sm text-gold-dark">
            From {formatPrice(priceFrom)}
          </span>
          <span className="text-sm font-body text-ink underline decoration-gold decoration-1 underline-offset-4 group-hover:text-gold-dark transition-colors">
            View Treatments →
          </span>
        </div>
      </div>
    </Link>
  );
}
