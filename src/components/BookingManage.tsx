"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface DecodedBooking {
  name: string;
  email: string;
  phone: string;
  treatment: string;
  category: string;
  date: string;
  time: string;
}

/** Browser-safe base64url decode — mirrors src/lib/email/booking-token.ts (server-only, uses Buffer). */
function decodeBookingToken(token: string): DecodedBooking | null {
  try {
    const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = decodeURIComponent(escape(atob(padded)));
    const data = JSON.parse(json);
    if (
      typeof data.name === "string" &&
      typeof data.email === "string" &&
      typeof data.phone === "string" &&
      typeof data.treatment === "string" &&
      typeof data.category === "string" &&
      typeof data.date === "string" &&
      typeof data.time === "string"
    ) {
      return data as DecodedBooking;
    }
    return null;
  } catch {
    return null;
  }
}

type Mode = "view" | "cancel" | "reschedule";
type Status = "idle" | "submitting" | "done" | "error";

export default function BookingManage() {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<DecodedBooking | null | undefined>(undefined);
  const [mode, setMode] = useState<Mode>("view");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [reason, setReason] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
  const formRenderedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = searchParams.get("b");
    setBooking(token ? decodeBookingToken(token) : null);
  }, [searchParams]);

  async function handleCancel(e: React.FormEvent) {
    e.preventDefault();
    if (!booking) return;
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/booking/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          reason,
          honeypot: honeypotRef.current?.value ?? "",
          formRenderedAt: formRenderedAt.current,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setStatus("error");
        setErrorMessage(result.message ?? "Something went wrong. Please try again or contact us directly.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMessage("We couldn't reach the server. Please call or WhatsApp us directly.");
    }
  }

  async function handleReschedule(e: React.FormEvent) {
    e.preventDefault();
    if (!booking) return;
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/booking/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          originalDate: booking.date,
          originalTime: booking.time,
          preferredDate,
          preferredTime,
          notes,
          honeypot: honeypotRef.current?.value ?? "",
          formRenderedAt: formRenderedAt.current,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setStatus("error");
        setErrorMessage(result.message ?? "Something went wrong. Please try again or contact us directly.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMessage("We couldn't reach the server. Please call or WhatsApp us directly.");
    }
  }

  // Loading (client-side decode hasn't run yet)
  if (booking === undefined) {
    return <p className="text-ink/50 font-body text-sm">Loading your booking…</p>;
  }

  // No/invalid token — nothing to manage
  if (booking === null) {
    return (
      <div className="rounded-xl2 border border-ink/15 p-8 max-w-xl">
        <h2 className="font-display text-xl text-ink mb-3">Booking link not found</h2>
        <p className="text-ink/65 font-body text-sm leading-relaxed mb-6">
          This link doesn&apos;t contain a valid booking reference. If you followed a link from
          your confirmation email, please try again, or contact us directly and we&apos;ll help
          with your appointment.
        </p>
        <Link
          href="/contact"
          className="text-sm font-body text-ink underline decoration-gold decoration-1 underline-offset-4 hover:text-gold-dark transition-colors"
        >
          Contact Us →
        </Link>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="rounded-xl2 border border-ink/15 p-8 max-w-xl">
        <h2 className="font-display text-xl text-ink mb-3">
          {mode === "cancel" ? "Appointment cancelled" : "Reschedule request sent"}
        </h2>
        <p className="text-ink/65 font-body text-sm leading-relaxed">
          {mode === "cancel"
            ? "Your appointment has been cancelled and the clinic has been notified. A confirmation email is on its way to you."
            : "Your reschedule request has been sent to the clinic. We'll confirm your new date and time by phone or email shortly."}
        </p>
      </div>
    );
  }

  const honeypotField = (
    <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
      <label htmlFor="manage-company">Company</label>
      <input id="manage-company" ref={honeypotRef} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );

  return (
    <div className="max-w-xl">
      <div className="rounded-xl2 bg-warm border border-ink/10 p-6 mb-8">
        <h2 className="font-display text-base text-ink mb-3">Your appointment</h2>
        <dl className="text-sm font-body text-ink/70 space-y-1.5">
          <div className="flex justify-between">
            <dt>Treatment</dt>
            <dd className="text-ink">
              {booking.category} — {booking.treatment}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Date</dt>
            <dd className="text-ink">{booking.date}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Time</dt>
            <dd className="text-ink">{booking.time}</dd>
          </div>
        </dl>
      </div>

      {mode === "view" && (
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => setMode("reschedule")}
            className="flex-1 px-6 py-4 rounded-full border border-ink/20 text-ink font-body text-sm tracking-wide hover:border-ink transition-colors duration-300"
          >
            Request Reschedule
          </button>
          <button
            type="button"
            onClick={() => setMode("cancel")}
            className="flex-1 px-6 py-4 rounded-full bg-ink text-warm font-body text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors duration-300"
          >
            Cancel Appointment
          </button>
        </div>
      )}

      {mode === "cancel" && (
        <form onSubmit={handleCancel} className="flex flex-col gap-6">
          <h3 className="font-display text-lg text-ink">Cancel this appointment</h3>
          <div>
            <label htmlFor="cancel-reason" className="text-xs tracking-widest2 uppercase text-ink/50 font-body">
              Reason (optional)
            </label>
            <textarea
              id="cancel-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-transparent border-b border-ink/20 py-3 font-body text-ink focus:border-gold outline-none transition-colors mt-2 resize-none"
            />
          </div>
          {honeypotField}
          {status === "error" && (
            <p role="alert" className="text-red-700 font-body text-xs">
              {errorMessage}
            </p>
          )}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setMode("view")}
              className="px-8 py-4 rounded-full border border-ink/20 text-ink font-body text-sm tracking-wide hover:border-ink transition-colors duration-300"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="px-8 py-4 rounded-full bg-ink text-warm font-body text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Cancelling…" : "Confirm Cancellation"}
            </button>
          </div>
        </form>
      )}

      {mode === "reschedule" && (
        <form onSubmit={handleReschedule} className="flex flex-col gap-6">
          <h3 className="font-display text-lg text-ink">Request a new date &amp; time</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="reschedule-date" className="text-xs tracking-widest2 uppercase text-ink/50 font-body">
                Preferred Date *
              </label>
              <input
                id="reschedule-date"
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-transparent border-b border-ink/20 py-3 font-body text-ink focus:border-gold outline-none transition-colors mt-2"
              />
            </div>
            <div>
              <label htmlFor="reschedule-time" className="text-xs tracking-widest2 uppercase text-ink/50 font-body">
                Preferred Time *
              </label>
              <input
                id="reschedule-time"
                type="time"
                required
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-transparent border-b border-ink/20 py-3 font-body text-ink focus:border-gold outline-none transition-colors mt-2"
              />
            </div>
          </div>
          <div>
            <label htmlFor="reschedule-notes" className="text-xs tracking-widest2 uppercase text-ink/50 font-body">
              Notes (optional)
            </label>
            <textarea
              id="reschedule-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-transparent border-b border-ink/20 py-3 font-body text-ink focus:border-gold outline-none transition-colors mt-2 resize-none"
            />
          </div>
          {honeypotField}
          {status === "error" && (
            <p role="alert" className="text-red-700 font-body text-xs">
              {errorMessage}
            </p>
          )}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setMode("view")}
              className="px-8 py-4 rounded-full border border-ink/20 text-ink font-body text-sm tracking-wide hover:border-ink transition-colors duration-300"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="px-8 py-4 rounded-full bg-ink text-warm font-body text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Sending…" : "Send Request"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
