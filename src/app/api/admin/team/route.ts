import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-api";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const denied = authorizeAdminRequest(request, true); if (denied) return denied;
  let body: Record<string, unknown>; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid team details." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid team details." }, { status: 400 });
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : null;
  const phone = typeof body.phone === "string" ? body.phone.trim() : null;
  const role = typeof body.role === "string" && body.role.trim() ? body.role.trim() : "Cleaning professional";
  if (!name || name.length > 120 || (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) || (phone && phone.length > 40) || role.length > 100) return NextResponse.json({ error: "Enter a name and check the contact field lengths." }, { status: 400 });
  const { data, error } = await createSupabaseServerClient().from("team_members").insert({ name, email, phone, role, active: true }).select().single();
  if (error) return NextResponse.json({ error: "Unable to add team member." }, { status: 400 });
  return NextResponse.json({ member: data }, { status: 201 });
}
