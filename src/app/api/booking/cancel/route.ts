import { NextRequest, NextResponse } from "next/server";
import { cancelSchema, detectSpam } from "@/lib/validation";
import { sendBookingCancellationEmails } from "@/lib/email/send";

/**
 * POST /api/booking/cancel
 *
 * Sends a cancellation confirmation to the client (BCC'd to the clinic)
 * and a dedicated cancellation-request notification to the clinic admin,
 * so any cancellation is always visible in the admin inbox even if the
 * client's own email fails to send.
 *
 * There is no live calendar/PMS behind this site yet — see
 * PROJECT_ROADMAP.md — so this does not automatically free up the slot in
 * a real booking system. It reliably notifies the clinic so the
 * cancellation can be actioned manually (e.g. in Consentz).
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = cancelSchema.safeParse(body);
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

  const { name, email, phone, treatment, category, date, time, reason } = parsed.data;

  try {
    const result = await sendBookingCancellationEmails({
      name,
      email,
      phone,
      treatment,
      category,
      date,
      time,
      reason,
      submittedAt: new Date().toISOString(),
    });

    if (!result.adminSent && !result.clientSent) {
      console.error("Cancellation email send failed entirely:", result.errors);
      return NextResponse.json(
        {
          success: false,
          message:
            "We couldn't process your cancellation right now. Please call or WhatsApp us directly.",
        },
        { status: 502 }
      );
    }

    if (!result.clientSent) {
      console.error("Cancellation client confirmation failed:", result.errors);
    }

    return NextResponse.json(
      { success: true, message: "Your appointment has been cancelled." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error handling cancellation:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
