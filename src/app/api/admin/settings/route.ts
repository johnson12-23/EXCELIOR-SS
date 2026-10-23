import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-api";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function PATCH(request: Request) {
  const denied = authorizeAdminRequest(request, true); if (denied) return denied;
  let body: Record<string, unknown>; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid settings." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid settings." }, { status: 400 });
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const limits = { company_name: 160, business_email: 254, business_phone: 40, service_areas: 1000, booking_policy: 3000 };
  for (const key of ["company_name", "business_email", "business_phone", "service_areas", "booking_policy"] as const) {
    if (typeof body[key] === "string") {
      const value = body[key].trim();
      if (value.length > limits[key] || (key === "company_name" && !value) || (key === "business_email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) return NextResponse.json({ error: "Check the business details and field lengths." }, { status: 400 });
      update[key] = value;
    }
  }
  if (typeof body.email_notifications === "boolean") update.email_notifications = body.email_notifications;
  if (Object.keys(update).length === 1) return NextResponse.json({ error: "No settings were provided." }, { status: 400 });
  const { data, error } = await createSupabaseServerClient().from("business_settings").upsert({ id: 1, ...update }).select().single();
  if (error) return NextResponse.json({ error: "Unable to save business settings." }, { status: 400 });
  return NextResponse.json({ settings: data });
}
