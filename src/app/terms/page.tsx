import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions | Nikoo Aesthetics",
  description: "Terms and conditions for treatments and bookings at Nikoo Aesthetics.",
  path: "/terms",
});

export default function TermsPage() {
  const site = getSiteSettings();

  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" />
      <section className="max-w-content mx-auto px-6 lg:px-10 py-24">
        <div className="max-w-2xl flex flex-col gap-8 font-body text-ink/75 leading-relaxed text-sm">
          <div>
            <h2 className="font-display text-xl text-ink mb-2">Consultations</h2>
            <p>
              All new clients must complete a full consultation before any
              treatment is carried out. Treatment is offered entirely at the
              practitioner&apos;s clinical discretion.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink mb-2">Bookings & Cancellations</h2>
            <p>
              Appointments are booked via our online booking platform. We
              request at least 48 hours&apos; notice for cancellations or
              rescheduling; late cancellations may be subject to a fee.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink mb-2">Results</h2>
            <p>
              While every effort is made to achieve the discussed outcome,
              individual results vary. Realistic expectations are set during
              consultation and no specific result can be guaranteed.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink mb-2">Payment</h2>
            <p>
              Prices are correct at time of publishing and may be subject to
              change. Consultation fees, where applicable, are redeemable
              against treatment on the day.
            </p>
          </div>
          <p className="text-ink/65 text-xs">
            This is placeholder terms text for {site.name}. Replace with terms
            drafted or reviewed by a qualified professional before launch.
          </p>
        </div>
      </section>
    </>
  );
}
