import { Resend } from "resend";

/**
 * Central Resend client + low-level send wrapper. Every email type
 * (booking, contact, and future reminder/cancellation/approval emails)
 * should go through `sendEmail()` so retries, logging, and error handling
 * only need to live in one place.
 *
 * RESEND_API_KEY, ADMIN_EMAIL and FROM_EMAIL are read from environment
 * variables only — never hard-code them. This file is server-only; it is
 * never imported by any client component, so the API key is never bundled
 * into browser JavaScript.
 */

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it to .env.local (development) or your Netlify site's environment variables (production)."
    );
  }
  return new Resend(apiKey);
}

export function getFromEmail(): string {
  const from = process.env.FROM_EMAIL;
  if (!from) {
    throw new Error(
      "FROM_EMAIL is not set. Add it to .env.local (development) or your Netlify site's environment variables (production)."
    );
  }
  return from;
}

export function getAdminEmail(): string {
  const admin = process.env.ADMIN_EMAIL;
  if (!admin) {
    throw new Error(
      "ADMIN_EMAIL is not set. Add it to .env.local (development) or your Netlify site's environment variables (production)."
    );
  }
  return admin;
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  bcc?: string | string[];
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Sends a single email via Resend. Never throws — always returns a result
 * object, so callers (API routes) can decide how to respond to the client
 * without wrapping every call in try/catch.
 */
export async function sendEmail({ to, subject, html, replyTo, bcc }: SendEmailInput): Promise<SendEmailResult> {
  try {
    const resend = getResendClient();
    const from = getFromEmail();

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
      ...(bcc ? { bcc } : {}),
    });

    if (error) {
      console.error("Resend API error:", error);
      return { success: false, error: error.message ?? "Unknown Resend error" };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("Failed to send email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error sending email",
    };
  }
}
