"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDateLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${d} ${MONTH_LABELS[m - 1]} ${y}`;
}

function todayDateInputValue(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Admin UI for /admin/blocked-dates. Only ever rendered after the server
 * component has already confirmed a valid admin session cookie — this
 * component itself carries no secret and doesn't need to check auth
 * again, though every read/write it makes still goes through the
 * authenticated API routes regardless.
 */
export default function BlockedDatesManager() {
  const router = useRouter();
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayDateInputValue());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadDates() {
    setLoading(true);
    try {
      const res = await fetch("/api/blocked-dates");
      const result = await res.json();
      setDates(Array.isArray(result?.dates) ? result.dates : []);
    } catch {
      setError("Couldn't load blocked dates. Try refreshing the page.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDates();
  }, []);

  async function handleBlock(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.message ?? "Failed to block date.");
        return;
      }
      setDates(result.dates);
      setMessage(`${formatDateLabel(selectedDate)} is now blocked.`);
    } catch {
      setError("We couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUnblock(date: string) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/blocked-dates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.message ?? "Failed to unblock date.");
        return;
      }
      setDates(result.dates);
      setMessage(`${formatDateLabel(date)} is available again.`);
    } catch {
      setError("We couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-10">
        <p className="text-ink/50 font-body text-sm">
          Blocking a date only closes that specific day — your normal weekly opening hours are
          never changed.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-body text-ink/60 hover:text-ink underline decoration-gold decoration-1 underline-offset-4 transition-colors whitespace-nowrap ml-6"
        >
          Log Out
        </button>
      </div>

      <form onSubmit={handleBlock} className="flex flex-wrap items-end gap-4 mb-12">
        <div>
          <label htmlFor="block-date" className="text-xs tracking-widest2 uppercase text-ink/50 font-body">
            Date to Block
          </label>
          <input
            id="block-date"
            type="date"
            required
            min={todayDateInputValue()}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="block bg-transparent border-b border-ink/20 py-3 font-body text-ink focus:border-gold outline-none transition-colors mt-2"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="px-8 py-3 rounded-full bg-ink text-warm font-body text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "Working…" : "Block Date"}
        </button>
      </form>

      {message && (
        <p role="status" className="text-ink/70 font-body text-sm mb-6 -mt-6">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="text-red-700 font-body text-sm mb-6 -mt-6">
          {error}
        </p>
      )}

      <h2 className="font-display text-xl text-ink mb-4">Currently Blocked Dates</h2>

      {loading ? (
        <p className="text-ink/40 font-body text-sm">Loading…</p>
      ) : dates.length === 0 ? (
        <p className="text-ink/40 font-body text-sm">No dates are currently blocked.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-ink/10 border-t border-b border-ink/10">
          {dates.map((date) => (
            <li key={date} className="flex items-center justify-between gap-4 py-3">
              <span className="font-body text-sm text-ink">
                <span className="line-through decoration-2 decoration-red-700/60">
                  {formatDateLabel(date)}
                </span>
                <span className="ml-3 text-xs tracking-widest2 uppercase text-red-700/70">Blocked</span>
              </span>
              <button
                type="button"
                onClick={() => handleUnblock(date)}
                disabled={busy}
                className="px-4 py-1.5 rounded-full text-xs font-body border border-ink/20 text-ink hover:bg-ink hover:text-warm hover:border-ink transition-colors whitespace-nowrap disabled:opacity-50"
              >
                Unblock
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
