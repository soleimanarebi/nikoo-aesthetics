import Image from "next/image";
import Link from "next/link";

/**
 * Official Nikoo Aesthetics logo — the client's real logo file (script
 * "Nikoo" mark + "NIKOO AESTHETICS" wordmark, baked into the image itself).
 * Rendered as a single image; no separately-coded text is added alongside
 * it in this component.
 *
 * Swap the underlying file at:
 *   /public/images/logo/nikoo-logo.png            (for light backgrounds)
 *   /public/images/logo/nikoo-logo-reversed.png   (for dark backgrounds)
 * to replace with an updated brand mark. No other code changes required.
 *
 * Rendered at 144×144px (h-36 w-36) per brand spec — the logo's own aspect
 * ratio is preserved via object-contain within that box.
 */
export default function Logo({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const src =
    variant === "light"
      ? "/images/logo/nikoo-logo-reversed.png"
      : "/images/logo/nikoo-logo.png";

  return (
    <Link
      href="/"
      className={`inline-flex items-center shrink-0 ${className}`}
      aria-label="Nikoo Aesthetics — home"
    >
      <span className="relative h-36 w-36 shrink-0">
        <Image
          src={src}
          alt=""
          fill
          sizes="144px"
          className="object-contain"
          priority
        />
      </span>
    </Link>
  );
}
