import { useEffect, useState } from "react";

export type BusRoute = {
  name: string;
  stops: number;
  students: number;
  bus: string;
  driver: string;
  start?: string;
  end?: string;
};

let routes: BusRoute[] = [
  { name: "Route A", stops: 12, students: 16, bus: "007", driver: "Ravi S." },
  { name: "Route B", stops: 9, students: 14, bus: "012", driver: "Sahil K." },
  { name: "Route C", stops: 11, students: 18, bus: "018", driver: "Rita J." },
  { name: "Route D", stops: 8, students: 10, bus: "021", driver: "Vikas P." },
];

const listeners = new Set<(r: BusRoute[]) => void>();

export function getRoutes() {
  return routes;
}

export function addRoute(r: BusRoute) {
  routes = [r, ...routes];
  listeners.forEach((l) => l(routes));
}

export function useRoutes() {
  const [r, setR] = useState(routes);
  useEffect(() => {
    listeners.add(setR);
    setR(routes);
    return () => {
      listeners.delete(setR);
    };
  }, []);
  return r;
}
