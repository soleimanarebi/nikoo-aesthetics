import Link from "next/link";

type Variant = "solid" | "outline" | "ghost";
type Size = "md" | "lg";

interface BookingButtonProps {
  variant?: Variant;
  size?: Size;
  label?: string;
  className?: string;
  treatment?: string;
}

const variantStyles: Record<Variant, string> = {
  solid:
    "bg-ink text-warm hover:bg-gold hover:text-ink border border-ink hover:border-gold",
  outline:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-warm",
  ghost:
    "bg-transparent text-gold-dark border border-gold/60 hover:bg-gold hover:text-ink",
};

const sizeStyles: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

/**
 * Every "Book Appointment" call to action on the site should use this
 * component. It links to the on-site /booking calendar page — pass a
 * `treatment` to pre-select that treatment on arrival.
 */
export default function BookingButton({
  variant = "solid",
  size = "md",
  label = "Book Appointment",
  className = "",
  treatment,
}: BookingButtonProps) {
  const href = treatment
    ? `/booking?treatment=${encodeURIComponent(treatment)}`
    : "/booking";

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-body tracking-wide transition-all duration-300 ease-out ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {label}
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
