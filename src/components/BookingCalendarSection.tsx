"use client";

import { useSearchParams } from "next/navigation";
import BookingCalendar from "@/components/BookingCalendar";
import type { SiteSettings, BookingServiceCategory } from "@/lib/types";

export default function BookingCalendarSection({
  hours,
  services,
}: {
  hours: SiteSettings["hours"];
  services: BookingServiceCategory[];
}) {
  const searchParams = useSearchParams();
  const treatment = searchParams.get("treatment") ?? undefined;
  const categoryId = searchParams.get("category") ?? undefined;
  const itemName = searchParams.get("item") ?? undefined;

  return (
    <BookingCalendar
      hours={hours}
      services={services}
      initialTreatment={treatment}
      initialCategoryId={categoryId}
      initialItemName={itemName}
    />
  );
}
