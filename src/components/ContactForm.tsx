"use client";

import { useState } from "react";

const inputClasses =
  "w-full bg-transparent border-b border-ink/20 py-3 font-body text-ink placeholder:text-ink/45 focus:border-gold outline-none transition-colors";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // This form is presentational. Connect it to your preferred form
    // handler (e.g. Netlify Forms, Formspree) — see the README.
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-xl2 border border-gold/40 bg-gold/10 p-8 text-center"
      >
        <p className="font-display text-xl text-ink mb-2">Thank you</p>
        <p className="text-ink/65 font-body text-sm">
          Your message has been received. We&apos;ll be in touch shortly.
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

      <button
        type="submit"
        className="self-start px-8 py-4 rounded-full bg-ink text-warm font-body text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors duration-300"
      >
        Send Message
      </button>
    </form>
  );
}
