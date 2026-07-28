import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable(tableName) {
  const { data, error, count } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.log(`Table "${tableName}": ERROR - ${error.message}`);
  } else {
    console.log(`Table "${tableName}": EXISTS, count = ${count}`);
    // Fetch a sample row
    const { data: sample, error: sampleErr } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    if (sample && sample.length > 0) {
      console.log(`  Sample row keys:`, Object.keys(sample[0]));
      console.log(`  Sample row:`, sample[0]);
    } else {
      console.log(`  Empty table`);
    }
  }
}

async function run() {
  const tables = ['profiles', 'students'];
  for (const t of tables) {
    await inspectTable(t);
  }
}

run().catch(console.error);
