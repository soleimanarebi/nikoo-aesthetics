/**
 * Central place for reading environment variables.
 *
 * NEXT_PUBLIC_BOOKING_URL is kept for reference/rollback: this variant
 * uses an on-site calendar at /booking instead of an external booking
 * platform, so BookingButton no longer reads this value. If you later
 * switch back to an external booking provider (e.g. Consentz), point
 * BookingButton at BOOKING_URL again — everything else is already wired.
 */
export const BOOKING_URL: string =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://booking.consentz.com/nikoo-aesthetics";

export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nikooaesthetics.co.uk";
