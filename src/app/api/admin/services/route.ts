import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-api";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function validate(body: Record<string, unknown>) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const price_label = typeof body.price_label === "string" ? body.price_label.trim() : "Custom quote";
  const image_path = typeof body.image_path === "string" ? body.image_path.trim() : null;
  const sort_order = Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0;
  if (!name || name.length > 100 || description.length > 1000 || price_label.length > 100 || (image_path && (image_path.length > 300 || !image_path.startsWith("/")))) return null;
  return { name, description, price_label, image_path, sort_order, active: body.active !== false, updated_at: new Date().toISOString() };
}
export async function POST(request: Request) {
  const denied = authorizeAdminRequest(request, true); if (denied) return denied;
  let body: Record<string, unknown>; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid service details." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid service details." }, { status: 400 });
  const values = validate(body); if (!values) return NextResponse.json({ error: "Add a service name and check the field lengths." }, { status: 400 });
  const { data, error } = await createSupabaseServerClient().from("service_catalog").insert(values).select().single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "A service with that name already exists." : "Unable to add the service." }, { status: 400 });
  return NextResponse.json({ service: data }, { status: 201 });
}
