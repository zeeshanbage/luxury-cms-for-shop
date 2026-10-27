import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_PUBLISHABLE_KEY || "";

// Custom fetch wrapper with a 3.5s timeout to prevent UI freeze on dead DNS / paused projects
const fetchWithTimeout: typeof fetch = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  if (options.signal) {
    options.signal.addEventListener("abort", () => controller.abort());
  }

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

// Initialize Supabase client if credentials are configured
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false, // Prevents spamming POST /auth/v1/token refresh when project is down
        persistSession: true,
        detectSessionInUrl: false,
      },
      global: {
        fetch: fetchWithTimeout,
      },
    })
  : null;

if (!supabase) {
  console.info(
    "[Supabase] Running in local JSON fallback mode. Environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured."
  );
}
