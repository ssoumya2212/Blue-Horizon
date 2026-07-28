import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "C:/Users/soumy/OneDrive/Desktop/PDD/web_app/.env" });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("Updating passwords...");
  const emails = ["driver.mike@example.com", "parent.sarah@example.com", "parent.tony@example.com"];
  
  const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError);
    return;
  }
  
  for (const email of emails) {
    const user = users.users.find(u => u.email === email);
    if (user) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, { password: "123456SZ" });
      if (!error) {
        console.log("Updated password for", email, "to 123456SZ");
      } else {
        console.error("Error updating", email, ":", error);
      }
    }
  }
  console.log("Done!");
}
main();
