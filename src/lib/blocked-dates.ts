import { getStore } from "@netlify/blobs";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

/**
 * Server-only storage for temporary "blocked dates" — an exception layer
 * on top of the normal weekly opening hours in src/data/site.json. This
 * does NOT change opening hours; it just maintains a small list of
 * specific dates (YYYY-MM-DD) that are closed regardless of what the
 * weekly schedule says.
 *
 * Backed by Netlify Blobs — a key-value store included with every Netlify
 * site, with no separate account/service and no manual credentials to
 * configure. `getStore()` auto-authenticates using the deployment context
 * that Netlify injects into every Function at runtime.
 *
 * Local development fallback: when running via plain `next dev`/`next
 * start` (i.e. NOT through the Netlify CLI), there is no Netlify
 * deployment context, so `getStore()` throws. In that case we fall back to
 * a small JSON file in the OS temp directory. This is a FILE, not an
 * in-memory variable, because Next.js's dev server compiles each API route
 * as a separate module instance — a plain in-memory variable would not
 * actually be shared between e.g. /api/blocked-dates and /api/booking
 * locally, even though they'd both correctly share real Netlify Blobs in
 * production. This fallback file is never created and never used on
 * Netlify itself.
 */

const STORE_NAME = "nikoo-availability";
const BLOCKED_DATES_KEY = "blocked-dates";
const LOCAL_FALLBACK_FILE = join(tmpdir(), "nikoo-blocked-dates.dev.json");

function isMissingBlobsContext(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return (
    message.includes("MissingBlobsEnvironmentError") ||
    message.includes("environment has not been configured") ||
    message.includes("The blob store connection")
  );
}

function readLocalFallback(): string[] {
  try {
    if (!existsSync(LOCAL_FALLBACK_FILE)) return [];
    const raw = readFileSync(LOCAL_FALLBACK_FILE, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeLocalFallback(dates: string[]): void {
  writeFileSync(LOCAL_FALLBACK_FILE, JSON.stringify(dates), "utf-8");
}

async function readRaw(): Promise<string[]> {
  try {
    const store = getStore(STORE_NAME);
    const data = await store.get(BLOCKED_DATES_KEY, { type: "json" });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (isMissingBlobsContext(err)) {
      return readLocalFallback();
    }
    throw err;
  }
}

async function writeRaw(dates: string[]): Promise<void> {
  const sorted = [...new Set(dates)].sort();
  try {
    const store = getStore(STORE_NAME);
    await store.setJSON(BLOCKED_DATES_KEY, sorted);
  } catch (err) {
    if (isMissingBlobsContext(err)) {
      writeLocalFallback(sorted);
      return;
    }
    throw err;
  }
}

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateString(date: string): boolean {
  return DATE_FORMAT.test(date);
}

/** Returns every currently-blocked date, sorted ascending (YYYY-MM-DD strings). */
export async function getBlockedDates(): Promise<string[]> {
  return readRaw();
}

/** Adds a date to the blocked list (no-op if already blocked). Returns the updated list. */
export async function addBlockedDate(date: string): Promise<string[]> {
  if (!isValidDateString(date)) {
    throw new Error("Invalid date format — expected YYYY-MM-DD.");
  }
  const current = await readRaw();
  if (!current.includes(date)) {
    await writeRaw([...current, date]);
  }
  return readRaw();
}

/** Removes a date from the blocked list (no-op if not blocked). Returns the updated list. */
export async function removeBlockedDate(date: string): Promise<string[]> {
  const current = await readRaw();
  await writeRaw(current.filter((d) => d !== date));
  return readRaw();
}

/** Convenience check used by /api/booking to reject a blocked date server-side. */
export async function isDateBlocked(date: string): Promise<boolean> {
  const dates = await getBlockedDates();
  return dates.includes(date);
}
