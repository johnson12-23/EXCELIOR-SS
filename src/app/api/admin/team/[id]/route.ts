import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-api";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = authorizeAdminRequest(request, true); if (denied) return denied;
  const { id } = await context.params;
  let body: Record<string, unknown>; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid update." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  const update: Record<string, unknown> = {};
  const limits = { name: 120, email: 254, phone: 40, role: 100 };
  for (const key of ["name", "email", "phone", "role"] as const) if (typeof body[key] === "string") {
    const value = body[key].trim();
    if (value.length > limits[key] || (key === "name" && !value) || (key === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) return NextResponse.json({ error: "Check the team member details and field lengths." }, { status: 400 });
    update[key] = value;
  }
  if (typeof body.active === "boolean") update.active = body.active;
  if (!Object.keys(update).length) return NextResponse.json({ error: "No changes were provided." }, { status: 400 });
  const { data, error } = await createSupabaseServerClient().from("team_members").update(update).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: "Unable to update this team member." }, { status: 400 });
  return NextResponse.json({ member: data });
}
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = authorizeAdminRequest(request, true); if (denied) return denied;
  const { id } = await context.params;
  const { error } = await createSupabaseServerClient().from("team_members").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Unable to remove team member." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
