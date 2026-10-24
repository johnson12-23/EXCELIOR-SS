"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LockKeyhole } from "lucide-react";
import ThemeToggle from "@/app/theme-toggle";

export default function AdminLoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to sign in.");
      router.push("/admin"); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to sign in."); }
    finally { setLoading(false); }
  }
  return <main className="admin-login-page"><section className="admin-login-card"><div className="admin-login-brand-row"><Image className="admin-login-logo" src="/excelior-logo.svg" alt="Excelior Solution Services logo" width={68} height={68} priority/><ThemeToggle/></div><span className="admin-eyebrow">EXCELIOR SOLUTION SERVICES</span><h1>Admin sign in</h1><p>Manage quote requests and keep your cleaning business moving.</p>
    {!configured ? <div className="admin-setup-notice"><LockKeyhole size={19}/><div><b>Admin access needs setup</b><span>Set ADMIN_EMAIL, ADMIN_PASSWORD, and a 32+ character ADMIN_SESSION_SECRET in your hosting environment.</span></div></div> : <form onSubmit={submit}><label>Email address<input name="email" type="email" autoComplete="username" required/></label><label>Password<input name="password" type="password" autoComplete="current-password" required/></label>{error && <p className="admin-form-error" role="alert">{error}</p>}<button className="admin-primary-button" disabled={loading}>{loading ? "Signing in…" : "Sign in"}<ArrowRight size={16}/></button></form>}
    <Link className="admin-back-link" href="/">← Back to website</Link>
  </section></main>;
}
