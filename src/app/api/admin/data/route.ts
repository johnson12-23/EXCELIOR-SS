import { NextResponse } from "next/server";
import { getSessionFromCookieHeader } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  if (!getSessionFromCookieHeader(request.headers.get("cookie"))) return NextResponse.json({ error: "Admin sign-in required." }, { status: 401 });
  try {
    const supabase = createSupabaseServerClient();
    const [bookings, services, team, settings, payments] = await Promise.all([
      supabase.from("quote_requests").select("id,name,email,phone,service,message,created_at,status,requested_date,requested_time,location,internal_note,updated_at").order("created_at", { ascending: false }).limit(2000),
      supabase.from("service_catalog").select("id,name,description,price_label,image_path,active,sort_order").order("sort_order"),
      supabase.from("team_members").select("id,name,email,phone,role,active,created_at").order("created_at", { ascending: false }),
      supabase.from("business_settings").select("company_name,business_email,business_phone,service_areas,booking_policy,email_notifications").eq("id", 1).maybeSingle(),
      supabase.from("payment_transactions").select("id,quote_request_id,provider,reference,amount_minor,currency,status,verified_at,created_at").order("created_at", { ascending: false }),
    ]);
    const error = bookings.error || services.error || team.error || settings.error || payments.error;
    if (error) {
      console.error("Admin dashboard data query failed", error.code, error.message);
      return NextResponse.json({ error: "The admin database is not ready. Run the latest supabase/schema.sql in your Supabase SQL editor, then reload this page." }, { status: 503 });
    }
    return NextResponse.json({ bookings: bookings.data ?? [], services: services.data ?? [], team: team.data ?? [], settings: settings.data, payments: payments.data ?? [] });
  } catch (error) {
    console.error("Admin dashboard request failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to load admin data. Check the Supabase server configuration." }, { status: 503 });
  }
}
