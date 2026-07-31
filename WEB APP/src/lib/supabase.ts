import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://unrzzlidycgtptvsdmck.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucnp6bGlkeWNndHB0dnNkbWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NDkzNzQsImV4cCI6MjA5NDEyNTM3NH0._SDVxadjxd6ocohXb8W6nbfmL2fM-4g9C3aWHL3mGtM");

console.log("🚀 Supabase URL being used:", supabaseUrl);
console.log("🚀 Supabase Key length:", supabaseKey.length);

export const supabase = createClient(supabaseUrl, supabaseKey);
