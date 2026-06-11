import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type BusPosition = {
  id: string;
  route: string;
  driver: string;
  status: "Running" | "Delayed" | "Idle";
  eta: string;
  lat: number;
  lng: number;
};

let positions: BusPosition[] = [];
const listeners = new Set<(p: BusPosition[]) => void>();

function emit() {
  listeners.forEach((l) => l([...positions]));
}

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const notifiedBuses = new Set<string>();

async function startSupabaseTracking() {
  // First, fetch the buses to get route and driver info
  const { data: buses } = await supabase.from("buses").select("*");
  if (!buses) return;

  // Then fetch current locations
  const { data: locations } = await supabase.from("bus_locations").select("*");

  const newPositions: BusPosition[] = [];

  for (const bus of buses) {
    const loc = locations?.find((l) => l.bus_id === bus.id);
    if (loc) {
      newPositions.push({
        id: bus.id,
        route: bus.route_name || "Unknown Route",
        driver: bus.driver_name || "Unknown Driver",
        status:
          bus.status === "Running"
            ? "Running"
            : bus.status === "Delayed"
              ? "Delayed"
              : "Idle",
        eta: bus.next_stop || "—",
        lat: Number(loc.latitude),
        lng: Number(loc.longitude),
      });
    }
  }

  positions = newPositions;
  emit();

  // Subscribe to changes
  supabase
    .channel("tracking_bus_locations")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bus_locations" },
      async (payload) => {
        const newLoc = payload.new as any;
        if (newLoc && newLoc.bus_id) {
          // Geofence check (1km from Blue Horizon Int. School: 13.0850, 80.2030)
          const dist = getDistanceFromLatLonInKm(
            Number(newLoc.latitude),
            Number(newLoc.longitude),
            13.085,
            80.203,
          );
          if (dist < 1.0 && !notifiedBuses.has(newLoc.bus_id)) {
            notifiedBuses.add(newLoc.bus_id);
            // Send push notification to parents
            const { addNotification } = await import("@/lib/notifications");
            addNotification(
              "Bus Arriving Soon",
              `Bus ${newLoc.bus_id} is within 1km of the stop!`,
              "bus_arrival",
              "parent",
            );
          }

          const idx = positions.findIndex((p) => p.id === newLoc.bus_id);
          if (idx !== -1) {
            positions[idx] = {
              ...positions[idx],
              lat: Number(newLoc.latitude),
              lng: Number(newLoc.longitude),
            };
            emit();
          } else {
            // New bus location appeared, fetch bus details
            const { data: bus } = await supabase
              .from("buses")
              .select("*")
              .eq("id", newLoc.bus_id)
              .single();
            if (bus) {
              positions.push({
                id: bus.id,
                route: bus.route_name || "Unknown Route",
                driver: bus.driver_name || "Unknown Driver",
                status:
                  bus.status === "Running"
                    ? "Running"
                    : bus.status === "Delayed"
                      ? "Delayed"
                      : "Idle",
                eta: bus.next_stop || "—",
                lat: Number(newLoc.latitude),
                lng: Number(newLoc.longitude),
              });
              emit();
            }
          }
        }
      },
    )
    .subscribe((status, err) => {
      if (status === "SUBSCRIBED") {
        console.log("Subscribed to bus locations realtime");
      }
      if (status === "CHANNEL_ERROR" || err) {
        console.error("Realtime channel error:", err);
        // Simple retry mechanism
        setTimeout(() => {
          supabase.removeChannel(supabase.channel("tracking_bus_locations"));
          startSupabaseTracking();
        }, 5000);
      }
    });
}

let started = false;
function ensureStarted() {
  if (started || typeof window === "undefined") return;
  started = true;
  startSupabaseTracking();
}

export function useFleetPositions() {
  const [state, setState] = useState<BusPosition[]>(positions);
  useEffect(() => {
    ensureStarted();
    listeners.add(setState);
    setState([...positions]);
    return () => {
      listeners.delete(setState);
    };
  }, []);
  return state;
}

export const trackingSource = "supabase";
