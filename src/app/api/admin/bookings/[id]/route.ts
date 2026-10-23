import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-api";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const statuses = new Set(["pending", "confirmed", "in_progress", "completed", "cancelled"]);
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = authorizeAdminRequest(request, true); if (denied) return denied;
  const { id } = await context.params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid update." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.status === "string") { if (!statuses.has(body.status)) return NextResponse.json({ error: "Invalid booking status." }, { status: 400 }); update.status = body.status; }
  if (typeof body.internal_note === "string") { if (body.internal_note.length > 3000) return NextResponse.json({ error: "Notes must be under 3,000 characters." }, { status: 400 }); update.internal_note = body.internal_note.trim(); }
  if (body.requested_date === null || typeof body.requested_date === "string") {
    if (body.requested_date && !/^\d{4}-\d{2}-\d{2}$/.test(body.requested_date)) return NextResponse.json({ error: "Choose a valid preferred date." }, { status: 400 });
    update.requested_date = body.requested_date || null;
  }
  if (body.requested_time === null || typeof body.requested_time === "string") {
    if (body.requested_time && !/^\d{2}:\d{2}$/.test(body.requested_time)) return NextResponse.json({ error: "Choose a valid preferred time." }, { status: 400 });
    update.requested_time = body.requested_time || null;
  }
  if (Object.keys(update).length === 1) return NextResponse.json({ error: "No changes were provided." }, { status: 400 });
  const { data, error } = await createSupabaseServerClient().from("quote_requests").update(update).eq("id", id).select("id,name,email,phone,service,message,created_at,status,requested_date,requested_time,location,internal_note,updated_at").single();
  if (error) { console.error("Unable to update quote request", error.code); return NextResponse.json({ error: "The booking could not be updated. Check that the latest database schema has been applied." }, { status: 400 }); }
  return NextResponse.json({ booking: data });
}
