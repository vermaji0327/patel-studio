// src/pages/Booking.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import "./booking.css"; // <-- create this file (content below)

type FormState = {
  name: string;
  phone: string;
  date: string;
  event: string;
  message: string;
};

const PHONE_NUMBER = "919009476587"; // WhatsApp number (no +)
const EMAIL_API = "/api/send-email"; // optional backend

export default function Booking(): JSX.Element {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    date: "",
    event: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.date.trim()) {
      alert("Please fill name, phone and event date.");
      return;
    }

    setSending(true);

    const waText = [
      "📸 *New Booking Request*",
      "-------------------------",
      `👤 Name: ${form.name}`,
      `📞 Phone: ${form.phone}`,
      `📅 Event Date: ${form.date}`,
      `🎉 Event Type: ${form.event || "-"}`,
      `📝 Message: ${form.message || "-"}`,
      "-------------------------",
    ].join("\n");

    const waURL = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(waText)}`;

    // Open WhatsApp in new tab for user to confirm/send
    try {
      window.open(waURL, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.warn("Could not open WhatsApp:", err);
    }

    // optional: backend email
    try {
      await fetch(EMAIL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, receivedAt: new Date().toISOString() }),
      });
    } catch (err) {
      console.warn("Email API call failed:", err);
    }

    setSending(false);
    alert("Booking request initiated. Please confirm on WhatsApp.");
    setForm({ name: "", phone: "", date: "", event: "", message: "" });
  };

  return (
    <main className="booking-page" role="main">
      <div className="booking-card" aria-labelledby="booking-heading">
        <h1 id="booking-heading" className="booking-title">
          Book Your Shoot 💖
        </h1>
        <p className="booking-sub">Fill details below and click <strong>Send Booking Request</strong>. A WhatsApp message will open.</p>

        <form onSubmit={handleSubmit} className="booking-form" noValidate>
          <div className="form-row">
            <label htmlFor="name" className="form-label">Full Name <span aria-hidden="true" className="required">*</span></label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="book-input"
              aria-required="true"
            />
          </div>

          <div className="form-row">
            <label htmlFor="phone" className="form-label">Phone Number <span aria-hidden="true" className="required">*</span></label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="+919009476587 or 9009476587"
              className="book-input"
              aria-required="true"
              inputMode="tel"
            />
          </div>

          <div className="form-row">
            <label htmlFor="date" className="form-label">Event Date <span aria-hidden="true" className="required">*</span></label>
            <input
              id="date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="book-input"
              aria-required="true"
            />
          </div>

          <div className="form-row">
            <label htmlFor="event" className="form-label">Event Type</label>
            <input
              id="event"
              name="event"
              value={form.event}
              onChange={handleChange}
              placeholder="Birthday, Pre-wedding, Photoshoot..."
              className="book-input"
            />
          </div>

          <div className="form-row">
            <label htmlFor="message" className="form-label">Message (optional)</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="book-input"
              placeholder="Any special notes..."
            />
          </div>

         <button
  type="submit"
  disabled={sending}
  className="submit-btn"
>

            {sending ? "Sending..." : "Send Booking Request"}
          </button>
        </form>
      </div>
    </main>
  );
}
