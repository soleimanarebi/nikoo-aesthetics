import { createHmac, timingSafeEqual } from "crypto";

/**
 * Minimal server-side admin session mechanism for the blocked-dates admin
 * page. No database or session store required — the session "token" is a
 * small signed, expiring payload (similar in spirit to a JWT, but a lot
 * smaller) verified with HMAC-SHA256 using ADMIN_SECRET as the signing
 * key. Node's built-in `crypto` module is used, so no extra dependency.
 *
 * Why not just store the raw password in the cookie? Because the cookie
 * is HttpOnly, it's never readable by JavaScript, but this way a leaked
 * cookie (e.g. an accidental log entry) still isn't your actual admin
 * password — it's a token that expires and is worthless without the
 * server-side secret used to verify it.
 *
 * IMPORTANT: ADMIN_SECRET is only ever read here, on the server. It is
 * never sent to or embedded in any client-side JavaScript.
 */

const SESSION_COOKIE_NAME = "nikoo_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SECRET is not set. Add it to .env.local (development) or your Netlify site's environment variables (production)."
    );
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getAdminSecret()).update(payload).digest("base64url");
}

export function verifyPassword(candidate: string): boolean {
  const secret = getAdminSecret();
  const a = Buffer.from(candidate);
  const b = Buffer.from(secret);
  // Constant-time comparison, and both buffers must be equal length for
  // timingSafeEqual — pad-compare via a length check first.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Creates a signed session token encoding an expiry timestamp. */
export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = String(expiresAt);
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

/** Verifies a session token's signature and expiry. */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE_NAME;
export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;
