import { createClient } from "@supabase/supabase-js";

// Provide fallback dummy values to prevent catastrophic SSR crashes
// if environment variables are missing at build time.
// @ts-ignore
const cfEnv = globalThis.__CF_ENV__ || {};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || cfEnv.VITE_SUPABASE_URL || "https://missing-env.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || cfEnv.VITE_SUPABASE_ANON_KEY || "missing-key";

export const supabase = createClient(supabaseUrl, supabaseKey);
