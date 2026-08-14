import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySessionToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-session";
import { getBlockedDates, addBlockedDate, removeBlockedDate, isValidDateString } from "@/lib/blocked-dates";

const dateSchema = z.object({ date: z.string().refine(isValidDateString, "Invalid date format.") });

function requireAdmin(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/**
 * GET /api/blocked-dates
 *
 * Public — the booking calendar needs this to grey out blocked dates for
 * every visitor. Returns only a list of date strings; no admin
 * information is exposed here.
 */
export async function GET() {
  try {
    const dates = await getBlockedDates();
    return NextResponse.json({ success: true, dates });
  } catch (err) {
    console.error("Failed to load blocked dates:", err);
    // Fail open on the read side with an empty list rather than breaking
    // the booking calendar entirely if the store is briefly unavailable —
    // the server-side check in /api/booking is the real enforcement point.
    return NextResponse.json({ success: true, dates: [] });
  }
}

/**
 * POST /api/blocked-dates  { date: "YYYY-MM-DD" }
 *
 * Admin-only — blocks a date. Requires a valid admin session cookie (see
 * /api/admin/login). Never reachable without it.
 */
export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const parsed = dateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Invalid date." }, { status: 400 });
  }

  try {
    const dates = await addBlockedDate(parsed.data.date);
    return NextResponse.json({ success: true, dates });
  } catch (err) {
    console.error("Failed to add blocked date:", err);
    return NextResponse.json({ success: false, message: "Failed to block date." }, { status: 500 });
  }
}

/**
 * DELETE /api/blocked-dates  { date: "YYYY-MM-DD" }
 *
 * Admin-only — unblocks a date. Same auth requirement as POST above.
 */
export async function DELETE(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const parsed = dateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Invalid date." }, { status: 400 });
  }

  try {
    const dates = await removeBlockedDate(parsed.data.date);
    return NextResponse.json({ success: true, dates });
  } catch (err) {
    console.error("Failed to remove blocked date:", err);
    return NextResponse.json({ success: false, message: "Failed to unblock date." }, { status: 500 });
  }
}
