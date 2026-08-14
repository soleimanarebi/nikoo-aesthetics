"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Simple password gate for /admin/blocked-dates. On success, the server
 * sets an HttpOnly session cookie (see /api/admin/login) and we refresh
 * the page so the server component re-checks the cookie and renders the
 * actual admin UI. The password is only ever sent over HTTPS to our own
 * API route — never stored, logged, or exposed to any other script.
 */
export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.message ?? "Incorrect password.");
        setSubmitting(false);
        return;
      }

      router.refresh();
    } catch {
      setError("We couldn't reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label htmlFor="admin-password" className="text-xs tracking-widest2 uppercase text-ink/50 font-body">
            Admin Password
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-ink/20 py-3 font-body text-ink focus:border-gold outline-none transition-colors mt-2"
          />
        </div>

        {error && (
          <p role="alert" className="text-red-700 font-body text-xs">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="self-start px-8 py-4 rounded-full bg-ink text-warm font-body text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Checking…" : "Log In"}
        </button>
      </form>
    </div>
  );
}
