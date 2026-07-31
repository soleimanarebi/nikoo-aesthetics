export interface TreatmentFaq {
  q: string;
  a: string;
}

export interface Treatment {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  image: string;
  benefits: string[];
  downtime: string;
  duration: string;
  priceFrom: number;
  resultsLast: string;
  overview: string;
  procedure: string;
  recovery: string;
  results: string;
  faqs: TreatmentFaq[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  group: string;
  items: FaqItem[];
}

export interface Testimonial {
  name: string;
  rating: number;
  text: string;
}

export interface GalleryImage {
  id: string;
  category?: string;
  image: string;
  caption: string;
}

export interface TreatmentFamily {
  slug: string;
  name: string;
  image: string;
  description: string;
}

export interface BookingServiceItem {
  name: string;
  price: number | null;
}

export interface BookingServiceCategory {
  id: string;
  category: string;
  note?: string;
  items: BookingServiceItem[];
  family: string | null;
  priceGroup: string | null;
}

export interface AftercareDocument {
  title: string;
  file: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  instagram: string;
  instagramHandle?: string;
  googleMapsUrl?: string;
  googleMapsEmbedSrc?: string;
  address: {
    area: string;
    region: string;
    country: string;
  };
  hours: { day: string; time: string }[];
}
