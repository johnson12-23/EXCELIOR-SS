import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  let payload: unknown;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Please send a valid request." }, { status: 400 }); }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Please send a valid request." }, { status: 400 });
  }
  const body = payload as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const service = typeof body.service === "string" ? body.service.trim() : "";
  if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !service || service.length > 100) {
    return NextResponse.json({ error: "Please check your name, email and service, then try again." }, { status: 400 });
  }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Quote requests aren’t available just yet. Please try again shortly." }, { status: 503 });
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await supabase.from("quote_requests").insert({
      name, email, phone: typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : null,
      service, message: typeof body.message === "string" ? body.message.trim().slice(0, 2000) : null,
    });
    if (error) {
      console.error("Unable to save quote request", error.message);
      return NextResponse.json({ error: "We couldn’t send your note right now. Please try again shortly." }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Unable to save quote request", error instanceof Error ? error.message : "Unknown database error");
    return NextResponse.json({ error: "We couldn’t send your note right now. Please try again shortly." }, { status: 500 });
  }
}
