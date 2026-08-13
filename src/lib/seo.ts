import type { Metadata } from "next";
import { SITE_URL } from "@/lib/env";
import { getSiteSettings } from "@/lib/data";

const site = getSiteSettings();

export function buildMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: "website",
      locale: "en_GB",
      images: [
        {
          url: `${SITE_URL}/images/og-cover.jpg`,
          width: 1200,
          height: 630,
          alt: `${site.name} — ${site.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/images/og-cover.jpg`],
    },
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    name: site.name,
    description: site.description,
    url: SITE_URL,
    telephone: site.phone,
    email: site.email,
    image: `${SITE_URL}/images/og-cover.jpg`,
    priceRange: "£££",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.businessName}, ${site.address.line1}`,
      addressLocality: site.address.line2,
      postalCode: site.address.postcode,
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.lat,
      longitude: site.address.lng,
    },
    sameAs: [site.instagram],
    openingHoursSpecification: site.hours
      .filter((h) => h.time !== "Closed")
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        opens: h.time.split(" – ")[0],
        closes: h.time.split(" – ")[1],
      })),
  };
}
