import { SITE_URL } from "@/lib/env";

/**
 * Encodes the essential booking details into a URL so a client can open
 * their confirmation email, click "Manage Booking", and land on a page
 * that already shows their appointment details — with no database or
 * booking ID system required.
 *
 * This is intentionally NOT cryptographically signed: there is no live
 * calendar/PMS integration behind this site yet (see PROJECT_ROADMAP.md),
 * so a cancellation or reschedule request here only ever triggers an
 * email to the clinic for manual confirmation — it doesn't automatically
 * alter a real appointment record. If/when this site is connected to a
 * real booking backend (e.g. Consentz), this token should be replaced
 * with a signed/looked-up booking ID instead.
 */
export interface ManageableBooking {
  name: string;
  email: string;
  phone: string;
  treatment: string;
  category: string;
  date: string;
  time: string;
}

export function encodeBookingToken(data: ManageableBooking): string {
  const json = JSON.stringify(data);
  return Buffer.from(json, "utf-8").toString("base64url");
}

export function decodeBookingToken(token: string): ManageableBooking | null {
  try {
    const json = Buffer.from(token, "base64url").toString("utf-8");
    const data = JSON.parse(json);
    if (
      typeof data.name === "string" &&
      typeof data.email === "string" &&
      typeof data.phone === "string" &&
      typeof data.treatment === "string" &&
      typeof data.category === "string" &&
      typeof data.date === "string" &&
      typeof data.time === "string"
    ) {
      return data as ManageableBooking;
    }
    return null;
  } catch {
    return null;
  }
}

export function buildManageBookingUrl(data: ManageableBooking): string {
  const token = encodeBookingToken(data);
  return `${SITE_URL}/booking/manage?b=${token}`;
}
