import Link from "next/link";
import BookingButton from "@/components/BookingButton";

export const metadata = {
  title: "Page Not Found | Nikoo Aesthetics",
};

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 pt-20">
      <div className="text-center max-w-md">
        <span className="text-xs tracking-widest2 uppercase text-gold-dark font-body">
          404
        </span>
        <h1 className="font-display text-4xl text-ink mt-4 mb-4">
          This page couldn&apos;t be found.
        </h1>
        <p className="text-ink/65 font-body text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for may have moved or no longer exists.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-full border border-ink/20 text-sm font-body hover:border-ink transition-colors"
          >
            Back to Home
          </Link>
          <BookingButton />
        </div>
      </div>
    </section>
  );
}
