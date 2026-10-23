"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const defaultServices = ["Home cleaning", "Commercial cleaning", "Deep cleaning", "Shallow cleaning", "Post-renovation cleaning", "Floor cleaning and polishing", "Something else"];

export default function QuoteForm() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    fetch("/api/services").then((response) => response.json()).then((result) => {
      if (Array.isArray(result.services)) setServices(result.services.map((item: { name: string }) => item.name));
    }).catch(() => undefined);
  }, []);

  async function submitQuote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong. Please try again.");
      setStatus("Thank you, you will receive a feedback within 24 hours.");
      form.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return <form id="quote-form" className="quote-form route-quote-form" aria-label="Request a cleaning quote" onSubmit={submitQuote}>
    <div className="form-top"><span>01 — TELL US A LITTLE</span><span>YOUR DETAILS MATTER</span></div>
    <label>Your name<input required name="name" autoComplete="name" placeholder="What should we call you?"/></label>
    <div className="form-row"><label>Email address<input required type="email" name="email" autoComplete="email" placeholder="you@example.com"/></label><label>Phone number<input name="phone" autoComplete="tel" placeholder="Your number"/></label></div>
    <label>What kind of clean?<select name="service" defaultValue="" required><option value="" disabled>Choose what you have in mind</option>{services.map((service) => <option key={service}>{service}</option>)}</select></label>
    <div className="form-row"><label>Preferred date<input name="requested_date" type="date" min={new Date().toISOString().slice(0, 10)} /></label><label>Preferred time<input name="requested_time" type="time" /></label></div>
    <label>Service address or area<input name="location" autoComplete="street-address" maxLength={240} placeholder="Your town, neighbourhood or address" /></label>
    <label>Anything else we should know?<textarea name="message" rows={3} placeholder="All details about your space, mandatory!" required/></label>
    <button className="button button-dark submit-button" disabled={submitting}>{submitting ? "Sending your note…" : "Request my complimentary quote"}<ArrowRight size={16}/></button>
    {status && <p className="form-status" role="status">{status}</p>}
    <p className="form-note">Just a friendly reply from us. Your details stay yours.</p>
  </form>;
}
