"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Our services" },
  { href: "/approach", label: "Our approach" },
  { href: "/touch", label: "The Excelior touch" },
  { href: "/faq", label: "FAQs" },
];

export default function SiteChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMenuOpen(false), [pathname]);

  return <>
    <div className="announcement"><Sparkles size={13} /> A little more lovely, every day <span className="announcement-dot">✳</span> Thoughtful cleaning, made personal</div>
    <header className="header">
      <Link className="brand" href="/" aria-label="Excelior home"><Image className="brand-logo" src="/excelior-logo.svg" alt="" width={48} height={48} priority/><span className="brand-copy">EXCELIOR<small>SOLUTIONS SERVICES</small></span></Link>
      <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main navigation" id="main-navigation">
        {navigation.map((item) => <Link href={item.href} key={item.href} onClick={() => setMenuOpen(false)} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
        <Link className="mobile-cta" href="/quote" onClick={() => setMenuOpen(false)}>Get a quote <ArrowUpRight size={15}/></Link>
      </nav>
      <Link className="header-cta" href="/quote">Let’s talk <ArrowUpRight size={15}/></Link>
      <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="main-navigation">{menuOpen ? <X/> : <Menu/>}</button>
    </header>
    {children}
    <footer className="footer"><div className="footer-top"><Link className="brand brand-footer" href="/"><Image className="brand-logo" src="/excelior-logo.svg" alt="" width={48} height={48}/><span className="brand-copy">EXCELIOR<small>SOLUTIONS SERVICES</small></span></Link><p>A little more lovely,<br/><i>every day.</i></p></div><div className="footer-bottom"><span>© {new Date().getFullYear()} EXCELIOR SOLUTIONS SERVICES</span><span>MADE WITH CARE, ALWAYS <b>✳</b></span><Link href="/">BACK TO HOME ↑</Link></div></footer>
  </>;
}