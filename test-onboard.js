import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://unrzzlidycgtptvsdmck.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runTest() {
  const email = "sumathi@gmail.com";
  const password = "Welcome@123";
  const parentName = "Sumathi";
  const studentName = "Arjun";
  const registerNo = "BH001";
  
  console.log("Starting onboarding test...");

  // Clean up any existing auth user with this email to avoid duplicate error
  try {
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = usersData?.users?.find(u => u.email === email);
    if (existingUser) {
      console.log(`Found existing user with email ${email}, deleting first...`);
      await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      console.log("Deleted old user successfully.");
    }
  } catch (err) {
    console.error("Error during cleanup:", err);
  }

  try {
    // 1. Create Auth User
    console.log("Step 1: Creating Auth User...");
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: parentName, role: "parent" }
    });

    if (authError) {
      console.error("Auth User Creation Failed:", authError.message);
      return;
    }
    const authUser = authData.user;
    console.log("Auth User Created: ID =", authUser.id);

    // 2. Create Profile
    console.log("Step 2: Inserting Profile...");
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authUser.id,
        full_name: parentName,
        parent_name: parentName,
        email,
        phone: null,
        role: "parent",
        status: "approved",
        password_changed: false,
        created_by_admin: true,
        student_name: studentName,
        student_roll_no: registerNo,
      });

    if (profileError) {
      console.error("Profile Insertion Failed:", profileError.message, profileError.details, profileError.hint);
      await supabaseAdmin.auth.admin.deleteUser(authUser.id);
      return;
    }
    console.log("Profile Inserted Successfully.");

    // 3. Create Parent entry
    console.log("Step 3: Inserting Parent...");
    const { error: parentError } = await supabaseAdmin
      .from("parents")
      .insert({
        id: authUser.id,
        auth_user_id: authUser.id,
        parent_name: parentName,
        email: email,
        phone: null,
        father_name: null,
        mother_name: null,
        address: null,
      });

    if (parentError) {
      console.error("Parent Insertion Failed:", parentError.message, parentError.details, parentError.hint);
      await supabaseAdmin.auth.admin.deleteUser(authUser.id);
      return;
    }
    console.log("Parent Inserted Successfully.");

    // 4. Create Student entry
    console.log("Step 4: Inserting Student...");
    const dbStudent = {
      name: studentName,
      student_name: studentName,
      student_roll_no: registerNo,
      roll_number: registerNo,
      class: "",
      section: "",
      pickup_address: "",
      drop_address: "",
      parent_phone: "",
      parent_id: authUser.id,
      assigned_parent_id: authUser.id,
      bus_id: null,
      assigned_bus: null,
      route_id: null,
      assigned_driver: null,
      status: "pending",
      last_updated: new Date().toISOString(),
    };

    const { data: studentData, error: studentError } = await supabaseAdmin
      .from("students")
      .insert([dbStudent])
      .select();

    if (studentError) {
      console.error("Student Insertion Failed:", studentError.message, studentError.details, studentError.hint);
      await supabaseAdmin.auth.admin.deleteUser(authUser.id);
      return;
    }
    console.log("Student Inserted Successfully. Student ID =", studentData?.[0]?.id);
    console.log("ONBOARDING TEST SUCCESSFUL!");

  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

runTest();
