import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import BookingButton from "@/components/BookingButton";
import Reveal from "@/components/Reveal";
import { getSiteSettings, getAddressLines } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact | Nikoo Aesthetics",
  description:
    "Get in touch with Nikoo Aesthetics. Find our address, opening hours and contact details, or book your appointment online.",
  path: "/contact",
});

export default function ContactPage() {
  const site = getSiteSettings();
  const addressLines = getAddressLines(site);
  const fallbackMapQuery = encodeURIComponent(addressLines.join(", "));
  const mapSrc =
    site.googleMapsEmbedSrc ?? `https://www.google.com/maps?q=${fallbackMapQuery}&output=embed`;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's start your consultation."
        description="Reach out with any questions, or book your consultation directly online."
      />

      <section className="max-w-content mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-2 gap-16">
        <Reveal className="flex flex-col gap-10">
          <div className="relative aspect-[4/3] rounded-xl2 overflow-hidden shadow-card bg-ink/5">
            <iframe
              title="Map showing Nikoo Aesthetics location"
              src={mapSrc}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xs tracking-widest2 uppercase text-ink/65 font-body mb-2">
                Address
              </h2>
              <p className="font-body text-ink/75 text-sm leading-relaxed">
                {addressLines.map((line, i) => (
                  <span key={line}>
                    {line}
                    {i < addressLines.length - 1 && <br />}
                  </span>
                ))}
              </p>
              {site.googleMapsUrl && (
                <a
                  href={site.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm font-body text-ink underline decoration-gold decoration-1 underline-offset-4 hover:text-gold-dark transition-colors"
                >
                  Get Directions
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
            <div>
              <h2 className="text-xs tracking-widest2 uppercase text-ink/65 font-body mb-2">
                Opening Hours
              </h2>
              <ul className="font-body text-ink/75 text-sm space-y-1">
                {site.hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4">
                    <span>{h.day}</span>
                    <span>{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <BookingButton size="lg" className="w-fit" />
        </Reveal>

        <Reveal delay={100}>
          <ContactForm />
        </Reveal>
      </section>
    </>
  );
}
