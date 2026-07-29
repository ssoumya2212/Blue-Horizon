import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import {
  adminUpdateUser,
  adminDeleteUser,
  adminDisableUser,
  adminAddDriver,
  adminResetPassword,
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
  license_expiry?: string;
  license_document_url?: string;
};

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
    const { data: driversData } = await supabase.from("drivers").select("*");

    const mapped = (profiles || []).map((p) => {
      const bus = buses?.find((b) => b.driver_id === p.id || b.id === p.bus_id);
      const drv = driversData?.find((d) => d.id === p.id);
      return {
        id: p.id,
        name: p.full_name,
        email: p.email,
        phone: p.phone || "",
        licence: p.licence || drv?.license_number || "",
        status: (p.status || "approved") as DriverStatus,
        route: bus ? bus.route_name || `Bus ${bus.id} Route` : "Unassigned",
        bus_id: bus ? bus.id : p.bus_id || "",
        blood_group: drv ? drv.blood_group || "" : "",
        medical_certificate_url: drv ? drv.medical_certificate_url || "" : "",
        license_expiry: drv ? drv.license_expiry || "" : "",
        license_document_url: drv ? drv.license_document_url || "" : "",
      };
    });

    globalDrivers = mapped;
    listeners.forEach((listener) => listener(globalDrivers));
    return mapped;
  } catch (err) {
    console.error("Error fetching drivers:", err);
    return globalDrivers;
  }
}

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>(globalDrivers);

  useEffect(() => {
    listeners.add(setDrivers);
    fetchDriversList();

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

    const channel3 = supabase
      .channel("realtime_drivers_documents_lib")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "drivers" },
        () => {
          fetchDriversList();
        },
      )
      .subscribe();

    return () => {
      listeners.delete(setDrivers);
      channel1.unsubscribe();
      channel2.unsubscribe();
      channel3.unsubscribe();
    };
  }, []);

  return drivers;
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
  licenseDocumentUrl?: string;
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
    },
  });

  if (!res.success) {
    toast.error(`Failed to create driver: ${res.error}`);
    return null;
  }

  if (data.licenseDocumentUrl) {
    await supabase
      .from("drivers")
      .update({ license_document_url: data.licenseDocumentUrl })
      .eq("id", res.user.id);
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
    licenseExpiry?: string;
    medicalCertificateUrl?: string;
    licenseDocumentUrl?: string;
  },
) {
  const metadata: Record<string, string | DriverStatus | null> = {};
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
    },
  });

  if (!res.success) {
    toast.error(`Failed to update driver: ${res.error}`);
    return false;
  }

  const driverPayload = {
    id,
    license_number: data.licence || null,
    license_expiry: data.licenseExpiry || null,
    medical_certificate_url: data.medicalCertificateUrl || null,
    license_document_url: data.licenseDocumentUrl || null,
  };

  const { error: driverTableError } = await supabase
    .from("drivers")
    .upsert(driverPayload, { onConflict: "id" });

  if (driverTableError) {
    toast.error(`Failed to update driver documents: ${driverTableError.message}`);
    return false;
  }

  if (data.bus_id !== undefined) {
    const { error: clearBusError } = await supabase
      .from("buses")
      .update({ driver_id: null, driver_name: "Unassigned" })
      .eq("driver_id", id);

    if (clearBusError) {
      toast.error(`Failed to clear old bus assignment: ${clearBusError.message}`);
      return false;
    }

    if (data.bus_id) {
      const { error: assignBusError } = await supabase
        .from("buses")
        .update({ driver_id: id, driver_name: data.name || "Driver" })
        .eq("id", data.bus_id);

      if (assignBusError) {
        toast.error(`Failed to assign new bus: ${assignBusError.message}`);
        return false;
      }
    }
  } else if (data.name) {
    const { error: renameBusError } = await supabase
      .from("buses")
      .update({ driver_name: data.name })
      .eq("driver_id", id);

    if (renameBusError) {
      toast.error(`Failed to update driver name on buses: ${renameBusError.message}`);
      return false;
    }
  }

  await fetchDriversList();
  toast.success("Driver updated successfully!");
  return true;
}

export async function updateDriverStatus(id: string, status: DriverStatus) {
  let res;
  if (status === "disabled") {
    const token = (await supabase.auth.getSession()).data.session?.access_token || "";
    res = await adminDisableUser({ data: { token, id, disable: true } });
  } else {
    const { data: profile } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", id)
      .single();
    if (profile?.status === "disabled") {
      const token = (await supabase.auth.getSession()).data.session?.access_token || "";
      await adminDisableUser({ data: { token, id, disable: false } });
    }
    const token = (await supabase.auth.getSession()).data.session?.access_token || "";
    res = await adminUpdateUser({
      data: {
        token,
        id,
        metadata: { status },
      },
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

export async function resetDriverPassword(id: string, password?: string) {
  const token = (await supabase.auth.getSession()).data.session?.access_token || "";
  const res = await adminResetPassword({ data: { token, id, password } });
  if (!res.success) {
    toast.error(`Failed to reset password: ${res.error}`);
    return false;
  }

  toast.success("Password reset to: 12345678", {
    description: "The user will be prompted to change it on their next login.",
    duration: 10000,
  });
  return true;
}
