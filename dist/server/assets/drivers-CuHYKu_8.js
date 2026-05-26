import { T as reactExports } from "./server-R_mBchsc.js";
let drivers = [
  {
    name: "Ravi S.",
    route: "Route A",
    phone: "+1 555 233 1180",
    licence: "DL-1180",
    status: "approved"
  },
  {
    name: "Sahil K.",
    route: "Route B",
    phone: "+1 555 233 1190",
    licence: "DL-1190",
    status: "pending"
  },
  {
    name: "Rita J.",
    route: "Route C",
    phone: "+1 555 233 1201",
    licence: "DL-1201",
    status: "approved"
  },
  {
    name: "Vikas P.",
    route: "Route D",
    phone: "+1 555 233 1212",
    licence: "DL-1212",
    status: "pending"
  }
];
const listeners = /* @__PURE__ */ new Set();
function updateDriverStatus(name, status) {
  drivers = drivers.map((d) => d.name === name ? { ...d, status } : d);
  listeners.forEach((l) => l(drivers));
}
function useDrivers() {
  const [d, setD] = reactExports.useState(drivers);
  reactExports.useEffect(() => {
    listeners.add(setD);
    setD(drivers);
    return () => {
      listeners.delete(setD);
    };
  }, []);
  return d;
}
export {
  useDrivers as a,
  updateDriverStatus as u
};
