import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminConfigured, checkAdminCredentials, createAdminSession } from "@/lib/admin-auth";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  if (!adminConfigured()) return NextResponse.json({ error: "Admin access is not configured yet. Add the required admin environment variables in Vercel." }, { status: 503 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const attempt = loginAttempts.get(ip);
  if (attempt && attempt.resetAt > Date.now() && attempt.count >= 10) return NextResponse.json({ error: "Too many sign-in attempts. Wait 15 minutes and try again." }, { status: 429 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Enter your admin email and password." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Enter your admin email and password." }, { status: 400 });
  const credentials = body as { email?: unknown; password?: unknown };
  if (typeof credentials.email !== "string" || typeof credentials.password !== "string" || !checkAdminCredentials(credentials.email, credentials.password)) {
    const current = attempt && attempt.resetAt > Date.now() ? attempt : { count: 0, resetAt: Date.now() + 15 * 60 * 1000 };
    loginAttempts.set(ip, { count: current.count + 1, resetAt: current.resetAt });
    return NextResponse.json({ error: "The email or password is incorrect." }, { status: 401 });
  }
  loginAttempts.delete(ip);
  const session = createAdminSession(credentials.email);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, session.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: session.maxAge });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
