import { NextRequest, NextResponse } from "next/server";
import { contactSchema, detectSpam } from "@/lib/validation";
import { sendContactEmails } from "@/lib/email/send";

/**
 * POST /api/contact
 *
 * Validates a contact-form submission, sends the admin notification +
 * client confirmation emails via Resend, and returns a JSON result.
 * Server-side only — see /api/booking/route.ts for the fuller explanation
 * of the pattern shared by both routes.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid submission.";
    return NextResponse.json(
      { success: false, message: firstError, fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const spamReason = detectSpam(parsed.data);
  if (spamReason) {
    return NextResponse.json({ success: true, message: "Message received." }, { status: 200 });
  }

  const { name, email, phone, message } = parsed.data;

  try {
    const result = await sendContactEmails({
      name,
      email,
      phone,
      message,
      submittedAt: new Date().toISOString(),
    });

    if (!result.adminSent && !result.clientSent) {
      console.error("Contact email send failed entirely:", result.errors);
      return NextResponse.json(
        {
          success: false,
          message:
            "We couldn't send your message right now. Please call, WhatsApp or email us directly.",
        },
        { status: 502 }
      );
    }

    if (!result.clientSent) {
      console.error("Contact client confirmation failed:", result.errors);
    }

    return NextResponse.json(
      { success: true, message: "Your message has been received." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error handling contact submission:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
