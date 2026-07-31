import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import BookingManage from "@/components/BookingManage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Manage Your Booking | Nikoo Aesthetics",
    description: "Cancel or request to reschedule your appointment at Nikoo Aesthetics.",
    path: "/booking/manage",
  }),
  robots: { index: false, follow: false },
};

export default function ManageBookingPage() {
  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Manage your appointment."
        description="Cancel your appointment or request a new date and time below."
      />

      <section className="max-w-content mx-auto px-6 lg:px-10 py-24">
        <Suspense fallback={<p className="text-ink/40 font-body text-sm">Loading…</p>}>
          <BookingManage />
        </Suspense>
      </section>
    </>
  );
}
