import { Mail, Phone } from "lucide-react";
import { PageHero } from "../page-components";
import ContactForm from "./contact-form";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const email = "infoexceliorss@gmail.com";
  const phone = "+233 59 787 5558";

  return <main className="interior-page contact-page">
    <PageHero eyebrow="HERE TO HELP" title="A question or" emphasis="something to flag?" description="For something outside a cleaning request, send us a note. We’re happy to help with questions, feedback, or a problem on the website." showImage={false} ctaLabel="Send us a message" ctaHref="#contact-form" ctaDirection="down"/>
    <section className="contact-route-section" id="contact-form">
      <div className="contact-copy">
        <span className="eyebrow"><span/> CONTACT OUR TEAM</span>
        <h2>We’re listening.</h2>
        <p>Use the message form and our team will reply to the email address you provide. For a quick response, reach us on our details below.</p>
        <div className="contact-details">
          <a href={`mailto:${email}`}><Mail size={18}/><span><small>Email</small><b>{email}</b></span></a>
          <a href="tel:+233597875558"><Phone size={18}/><span><small>Call us</small><b>{phone}</b></span></a>
        </div>
      </div>
      <ContactForm/>
    </section>
  </main>;
}
