"use client";

import { useEffect, useMemo, useState } from "react";
import treatmentFamilies from "@/data/treatment-families.json";
import type { SiteSettings, BookingServiceCategory, BookingServiceItem, TreatmentFamily } from "@/lib/types";

interface BookingCalendarProps {
  hours: SiteSettings["hours"];
  services: BookingServiceCategory[];
  initialTreatment?: string;
  initialCategoryId?: string;
  initialItemName?: string;
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAME_BY_JS_INDEX = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

const STORAGE_KEY = "nikoo-bookings";
const SLOT_MINUTES = 15;
// No appointments 13:00–14:00 (lunch / rest break).
const LUNCH_BREAK = { start: 13 * 60, end: 14 * 60 };

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseTimeRange(time: string): { start: number; end: number } | null {
  if (!time || /closed/i.test(time)) return null;
  const match = time.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return { start: parseInt(match[1], 10) * 60 + parseInt(match[2], 10), end: parseInt(match[3], 10) * 60 + parseInt(match[4], 10) };
}

function minutesToLabel(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

function formatPrice(price: number | null): string {
  return price === null ? "POA" : price === 0 ? "Free" : `£${price.toFixed(2)}`;
}

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const labels = ["Select Service", "Date & Time", "Your Details"];
  return (
    <div className="flex items-center gap-3 mb-10" aria-label={`Step ${step} of 3`}>
      {labels.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-body shrink-0 ${
                  active ? "bg-ink text-warm" : done ? "bg-ink/20 text-ink" : "border border-ink/20 text-ink/40"
                }`}
              >
                {n}
              </span>
              <span className={`text-xs font-body tracking-wide hidden sm:inline ${active ? "text-ink" : "text-ink/40"}`}>
                {label}
              </span>
            </div>
            {n < 3 && <span className="h-px w-6 sm:w-10 bg-ink/15" aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );
}

export default function BookingCalendar({
  hours,
  services,
  initialTreatment,
  initialCategoryId,
  initialItemName,
}: BookingCalendarProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const preselected = useMemo(() => {
    // Precise deep-link from a treatment family page: exact category + item.
    if (initialCategoryId) {
      const cat = services.find((c) => c.id === initialCategoryId);
      if (cat) {
        const matchedItem =
          cat.items.find((i) => i.name === initialItemName) ?? cat.items[0];
        return { category: cat, item: matchedItem };
      }
    }
    // Fallback: fuzzy match by treatment/category name (e.g. from a legacy treatment page).
    if (initialTreatment) {
      const needle = initialTreatment.toLowerCase();
      for (const cat of services) {
        if (cat.category.toLowerCase().includes(needle) || needle.includes(cat.category.toLowerCase())) {
          return { category: cat, item: cat.items[0] };
        }
      }
    }
    return null;
  }, [initialCategoryId, initialItemName, initialTreatment, services]);

  const [step, setStep] = useState<1 | 2 | 3>(preselected ? 2 : 1);
  const [category, setCategory] = useState<BookingServiceCategory | null>(preselected?.category ?? null);
  const [item, setItem] = useState<BookingServiceItem | null>(preselected?.item ?? null);

  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Record<string, string[]>>({});
  const [form, setForm] = useState({ name: "", surname: "", email: "", phone: "", notes: "", agreed: false });
  const [confirmed, setConfirmed] = useState<{ date: string; time: string } | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setBookings(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
  }, []);

  const hoursByWeekday = useMemo(() => {
    const map = new Map<string, { start: number; end: number } | null>();
    for (const h of hours) map.set(h.day, parseTimeRange(h.time));
    return map;
  }, [hours]);

  function getSlotsForDate(date: Date): string[] {
    const range = hoursByWeekday.get(DAY_NAME_BY_JS_INDEX[date.getDay()]);
    if (!range) return [];
    const slots: string[] = [];
    for (let m = range.start; m < range.end; m += SLOT_MINUTES) {
      if (m >= LUNCH_BREAK.start && m < LUNCH_BREAK.end) continue;
      slots.push(minutesToLabel(m));
    }
    return slots;
  }

  function isDateOpen(date: Date): boolean {
    return getSlotsForDate(date).length > 0;
  }

  function isDatePast(date: Date): boolean {
    return date.getTime() < today.getTime();
  }

  function isDateFullyBooked(date: Date): boolean {
    const slots = getSlotsForDate(date);
    if (slots.length === 0) return false;
    const booked = bookings[toDateKey(date)] ?? [];
    return slots.every((s) => booked.includes(s));
  }

  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const firstWeekday = (new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay() + 6) % 7;

  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1)),
  ];

  const canGoPrev = viewMonth.getFullYear() > today.getFullYear() ||
    (viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() > today.getMonth());

  const selectedSlots = selectedDate ? getSlotsForDate(selectedDate) : [];
  const selectedBooked = selectedDate ? bookings[toDateKey(selectedDate)] ?? [] : [];

  // Group Step 1's services by treatment family, in family order, so the
  // list matches the 6 families shown on /treatments — with any category
  // that doesn't belong to one of the 6 families collected at the end.
  const familyGroups = useMemo(() => {
    const families = treatmentFamilies as TreatmentFamily[];
    const groups = families.map((family) => ({
      name: family.name,
      categories: services.filter((c) => c.family === family.slug),
    }));
    const leftover = services.filter((c) => !c.family);
    if (leftover.length) groups.push({ name: "Other Treatments", categories: leftover });
    return groups.filter((g) => g.categories.length > 0);
  }, [services]);

  function handleSelectDate(date: Date) {
    if (isDatePast(date) || !isDateOpen(date) || isDateFullyBooked(date)) return;
    setSelectedDate(date);
    setSelectedTime(null);
  }

  function selectItem(cat: BookingServiceCategory, it: BookingServiceItem) {
    setCategory(cat);
    setItem(it);
    setStep(2);
  }

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!selectedDate || !selectedTime || !form.name || !form.email || !form.agreed) return;

    const key = toDateKey(selectedDate);
    const updated = { ...bookings, [key]: [...(bookings[key] ?? []), selectedTime] };
    setBookings(updated);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage may be unavailable — booking still confirms for this session
    }
    setConfirmed({ date: key, time: selectedTime });
  }

  function startOver() {
    setStep(1);
    setCategory(null);
    setItem(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setConfirmed(null);
    setSubmitAttempted(false);
    setForm({ name: "", surname: "", email: "", phone: "", notes: "", agreed: false });
  }

  if (confirmed) {
    return (
      <div className="rounded-xl2 border border-ink/15 p-8 max-w-xl">
        <h2 className="font-display text-2xl text-ink mb-3">Appointment requested</h2>
        <p className="text-ink/70 font-body text-sm leading-relaxed mb-4">
          We&apos;ve pencilled in{" "}
          {item && (
            <>
              <strong>{item.name}</strong> on{" "}
            </>
          )}
          <strong>{confirmed.date}</strong> at <strong>{confirmed.time}</strong>.
        </p>
        <p className="text-ink/70 font-body text-sm leading-relaxed mb-6">
          A confirmation email is on its way to <strong>{form.email}</strong> with your
          appointment details, along with links to cancel or reschedule if your plans change.
        </p>
        <button
          type="button"
          onClick={startOver}
          className="text-sm font-body text-ink underline decoration-gold decoration-1 underline-offset-4 hover:text-gold-dark transition-colors"
        >
          Book another appointment →
        </button>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator step={step} />

      {/* ---- Step 1: Select Service ---- */}
      {step === 1 && (
        <div className="flex flex-col gap-16">
          {familyGroups.map((group) => (
            <div key={group.name}>
              <h2 className="font-display font-bold text-2xl text-ink mb-8 border-b border-ink/10 pb-3">
                {group.name}
              </h2>
              <div className="flex flex-col gap-10">
                {group.categories.map((cat) => (
                  <div key={cat.id}>
                    <h3 className="font-display text-lg text-ink mb-1">{cat.category}</h3>
                    {cat.note && <p className="text-ink/45 font-body text-xs mb-3">{cat.note}</p>}
                    <div className="flex flex-col divide-y divide-ink/10 border-t border-b border-ink/10">
                      {cat.items.map((it) => (
                        <div key={it.name} className="flex items-center justify-between gap-4 py-3">
                          <span className="font-body text-sm text-ink">{it.name}</span>
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="font-body text-sm text-gold-dark w-20 text-right">{formatPrice(it.price)}</span>
                            <button
                              type="button"
                              onClick={() => selectItem(cat, it)}
                              className="px-4 py-1.5 rounded-full text-xs font-body border border-ink/20 text-ink hover:bg-ink hover:text-warm hover:border-ink transition-colors whitespace-nowrap"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- Step 2: Date & Time ---- */}
      {step === 2 && (
        <div>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-sm font-body text-ink/60 hover:text-ink mb-6 flex items-center gap-1"
          >
            ← Back
          </button>

          {item && (
            <div className="rounded-xl2 bg-warm border border-ink/10 px-5 py-4 mb-8 max-w-xl">
              {category && (
                <span className="text-ink/45 font-body text-xs block mb-1">{category.category}</span>
              )}
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-ink">{item.name}</span>
                <span className="font-body text-sm text-gold-dark">{formatPrice(item.price)}</span>
              </div>
            </div>
          )}

          <div className="max-w-xl">
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                disabled={!canGoPrev}
                aria-label="Previous month"
                className="h-9 w-9 flex items-center justify-center rounded-full border border-ink/20 text-ink disabled:opacity-30 disabled:cursor-not-allowed hover:border-ink transition-colors"
              >
                ←
              </button>
              <h3 className="font-display text-lg text-ink">
                {MONTH_LABELS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </h3>
              <button
                type="button"
                onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                aria-label="Next month"
                className="h-9 w-9 flex items-center justify-center rounded-full border border-ink/20 text-ink hover:border-ink transition-colors"
              >
                →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs tracking-wide text-ink/45 font-body mb-2">
              {WEEKDAY_LABELS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((date, i) => {
                if (!date) return <span key={`blank-${i}`} />;

                const past = isDatePast(date);
                const open = isDateOpen(date);
                const fullyBooked = isDateFullyBooked(date);
                const isToday = isSameDay(date, today);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const disabled = past || !open || fullyBooked;

                return (
                  <button
                    key={toDateKey(date)}
                    type="button"
                    onClick={() => handleSelectDate(date)}
                    disabled={disabled}
                    aria-pressed={!!isSelected}
                    aria-label={
                      past
                        ? `${date.getDate()} ${MONTH_LABELS[date.getMonth()]} — past date`
                        : fullyBooked
                        ? `${date.getDate()} ${MONTH_LABELS[date.getMonth()]} — fully booked`
                        : !open
                        ? `${date.getDate()} ${MONTH_LABELS[date.getMonth()]} — closed`
                        : `${date.getDate()} ${MONTH_LABELS[date.getMonth()]} — available`
                    }
                    className={`aspect-square rounded-full text-sm font-body transition-colors relative ${
                      isSelected
                        ? "bg-ink text-warm"
                        : disabled
                        ? "text-ink/25 cursor-not-allowed"
                        : "text-ink hover:bg-ink/5 border border-ink/15"
                    } ${isToday && !isSelected ? "ring-1 ring-gold-dark" : ""}`}
                  >
                    <span className={fullyBooked ? "line-through decoration-2" : ""}>{date.getDate()}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-xs font-body text-ink/50">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border border-ink/15" /> Available
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full ring-1 ring-gold-dark" /> Today
              </span>
              <span className="flex items-center gap-2">
                <span className="line-through decoration-2">12</span> Fully booked
              </span>
            </div>

            {selectedDate && (
              <div className="mt-8">
                <h3 className="font-display text-base text-ink mb-3">
                  Available times — {selectedDate.getDate()} {MONTH_LABELS[selectedDate.getMonth()]}
                </h3>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                  {selectedSlots.map((slot) => {
                    const taken = selectedBooked.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={taken}
                        onClick={() => setSelectedTime(slot)}
                        aria-pressed={selectedTime === slot}
                        className={`px-3 py-1.5 rounded-full text-xs font-body border transition-colors ${
                          taken
                            ? "border-ink/10 text-ink/25 line-through cursor-not-allowed"
                            : selectedTime === slot
                            ? "bg-ink text-warm border-ink"
                            : "border-ink/20 text-ink hover:border-ink"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                  {selectedSlots.length === 0 && (
                    <p className="text-ink/50 font-body text-sm">No slots available on this date.</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-10">
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="px-8 py-4 rounded-full bg-ink text-warm font-body text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Step 3: Your Details ---- */}
      {step === 3 && (
        <div className="max-w-xl">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="text-sm font-body text-ink/60 hover:text-ink mb-6 flex items-center gap-1"
          >
            ← Back
          </button>

          <div className="rounded-xl2 bg-warm border border-ink/10 p-6 mb-8">
            <h3 className="font-display text-base text-ink mb-3">Booking overview</h3>
            <dl className="text-sm font-body text-ink/70 space-y-1.5">
              {category && (
                <div className="flex justify-between">
                  <dt>Treatment</dt>
                  <dd className="text-ink">{category.category}</dd>
                </div>
              )}
              {item && (
                <div className="flex justify-between">
                  <dt>Service</dt>
                  <dd className="text-ink">{item.name}</dd>
                </div>
              )}
              {item && (
                <div className="flex justify-between">
                  <dt>Price</dt>
                  <dd className="text-gold-dark">{formatPrice(item.price)}</dd>
                </div>
              )}
              {selectedDate && (
                <div className="flex justify-between">
                  <dt>Date</dt>
                  <dd className="text-ink">
                    {selectedDate.getDate()} {MONTH_LABELS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                  </dd>
                </div>
              )}
              {selectedTime && (
                <div className="flex justify-between">
                  <dt>Time</dt>
                  <dd className="text-ink">{selectedTime}</dd>
                </div>
              )}
            </dl>
          </div>

          <form onSubmit={handleConfirm} className="flex flex-col gap-6">
            <h2 className="font-display text-xl text-ink">Personal information</h2>
            <p className="text-ink/45 font-body text-xs -mt-4">Fields marked * are required</p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="booking-name" className="text-xs tracking-widest2 uppercase text-ink/50 font-body">
                  First Name *
                </label>
                <input
                  id="booking-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-transparent border-b border-ink/20 py-3 font-body text-ink focus:border-gold outline-none transition-colors mt-2"
                />
              </div>
              <div>
                <label htmlFor="booking-surname" className="text-xs tracking-widest2 uppercase text-ink/50 font-body">
                  Surname
                </label>
                <input
                  id="booking-surname"
                  value={form.surname}
                  onChange={(e) => setForm((f) => ({ ...f, surname: e.target.value }))}
                  className="w-full bg-transparent border-b border-ink/20 py-3 font-body text-ink focus:border-gold outline-none transition-colors mt-2"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="booking-email" className="text-xs tracking-widest2 uppercase text-ink/50 font-body">
                  Email *
                </label>
                <input
                  id="booking-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full bg-transparent border-b border-ink/20 py-3 font-body text-ink focus:border-gold outline-none transition-colors mt-2"
                />
              </div>
              <div>
                <label htmlFor="booking-phone" className="text-xs tracking-widest2 uppercase text-ink/50 font-body">
                  Phone
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-transparent border-b border-ink/20 py-3 font-body text-ink focus:border-gold outline-none transition-colors mt-2"
                />
              </div>
            </div>

            <div>
              <label htmlFor="booking-notes" className="text-xs tracking-widest2 uppercase text-ink/50 font-body">
                Description
              </label>
              <textarea
                id="booking-notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full bg-transparent border-b border-ink/20 py-3 font-body text-ink focus:border-gold outline-none transition-colors mt-2 resize-none"
              />
            </div>

            <div className="rounded-xl2 border border-ink/15 p-5 max-h-40 overflow-y-auto text-ink/60 font-body text-xs leading-relaxed">
              <p className="text-ink font-body text-xs mb-2 font-medium">Booking Terms &amp; Conditions</p>
              By proceeding with this booking you confirm that you understand and agree to the
              following: all clients must be over 18; appointments arriving more than 10 minutes
              late may need to be rescheduled; individual results and the number of sessions
              required vary and cannot be guaranteed; a minimum of 48 hours&apos; notice is
              required to cancel or reschedule; treatment is not suitable for those who are
              pregnant, breastfeeding, or otherwise medically unfit; risks and side effects will
              be explained in full during your consultation before treatment.
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                checked={form.agreed}
                onChange={(e) => setForm((f) => ({ ...f, agreed: e.target.checked }))}
                className="mt-1"
              />
              <span className="font-body text-sm text-ink/75">
                I agree with the terms and conditions *
              </span>
            </label>
            {submitAttempted && !form.agreed && (
              <p className="text-red-700 font-body text-xs -mt-4">
                Please agree to the terms and conditions to continue.
              </p>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={startOver}
                className="px-8 py-4 rounded-full border border-ink/20 text-ink font-body text-sm tracking-wide hover:border-ink transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-4 rounded-full bg-ink text-warm font-body text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
