import { T as reactExports } from "./server-Dv4jboWA.js";
let routes = [
  { name: "Route A", stops: 12, students: 16, bus: "007", driver: "Ravi S." },
  { name: "Route B", stops: 9, students: 14, bus: "012", driver: "Sahil K." },
  { name: "Route C", stops: 11, students: 18, bus: "018", driver: "Rita J." },
  { name: "Route D", stops: 8, students: 10, bus: "021", driver: "Vikas P." }
];
const listeners = /* @__PURE__ */ new Set();
function addRoute(r) {
  routes = [r, ...routes];
  listeners.forEach((l) => l(routes));
}
function useRoutes() {
  const [r, setR] = reactExports.useState(routes);
  reactExports.useEffect(() => {
    listeners.add(setR);
    setR(routes);
    return () => {
      listeners.delete(setR);
    };
  }, []);
  return r;
}
export {
  addRoute as a,
  useRoutes as u
};
