import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "excelior_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

function secret() { return process.env.ADMIN_SESSION_SECRET ?? ""; }
export function adminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && secret().length >= 32);
}
function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
function signature(payload: string) { return createHmac("sha256", secret()).update(payload).digest("base64url"); }

export function checkAdminCredentials(email: string, password: string) {
  const expectedEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  return adminConfigured() && safeEqual(email.trim().toLowerCase(), expectedEmail) && safeEqual(password, expectedPassword);
}

export function createAdminSession(email: string) {
  const payload = Buffer.from(JSON.stringify({ email: email.trim().toLowerCase(), exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString("base64url");
  return { token: `${payload}.${signature(payload)}`, maxAge: SESSION_SECONDS };
}

export function verifyAdminSession(token?: string | null) {
  if (!token || !adminConfigured()) return null;
  const [payload, providedSignature, extra] = token.split(".");
  if (!payload || !providedSignature || extra) return null;
  const expectedSignature = signature(payload);
  if (!safeEqual(providedSignature, expectedSignature)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: string; exp?: number };
    if (!session.email || session.email !== process.env.ADMIN_EMAIL?.trim().toLowerCase() || !session.exp || session.exp <= Math.floor(Date.now() / 1000)) return null;
    return { email: session.email };
  } catch { return null; }
}

export function getSessionFromCookieHeader(header: string | null) {
  const value = header?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_COOKIE}=`))?.slice(ADMIN_COOKIE.length + 1);
  return verifyAdminSession(value ? decodeURIComponent(value) : null);
}
