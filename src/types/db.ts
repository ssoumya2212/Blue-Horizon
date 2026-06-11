export type StudentStatus = "pending" | "picked" | "dropped" | "absent";

export interface Student {
  id: string;
  name: string;
  student_roll_no: string;
  pickup_address: string;
  drop_address: string;
  parent_phone: string;
  bus_id: string;
  status: StudentStatus;
  last_updated: string;
}

export interface Bus {
  id: string;
  driver_name: string;
  route_name: string;
  status: string;
  speed_kmh: number;
  next_stop: string;
  last_updated: string;
}

export interface DropLog {
  id: string;
  student_id: string;
  bus_id: string;
  status: StudentStatus;
  location_name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  student_name?: string;
  student_roll_no?: string;
  email: string;
  phone?: string;
  role: "parent" | "driver" | "admin";
  bus_id?: string;
  created_at: string;
}
