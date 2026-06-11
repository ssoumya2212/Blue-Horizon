import { supabase } from "../lib/supabase";

export const getBuses = async () => {
  const { data, error } = await supabase.from("buses").select("*").order("id");

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};

export const addBus = async (bus: any) => {
  // Extract route ID if we have a match
  let routeId = bus.route_id || null;
  let routeName = bus.route || bus.route_name || "Unassigned";

  if (routeId && routeName === "Unassigned") {
    try {
      const { data: routeData } = await supabase
        .from("routes")
        .select("name")
        .eq("id", routeId)
        .single();
      if (routeData && routeData.name) {
        routeName = routeData.name;
      }
    } catch (e) {
      console.error("Error looking up route name:", e);
    }
  } else if (bus.route && !routeId) {
    const { data: routeData } = await supabase
      .from("routes")
      .select("id")
      .eq("name", bus.route)
      .limit(1);
    if (routeData && routeData.length > 0) {
      routeId = routeData[0].id;
    }
  }

  const dbBus = {
    id:
      bus.id || bus.busNumber || String(Math.floor(100 + Math.random() * 900)),
    route_id: routeId,
    route_name: routeName,
    driver_id: bus.driver_id || null,
    driver_name: bus.driver_name || "Unassigned",
    capacity: Number(bus.capacity || 40),
    status: bus.status || "Active",
    speed_kmh: bus.speed_kmh !== undefined ? bus.speed_kmh : 0,
    next_stop: bus.next_stop || "Not Started",
    last_updated: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("buses").insert([dbBus]).select();

  if (error) {
    console.error("Error adding bus:", error);
    return null;
  }

  return data;
};

export const updateBus = async (id: string, bus: any) => {
  const dbBus: any = {};
  if (bus.route_id !== undefined) dbBus.route_id = bus.route_id || null;
  if (bus.route_name !== undefined) dbBus.route_name = bus.route_name;
  if (bus.driver_id !== undefined) dbBus.driver_id = bus.driver_id || null;
  if (bus.driver_name !== undefined) dbBus.driver_name = bus.driver_name;
  if (bus.capacity !== undefined) dbBus.capacity = Number(bus.capacity);
  if (bus.status !== undefined) dbBus.status = bus.status;
  if (bus.speed_kmh !== undefined) dbBus.speed_kmh = Number(bus.speed_kmh);
  if (bus.next_stop !== undefined) dbBus.next_stop = bus.next_stop;
  dbBus.last_updated = new Date().toISOString();

  const { data, error } = await supabase
    .from("buses")
    .update(dbBus)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating bus:", error);
    return null;
  }

  return data;
};

export const deleteBus = async (id: string) => {
  // Clear driver's bus reference in profiles and students
  await supabase.from("profiles").update({ bus_id: null }).eq("bus_id", id);
  await supabase.from("students").update({ bus_id: null }).eq("bus_id", id);

  const { error } = await supabase.from("buses").delete().eq("id", id);

  if (error) {
    console.error("Error deleting bus:", error);
    return false;
  }

  return true;
};
