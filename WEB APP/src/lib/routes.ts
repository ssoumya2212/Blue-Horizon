import { useEffect, useState } from "react";
import { supabase } from "./supabase";

type RouteRow = {
  id: string;
  name: string;
  description?: string | null;
};

type BusRow = {
  id: string;
  route_id?: string | null;
  route_name?: string | null;
  driver_id?: string | null;
  driver_name?: string | null;
};

type StudentRow = {
  id: string;
  route_id?: string | null;
};

type ProfileRow = {
  id: string;
  full_name: string;
  role: string;
};

type DriverOptionRow = {
  id: string;
  full_name: string;
  status?: string | null;
};

type StudentOptionRow = {
  id: string;
  name: string;
  student_roll_no?: string | null;
  bus_id?: string | null;
  route_id?: string | null;
};

export type BusRoute = {
  id?: string;
  name: string;
  stops: number;
  students: number;
  bus: string;
  busId?: string;
  driver: string;
  driverId?: string;
  start?: string;
  end?: string;
  stopNames: string[];
};

type SaveRouteInput = {
  name: string;
  stopNames: string[];
  busId?: string;
  driverId?: string;
};

export function parseRouteDescription(description?: string | null) {
  const text = (description || "").trim();
  if (!text) {
    return { start: "", end: "", stopNames: [] as string[] };
  }

  const jsonMatch = text.match(/^stops_json:(\[.*\])$/s);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (Array.isArray(parsed)) {
        const stopNames = parsed
          .map((value) => String(value || "").trim())
          .filter(Boolean);
        return {
          start: stopNames[0] || "",
          end: stopNames[stopNames.length - 1] || "",
          stopNames,
        };
      }
    } catch {
      // Fall through to legacy parsing
    }
  }

  if (text.includes(" to ")) {
    const parts = text
      .split(" to ")
      .map((part) => part.trim())
      .filter(Boolean);
    return {
      start: parts[0] || "",
      end: parts[parts.length - 1] || "",
      stopNames: parts,
    };
  }

  return {
    start: text,
    end: text,
    stopNames: text ? [text] : [],
  };
}

function serializeRouteDescription(stopNames: string[]) {
  return `stops_json:${JSON.stringify(stopNames)}`;
}

async function syncRouteAssignments(
  routeId: string,
  busId?: string,
  driverId?: string,
) {
  const selectedBusId = busId?.trim() || "";
  const selectedDriverId = driverId?.trim() || "";

  const { data: routeRow } = await supabase
    .from("routes")
    .select("name")
    .eq("id", routeId)
    .single();

  const routeName = routeRow?.name || "Unassigned";

  const { data: driverProfiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "driver");

  const driverName =
    driverProfiles?.find((profile) => profile.id === selectedDriverId)
      ?.full_name || "Unassigned";

  await supabase
    .from("buses")
    .update({ route_id: null, route_name: "Unassigned" })
    .eq("route_id", routeId);

  await supabase
    .from("students")
    .update({ route_id: null, bus_id: null })
    .eq("route_id", routeId);

  if (!selectedBusId) {
    return;
  }

  await supabase
    .from("buses")
    .update({ route_id: null, route_name: "Unassigned" })
    .eq("id", selectedBusId)
    .neq("route_id", routeId);

  if (selectedDriverId) {
    await supabase
      .from("buses")
      .update({ driver_id: null, driver_name: "Unassigned" })
      .eq("driver_id", selectedDriverId)
      .neq("id", selectedBusId);

    await supabase
      .from("profiles")
      .update({ bus_id: null })
      .eq("role", "driver")
      .eq("bus_id", selectedBusId)
      .neq("id", selectedDriverId);
  }

  await supabase
    .from("buses")
    .update({
      route_id: routeId,
      route_name: routeName,
      driver_id: selectedDriverId || null,
      driver_name: selectedDriverId ? driverName : "Unassigned",
    })
    .eq("id", selectedBusId);

  const { data: assignedStudents } = await supabase
    .from("students")
    .select("id")
    .eq("bus_id", selectedBusId);

  if (assignedStudents?.length) {
    await supabase
      .from("students")
      .update({ route_id: routeId })
      .eq("bus_id", selectedBusId);
  }

  if (selectedDriverId) {
    await supabase
      .from("profiles")
      .update({ bus_id: selectedBusId })
      .eq("id", selectedDriverId);
  }
}

async function fetchRoutesSnapshot(): Promise<BusRoute[]> {
  const [
    { data: dbRoutes },
    { data: buses },
    { data: students },
    { data: profiles },
  ] = await Promise.all([
    supabase.from("routes").select("*").order("name"),
    supabase.from("buses").select("*"),
    supabase.from("students").select("id, route_id"),
    supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("role", "driver"),
  ]);

  const routeRows = (dbRoutes || []) as RouteRow[];
  const busRows = (buses || []) as BusRow[];
  const studentRows = (students || []) as StudentRow[];
  const driverRows = (profiles || []) as ProfileRow[];

  return routeRows.map((route) => {
    const bus = busRows.find((item) => item.route_id === route.id);
    const parsed = parseRouteDescription(route.description);
    const assignedDriver =
      driverRows.find((driver) => driver.id === bus?.driver_id)?.full_name ||
      bus?.driver_name ||
      "Unassigned";

    return {
      id: route.id,
      name: route.name,
      stops: parsed.stopNames.length,
      students: studentRows.filter((student) => student.route_id === route.id)
        .length,
      bus: bus?.id || "—",
      busId: bus?.id || "",
      driver: assignedDriver,
      driverId: bus?.driver_id || "",
      start: parsed.start,
      end: parsed.end,
      stopNames: parsed.stopNames,
    };
  });
}

export function useRoutes() {
  const [routes, setRoutes] = useState<BusRoute[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      const combined = await fetchRoutesSnapshot();
      setRoutes(combined);
    };

    fetchRoutes();
    const sub1 = supabase
      .channel(`routes_ch_${Math.random()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "routes" },
        fetchRoutes,
      )
      .subscribe();
    const sub2 = supabase
      .channel(`buses_ch_${Math.random()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buses" },
        fetchRoutes,
      )
      .subscribe();
    const sub3 = supabase
      .channel(`students_ch_${Math.random()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        fetchRoutes,
      )
      .subscribe();
    const sub4 = supabase
      .channel(`drivers_profiles_ch_${Math.random()}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: "role=eq.driver",
        },
        fetchRoutes,
      )
      .subscribe();

    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
      sub3.unsubscribe();
      sub4.unsubscribe();
    };
  }, []);

  return routes;
}

export async function addRoute(input: SaveRouteInput) {
  const stopNames = input.stopNames.map((stop) => stop.trim()).filter(Boolean);

  const { data: routeData, error } = await supabase
    .from("routes")
    .insert({
      name: input.name.trim(),
      description: serializeRouteDescription(stopNames),
    })
    .select()
    .single();

  if (error) throw error;
  await syncRouteAssignments(routeData.id, input.busId, input.driverId);
  return routeData;
}

export async function updateRoute(routeId: string, input: SaveRouteInput) {
  const stopNames = input.stopNames.map((stop) => stop.trim()).filter(Boolean);

  const { error } = await supabase
    .from("routes")
    .update({
      name: input.name.trim(),
      description: serializeRouteDescription(stopNames),
    })
    .eq("id", routeId);

  if (error) throw error;
  await syncRouteAssignments(routeId, input.busId, input.driverId);
  return true;
}

export async function deleteRoute(routeId: string) {
  await supabase
    .from("buses")
    .update({ route_id: null, route_name: "Unassigned" })
    .eq("route_id", routeId);

  await supabase
    .from("students")
    .update({ route_id: null })
    .eq("route_id", routeId);

  const { error } = await supabase.from("routes").delete().eq("id", routeId);
  if (error) throw error;
  return true;
}

export async function getRouteAssignmentOptions() {
  const [{ data: buses }, { data: drivers }, { data: students }] =
    await Promise.all([
      supabase
        .from("buses")
        .select("id, route_id, route_name, driver_id, driver_name")
        .order("id"),
      supabase
        .from("profiles")
        .select("id, full_name, status")
        .eq("role", "driver")
        .order("full_name"),
      supabase
        .from("students")
        .select("id, name, student_roll_no, bus_id, route_id")
        .order("name"),
    ]);

  return {
    buses: (buses || []) as BusRow[],
    drivers: ((drivers || []) as DriverOptionRow[]).filter(
      (driver) => driver.status !== "disabled",
    ),
    students: (students || []) as StudentOptionRow[],
  };
}
