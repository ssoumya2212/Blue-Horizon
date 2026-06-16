import { supabase } from "../lib/supabase";

export const getPassengers = async () => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("name");

  if (error) {
    console.log(error);
    return [];
  }

  // Map database columns to fields expected by frontend
  return data.map((s: any) => ({
    id: s.id,
    name: s.name,
    student_roll_no: s.student_roll_no || "",
    class: s.class || "N/A",
    section: s.section || "",
    stop: s.drop_address || s.pickup_address || "",
    pickup_address: s.pickup_address || "",
    drop_address: s.drop_address || "",
    parent_phone: s.parent_phone || "",
    parent_id: s.parent_id || "",
    bus_id: s.bus_id || "",
    route_id: s.route_id || "",
    status: s.status || "pending",
    last_updated: s.last_updated,
  }));
};

export const addPassenger = async (student: any) => {
  const dbStudent = {
    name: student.name,
    student_roll_no: student.student_roll_no || null,
    class: student.class || "",
    section: student.section || "",
    pickup_address: student.pickup_address || student.stop || "Main Road",
    drop_address: student.drop_address || student.stop || "Main Road",
    parent_phone: student.parent_phone || "",
    parent_id: student.parent_id || null,
    bus_id: student.bus_id || null,
    route_id: student.route_id || null,
    status: "pending",
    last_updated: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("students")
    .insert([dbStudent])
    .select();

  if (error) {
    console.error("Error adding student:", error);
    return null;
  }

  return data;
};

export const updatePassenger = async (id: string, student: any) => {
  const dbStudent: any = {};
  if (student.name !== undefined) dbStudent.name = student.name;
  if (student.student_roll_no !== undefined)
    dbStudent.student_roll_no = student.student_roll_no;
  if (student.class !== undefined) dbStudent.class = student.class;
  if (student.section !== undefined) dbStudent.section = student.section;
  if (student.pickup_address !== undefined)
    dbStudent.pickup_address = student.pickup_address;
  if (student.drop_address !== undefined)
    dbStudent.drop_address = student.drop_address;
  if (student.stop !== undefined) {
    dbStudent.pickup_address = student.stop;
    dbStudent.drop_address = student.stop;
  }
  if (student.parent_phone !== undefined)
    dbStudent.parent_phone = student.parent_phone;
  if (student.parent_id !== undefined)
    dbStudent.parent_id = student.parent_id || null;
  if (student.bus_id !== undefined) dbStudent.bus_id = student.bus_id || null;
  if (student.route_id !== undefined)
    dbStudent.route_id = student.route_id || null;
  if (student.status !== undefined) dbStudent.status = student.status;
  dbStudent.last_updated = new Date().toISOString();

  const { data, error } = await supabase
    .from("students")
    .update(dbStudent)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating student:", error);
    return null;
  }

  return data;
};

export const deletePassenger = async (id: string) => {
  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) {
    console.error("Error deleting student:", error);
    return false;
  }

  return true;
};
