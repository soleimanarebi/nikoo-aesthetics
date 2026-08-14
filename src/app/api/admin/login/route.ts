import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  verifyPassword,
  createSessionToken,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from "@/lib/admin-session";

const loginSchema = z.object({ password: z.string().min(1) });

/**
 * POST /api/admin/login
 *
 * Verifies the submitted password against ADMIN_SECRET (server-side only)
 * and, if correct, sets an HttpOnly session cookie. The password itself
 * and ADMIN_SECRET never reach client-side JavaScript — only the browser
 * automatically attaches the resulting cookie on subsequent requests.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Password required." }, { status: 400 });
  }

  let valid: boolean;
  try {
    valid = verifyPassword(parsed.data.password);
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { success: false, message: "Admin login is not configured. Set ADMIN_SECRET." },
      { status: 500 }
    );
  }

  if (!valid) {
    // Deliberately generic message — don't hint whether the password was close.
    return NextResponse.json({ success: false, message: "Incorrect password." }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
