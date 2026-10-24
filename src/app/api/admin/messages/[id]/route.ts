import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-api";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = authorizeAdminRequest(request, true);
  if (denied) return denied;
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid message update." }, { status: 400 }); }
  if (typeof body.is_read !== "boolean") return NextResponse.json({ error: "Choose a valid read status." }, { status: 400 });
  const { data, error } = await createSupabaseServerClient().from("contact_messages").update({ is_read: body.is_read }).eq("id", id).select("id,is_read").maybeSingle();
  if (error || !data) return NextResponse.json({ error: "Unable to update this message." }, { status: 400 });
  return NextResponse.json({ message: data });
}
