import { Mail, MapPin, Phone } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { PageHero } from "../page-components";
import ContactForm from "./contact-form";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  let settings: { business_email: string; business_phone: string; service_areas: string } | null = null;
  try {
    const { data } = await createSupabaseServerClient().from("business_settings").select("business_email,business_phone,service_areas").eq("id", 1).maybeSingle();
    settings = data;
  } catch { /* Direct contact details remain optional until configured in admin settings. */ }
  const email = settings?.business_email || process.env.QUOTE_NOTIFICATION_EMAIL || "";

  return <main className="interior-page contact-page">
    <PageHero eyebrow="HERE TO HELP" title="A question or" emphasis="something to flag?" description="For something outside a cleaning request, send us a note. We’re happy to help with questions, feedback, or a problem on the website." showImage={false} ctaLabel="Send us a message" ctaHref="#contact-form" ctaDirection="down"/>
    <section className="contact-route-section" id="contact-form">
      <div className="contact-copy">
        <span className="eyebrow"><span/> CONTACT OUR TEAM</span>
        <h2>We’re listening.</h2>
        <p>Tell us what you need help with and include any details that will help us understand. If you found a website problem, mention which page you were on and what happened.</p>
        <div className="contact-details">
          {email && <a href={`mailto:${email}`}><Mail size={18}/><span><small>Email</small><b>{email}</b></span></a>}
          {settings?.business_phone && <a href={`tel:${settings.business_phone}`}><Phone size={18}/><span><small>Call us</small><b>{settings.business_phone}</b></span></a>}
          {settings?.service_areas && <div><MapPin size={18}/><span><small>Service areas</small><b>{settings.service_areas}</b></span></div>}
          {!email && !settings?.business_phone && <p className="contact-direct-note">Use the message form and our team will reply to the email address you provide.</p>}
        </div>
      </div>
      <ContactForm/>
    </section>
  </main>;
}
