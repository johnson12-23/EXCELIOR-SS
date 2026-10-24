import type { Metadata } from "next";
import "./redesign.css";
import "./admin.css";
import "./theme.css";
import SiteChrome from "./site-chrome";

export const metadata: Metadata = {
  title: "Excelior — A higher standard of clean",
  description: "Thoughtful, detail-led cleaning for the spaces you love. Request a complimentary, no-obligation quote from Excelior Solutions Services.",
  applicationName: "Excelior Solutions Services",
  openGraph: { title: "Excelior — A higher standard of clean", description: "Thoughtful, detail-led cleaning for the spaces you love.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem("excelior-theme")==="dark")document.documentElement.dataset.theme="dark"}catch{}` }}/></head><body><SiteChrome>{children}</SiteChrome></body></html>;
}
