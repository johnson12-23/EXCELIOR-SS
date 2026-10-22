import { PageHero } from "../page-components";
import QuoteForm from "./quote-form";

export default function QuotePage() {
  return <main className="interior-page quote-page">
    <PageHero eyebrow="YOUR LOVELY STARTS HERE" title="Let’s make room" emphasis="for lovely." description="Tell us a little about your space. We’ll be in touch with a thoughtful, no-obligation quote." showImage={false} ctaLabel="Fill in your details here" ctaHref="#quote-form" ctaDirection="down"/>
    <section className="quote-route-section"><div className="quote-route-copy"><span className="eyebrow"><span/> A REAL PERSON, A CONSIDERED REPLY</span><h2>Every space has<br/>its own <em>story.</em></h2><p>We’ll listen first, then put together a clear plan that fits the way you live or work.</p></div><QuoteForm/></section>
  </main>;
}