import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import BookingCalendarSection from "@/components/BookingCalendarSection";
import { getSiteSettings, getBookingServices } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Book an Appointment | Nikoo Aesthetics",
  description:
    "Choose a treatment, then an available date and time for your appointment at Nikoo Aesthetics.",
  path: "/booking",
});

export default function BookingPage() {
  const site = getSiteSettings();
  const services = getBookingServices();

  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Choose your appointment."
        description="Select a treatment, then an available date and time. All appointments begin with a full consultation to discuss your goals and suitability."
      />

      <section className="max-w-content mx-auto px-6 lg:px-10 py-24">
        <Suspense fallback={<p className="text-ink/40 font-body text-sm">Loading calendar…</p>}>
          <BookingCalendarSection hours={site.hours} services={services} />
        </Suspense>
      </section>
    </>
  );
}
