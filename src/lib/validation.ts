import { z } from "zod";

/**
 * Server-side validation for both forms. Client-side validation (required
 * attributes, input types) exists purely for UX — this is the real gate,
 * since anyone can POST directly to the API routes bypassing the browser.
 *
 * Spam prevention (both forms):
 *  - `honeypot`: a hidden field real visitors never see or fill in. If a
 *    bot fills it in, we silently reject.
 *  - `formRenderedAt`: timestamp (ms) captured when the form first
 *    rendered, sent back on submit. Genuine humans take at least a couple
 *    of seconds to fill in a form; near-instant submissions are almost
 *    always scripted.
 */

const honeypotField = z.string().optional().or(z.literal(""));

const NAME_MAX = 100;
const MESSAGE_MAX = 2000;
const MIN_FILL_TIME_MS = 1500;

const phoneRegex = /^[0-9+()\-\s]{7,20}$/;

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(NAME_MAX),
  email: z.string().trim().email("Please enter a valid email address.").max(NAME_MAX),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20)
    .regex(phoneRegex, "Please enter a valid phone number."),
  treatment: z.string().trim().min(1, "Please select a treatment.").max(200),
  category: z.string().trim().min(1).max(200),
  date: z.string().trim().min(1, "Please select a date."),
  time: z.string().trim().min(1, "Please select a time."),
  message: z.string().trim().max(MESSAGE_MAX, "Message is too long.").optional().default(""),
  // Spam-prevention fields
  honeypot: honeypotField,
  formRenderedAt: z.number().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(NAME_MAX),
  email: z.string().trim().email("Please enter a valid email address.").max(NAME_MAX),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(phoneRegex, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(5, "Please enter a message.").max(MESSAGE_MAX),
  // Spam-prevention fields
  honeypot: honeypotField,
  formRenderedAt: z.number().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const cancelSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(NAME_MAX),
  email: z.string().trim().email("Please enter a valid email address.").max(NAME_MAX),
  phone: z.string().trim().max(20).optional().default(""),
  treatment: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(200),
  date: z.string().trim().min(1, "Missing appointment date."),
  time: z.string().trim().min(1, "Missing appointment time."),
  reason: z.string().trim().max(MESSAGE_MAX).optional().default(""),
  honeypot: honeypotField,
  formRenderedAt: z.number().optional(),
});

export type CancelInput = z.infer<typeof cancelSchema>;

export const rescheduleSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(NAME_MAX),
  email: z.string().trim().email("Please enter a valid email address.").max(NAME_MAX),
  phone: z.string().trim().max(20).optional().default(""),
  treatment: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(200),
  originalDate: z.string().trim().min(1, "Missing original appointment date."),
  originalTime: z.string().trim().min(1, "Missing original appointment time."),
  preferredDate: z.string().trim().min(1, "Please enter your preferred new date."),
  preferredTime: z.string().trim().min(1, "Please enter your preferred new time."),
  notes: z.string().trim().max(MESSAGE_MAX).optional().default(""),
  honeypot: honeypotField,
  formRenderedAt: z.number().optional(),
});

export type RescheduleInput = z.infer<typeof rescheduleSchema>;

/**
 * Returns a rejection reason if the submission looks like spam, or null if
 * it looks genuine. Kept separate from the zod schema since this is a
 * heuristic check (timing), not a strict field-shape validation.
 */
export function detectSpam(input: { honeypot?: string; formRenderedAt?: number }): string | null {
  if (input.honeypot && input.honeypot.length > 0) {
    return "Submission rejected.";
  }
  if (input.formRenderedAt) {
    const elapsed = Date.now() - input.formRenderedAt;
    if (elapsed >= 0 && elapsed < MIN_FILL_TIME_MS) {
      return "Submission rejected — please try again.";
    }
  }
  return null;
}
