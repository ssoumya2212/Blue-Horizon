import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type BusPosition = {
  id: string;
  route: string;
  driver: string;
  status: "On Route" | "Delay" | "Idle";
  eta: string;
  lat: number;
  lng: number;
};

// Default seed coordinates (Chennai) used only as fallback if no live location exists
const seed: BusPosition[] = [
  {
    id: "007",
    route: "Route A",
    driver: "Ravi S.",
    status: "On Route",
    eta: "3:30 PM",
    lat: 13.0855,
    lng: 80.2035,
  },
  {
    id: "012",
    route: "Route B",
    driver: "Sahil K.",
    status: "Delay",
    eta: "3:42 PM",
    lat: 13.0890,
    lng: 80.2000,
  },
  {
    id: "018",
    route: "Route C",
    driver: "Rita J.",
    status: "On Route",
    eta: "3:51 PM",
    lat: 13.0820,
    lng: 80.2050,
  },
  {
    id: "021",
    route: "Route D",
    driver: "Vikas P.",
    status: "Idle",
    eta: "—",
    lat: 13.0850,
    lng: 80.2030,
  },
];

let positions: BusPosition[] = [...seed];
const listeners = new Set<(p: BusPosition[]) => void>();

function emit() {
  listeners.forEach((l) => l([...positions]));
}

function startSupabaseTracking() {
  // Fetch initial locations
  supabase
    .from("bus_locations")
    .select("*")
    .then(({ data }) => {
      if (data) {
        let updated = false;
        data.forEach((loc) => {
          const idx = positions.findIndex((p) => p.id === loc.bus_id);
          if (idx !== -1) {
            positions[idx] = {
              ...positions[idx],
              lat: Number(loc.latitude),
              lng: Number(loc.longitude),
            };
            updated = true;
          }
        });
        if (updated) emit();
      }
    });

  // Subscribe to changes
  supabase
    .channel("tracking_bus_locations")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bus_locations" },
      (payload) => {
        const newLoc = payload.new as any;
        if (newLoc && newLoc.bus_id) {
          const idx = positions.findIndex((p) => p.id === newLoc.bus_id);
          if (idx !== -1) {
            positions[idx] = {
              ...positions[idx],
              lat: Number(newLoc.latitude),
              lng: Number(newLoc.longitude),
            };
            emit();
          }
        }
      },
    )
    .subscribe();
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
