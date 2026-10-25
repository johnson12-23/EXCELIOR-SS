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

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("contact_messages").insert({ name, email, topic, message }).select("id").single();
  if (error || !data) {
    console.error("Contact message could not be saved", error?.code, error?.message);
    return NextResponse.json({ error: "Our message inbox is being set up. Please contact us by email or phone for now." }, { status: 503 });
  }

  // Email notification is optional: database delivery remains successful if Resend is not configured.
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.RESEND_FROM_EMAIL;
  const recipient = process.env.QUOTE_NOTIFICATION_EMAIL || "infoexceliorss@gmail.com";
  if (apiKey && sender) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: sender, to: [recipient], reply_to: email, subject: `Website contact: ${topics[topic]} — ${name}`, text: [`Name: ${name}`, `Email: ${email}`, `Topic: ${topics[topic]}`, "", "Message:", message].join("\n") }),
      });
      if (!response.ok) console.error("Contact notification email failed", response.status);
    } catch (error) { console.error("Contact notification email failed", error instanceof Error ? error.message : "Unknown error"); }
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
