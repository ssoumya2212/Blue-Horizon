import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://unrzzlidycgtptvsdmck.supabase.co";

const supabaseKey = "sb_publishable_KNe7DjrRzyEEDt7ONnyVGQ_Hxndmhm2";

export const supabase = createClient(supabaseUrl, supabaseKey);
