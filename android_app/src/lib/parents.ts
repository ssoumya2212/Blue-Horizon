import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import {
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminResetPassword,
  adminAddParentWithStudent,
} from "@/server-functions/admin_actions";
import { toast } from "sonner";

export type Parent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  student_name: string;
  student_roll_no: string;
  created_at: string;
};

let globalParents: Parent[] = [];
const listeners = new Set<(p: Parent[]) => void>();

export async function fetchParentsList(): Promise<Parent[]> {
  try {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "parent");

    if (error) throw error;

    const mapped = (profiles || []).map((p) => ({
      id: p.id,
      name: p.full_name,
      email: p.email,
      phone: p.phone || "",
      student_name: p.student_name || "",
      student_roll_no: p.student_roll_no || "",
      created_at: p.created_at,
    }));

    globalParents = mapped;
    listeners.forEach((l) => l(globalParents));
    return mapped;
  } catch (err) {
    console.error("Error fetching parents:", err);
    return globalParents;
  }
}

export function useParents() {
  const [p, setP] = useState<Parent[]>(globalParents);

  useEffect(() => {
    listeners.add(setP);
    fetchParentsList();

    const channel = supabase
      .channel("realtime_parents_profiles")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: "role=eq.parent",
        },
        () => {
          fetchParentsList();
        },
      )
      .subscribe();

    return () => {
      listeners.delete(setP);
      channel.unsubscribe();
    };
  }, []);

  return p;
}

export async function addParent(data: {
  name: string;
  email: string;
  phone: string;
  student_name: string;
  student_roll_no: string;
  password?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  gender?: "male" | "female" | "other";
  dob?: string;
  class?: string;
  section?: string;
  pickupAddress?: string;
  dropAddress?: string;
  busId?: string;
  routeId?: string;
}) {
  const token = (await supabase.auth.getSession()).data.session?.access_token || "";
  const res = await adminAddParentWithStudent({
    data: {
      token,
      parentName: data.name,
      fatherName: data.fatherName,
      motherName: data.motherName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      password: data.password || "123456",
      studentName: data.student_name,
      registerNo: data.student_roll_no,
      dob: data.dob,
      gender: data.gender,
      class: data.class,
      section: data.section,
      pickupAddress: data.pickupAddress,
      dropAddress: data.dropAddress,
      busId: data.busId,
      routeId: data.routeId,
    }
  });

  if (!res.success) {
    toast.error(`Failed to create parent: ${res.error}`);
    return null;
  }

  toast.success("Parent and student onboarded successfully!");
  fetchParentsList();
  return res.user;
}

export async function updateParent(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    student_name?: string;
    student_roll_no?: string;
  },
) {
  const metadata: any = {};
  if (data.student_name !== undefined)
    metadata.student_name = data.student_name;
  if (data.student_roll_no !== undefined)
    metadata.student_roll_no = data.student_roll_no;

  const token = (await supabase.auth.getSession()).data.session?.access_token || "";
  const res = await adminUpdateUser({
    data: {
      token,
      id,
      email: data.email,
      fullName: data.name,
      phone: data.phone,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    }
  });

  if (!res.success) {
    toast.error(`Failed to update parent: ${res.error}`);
    return false;
  }

  // Update association in students table if roll number was changed
  if (data.student_roll_no) {
    // 1. Unassign from previous students
    await supabase
      .from("students")
      .update({ parent_id: null })
      .eq("parent_id", id);

    // 2. Assign to new student
    const { data: stud } = await supabase
      .from("students")
      .select("id")
      .eq("student_roll_no", data.student_roll_no)
      .single();

    if (stud) {
      await supabase
        .from("students")
        .update({ parent_id: id, parent_phone: data.phone || "" })
        .eq("id", stud.id);
    }
  }

  toast.success("Parent updated successfully!");
  fetchParentsList();
  return true;
}

export async function resetParentPassword(id: string, password?: string) {
  const token = (await supabase.auth.getSession()).data.session?.access_token || "";
  const res = await adminResetPassword({ data: { token, id, password } });
  if (!res.success) {
    toast.error(`Failed to reset password: ${res.error}`);
    return false;
  }

  toast.success("Parent password reset successfully!");
  return true;
}

export async function deleteParent(id: string) {
  // Clear reference in students
  await supabase
    .from("students")
    .update({ parent_id: null })
    .eq("parent_id", id);

  const token = (await supabase.auth.getSession()).data.session?.access_token || "";
  const res = await adminDeleteUser({ data: { token, id } });
  if (!res.success) {
    toast.error(`Failed to delete parent: ${res.error}`);
    return false;
  }

  toast.success("Parent deleted successfully");
  fetchParentsList();
  return true;
}
