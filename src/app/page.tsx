"use client";

import { ArrowDown, ArrowRight, Check } from "lucide-react";

const services = [
  { no: "01", title: "Home, beautifully", desc: "Regular care for the rooms you live in, shaped around your routine and the details that matter to you.", tag: "RESIDENTIAL" },
  { no: "02", title: "Work, without the mess", desc: "A considered workspace sets the tone. We keep yours ready for what comes next.", tag: "COMMERCIAL" },
  { no: "03", title: "A fresh beginning", desc: "Move-in or move-out. We take care of the details the last set of keys left behind.", tag: "DEEP CLEAN" },
  { no: "04", title: "Shallow cleaning", desc: "A practical surface-level refresh for well-maintained spaces and everyday upkeep.", tag: "ROUTINE CARE" },
  { no: "05", title: "Post-renovation cleaning", desc: "A careful clean to clear renovation dust and leave updated rooms ready to enjoy.", tag: "AFTER RENOVATION" },
  { no: "06", title: "Floor cleaning and polishing", desc: "Focused floor care to lift everyday dirt and bring back a smooth, polished finish.", tag: "FLOOR CARE" },
];

const faqs = [
  { q: "What’s included in a clean?", a: "Every visit is tailored to your space. We’ll agree the rooms, priorities and any special requests before your appointment, then send a clear checklist with your quote." },
  { q: "Do I need to be home?", a: "Not at all. If you prefer, arrange a secure way for your cleaner to access the space. We’ll confirm the details together before your first visit." },
];

export default function Home() {
  return <main className="home-page">
    <section className="hero" id="top">
      <div className="hero-inner">
        <div className="eyebrow hero-eyebrow"><span/> A FRESHER KIND OF CLEAN</div>
        <h1>Come home to<br/><em>a spotless space.</em></h1>
        <p className="hero-intro">Friendly, vetted cleaners for homes and offices. Book in two minutes and we bring everything we need.</p>
        <a className="button button-light" href="/quote">Book a cleaning <ArrowRight size={16}/></a>
        <div className="hero-note"><span className="note-icon">✳</span><span>CONSIDERED CLEANING<br/><b>for the way you live</b></span></div>
      </div>
      <div className="hero-scene" role="img" aria-label="A cleaner in a teal uniform mops a shiny floor beside a bucket with bubbles">
        <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="floor-glow" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0"/><stop offset=".5" stopColor="#fff" stopOpacity=".9"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
            <linearGradient id="sunlight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6c9" stopOpacity=".8"/><stop offset="1" stopColor="#fff6c9" stopOpacity="0"/></linearGradient>
          </defs>
          <rect width="800" height="450" fill="#dcece8"/><rect y="330" width="800" height="120" fill="#b9d3cd"/><rect y="326" width="800" height="6" fill="#fff" opacity=".55"/>
          <rect x="90" y="60" width="190" height="170" rx="8" fill="#bfe3f2"/><path d="M185 60v170M90 145h190" stroke="#dcece8" strokeWidth="6"/><path d="M110 80h50L90 200z" fill="#fff" className="window-glint"/><path d="M90 230-20 340h250z" fill="url(#sunlight)"/>
          <g className="mop-shine"><ellipse cx="460" cy="385" rx="130" ry="22" fill="url(#floor-glow)"/></g>
          <g fill="#fff" className="sparkles"><path d="m560 350 6 14 14 6-14 6-6 14-6-14-14-6 14-6z"/><path d="m470 400 5 11 11 5-11 5-5 11-5-11-11-5 11-5z"/><path d="m640 410 5 11 11 5-11 5-5 11-5-11-11-5 11-5z"/><path d="m360 415 4 9 9 4-9 4-4 9-4-9-9-4 9-4z"/><path d="m690 345 4 9 9 4-9 4-4 9-4-9-9-4 9-4z"/></g>
          <g transform="translate(150 0)"><g fill="#fff" stroke="#0e8f7e" strokeWidth="2"><circle className="bubble bubble-one" cx="100" cy="335" r="10"/><circle className="bubble bubble-two" cx="118" cy="340" r="7"/><circle className="bubble bubble-three" cx="86" cy="342" r="6"/></g><path d="M70 345h60l-8 50h-44z" fill="#f2b632"/><ellipse cx="100" cy="345" rx="30" ry="7" fill="#9fd8ee"/><path d="M72 346q28-48 56 0" fill="none" stroke="#6b7a80" strokeWidth="3"/></g>
          <g transform="translate(640 0)"><path d="m0 395 25-60 25 60z" fill="#f7c600" stroke="#c99a00" strokeWidth="2"/><rect x="23" y="352" width="4" height="22" rx="2" fill="#222"/><circle cx="25" cy="382" r="3" fill="#222"/></g>
          <ellipse cx="400" cy="385" rx="52" ry="8" fill="#000" opacity=".15"/>
          <g className="cleaner-bob"><rect x="381" y="270" width="16" height="104" rx="6" fill="#27455a"/><rect x="403" y="270" width="16" height="104" rx="6" fill="#27455a"/><ellipse cx="386" cy="377" rx="16" ry="7" fill="#222"/><ellipse cx="416" cy="377" rx="16" ry="7" fill="#222"/><rect x="370" y="175" width="60" height="105" rx="20" fill="#0e8f7e"/><rect x="392" y="150" width="16" height="30" fill="#c98f6b"/><circle cx="400" cy="140" r="26" fill="#d9a07b"/><path d="M373 134q27-38 54 0z" fill="#f2b632"/><rect x="396" y="124" width="46" height="9" rx="4" fill="#f2b632"/><circle cx="391" cy="143" r="2.5" fill="#222"/><circle cx="410" cy="143" r="2.5" fill="#222"/><path d="M392 153q9 7 18 0" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round"/><g className="mop-swing"><line x1="400" y1="195" x2="440" y2="262" stroke="#0e8f7e" strokeWidth="16" strokeLinecap="round"/><line x1="438" y1="262" x2="500" y2="372" stroke="#8a6a4a" strokeWidth="6" strokeLinecap="round"/><circle cx="440" cy="263" r="9" fill="#d9a07b"/><path d="M470 370h60l8 24h-76z" fill="#fff" stroke="#0e8f7e" strokeWidth="3"/><path d="M478 372v22m14-22v22m14-22v22m14-22v22" stroke="#0e8f7e" strokeWidth="2" opacity=".5"/></g><circle cx="384" cy="205" r="7" fill="#fff" opacity=".9"/><path d="m384 200 1.8 3.6 3.6 1.8-3.6 1.8-1.8 3.6-1.8-3.6-3.6-1.8 3.6-1.8z" fill="#0e8f7e"/></g>
        </svg>
      </div>
      <a className="scroll-link" href="#services"><ArrowDown size={14}/> SCROLL A LITTLE</a>
      <div className="hero-index">01 <span/> 03</div>
    </section>

    <section className="intro section-pad" id="approach">
      <div className="intro-side"><div className="eyebrow"><span/> THE EXCELIOR STANDARD</div><div className="ornament">✳</div></div>
      <div className="intro-main"><p className="kicker">A BEAUTIFUL SPACE IS A FEELING.</p><h2>It’s not just clean.<br/>It’s <em>how clean feels.</em></h2><p className="body-copy">The exhale when you walk through the door. The calm of a clear desk. The joy of little things in their place. Excelior makes room for those moments—with thoughtful people, a gentler touch, and a standard you can feel.</p><a className="text-link" href="#love">A little about us <ArrowRight size={14}/></a></div>
      <div className="intro-stamp"><span>DETAILS MAKE<br/>THE DIFFERENCE</span><b>✳</b><span>SINCE DAY ONE<br/>ALWAYS WITH CARE</span></div>
    </section>

    <section className="services section-pad" id="services">
      <div className="section-top"><div><div className="eyebrow"><span/> WHAT WE DO, BEAUTIFULLY</div><h2>A place for every<br/><em>kind of clean.</em></h2></div><p className="section-aside">A thoughtful team. A fresh perspective.<br/>The little details, taken care of.</p></div>
      <div className="service-grid">{services.map((s) => <article className="service-card service-card-text" key={s.no}><div className="service-info"><div className="service-card-top"><span className="service-number">{s.no}</span><span className="service-tag">{s.tag}</span></div><h3>{s.title}</h3><p>{s.desc}</p><a className="text-link" href="/quote">Ask about this service <ArrowRight size={14}/></a></div></article>)}</div>
      <div className="services-foot"><span>GOOD THINGS, THOUGHTFULLY DONE.</span><a className="text-link" href="/quote">Find your kind of clean <ArrowRight size={14}/></a></div>
    </section>

    <section className="manifesto" id="love"><div className="manifesto-photo" role="img" aria-label="Detail of a quiet, warmly lit home"/><div className="manifesto-panel"><span className="eyebrow"><span/> THE EXCELIOR TOUCH</span><div className="manifesto-star">✳</div><h2>Care is in<br/>the <em>details.</em></h2><p>We believe a truly lovely clean isn’t a checklist. It’s noticing the things that matter to you, respecting the space you’ve made, and leaving everything feeling a little lighter.</p><div className="manifesto-sign">A little more lovely, <i>every day.</i></div><a className="button button-dark" href="/quote">Meet your new clean <ArrowRight size={16}/></a></div></section>

    <section className="promise section-pad"><div className="promise-heading"><div className="eyebrow"><span/> OUR PROMISE TO YOU</div><h2>The little things<br/>make <em>all the difference.</em></h2></div><div className="promise-list"><div><span>01</span><p><b>People, with care.</b> Thoughtful, professional cleaners who care about the details.</p><Check/></div><div><span>02</span><p><b>Made around you.</b> Your priorities, your space, your kind of lovely.</p><Check/></div><div><span>03</span><p><b>A standard you feel.</b> The kind of finish that makes you pause at the door.</p><Check/></div><div><span>04</span><p><b>Easy from hello.</b> A friendly conversation, a clear quote, and a fresh start.</p><Check/></div></div></section>

    <section className="faq section-pad" id="faq"><div className="faq-heading"><div className="eyebrow"><span/> GOOD TO KNOW</div><h2>A few little<br/><em>answers.</em></h2><p>Have another question? We’d love to hear it.</p><a className="text-link" href="/quote">Drop us a note <ArrowRight size={14}/></a></div><div className="route-faq-list">{faqs.map((f, i) => <details key={f.q} open={i === 0}><summary>{f.q}<span>+</span></summary><p>{f.a}</p></details>)}</div></section>

  </main>;
}
