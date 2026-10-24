"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Bell, CalendarDays, ChartNoAxesCombined, ChevronDown, ChevronRight, CircleDollarSign, LayoutDashboard, LogOut, Menu, Settings, Sparkles, Users, UserRound, X } from "lucide-react";
import ThemeToggle from "@/app/theme-toggle";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/team", label: "Team", icon: UserRound },
  { href: "/admin/payments", label: "Payments", icon: CircleDollarSign },
  { href: "/admin/reports", label: "Reports", icon: ChartNoAxesCombined },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const path = usePathname();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const [profile, setProfile] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [range, setRange] = useState("30 days");
  const [pendingCount, setPendingCount] = useState(0);
  useEffect(() => { fetch("/api/admin/data").then((response) => response.ok ? response.json() : null).then((data) => { if (data) setPendingCount(data.bookings.filter((booking: { status: string }) => booking.status === "pending").length); }).catch(() => undefined); }, []);
  const title = path === "/admin" ? "Admin Dashboard" : navigation.find((item) => item.href === path)?.label ?? "Admin Dashboard";
  const subtitle = path === "/admin" ? "Welcome back! Here’s what’s happening with your cleaning business." : `Manage your ${title.toLowerCase()} for Excelior Solution Services.`;
  async function logout() { await fetch("/api/admin/login", { method: "DELETE" }); router.replace("/admin/login"); router.refresh(); }
  return <div className="admin-app">
    {drawer && <button className="admin-drawer-backdrop" aria-label="Close navigation" onClick={() => setDrawer(false)}/>}
    <aside className={`admin-sidebar ${drawer ? "is-open" : ""}`}>
      <div className="admin-brand"><Image className="admin-logo-image" src="/excelior-logo.svg" alt="" width={39} height={39} priority/><span><b>EXCELIOR</b><small>SOLUTION SERVICES</small></span><button className="admin-mobile-close" aria-label="Close navigation" onClick={() => setDrawer(false)}><X size={18}/></button></div>
      <p className="admin-slogan">Clean Spaces. Better Living.</p>
      <span className="admin-nav-label">WORKSPACE</span>
      <nav aria-label="Admin navigation">{navigation.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`admin-nav-item ${(path === href || (href !== "/admin" && path.startsWith(href + "/"))) ? "active" : ""}`} onClick={() => setDrawer(false)}><Icon size={18}/><span>{label}</span>{label === "Bookings" && <ChevronRight className="admin-nav-arrow" size={15}/>}</Link>)}</nav>
      <div className="admin-sidebar-bottom"><div className="admin-sidebar-help"><span className="admin-help-icon"><Activity size={16}/></span><b>Keep everything in sync</b><span>New website requests appear in your bookings.</span><Link href="/admin/bookings">View bookings <ChevronRight size={13}/></Link></div><button className="admin-logout" onClick={logout}><LogOut size={17}/>Log out</button></div>
    </aside>
    <div className="admin-main-wrap"><header className="admin-header"><button className="admin-mobile-menu" aria-label="Open navigation" onClick={() => setDrawer(true)}><Menu size={21}/></button><div className="admin-header-title"><h1>{title}</h1><p>{subtitle}</p></div><div className="admin-header-actions"><ThemeToggle className="admin-theme-toggle"/><label className="admin-range-picker"><CalendarDays size={16}/><select aria-label="Dashboard date range" value={range} onChange={(event) => { setRange(event.target.value); window.dispatchEvent(new CustomEvent("excelior:range", { detail: event.target.value })); }}><option>30 days</option><option>This month</option><option>All time</option></select><ChevronDown size={14}/></label><div className="admin-popover-wrap"><button className="admin-icon-button" aria-label={`Notifications${pendingCount ? `, ${pendingCount} pending` : ""}`} onClick={() => { setNotifications(!notifications); setProfile(false); }}>{pendingCount > 0 && <i/>}<Bell size={19}/></button>{notifications && <div className="admin-popover"><b>Booking notifications</b><p>{pendingCount ? `${pendingCount} request${pendingCount === 1 ? " is" : "s are"} waiting for confirmation.` : "No pending booking requests right now."}</p><Link href="/admin/bookings" onClick={() => setNotifications(false)}>Review bookings <ChevronRight size={14}/></Link></div>}</div><div className="admin-profile-wrap"><button className="admin-profile-button" onClick={() => { setProfile(!profile); setNotifications(false); }}><span className="admin-avatar">{email.slice(0,1).toUpperCase()}</span><span className="admin-profile-copy"><b>Administrator</b><small>{email}</small></span><ChevronDown size={15}/></button>{profile && <div className="admin-popover admin-profile-menu"><Link href="/admin/settings">Business settings</Link><button onClick={logout}>Log out</button></div>}</div></div></header>
      <main className="admin-content">{children}</main>
    </div>
  </div>;
}
