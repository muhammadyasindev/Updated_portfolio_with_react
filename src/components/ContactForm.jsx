"use client";

import { useState } from "react";

const subjects = [
  "New project enquiry",
  "Website redesign",
  "E-commerce store",
  "Dashboard / internal tool",
  "API or integration work",
  "Something else",
];

const WHATSAPP_NUMBER = "923324042186";

export default function ContactForm() {
  const [status, setStatus] = useState({ type: "idle" });
  const [errors, setErrors] = useState({});
  const [whatsappLink, setWhatsappLink] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ type: "loading" });
    setErrors({});
    setWhatsappLink("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.errors ?? {});
        setStatus({ type: "error", message: json.error ?? "Something went wrong." });
        return;
      }

      // Build WhatsApp message text for manual click
      const waText = `*Inquiry from ${data.name || "Client"}*\n*Email:* ${data.email || ""}\n*Subject:* ${data.subject || ""}\n*Message:*\n${data.message || ""}`;
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
      setWhatsappLink(waUrl);

      form.reset();
      setStatus({
        type: "success",
        message: "Thank you! Your inquiry has been sent successfully.",
      });
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again or reach out on WhatsApp." });
    }
  }

  const err = (k) =>
    errors[k] ? (
      <p className="mt-1 text-xs text-rose-400" role="alert">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="card p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs muted">Name</label>
          <input id="name" name="name" required className="field" placeholder="Your name" autoComplete="name" />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs muted">Email</label>
          <input id="email" name="email" type="email" required className="field" placeholder="you@email.com" autoComplete="email" />
          {err("email")}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="subject" className="mb-1.5 block text-xs muted">Subject</label>
        <select id="subject" name="subject" required defaultValue="" className="field">
          <option value="" disabled>Select a subject</option>
          {subjects.map((s) => (
            <option key={s} value={s} className="bg-[#0a0c1b] text-white">{s}</option>
          ))}
        </select>
        {err("subject")}
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="mb-1.5 block text-xs muted">Message</label>
        <textarea id="message" name="message" rows={5} required className="field resize-y" placeholder="Tell me about your project…" />
        {err("message")}
      </div>

      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status.type === "loading"}
        className="btn-primary mt-5 w-full py-3 text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <span>{status.type === "loading" ? "Sending…" : "Send Message →"}</span>
      </button>

      {status.type === "success" && (
        <div role="status" className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300 space-y-2.5">
          <p className="font-medium">✓ {status.message}</p>
          {whatsappLink && (
            <div>
              <p className="text-xs text-emerald-400/90 mb-2">Want a faster reply? You can also message on WhatsApp directly:</p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] text-black px-4 py-2 font-bold text-xs hover:bg-[#1ebd5a] transition-all"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span>Send to WhatsApp (03324042186)</span>
              </a>
            </div>
          )}
        </div>
      )}

      {status.type === "error" && (
        <p role="alert" className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {status.message}
        </p>
      )}
    </form>
  );
}
