"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const themeKey = "excelior-theme";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(themeKey); } catch { /* Theme still works for this visit if storage is unavailable. */ }
    const isDark = saved === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    setDark(isDark);
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem(themeKey, next ? "dark" : "light"); } catch { /* Keep the selected theme active for this visit. */ }
    setDark(next);
  }

  return <button type="button" className={`theme-toggle ${className}`} onClick={toggle} aria-label={`Turn ${dark ? "light" : "dark"} mode on`} aria-pressed={dark} title={`Turn ${dark ? "light" : "dark"} mode on`}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>;
}
