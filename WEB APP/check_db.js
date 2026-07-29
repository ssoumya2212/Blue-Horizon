import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkGoldenFlow() {
  console.log("--- GOLDEN FLOW DB CHECK ---");
  
  const { data: route } = await supabaseAdmin.from("routes").select("*").eq("name", "Morning City Express").single();
  console.log("Route:", route?.name ? "OK" : "MISSING", route);

  const { data: bus } = await supabaseAdmin.from("buses").select("*").eq("id", "BUS-999").single();
  console.log("Bus:", bus?.id ? "OK" : "MISSING", bus);

  const { data: driverProfile } = await supabaseAdmin.from("profiles").select("*").eq("email", "driver.cap@gmail.com").single();
  console.log("Driver Profile:", driverProfile?.id ? "OK" : "MISSING", driverProfile);

  const { data: parentProfile } = await supabaseAdmin.from("profiles").select("*").eq("email", "parent.howard@gmail.com").single();
  console.log("Parent Profile:", parentProfile?.id ? "OK" : "MISSING", parentProfile);

  let { data: student } = await supabaseAdmin.from("students").select("*").eq("name", "Iron Man Jr.").single();
  console.log("Student:", student?.id ? "OK" : "MISSING", student);

  if (!student) {
    const { data: routeData } = await supabaseAdmin.from("routes").select("*").eq("name", "Morning City Express").single();
    const { data: rd, error: re } = await supabaseAdmin.from("students").insert({
        name: "Iron Man Jr.",
        student_name: "Iron Man Jr.",
        student_roll_no: "STU-999",
        roll_number: "STU-999",
        parent_phone: "555-8888",
        parent_id: parentProfile?.id,
        assigned_parent_id: parentProfile?.id,
        route_id: routeData?.id,
        bus_id: "BUS-999",
        status: "pending",
        pickup_address: "Stark Tower",
        drop_address: "School Campus"
    }).select().single();
    if (re) console.error("Student Insert Error:", re);
    else console.log("Student Inserted:", rd);
  }

}

checkGoldenFlow();
