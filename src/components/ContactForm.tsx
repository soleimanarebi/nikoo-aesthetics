"use client";

import { useRef, useState } from "react";

const inputClasses =
  "w-full bg-transparent border-b border-ink/20 py-3 font-body text-ink placeholder:text-ink/45 focus:border-gold outline-none transition-colors";

type Status = "idle" | "submitting" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formRenderedAt = useRef(Date.now());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      message: String(data.get("message") ?? ""),
      // Spam-prevention fields — see src/lib/validation.ts
      honeypot: String(data.get("company") ?? ""),
      formRenderedAt: formRenderedAt.current,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        setStatus("error");
        setErrorMessage(
          result.message ?? "Something went wrong. Please try again or contact us directly."
        );
        return;
      }

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage(
        "We couldn't reach the server. Please check your connection and try again, or contact us directly."
      );
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-xl2 border border-gold/40 bg-gold/10 p-8 text-center"
      >
        <p className="font-display text-xl text-ink mb-2">Thank you</p>
        <p className="text-ink/65 font-body text-sm">
          Your message has been received. We&apos;ll be in touch shortly, and a confirmation
          email is on its way to you now.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      name="contact"
      className="flex flex-col gap-8"
      aria-label="Contact form"
    >
      {/* Honeypot field — hidden from real visitors via CSS, left blank by
          humans, often auto-filled by bots. Server rejects any submission
          where this isn't empty. */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <label htmlFor="name" className="text-xs tracking-widest2 uppercase text-ink/65 font-body">
            Full Name
          </label>
          <input id="name" name="name" type="text" required className={`${inputClasses} mt-2`} />
        </div>
        <div>
          <label htmlFor="email" className="text-xs tracking-widest2 uppercase text-ink/65 font-body">
            Email
          </label>
          <input id="email" name="email" type="email" required className={`${inputClasses} mt-2`} />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="text-xs tracking-widest2 uppercase text-ink/65 font-body">
          Phone
        </label>
        <input id="phone" name="phone" type="tel" className={`${inputClasses} mt-2`} />
      </div>

      <div>
        <label htmlFor="message" className="text-xs tracking-widest2 uppercase text-ink/65 font-body">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className={`${inputClasses} mt-2 resize-none`}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm font-body text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start px-8 py-4 rounded-full bg-ink text-warm font-body text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
