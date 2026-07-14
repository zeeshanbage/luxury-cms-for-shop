import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Initialize Supabase client if credentials are configured
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.info(
    "[Supabase] Running in local JSON fallback mode. Environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured."
  );
}
