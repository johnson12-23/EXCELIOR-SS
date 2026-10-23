import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-api";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = authorizeAdminRequest(request, true); if (denied) return denied;
  const { id } = await context.params;
  let body: Record<string, unknown>; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid service update." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid service update." }, { status: 400 });
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.active === "boolean") update.active = body.active;
  const limits = { name: 100, description: 1000, price_label: 100 };
  for (const key of ["name", "description", "price_label"] as const) {
    if (typeof body[key] === "string") {
      const value = body[key].trim();
      if (value.length > limits[key] || (key === "name" && !value)) return NextResponse.json({ error: "Check the service name and field lengths." }, { status: 400 });
      update[key] = value;
    }
  }
  if (body.image_path === null || typeof body.image_path === "string") {
    if (typeof body.image_path === "string" && body.image_path && (!body.image_path.startsWith("/") || body.image_path.length > 300)) return NextResponse.json({ error: "Service images must use a valid local image path." }, { status: 400 });
    update.image_path = body.image_path;
  }
  if (typeof body.sort_order === "number" && Number.isFinite(body.sort_order)) update.sort_order = body.sort_order;
  if (Object.keys(update).length === 1) return NextResponse.json({ error: "No service changes were provided." }, { status: 400 });
  const { data, error } = await createSupabaseServerClient().from("service_catalog").update(update).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: "Unable to update service. Service names must be unique." }, { status: 400 });
  return NextResponse.json({ service: data });
}
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = authorizeAdminRequest(request, true); if (denied) return denied;
  const { id } = await context.params;
  const { error } = await createSupabaseServerClient().from("service_catalog").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Unable to remove the service." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
