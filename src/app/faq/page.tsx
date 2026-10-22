import { DetailSection, PageHero } from "../page-components";

const answers = [
  { question: "What’s included in a clean?", answer: "Every visit is tailored to your space. We’ll agree the rooms, priorities, and any special requests before your appointment, then send a clear checklist with your quote." },
  { question: "Do I need to be home?", answer: "Not at all. If you prefer, arrange a secure way for your cleaner to access the space. We’ll confirm the details together before your first visit." },
  { question: "How do I get a price?", answer: "Share a few details in the quote form and our team will follow up with a personalised, no-obligation estimate. Every space is different, so we quote with care." },
  { question: "Can I book regular visits?", answer: "Absolutely. Ask us about weekly, fortnightly, and monthly schedules. We’ll find a rhythm that fits your space and your life." },
];

export default function FaqPage() {
  return <main className="interior-page faq-page">
    <PageHero eyebrow="GOOD TO KNOW" title="A few little" emphasis="answers." description="A few helpful details before you get started. If you have another question, just ask." image="photo-1600210492486-724fe5c67fb0" showImage={false}/>
    <DetailSection eyebrow="FREQUENTLY ASKED" title="The details, made clear.">
      <div className="route-faq-list">{answers.map((item) => <details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div>
    </DetailSection>
    <section className="route-callout"><span className="eyebrow"><span/> STILL WONDERING?</span><p>We’d be happy to help you find the right kind of clean.</p></section>
  </main>;
}