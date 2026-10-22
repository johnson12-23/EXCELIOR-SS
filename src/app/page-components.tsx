import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

export function PageHero({ eyebrow, title, emphasis, description, image, showImage = true, ctaLabel = "Let’s talk about your space", ctaHref = "/quote", ctaDirection = "right" }: { eyebrow: string; title: string; emphasis: string; description: string; image?: string; showImage?: boolean; ctaLabel?: string; ctaHref?: string; ctaDirection?: "right" | "down" }) {
  return <section className={showImage ? "interior-hero" : "interior-hero interior-hero-text-only"}>
    <div className="interior-copy"><div className="eyebrow"><span/>{eyebrow}</div><h1>{title}<br/><em>{emphasis}</em></h1><p>{description}</p><Link href={ctaHref} className="button button-dark page-hero-cta">{ctaLabel}{ctaDirection === "down" ? <ArrowDown size={17}/> : <ArrowRight size={16}/>}</Link></div>
    {showImage && image && <div className="interior-image" role="img" aria-label={eyebrow.toLowerCase()} style={{ backgroundImage: `url(https://images.unsplash.com/${image}?auto=format&fit=crop&w=1400&q=85)` }}/>}
  </section>;
}

export function DetailSection({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <section className="detail-section"><div className="eyebrow"><span/>{eyebrow}</div><h2>{title}</h2><div className="detail-content">{children}</div></section>;
}