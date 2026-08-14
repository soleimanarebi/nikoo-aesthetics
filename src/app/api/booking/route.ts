import { NextRequest, NextResponse } from "next/server";
import { bookingSchema, detectSpam } from "@/lib/validation";
import { sendBookingEmails } from "@/lib/email/send";
import { isDateBlocked } from "@/lib/blocked-dates";

/**
 * POST /api/booking
 *
 * Validates a booking submission, sends the admin notification + client
 * confirmation emails via Resend, and returns a JSON result. This route
 * runs server-side only (Next.js App Router Route Handler) — the Resend
 * API key is never sent to the browser.
 *
 * On Netlify, `@netlify/plugin-nextjs` automatically converts this route
 * into a serverless function; no extra configuration is required beyond
 * the environment variables documented in the README.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid submission.";
    return NextResponse.json(
      { success: false, message: firstError, fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const spamReason = detectSpam(parsed.data);
  if (spamReason) {
    // Respond as if successful to avoid tipping off bots, but do not send any email.
    return NextResponse.json({ success: true, message: "Request received." }, { status: 200 });
  }

  const { name, email, phone, treatment, category, date, time, message } = parsed.data;

  // Reject bookings for dates the clinic has temporarily blocked — this is
  // the real enforcement point: it applies even if a request bypasses the
  // calendar UI entirely and POSTs directly to this endpoint.
  try {
    if (await isDateBlocked(date)) {
      return NextResponse.json(
        {
          success: false,
          message: "That date is not available. Please choose a different date.",
        },
        { status: 409 }
      );
    }
  } catch (err) {
    // If the blocked-dates check itself fails, do not silently let the
    // booking through — but also don't crash the whole request; log and
    // continue, since a transient storage issue shouldn't block every
    // booking on the site.
    console.error("Failed to check blocked dates:", err);
  }

  try {
    const result = await sendBookingEmails({
      name,
      email,
      phone,
      treatment,
      category,
      date,
      time,
      message,
      submittedAt: new Date().toISOString(),
    });

    if (!result.adminSent && !result.clientSent) {
      console.error("Booking email send failed entirely:", result.errors);
      return NextResponse.json(
        {
          success: false,
          message:
            "We couldn't send your booking confirmation right now. Please call or WhatsApp us directly to confirm your appointment.",
        },
        { status: 502 }
      );
    }

    if (!result.clientSent) {
      // Admin was notified, so the booking is on our radar — but the client
      // didn't get their confirmation email. Still a success for the visitor.
      console.error("Booking client confirmation failed:", result.errors);
    }

    return NextResponse.json(
      { success: true, message: "Your appointment request has been received." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error handling booking submission:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
