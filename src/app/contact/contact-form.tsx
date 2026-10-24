"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setFailed(false);
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn’t send your message. Please try again.");
      setMessage("Thanks for getting in touch. Our team will reply soon.");
      form.reset();
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "We couldn’t send your message. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <form className="contact-form" onSubmit={submit}>
    <h2>Send us a message</h2>
    <p>For a general question, feedback, or help with a website issue.</p>
    <label>Your name<input name="name" autoComplete="name" required maxLength={120}/></label>
    <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>
    <label>What can we help with?<select name="topic" defaultValue="general"><option value="general">A general question</option><option value="website">A website problem</option><option value="feedback">Feedback</option><option value="other">Something else</option></select></label>
    <label>Your message<textarea name="message" rows={5} required maxLength={3000} placeholder="Tell us what you’d like us to know."/></label>
    <label className="contact-honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <button className="button button-dark" disabled={busy}>{busy ? "Sending…" : "Send message"}<ArrowRight size={16}/></button>
    {message && <p className={`contact-status ${failed ? "is-error" : ""}`} role="status">{message}</p>}
  </form>;
}
