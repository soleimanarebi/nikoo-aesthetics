import treatmentsJson from "@/data/treatments.json";
import faqsJson from "@/data/faqs.json";
import testimonialsJson from "@/data/testimonials.json";
import galleryJson from "@/data/gallery.json";
import siteJson from "@/data/site.json";
import bookingServicesJson from "@/data/booking-services.json";
import treatmentFamiliesJson from "@/data/treatment-families.json";
import aftercareDocumentsJson from "@/data/aftercare-documents.json";
import type {
  Treatment,
  FaqGroup,
  Testimonial,
  GalleryImage,
  SiteSettings,
  BookingServiceCategory,
  TreatmentFamily,
  AftercareDocument,
} from "@/lib/types";

export function getTreatments(): Treatment[] {
  return treatmentsJson as Treatment[];
}

export function getTreatmentBySlug(slug: string): Treatment | undefined {
  return getTreatments().find((t) => t.slug === slug);
}

export function getFaqs(): FaqGroup[] {
  return faqsJson as FaqGroup[];
}

export function getTestimonials(): Testimonial[] {
  return testimonialsJson as Testimonial[];
}

export function getGallery(): GalleryImage[] {
  return galleryJson as GalleryImage[];
}

export function getSiteSettings(): SiteSettings {
  return siteJson as SiteSettings;
}

export function getBookingServices(): BookingServiceCategory[] {
  return bookingServicesJson as BookingServiceCategory[];
}

export function getTreatmentFamilies(): TreatmentFamily[] {
  return treatmentFamiliesJson as TreatmentFamily[];
}

export function getTreatmentFamilyBySlug(slug: string): TreatmentFamily | undefined {
  return getTreatmentFamilies().find((f) => f.slug === slug);
}

/** All booking-service categories belonging to a given treatment family. */
export function getCategoriesForFamily(familySlug: string): BookingServiceCategory[] {
  return getBookingServices().filter((c) => c.family === familySlug);
}

/** Lowest price across every item in a family — used as its "From £X" card price. */
export function getFamilyPriceFrom(familySlug: string): number | null {
  const prices = getCategoriesForFamily(familySlug)
    .flatMap((c) => c.items)
    .map((i) => i.price)
    .filter((p): p is number => p !== null);
  return prices.length ? Math.min(...prices) : null;
}

/** All categories grouped by their pricing-page group (Injectables, Skin & Rejuvenation, etc). */
/**
 * Categories grouped under each of the 6 treatment families, in family
 * order — used for the Pricing page. Categories not belonging to any of
 * the 6 families (e.g. Lumi Eyes, Light Eye, Vitamin Therapy) are returned
 * separately so nothing is lost from the price list.
 */
export function getCategoriesGroupedByFamily(): {
  family: TreatmentFamily;
  categories: BookingServiceCategory[];
}[] {
  return getTreatmentFamilies().map((family) => ({
    family,
    categories: getCategoriesForFamily(family.slug),
  }));
}

export function getUnfamiliedCategories(): BookingServiceCategory[] {
  return getBookingServices().filter((c) => !c.family);
}

export function getCategoriesByPriceGroup(): Record<string, BookingServiceCategory[]> {
  const groups: Record<string, BookingServiceCategory[]> = {};
  for (const cat of getBookingServices()) {
    if (!cat.priceGroup) continue;
    if (!groups[cat.priceGroup]) groups[cat.priceGroup] = [];
    groups[cat.priceGroup].push(cat);
  }
  return groups;
}

export function getAftercareDocuments(): AftercareDocument[] {
  return aftercareDocumentsJson as AftercareDocument[];
}

/**
 * Formats the clinic address as a list of non-empty display lines —
 * gracefully skips city/postcode when either is blank, so address data
 * with fewer fields (e.g. no separate "city") never renders an awkward
 * blank line.
 */
export function getAddressLines(site: SiteSettings): string[] {
  const { line1, line2, city, postcode } = site.address;
  const cityPostcode = [city, postcode].filter(Boolean).join(" ");
  return [line1, line2, cityPostcode].filter(Boolean);
}
