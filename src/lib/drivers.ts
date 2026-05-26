import { useEffect, useState } from "react";

export type DriverStatus = "pending" | "approved" | "rejected";

export type Driver = {
  name: string;
  route: string;
  phone: string;
  licence: string;
  status: DriverStatus;
};

let drivers: Driver[] = [
  {
    name: "Ravi S.",
    route: "Route A",
    phone: "+1 555 233 1180",
    licence: "DL-1180",
    status: "approved",
  },
  {
    name: "Sahil K.",
    route: "Route B",
    phone: "+1 555 233 1190",
    licence: "DL-1190",
    status: "pending",
  },
  {
    name: "Rita J.",
    route: "Route C",
    phone: "+1 555 233 1201",
    licence: "DL-1201",
    status: "approved",
  },
  {
    name: "Vikas P.",
    route: "Route D",
    phone: "+1 555 233 1212",
    licence: "DL-1212",
    status: "pending",
  },
];

const listeners = new Set<(d: Driver[]) => void>();

export function getDrivers() {
  return drivers;
}

export function addDriver(d: Driver) {
  drivers = [d, ...drivers];
  listeners.forEach((l) => l(drivers));
}

export function updateDriverStatus(name: string, status: DriverStatus) {
  drivers = drivers.map((d) => (d.name === name ? { ...d, status } : d));
  listeners.forEach((l) => l(drivers));
}

export function useDrivers() {
  const [d, setD] = useState(drivers);
  useEffect(() => {
    listeners.add(setD);
    setD(drivers);
    return () => {
      listeners.delete(setD);
    };
  }, []);
  return d;
}
