import { emailLayout, detailRow, detailsTable, paragraph, ctaButton } from "@/lib/email/layout";
import { getSiteSettings } from "@/lib/data";
import { buildManageBookingUrl } from "@/lib/email/booking-token";
import { SITE_URL } from "@/lib/env";

/**
 * Every email the site sends is built here as a `{ subject, html }` pair.
 * To add a future email type (reminder, cancellation, appointment
 * approval), add a new function following the same pattern — pull in
 * `emailLayout`/`detailRow`/`paragraph`/`ctaButton` from lib/email/layout
 * and it will automatically match the branding of every other email.
 */

export interface BookingEmailData {
  name: string;
  email: string;
  phone: string;
  treatment: string;
  category: string;
  date: string;
  time: string;
  message?: string;
  submittedAt: string;
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: string;
}

function formatSubmittedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Europe/London",
    });
  } catch {
    return iso;
  }
}

// ---------------------------------------------------------------------------
// Booking emails
// ---------------------------------------------------------------------------

export function bookingAdminEmail(data: BookingEmailData): { subject: string; html: string } {
  const rows = detailsTable(
    [
      detailRow("Client Name", data.name),
      detailRow("Email", data.email),
      detailRow("Phone", data.phone),
      detailRow("Treatment", `${data.category} — ${data.treatment}`),
      detailRow("Preferred Date", data.date),
      detailRow("Preferred Time", data.time),
      detailRow("Message", data.message?.trim() ? data.message : "—"),
      detailRow("Submitted", formatSubmittedAt(data.submittedAt)),
    ].join("")
  );

  const html = emailLayout({
    previewText: `New appointment request from ${data.name} — ${data.treatment}`,
    heading: "New Appointment Request",
    bodyHtml: `
      ${paragraph(`A new appointment request has been submitted through the website.`)}
      ${rows}
      ${ctaButton("Reply to Client", `mailto:${data.email}`)}
    `,
  });

  return { subject: `New Booking: ${data.name} — ${data.treatment}`, html };
}

export function bookingClientEmail(data: BookingEmailData): { subject: string; html: string } {
  const site = getSiteSettings();
  const rows = detailsTable(
    [
      detailRow("Treatment", `${data.category} — ${data.treatment}`),
      detailRow("Preferred Date", data.date),
      detailRow("Preferred Time", data.time),
    ].join("")
  );

  const manageUrl = buildManageBookingUrl({
    name: data.name,
    email: data.email,
    phone: data.phone,
    treatment: data.treatment,
    category: data.category,
    date: data.date,
    time: data.time,
  });

  const html = emailLayout({
    previewText: `Your appointment request with ${site.name} has been received.`,
    heading: "Appointment Request Received",
    bodyHtml: `
      ${paragraph(`Dear ${data.name},`)}
      ${paragraph(
        `Thank you for booking with ${site.name}. We've received your appointment request with the following details:`
      )}
      ${rows}
      ${paragraph(
        `This is a request, not a final confirmation — our team will contact you shortly by phone or email to confirm your appointment and take any final details ahead of your visit.`
      )}
      ${ctaButton("Manage Your Booking", manageUrl)}
      ${paragraph(
        `Need to cancel or change your date? Use the button above, or reply to this email — either way, please let us know as early as possible so we can offer your slot to another client.`
      )}
      ${paragraph(`We look forward to welcoming you to the clinic.`)}
    `,
  });

  return { subject: `Your Appointment Request — ${site.name}`, html };
}

// ---------------------------------------------------------------------------
// Contact form emails
// ---------------------------------------------------------------------------

export function contactAdminEmail(data: ContactEmailData): { subject: string; html: string } {
  const rows = detailsTable(
    [
      detailRow("Name", data.name),
      detailRow("Email", data.email),
      detailRow("Phone", data.phone?.trim() ? data.phone : "—"),
      detailRow("Submitted", formatSubmittedAt(data.submittedAt)),
    ].join("")
  );

  const html = emailLayout({
    previewText: `New enquiry from ${data.name}`,
    heading: "New Website Enquiry",
    bodyHtml: `
      ${paragraph(`A new enquiry has been submitted through the website contact form.`)}
      ${rows}
      <div style="margin-top: 20px; padding: 16px; background-color:#FAF7F2; border-radius:8px;">
        <p style="margin:0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:12px; text-transform:uppercase; letter-spacing:0.06em; color:#6B6660; margin-bottom:8px;">Message</p>
        <p style="margin:0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:14px; line-height:1.6; color:#111111; white-space:pre-wrap;">${escapeForDisplay(data.message)}</p>
      </div>
      ${ctaButton("Reply to Enquiry", `mailto:${data.email}`)}
    `,
  });

  return { subject: `New Enquiry: ${data.name}`, html };
}

export function contactClientEmail(data: ContactEmailData): { subject: string; html: string } {
  const site = getSiteSettings();

  const html = emailLayout({
    previewText: `Thank you for contacting ${site.name}.`,
    heading: "Thank You for Your Enquiry",
    bodyHtml: `
      ${paragraph(`Dear ${data.name},`)}
      ${paragraph(
        `Thank you for getting in touch with ${site.name}. We've received your message and a member of our team will respond within one to two working days.`
      )}
      <div style="margin: 16px 0; padding: 16px; background-color:#FAF7F2; border-radius:8px;">
        <p style="margin:0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:12px; text-transform:uppercase; letter-spacing:0.06em; color:#6B6660; margin-bottom:8px;">Your Message</p>
        <p style="margin:0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:14px; line-height:1.6; color:#111111; white-space:pre-wrap;">${escapeForDisplay(data.message)}</p>
      </div>
      ${paragraph(`If your enquiry is urgent, please call or WhatsApp us directly — our details are below.`)}
    `,
  });

  return { subject: `We've Received Your Enquiry — ${site.name}`, html };
}

// ---------------------------------------------------------------------------
// Cancellation emails
// ---------------------------------------------------------------------------

export interface CancelEmailData {
  name: string;
  email: string;
  phone: string;
  treatment: string;
  category: string;
  date: string;
  time: string;
  reason?: string;
  submittedAt: string;
}

export function bookingCancelledClientEmail(data: CancelEmailData): { subject: string; html: string } {
  const site = getSiteSettings();
  const rows = detailsTable(
    [
      detailRow("Treatment", `${data.category} — ${data.treatment}`),
      detailRow("Date", data.date),
      detailRow("Time", data.time),
    ].join("")
  );

  const html = emailLayout({
    previewText: `Your appointment with ${site.name} has been cancelled.`,
    heading: "Appointment Cancelled",
    bodyHtml: `
      ${paragraph(`Dear ${data.name},`)}
      ${paragraph(`As requested, the following appointment has been cancelled:`)}
      ${rows}
      ${paragraph(
        `We're sorry to see this one go — whenever you're ready to rebook, we'd love to welcome you to the clinic.`
      )}
      ${ctaButton("Book a New Appointment", `${SITE_URL}/booking`)}
    `,
  });

  return { subject: `Your Appointment Has Been Cancelled — ${site.name}`, html };
}

export function bookingCancelledAdminEmail(data: CancelEmailData): { subject: string; html: string } {
  const rows = detailsTable(
    [
      detailRow("Client Name", data.name),
      detailRow("Email", data.email),
      detailRow("Phone", data.phone),
      detailRow("Treatment", `${data.category} — ${data.treatment}`),
      detailRow("Original Date", data.date),
      detailRow("Original Time", data.time),
      detailRow("Reason Given", data.reason?.trim() ? data.reason : "—"),
      detailRow("Requested", formatSubmittedAt(data.submittedAt)),
    ].join("")
  );

  const html = emailLayout({
    previewText: `${data.name} has cancelled their appointment.`,
    heading: "Appointment Cancellation Request",
    bodyHtml: `
      ${paragraph(
        `A client has cancelled their appointment via the website. Please remove this slot from the clinic calendar/Consentz.`
      )}
      ${rows}
      ${ctaButton("Contact Client", `mailto:${data.email}`)}
    `,
  });

  return { subject: `Cancellation: ${data.name} — ${data.treatment}`, html };
}

// ---------------------------------------------------------------------------
// Reschedule emails
// ---------------------------------------------------------------------------

export interface RescheduleEmailData {
  name: string;
  email: string;
  phone: string;
  treatment: string;
  category: string;
  originalDate: string;
  originalTime: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  submittedAt: string;
}

export function bookingRescheduleClientEmail(data: RescheduleEmailData): { subject: string; html: string } {
  const site = getSiteSettings();
  const rows = detailsTable(
    [
      detailRow("Treatment", `${data.category} — ${data.treatment}`),
      detailRow("Original Date & Time", `${data.originalDate} at ${data.originalTime}`),
      detailRow("Requested New Date & Time", `${data.preferredDate} at ${data.preferredTime}`),
    ].join("")
  );

  const html = emailLayout({
    previewText: `Your reschedule request has been received.`,
    heading: "Reschedule Request Received",
    bodyHtml: `
      ${paragraph(`Dear ${data.name},`)}
      ${paragraph(
        `We've received your request to reschedule the following appointment:`
      )}
      ${rows}
      ${paragraph(
        `This is a request, not a confirmed change — our team will contact you shortly to confirm your new date and time.`
      )}
    `,
  });

  return { subject: `Reschedule Request Received — ${site.name}`, html };
}

export function bookingRescheduleAdminEmail(data: RescheduleEmailData): { subject: string; html: string } {
  const rows = detailsTable(
    [
      detailRow("Client Name", data.name),
      detailRow("Email", data.email),
      detailRow("Phone", data.phone),
      detailRow("Treatment", `${data.category} — ${data.treatment}`),
      detailRow("Original Date & Time", `${data.originalDate} at ${data.originalTime}`),
      detailRow("Requested New Date & Time", `${data.preferredDate} at ${data.preferredTime}`),
      detailRow("Notes", data.notes?.trim() ? data.notes : "—"),
      detailRow("Requested", formatSubmittedAt(data.submittedAt)),
    ].join("")
  );

  const html = emailLayout({
    previewText: `${data.name} has requested to reschedule their appointment.`,
    heading: "Reschedule Request",
    bodyHtml: `
      ${paragraph(
        `A client has requested to reschedule their appointment via the website. Please confirm the new slot with them and update the clinic calendar/Consentz.`
      )}
      ${rows}
      ${ctaButton("Contact Client", `mailto:${data.email}`)}
    `,
  });

  return { subject: `Reschedule Request: ${data.name} — ${data.treatment}`, html };
}

// Local re-export so template files don't need a separate import for one helper.
function escapeForDisplay(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
