import Hero from "@/components/Hero";
import FeaturedTreatments from "@/components/FeaturedTreatments";
import AboutTeaser from "@/components/AboutTeaser";
import GalleryPreview from "@/components/GalleryPreview";
import WhyChoose from "@/components/WhyChoose";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import FaqPreview from "@/components/FaqPreview";
import CtaSection from "@/components/CtaSection";
import { getTestimonials } from "@/lib/data";

export default function HomePage() {
  const testimonials = getTestimonials();

  return (
    <>
      <Hero />
      <FeaturedTreatments />
      <AboutTeaser />
      <GalleryPreview />
      <WhyChoose />
      <TestimonialsCarousel testimonials={testimonials} />
      <FaqPreview />
      <CtaSection />
    </>
  );
}
