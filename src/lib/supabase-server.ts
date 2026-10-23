import { createClient } from "@supabase/supabase-js";

export function createSupabaseServerClient() {
  const url = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server credentials are not configured.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
