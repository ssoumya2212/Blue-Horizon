import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import {
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminDisableUser,
  adminAddDriver,
} from "@/server-functions/admin_actions";
import { toast } from "sonner";

export type DriverStatus = "pending" | "approved" | "rejected" | "disabled";

export type Driver = {
  id: string;
  name: string;
  email: string;
  phone: string;
  licence: string;
  status: DriverStatus;
  route: string;
  bus_id: string;
  blood_group?: string;
  medical_certificate_url?: string;
};

// Internal list to serve as initial value if needed
let globalDrivers: Driver[] = [];
const listeners = new Set<(d: Driver[]) => void>();

export async function fetchDriversList(): Promise<Driver[]> {
  try {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "driver");

    if (error) throw error;

    const { data: buses } = await supabase.from("buses").select("*");
    
    // Fetch detailed driver info
    const { data: driversData } = await supabase.from("drivers").select("*");

    const mapped = (profiles || []).map((p) => {
      // Find a bus assigned to this driver
      const bus = buses?.find((b) => b.driver_id === p.id || b.id === p.bus_id);
      const drv = driversData?.find((d) => d.id === p.id);
      return {
        id: p.id,
        name: p.full_name,
        email: p.email,
        phone: p.phone || "",
        licence: p.licence || "",
        status: (p.status || "approved") as DriverStatus,
        route: bus ? bus.route_name || `Bus ${bus.id} Route` : "Unassigned",
        bus_id: bus ? bus.id : p.bus_id || "",
        blood_group: drv ? drv.blood_group || "" : "",
        medical_certificate_url: drv ? drv.medical_certificate_url || "" : "",
      };
    });

    globalDrivers = mapped;
    listeners.forEach((l) => l(globalDrivers));
    return mapped;
  } catch (err: any) {
    console.error("Error fetching drivers:", err);
    return globalDrivers;
  }
}

export function useDrivers() {
  const [d, setD] = useState<Driver[]>(globalDrivers);

  useEffect(() => {
    listeners.add(setD);
    fetchDriversList();

    // Subscribe to realtime updates on profiles and buses
    const channel1 = supabase
      .channel("realtime_drivers_profiles_lib")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: "role=eq.driver",
        },
        () => {
          fetchDriversList();
        },
      )
      .subscribe();

    const channel2 = supabase
      .channel("realtime_drivers_buses_lib")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buses" },
        () => {
          fetchDriversList();
        },
      )
      .subscribe();

    return () => {
      listeners.delete(setD);
      channel1.unsubscribe();
      channel2.unsubscribe();
    };
  }, []);

  return d;
}

export async function addDriver(data: {
  name: string;
  email: string;
  phone: string;
  licence: string;
  bus_id?: string;
  password?: string;
  licenseExpiry?: string;
  experience?: number;
  address?: string;
  emergencyContact?: string;
  routeId?: string;
  bloodGroup?: string;
  medicalCertificateUrl?: string;
}) {
  const token = (await supabase.auth.getSession()).data.session?.access_token || "";
  const res = await adminAddDriver({
    data: {
      token,
      fullName: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password || "123456",
      licenseNumber: data.licence,
      licenseExpiry: data.licenseExpiry,
      experience: data.experience,
      address: data.address,
      emergencyContact: data.emergencyContact,
      busId: data.bus_id,
      routeId: data.routeId,
      bloodGroup: data.bloodGroup,
      medicalCertificateUrl: data.medicalCertificateUrl,
    }
  });

  if (!res.success) {
    toast.error(`Failed to create driver: ${res.error}`);
    return null;
  }

  toast.success("Driver created and linked successfully!");
  fetchDriversList();
  return res.user;
}

export async function updateDriver(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    licence?: string;
    bus_id?: string;
    status?: DriverStatus;
  },
) {
  const metadata: any = {};
  if (data.licence !== undefined) metadata.licence = data.licence;
  if (data.bus_id !== undefined) metadata.bus_id = data.bus_id || null;
  if (data.status !== undefined) metadata.status = data.status;

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
    toast.error(`Failed to update driver: ${res.error}`);
    return false;
  }

  // Handle bus assignment logic
  if (data.bus_id !== undefined) {
    // 1. Unassign from previous buses
    await supabase
      .from("buses")
      .update({ driver_id: null, driver_name: "Unassigned" })
      .eq("driver_id", id);

    // 2. Assign to new bus
    if (data.bus_id) {
      await supabase
        .from("buses")
        .update({ driver_id: id, driver_name: data.name || "Driver" })
        .eq("id", data.bus_id);
    }
  } else if (data.name) {
    // If name changed, update the buses table where this driver is assigned
    await supabase
      .from("buses")
      .update({ driver_name: data.name })
      .eq("driver_id", id);
  }

  toast.success("Driver updated successfully!");
  fetchDriversList();
  return true;
}

export async function updateDriverStatus(id: string, status: DriverStatus) {
  let res;
  if (status === "disabled") {
    const token = (await supabase.auth.getSession()).data.session?.access_token || "";
    res = await adminDisableUser({ data: { token, id, disable: true } });
  } else {
    // If enabling a previously disabled driver
    const { data: p } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", id)
      .single();
    if (p?.status === "disabled") {
      const token = (await supabase.auth.getSession()).data.session?.access_token || "";
      await adminDisableUser({ data: { token, id, disable: false } });
    }
    const token = (await supabase.auth.getSession()).data.session?.access_token || "";
    res = await adminUpdateUser({
      data: {
        token,
        id,
        metadata: { status },
      }
    });
  }

  if (res && !res.success) {
    toast.error(`Failed to update driver status: ${res.error}`);
    return false;
  }

  toast.success(`Driver status updated to ${status}`);
  fetchDriversList();
  return true;
}

export async function deleteDriver(id: string) {
  // 1. Unassign from any buses
  await supabase
    .from("buses")
    .update({ driver_id: null, driver_name: "Unassigned" })
    .eq("driver_id", id);

  const token = (await supabase.auth.getSession()).data.session?.access_token || "";
  const res = await adminDeleteUser({ data: { token, id } });
  if (!res.success) {
    toast.error(`Failed to delete driver: ${res.error}`);
    return false;
  }

  toast.success("Driver deleted successfully");
  fetchDriversList();
  return true;
}
