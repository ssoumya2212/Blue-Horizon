import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type BusRoute = {
  id?: string;
  name: string;
  stops: number;
  students: number;
  bus: string;
  driver: string;
  start?: string;
  end?: string;
};

export function useRoutes() {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  useEffect(() => {
    const fetchRoutes = async () => {
      const { data: dbRoutes } = await supabase.from("routes").select("*");
      const { data: buses } = await supabase.from("buses").select("*");
      const { data: students } = await supabase
        .from("students")
        .select("route_id");

      if (!dbRoutes) return;

      const combined = dbRoutes.map((r) => {
        const bus = buses?.find((b) => b.route_id === r.id);
        const stCount =
          students?.filter((s) => s.route_id === r.id).length || 0;

        let start = "";
        let end = "";
        if (r.description && r.description.includes(" to ")) {
          const parts = r.description.split(" to ");
          start = parts[0];
          end = parts[1];
        }

        return {
          id: r.id,
          name: r.name,
          stops: 8, // Requires a stops table for real data
          students: stCount,
          bus: bus ? bus.id : "—",
          driver: bus ? bus.driver_name || "Unknown" : "Unassigned",
          start: start,
          end: end,
        };
      });
      setRoutes(combined);
    };

    fetchRoutes();
    const sub1 = supabase
      .channel("routes_ch")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "routes" },
        fetchRoutes,
      )
      .subscribe();
    const sub2 = supabase
      .channel("buses_ch")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buses" },
        fetchRoutes,
      )
      .subscribe();
    const sub3 = supabase
      .channel("students_ch")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        fetchRoutes,
      )
      .subscribe();

    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
      sub3.unsubscribe();
    };
  }, []);
  return routes;
}

export async function addRoute(r: BusRoute) {
  await supabase
    .from("routes")
    .insert({ name: r.name, description: `${r.start} to ${r.end}` });
}
