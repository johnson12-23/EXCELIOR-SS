import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const services = new Set([
  "Home cleaning",
  "Commercial cleaning",
  "Deep cleaning",
  "Shallow cleaning",
  "Post-renovation cleaning",
  "Floor cleaning and polishing",
  "Something else",
]);

type ResendEmail = {
  to: string[];
  subject: string;
  text: string;
  reply_to?: string;
};

async function sendEmail(apiKey: string, from: string, message: ResendEmail, idempotencyKey: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ from, ...message }),
  });
  if (!response.ok) {
    const error = await response.text();
    console.error("Quote notification email was rejected", response.status, error.slice(0, 500));
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Please send a valid request." }, { status: 400 });
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Please send a valid request." }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";
  const service = typeof body.service === "string" ? body.service.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !services.has(service) || !message || message.length > 2000) {
    return NextResponse.json({ error: "Please check your name, email, service and space details, then try again." }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.QUOTE_NOTIFICATION_EMAIL;
  const senderEmail = process.env.RESEND_FROM_EMAIL;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Quote requests are temporarily unavailable. Please try again later or contact us directly." }, { status: 503 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.from("quote_requests").insert({
      name,
      email,
      phone: phone || null,
      service,
      message,
    }).select("id").single();

    if (error || !data?.id) {
      console.error("Unable to save quote request", error?.message ?? "The inserted request did not return an id.");
      return NextResponse.json({ error: "We couldn’t save your request. Please try again shortly." }, { status: 500 });
    }

    if (resendKey && notificationEmail && senderEmail) {
      const reference = String(data.id);
      const details = [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone || "Not provided"}`, `Service: ${service}`, "", "Space details:", message].join("\n");
      const [businessSent, clientSent] = await Promise.all([
        sendEmail(resendKey, senderEmail, {
          to: [notificationEmail],
          reply_to: email,
          subject: `New quote request: ${service} — ${name}`,
          text: details,
        }, `quote-${reference}-business`),
        sendEmail(resendKey, senderEmail, {
          to: [email],
          subject: "We’ve received your Excelior quote request",
          text: `Hi ${name},\n\nThanks for sharing your space details with Excelior Solutions Services. We’ve received your request for ${service} and will be in touch soon.\n\nHere’s a copy of the details you sent:\n\n${details}\n\nExcelior Solutions Services`,
        }, `quote-${reference}-client`),
      ]);

      if (!businessSent || !clientSent) {
        return NextResponse.json({ error: "We saved your request, but couldn’t send all confirmation emails. Please contact us directly so we can follow up." }, { status: 502 });
      }
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Unable to process quote request", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "We couldn’t process your request right now. Please try again shortly." }, { status: 500 });
  }
}
