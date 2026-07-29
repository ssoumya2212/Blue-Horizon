import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "C:/Users/soumy/OneDrive/Desktop/PDD/WEB APP/.env" });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration in .env");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_DATA = {
  routeName: "Saveetha Campus Route 01",
  routeStops: [
    "Saveetha Nagar, Thandalam",
    "Kuthambakkam Bus Stop",
    "Saveetha Engineering College Gate",
    "Saveetha Medical College",
    "Thandalam School Drop Point",
  ],
  busId: "BUS-099",
  driver: {
    name: "Arun Kumar",
    email: "driver.arun2026@gmail.com",
    password: "Arun@2026",
    phone: "9876543210",
    licence: "TN22-2026-DRV099",
  },
  parent: {
    name: "Lakshmi Priya",
    email: "parent.lakshmi2026@gmail.com",
    password: "Lakshmi@2026",
    phone: "9345678901",
  },
  student: {
    name: "Harish Kumar",
    rollNo: "SVT-2026-001",
    class: "7",
    section: "A",
    pickupAddress: "No. 12, Ganesh Avenue, Saveetha Nagar, Thandalam, Chennai - 602105",
    dropAddress: "Kuthambakkam Bus Stop, Kuthambakkam, Chennai - 602105",
  },
  busLocation: {
    latitude: 13.0094,
    longitude: 80.0111,
  },
};

function serializeStops(stops) {
  return `stops_json:${JSON.stringify(stops)}`;
}

async function findUserIdByEmail(email) {
  const { data } = await supabaseAdmin.auth.admin.listUsers();
  return data?.users?.find((user) => user.email === email)?.id || null;
}

async function ensureAuthUser({ email, password, name, role }) {
  const existingId = await findUserIdByEmail(email);
  if (existingId) {
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      existingId,
      {
        password,
        email_confirm: true,
        user_metadata: { full_name: name, role },
      },
    );
    if (updateError) throw updateError;
    return existingId;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name, role },
  });

  if (error) throw error;
  return data.user.id;
}

async function upsertRoute() {
  const payload = {
    name: TEST_DATA.routeName,
    description: serializeStops(TEST_DATA.routeStops),
  };

  const { data, error } = await supabaseAdmin
    .from("routes")
    .upsert(payload, { onConflict: "name" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function upsertBus(routeId, driverId, driverName) {
  const payload = {
    id: TEST_DATA.busId,
    route_id: routeId,
    route_name: TEST_DATA.routeName,
    driver_id: driverId,
    driver_name: driverName,
    status: "Running",
    next_stop: TEST_DATA.routeStops[1],
    last_updated: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from("buses")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function upsertDriver(driverId) {
  const profilePayload = {
    id: driverId,
    full_name: TEST_DATA.driver.name,
    email: TEST_DATA.driver.email,
    phone: TEST_DATA.driver.phone,
    role: "driver",
    status: "approved",
    licence: TEST_DATA.driver.licence,
    bus_id: null,
  };

  const driverPayloadCandidates = [
    {
      id: driverId,
      license_number: TEST_DATA.driver.licence,
      license_expiry: "2028-12-31",
      medical_certificate_url: "mock-storage/documents/medical-certificates/arun-kumar.pdf",
      license_document_url: "mock-storage/documents/driver-licenses/arun-kumar-license.pdf",
    },
    {
      id: driverId,
      license_number: TEST_DATA.driver.licence,
      license_expiry: "2028-12-31",
      medical_certificate_url: "mock-storage/documents/medical-certificates/arun-kumar.pdf",
    },
    {
      id: driverId,
      license_number: TEST_DATA.driver.licence,
      license_expiry: "2028-12-31",
    },
  ];

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .upsert(profilePayload, { onConflict: "id" });
  if (profileError) throw profileError;

  let lastDriverError = null;
  for (const payload of driverPayloadCandidates) {
    const { error: driverError } = await supabaseAdmin
      .from("drivers")
      .upsert(payload, { onConflict: "id" });

    if (!driverError) {
      return;
    }

    lastDriverError = driverError;
    if (driverError.code !== "PGRST204") {
      throw driverError;
    }
  }

  throw lastDriverError;
}

async function upsertParent(parentId) {
  const profilePayload = {
    id: parentId,
    full_name: TEST_DATA.parent.name,
    parent_name: TEST_DATA.parent.name,
    email: TEST_DATA.parent.email,
    phone: TEST_DATA.parent.phone,
    role: "parent",
    status: "approved",
    password_changed: true,
    created_by_admin: true,
    student_name: TEST_DATA.student.name,
    student_roll_no: TEST_DATA.student.rollNo,
  };

  const parentPayload = {
    id: parentId,
    auth_user_id: parentId,
    parent_name: TEST_DATA.parent.name,
    email: TEST_DATA.parent.email,
    phone: TEST_DATA.parent.phone,
    address: TEST_DATA.student.pickupAddress,
  };

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .upsert(profilePayload, { onConflict: "id" });
  if (profileError) throw profileError;

  const { error: parentError } = await supabaseAdmin
    .from("parents")
    .upsert(parentPayload, { onConflict: "id" });
  if (parentError) throw parentError;
}

async function upsertStudent(parentId, routeId) {
  const existing = await supabaseAdmin
    .from("students")
    .select("id")
    .eq("student_roll_no", TEST_DATA.student.rollNo)
    .maybeSingle();

  const studentPayload = {
    name: TEST_DATA.student.name,
    student_name: TEST_DATA.student.name,
    student_roll_no: TEST_DATA.student.rollNo,
    roll_number: TEST_DATA.student.rollNo,
    class: TEST_DATA.student.class,
    section: TEST_DATA.student.section,
    pickup_address: TEST_DATA.student.pickupAddress,
    drop_address: TEST_DATA.student.dropAddress,
    parent_phone: TEST_DATA.parent.phone,
    parent_id: parentId,
    assigned_parent_id: parentId,
    route_id: routeId,
    bus_id: TEST_DATA.busId,
    assigned_bus: TEST_DATA.busId,
    assigned_driver: TEST_DATA.driver.name,
    status: "pending",
    last_updated: new Date().toISOString(),
  };

  const query = existing.data?.id
    ? supabaseAdmin.from("students").update(studentPayload).eq("id", existing.data.id)
    : supabaseAdmin.from("students").insert(studentPayload);

  const { error } = await query;
  if (error) throw error;
}

async function upsertBusLocation() {
  const payload = {
    bus_id: TEST_DATA.busId,
    latitude: TEST_DATA.busLocation.latitude,
    longitude: TEST_DATA.busLocation.longitude,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from("bus_locations")
    .upsert(payload, { onConflict: "bus_id" });

  if (error) throw error;
}

async function main() {
  console.log("Creating one proper linked test case...");

  const route = await upsertRoute();
  const driverId = await ensureAuthUser({
    email: TEST_DATA.driver.email,
    password: TEST_DATA.driver.password,
    name: TEST_DATA.driver.name,
    role: "driver",
  });
  await upsertDriver(driverId);

  await upsertBus(route.id, driverId, TEST_DATA.driver.name);
  await supabaseAdmin
    .from("profiles")
    .update({ bus_id: TEST_DATA.busId })
    .eq("id", driverId);

  const parentId = await ensureAuthUser({
    email: TEST_DATA.parent.email,
    password: TEST_DATA.parent.password,
    name: TEST_DATA.parent.name,
    role: "parent",
  });
  await upsertParent(parentId);
  await upsertStudent(parentId, route.id);
  await upsertBusLocation();

  console.log("Done! Test case created successfully.");
  console.log("----------------------------------------");
  console.log(`Route: ${TEST_DATA.routeName}`);
  console.log(`Bus: ${TEST_DATA.busId}`);
  console.log(`Driver Login: ${TEST_DATA.driver.email} / ${TEST_DATA.driver.password}`);
  console.log(`Parent Login: ${TEST_DATA.parent.email} / ${TEST_DATA.parent.password}`);
  console.log(`Student: ${TEST_DATA.student.name} (${TEST_DATA.student.rollNo})`);
  console.log(`Location Base: Thandalam, Saveetha Nagar, Kuthambakkam, Chennai - 602105`);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
