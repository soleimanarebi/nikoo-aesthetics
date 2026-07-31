import { NextRequest, NextResponse } from "next/server";
import { rescheduleSchema, detectSpam } from "@/lib/validation";
import { sendBookingRescheduleEmails } from "@/lib/email/send";

/**
 * POST /api/booking/reschedule
 *
 * Sends a reschedule-request confirmation to the client (BCC'd to the
 * clinic) and a dedicated notification to the clinic admin with both the
 * original and requested new date/time, so the change can be confirmed
 * manually. See /api/booking/cancel/route.ts for the same caveat: there's
 * no live calendar/PMS behind this site yet, so this notifies rather than
 * automatically moves a real appointment.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = rescheduleSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid submission.";
    return NextResponse.json(
      { success: false, message: firstError, fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const spamReason = detectSpam(parsed.data);
  if (spamReason) {
    return NextResponse.json({ success: true, message: "Request received." }, { status: 200 });
  }

  const { name, email, phone, treatment, category, originalDate, originalTime, preferredDate, preferredTime, notes } =
    parsed.data;

  try {
    const result = await sendBookingRescheduleEmails({
      name,
      email,
      phone,
      treatment,
      category,
      originalDate,
      originalTime,
      preferredDate,
      preferredTime,
      notes,
      submittedAt: new Date().toISOString(),
    });

    if (!result.adminSent && !result.clientSent) {
      console.error("Reschedule email send failed entirely:", result.errors);
      return NextResponse.json(
        {
          success: false,
          message:
            "We couldn't process your reschedule request right now. Please call or WhatsApp us directly.",
        },
        { status: 502 }
      );
    }

    if (!result.clientSent) {
      console.error("Reschedule client confirmation failed:", result.errors);
    }

    return NextResponse.json(
      { success: true, message: "Your reschedule request has been received." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error handling reschedule request:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
