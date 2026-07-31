import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://unrzzlidycgtptvsdmck.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_KNe7DjrRzyEEDt7ONnyVGQ_Hxndmhm2";

console.log("🚀 Supabase URL being used:", supabaseUrl);
console.log("🚀 Supabase Key length:", supabaseKey.length);

export const supabase = createClient(supabaseUrl, supabaseKey);
