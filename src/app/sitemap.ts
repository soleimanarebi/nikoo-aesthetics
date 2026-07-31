import type { MetadataRoute } from "next";
import { getTreatments } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/treatments",
    "/gallery",
    "/pricing",
    "/faq",
    "/contact",
    "/booking",
    "/privacy-policy",
    "/terms",
    "/cookie-policy",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const treatmentRoutes = getTreatments().map((t) => ({
    url: `${SITE_URL}/treatments/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...treatmentRoutes];
}
