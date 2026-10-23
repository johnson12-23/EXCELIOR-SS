import { NextResponse } from "next/server";
import { getSessionFromCookieHeader } from "@/lib/admin-auth";

export function authorizeAdminRequest(request: Request, requireSameOrigin = false) {
  if (!getSessionFromCookieHeader(request.headers.get("cookie"))) return NextResponse.json({ error: "Admin sign-in required." }, { status: 401 });
  if (requireSameOrigin) {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "This request was not accepted." }, { status: 403 });
  }
  return null;
}
