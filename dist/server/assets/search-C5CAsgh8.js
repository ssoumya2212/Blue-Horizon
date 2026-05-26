import { r as reactExports } from "./server-istEu6hz.js";
let query = "";
const listeners = /* @__PURE__ */ new Set();
function setSearchQuery(q) {
  query = q;
  listeners.forEach((l) => l(q));
}
function useSearchQuery() {
  const [q, setQ] = reactExports.useState(query);
  reactExports.useEffect(() => {
    listeners.add(setQ);
    return () => {
      listeners.delete(setQ);
    };
  }, []);
  return q;
}
export {
  setSearchQuery as s,
  useSearchQuery as u
};
