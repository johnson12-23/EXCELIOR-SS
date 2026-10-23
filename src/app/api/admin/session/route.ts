import { NextResponse } from "next/server";
import { getSessionFromCookieHeader } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const session = getSessionFromCookieHeader(request.headers.get("cookie"));
  return session ? NextResponse.json({ ok: true, email: session.email }) : NextResponse.json({ ok: false }, { status: 401 });
}
