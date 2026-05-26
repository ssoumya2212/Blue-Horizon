import { T as reactExports } from "./server-R_mBchsc.js";
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
