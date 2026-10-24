import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  let payload: unknown;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Please send a valid message." }, { status: 400 }); }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return NextResponse.json({ error: "Please send a valid message." }, { status: 400 });

  const body = payload as Record<string, unknown>;
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true });
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const topic = typeof body.topic === "string" ? body.topic.trim() : "general";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const topics: Record<string, string> = { general: "General question", website: "Website problem", feedback: "Feedback", other: "Other" };
  if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !topics[topic] || !message || message.length > 3000) {
    return NextResponse.json({ error: "Please check your name, email, topic, and message." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.RESEND_FROM_EMAIL;
  let recipient = process.env.QUOTE_NOTIFICATION_EMAIL;
  if (!recipient) {
    try {
      const { data } = await createSupabaseServerClient().from("business_settings").select("business_email").eq("id", 1).maybeSingle();
      recipient = data?.business_email || undefined;
    } catch { /* Report missing email setup below. */ }
  }
  if (!apiKey || !sender || !recipient) return NextResponse.json({ error: "Our message form is temporarily unavailable. Please try again later." }, { status: 503 });

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `contact-${randomUUID()}` },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: `Website contact: ${topics[topic]} — ${name}`,
        text: [`Name: ${name}`, `Email: ${email}`, `Topic: ${topics[topic]}`, "", "Message:", message].join("\n"),
      }),
    });
    if (!response.ok) {
      console.error("Contact message delivery failed", response.status);
      return NextResponse.json({ error: "We couldn’t send your message right now. Please try again shortly." }, { status: 502 });
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Contact message delivery failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "We couldn’t send your message right now. Please try again shortly." }, { status: 502 });
  }
}
