// Realtime fleet positions.
// - When Firebase is configured (VITE_FIREBASE_*), subscribes to /buses in
//   the Realtime Database. Each bus document is expected to look like:
//     { id, route, driver, status, eta, lat, lng }
// - Otherwise, runs a local simulator that nudges bus coordinates every
//   2 seconds so the UI behaves as if positions were streaming in.
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { firebaseEnabled, getFirebaseDb } from "./firebase";

export type BusPosition = {
  id: string;
  route: string;
  driver: string;
  status: "On Route" | "Delay" | "Idle";
  eta: string;
  lat: number;
  lng: number;
};

// Centered around a generic city grid (Mumbai-ish coords) so the map has
// something recognisable. Replace with your own depot coordinates.
const seed: BusPosition[] = [
  {
    id: "007",
    route: "Route A",
    driver: "Ravi S.",
    status: "On Route",
    eta: "3:30 PM",
    lat: 19.076,
    lng: 72.8777,
  },
  {
    id: "012",
    route: "Route B",
    driver: "Sahil K.",
    status: "Delay",
    eta: "3:42 PM",
    lat: 19.082,
    lng: 72.873,
  },
  {
    id: "018",
    route: "Route C",
    driver: "Rita J.",
    status: "On Route",
    eta: "3:51 PM",
    lat: 19.072,
    lng: 72.882,
  },
  {
    id: "021",
    route: "Route D",
    driver: "Vikas P.",
    status: "Idle",
    eta: "—",
    lat: 19.078,
    lng: 72.87,
  },
];

let positions: BusPosition[] = [...seed];
const listeners = new Set<(p: BusPosition[]) => void>();
let simulatorStarted = false;

function emit() {
  listeners.forEach((l) => l(positions));
}

function startSimulator() {
  if (simulatorStarted || typeof window === "undefined") return;
  simulatorStarted = true;
  setInterval(() => {
    positions = positions.map((b) =>
      b.status === "Idle"
        ? b
        : {
            ...b,
            lat: b.lat + (Math.random() - 0.5) * 0.0008,
            lng: b.lng + (Math.random() - 0.5) * 0.0008,
          },
    );
    emit();
  }, 2000);
}

function startFirebase() {
  const db = getFirebaseDb();
  if (!db) return;
  onValue(ref(db, "buses"), (snap) => {
    const val = snap.val();
    if (!val) return;
    const next: BusPosition[] = Array.isArray(val)
      ? val.filter(Boolean)
      : Object.values(val);
    positions = next;
    emit();
  });
}

let started = false;
function ensureStarted() {
  if (started || typeof window === "undefined") return;
  started = true;
  if (firebaseEnabled) startFirebase();
  else startSimulator();
}

export function useFleetPositions() {
  const [state, setState] = useState<BusPosition[]>(positions);
  useEffect(() => {
    ensureStarted();
    listeners.add(setState);
    setState(positions);
    return () => {
      listeners.delete(setState);
    };
  }, []);
  return state;
}

export const trackingSource: "firebase" | "simulated" = firebaseEnabled
  ? "firebase"
  : "simulated";
