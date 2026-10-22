import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { DetailSection, PageHero } from "../page-components";

export default function TouchPage() {
  return <main className="interior-page touch-page">
    <PageHero eyebrow="THE EXCELIOR TOUCH" title="Care is in" emphasis="the details." description="We believe a lovely clean begins with listening, and ends with a space that feels lighter." image="photo-1616486338812-3dadae4b4ace" showImage={false}/>
    <DetailSection eyebrow="WHAT WE BELIEVE" title="Good work feels personal.">
      <div className="touch-values"><article><span>01</span><h3>People, with care.</h3><p>Professional cleaners who respect your home, your time, and your trust.</p></article><article><span>02</span><h3>Details that matter.</h3><p>We notice the little things that help a space feel genuinely looked after.</p></article><article><span>03</span><h3>A standard you feel.</h3><p>Clear communication and thoughtful finishing, from the first hello onward.</p></article></div>
    </DetailSection>
    <section className="route-callout"><span className="eyebrow"><span/> ALWAYS WITH CARE</span><p>A little more lovely, every day.</p><Link href="/approach" className="text-link">See how we work <ArrowRight size={14}/></Link><Check className="callout-check" size={22}/></section>
  </main>;
}