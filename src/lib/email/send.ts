import { sendEmail, getAdminEmail } from "@/lib/email/resend";
import {
  bookingAdminEmail,
  bookingClientEmail,
  contactAdminEmail,
  contactClientEmail,
  bookingCancelledAdminEmail,
  bookingCancelledClientEmail,
  bookingRescheduleAdminEmail,
  bookingRescheduleClientEmail,
  type BookingEmailData,
  type ContactEmailData,
  type CancelEmailData,
  type RescheduleEmailData,
} from "@/lib/email/templates";

/**
 * One pair of functions per event (booking, contact, cancellation,
 * reschedule). Each event sends TWO admin-visible emails and one
 * client-visible email:
 *
 *  1. A dedicated "action needed" notification to ADMIN_EMAIL (its own
 *     template — e.g. "New Booking", "Cancellation Request")
 *  2. The client's confirmation email, which is also BCC'd to ADMIN_EMAIL
 *     so the clinic has a complete record of exactly what every client
 *     received, not just a summary — this mirroring applies to every
 *     client-facing email the site sends, per site policy.
 *
 * Future additions (reminder emails, appointment approval emails) should
 * follow the same shape: a template pair in templates.ts, and a thin
 * `sendXEmails(data)` function here using `sendMirroredPair()`.
 */

export interface DualSendResult {
  adminSent: boolean;
  clientSent: boolean;
  errors: string[];
}

/** Resolves ADMIN_EMAIL without throwing — returns null + a message on failure. */
async function resolveAdminAddress(): Promise<{ address: string | null; error: string | null }> {
  try {
    return { address: getAdminEmail(), error: null };
  } catch (err) {
    return {
      address: null,
      error: err instanceof Error ? err.message : "ADMIN_EMAIL is not configured.",
    };
  }
}

/**
 * Shared send pattern: fires the admin "action needed" email and the
 * client confirmation email in parallel. The client email is BCC'd to
 * admin so every client-facing email is mirrored to the clinic inbox.
 */
async function sendMirroredPair(params: {
  adminEmail: { subject: string; html: string };
  clientEmail: { subject: string; html: string };
  clientAddress: string;
}): Promise<DualSendResult> {
  const { address: adminAddress, error: adminConfigError } = await resolveAdminAddress();
  if (!adminAddress) {
    return { adminSent: false, clientSent: false, errors: [adminConfigError ?? "ADMIN_EMAIL is not configured."] };
  }

  const [adminResult, clientResult] = await Promise.all([
    sendEmail({
      to: adminAddress,
      subject: params.adminEmail.subject,
      html: params.adminEmail.html,
      replyTo: params.clientAddress,
    }),
    sendEmail({
      to: params.clientAddress,
      subject: params.clientEmail.subject,
      html: params.clientEmail.html,
      // Mirror every client-facing email to the admin inbox as well, so
      // the clinic has a full record of exactly what the client received.
      bcc: adminAddress,
    }),
  ]);

  const errors: string[] = [];
  if (!adminResult.success) errors.push(`Admin notification: ${adminResult.error}`);
  if (!clientResult.success) errors.push(`Client confirmation: ${clientResult.error}`);

  return { adminSent: adminResult.success, clientSent: clientResult.success, errors };
}

// ---------------------------------------------------------------------------
// Booking
// ---------------------------------------------------------------------------

export async function sendBookingEmails(data: BookingEmailData): Promise<DualSendResult> {
  return sendMirroredPair({
    adminEmail: bookingAdminEmail(data),
    clientEmail: bookingClientEmail(data),
    clientAddress: data.email,
  });
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export async function sendContactEmails(data: ContactEmailData): Promise<DualSendResult> {
  return sendMirroredPair({
    adminEmail: contactAdminEmail(data),
    clientEmail: contactClientEmail(data),
    clientAddress: data.email,
  });
}

// ---------------------------------------------------------------------------
// Cancellation
// ---------------------------------------------------------------------------

export async function sendBookingCancellationEmails(data: CancelEmailData): Promise<DualSendResult> {
  return sendMirroredPair({
    adminEmail: bookingCancelledAdminEmail(data),
    clientEmail: bookingCancelledClientEmail(data),
    clientAddress: data.email,
  });
}

// ---------------------------------------------------------------------------
// Reschedule
// ---------------------------------------------------------------------------

export async function sendBookingRescheduleEmails(data: RescheduleEmailData): Promise<DualSendResult> {
  return sendMirroredPair({
    adminEmail: bookingRescheduleAdminEmail(data),
    clientEmail: bookingRescheduleClientEmail(data),
    clientAddress: data.email,
  });
}
