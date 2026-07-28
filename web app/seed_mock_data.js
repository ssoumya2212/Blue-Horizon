import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "C:/Users/soumy/OneDrive/Desktop/PDD/web_app/.env" });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function addDriver(name, email, phone, licence) {
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: "password123",
    email_confirm: true,
    user_metadata: { full_name: name, role: "driver" },
  });
  if (authError) return console.error("Auth Driver error:", authError);

  const authUser = authData.user;
  await supabaseAdmin.from("profiles").insert({
    id: authUser.id,
    full_name: name,
    email,
    phone,
    role: "driver",
    status: "approved",
    licence: licence,
  });

  await supabaseAdmin.from("drivers").insert({
    id: authUser.id,
    license_number: licence,
  });
  console.log("Created Driver:", name);
}

async function addParent(parentName, studentName, email, phone, rollNo) {
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: "password123",
    email_confirm: true,
    user_metadata: { full_name: parentName, role: "parent" },
  });
  if (authError) return console.error("Auth Parent error:", authError);

  const authUser = authData.user;
  await supabaseAdmin.from("profiles").insert({
    id: authUser.id,
    full_name: parentName,
    parent_name: parentName,
    email,
    phone,
    role: "parent",
    status: "approved",
    student_name: studentName,
    student_roll_no: rollNo,
  });

  await supabaseAdmin.from("parents").insert({
    id: authUser.id,
    auth_user_id: authUser.id,
    parent_name: parentName,
    email: email,
    phone: phone,
  });

  await supabaseAdmin.from("students").insert({
    name: studentName,
    student_name: studentName,
    student_roll_no: rollNo,
    roll_number: rollNo,
    parent_phone: phone,
    parent_id: authUser.id,
    assigned_parent_id: authUser.id,
    status: "pending",
  });
  console.log("Created Parent:", parentName, "with Student:", studentName);
}

async function main() {
  console.log("Starting mock data creation...");
  await addDriver("Michael Schumacher", "driver.mike@example.com", "555-0101", "DL-9876543");
  await addParent("Sarah Connor", "John Connor", "parent.sarah@example.com", "555-0202", "STU-001");
  await addParent("Tony Stark", "Morgan Stark", "parent.tony@example.com", "555-0303", "STU-002");
  console.log("Done!");
}
main();
