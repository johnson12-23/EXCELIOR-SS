import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { DetailSection, PageHero } from "../page-components";

const steps = [
  { no: "01", title: "Tell us what matters", copy: "Share the space, your priorities, and anything you want us to know." },
  { no: "02", title: "Get a considered plan", copy: "We’ll follow up with a clear quote and agree the details before a visit." },
  { no: "03", title: "Enjoy the difference", copy: "Our team arrives ready, with the supplies and care your space needs." },
];

export default function ApproachPage() {
  return <main className="interior-page approach-page">
    <PageHero eyebrow="THE EXCELIOR STANDARD" title="Easy from hello." emphasis="Care in every detail." description="A straightforward, personal process that makes getting a lovely clean feel easy." image="photo-1600607687939-ce8a6c25118c" showImage={false}/>
    <DetailSection eyebrow="HOW IT WORKS" title="Thoughtful at every step.">
      <div className="process-list">{steps.map((step) => <article key={step.no}><span>{step.no}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div><Check size={19}/></article>)}</div>
    </DetailSection>
    <section className="route-callout"><span className="eyebrow"><span/> MADE AROUND YOU</span><p>Your space is never just another checklist. We agree the rooms, timing, and priorities together.</p><Link href="/quote" className="text-link">Start a conversation <ArrowRight size={14}/></Link></section>
  </main>;
}