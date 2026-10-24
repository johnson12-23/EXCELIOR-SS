"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import ThemeToggle from "./theme-toggle";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Our services" },
  { href: "/approach", label: "Our approach" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact" },
  { href: "/quote", label: "Book now", className: "header-book-button" },
];

export default function SiteChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { setMenuOpen(false); menuButtonRef.current?.focus(); }
    }
    function onResize() { if (window.matchMedia("(min-width: 861px)").matches) setMenuOpen(false); }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  if (pathname.startsWith("/admin")) return <>{children}</>;

  return <>
    <div className="announcement"><Sparkles size={13} /> A little more lovely, every day <span className="announcement-dot">✳</span> Thoughtful cleaning, made personal</div>
    <header className="header" ref={headerRef}>
      <Link className="brand" href="/" aria-label="Excelior home"><Image className="brand-logo" src="/excelior-logo.svg" alt="" width={48} height={48} priority/><span className="brand-copy">EXCELIOR<small>SOLUTIONS SERVICES</small></span></Link>
      <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main navigation" id="main-navigation">
        {navigation.map((item) => <Link className={item.className} href={item.href} key={item.href} onClick={() => setMenuOpen(false)} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
      </nav>
      <ThemeToggle className="site-theme-toggle"/>
      <button ref={menuButtonRef} type="button" className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="main-navigation">{menuOpen ? <X aria-hidden="true"/> : <Menu aria-hidden="true"/>}</button>
    </header>
    {children}
    <footer className="footer"><div className="footer-main"><div className="footer-top"><p>A little more lovely,<br/><i>every day.</i></p><p className="footer-tagline">Clean Spaces. Better Living.</p></div><div className="footer-contact"><h2>Get in touch</h2><a href="mailto:exceliorsshp@gmail.com">exceliorsshp@gmail.com</a><a href="tel:+233597875558">+233 59 787 5558</a></div><nav className="footer-links" aria-label="Footer navigation"><h2>Explore</h2>{navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}</nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} EXCELIOR SOLUTIONS SERVICES</span><span>MADE WITH CARE, ALWAYS <b>✳</b></span><Link href="/">BACK TO HOME ↑</Link></div></footer>
  </>;
}
