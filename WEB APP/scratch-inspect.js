import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://unrzzlidycgtptvsdmck.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log(
  "Supabase Key Type:",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "Service Role" : "Anon Key",
);

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable(tableName) {
  const { data, error, count } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true });

  if (error) {
    console.log(`Table "${tableName}": ERROR - ${error.message}`);
  } else {
    console.log(`Table "${tableName}": EXISTS, count = ${count}`);
    // Fetch a sample row
    const { data: sample, error: sampleErr } = await supabase
      .from(tableName)
      .select("*")
      .limit(1);
    if (sample && sample.length > 0) {
      console.log(`  Sample row keys:`, Object.keys(sample[0]));
    } else {
      console.log(`  Empty table`);
    }
  }
}

async function run() {
  const tables = [
    "profiles",
    "students",
    "buses",
    "routes",
    "drop_logs",
    "bus_locations",
    "notifications",
    "parents",
    "drivers",
    "pickup_logs",
    "tracking_history",
    "trips",
  ];
  for (const t of tables) {
    await inspectTable(t);
  }
}

run().catch(console.error);
