import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const defaults = ["Home cleaning", "Commercial cleaning", "Deep cleaning", "Shallow cleaning", "Post-renovation cleaning", "Floor cleaning and polishing", "Something else"];

export async function GET() {
  try {
    const { data, error } = await createSupabaseServerClient().from("service_catalog").select("id,name,description,price_label,image_path,active,sort_order").eq("active", true).order("sort_order");
    if (!error && data) return NextResponse.json({ services: data });
  } catch { /* Public quote intake keeps working while the dashboard migration is applied. */ }
  return NextResponse.json({ services: defaults.map((name, sort_order) => ({ id: name, name, description: "", price_label: "Custom quote", image_path: null, active: true, sort_order })) });
}
