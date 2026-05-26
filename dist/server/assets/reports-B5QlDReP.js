import { T as reactExports } from "./server-R_mBchsc.js";
const seed = [
  {
    id: "r1",
    text: "Incident reported at 12:02 PM: Minor delay due to traffic near Stop 6.",
    author: "Driver Ravi",
    createdAt: Date.now() - 1e3 * 60 * 60
  },
  {
    id: "r2",
    text: "Detour applied at 8:14 AM: Construction on Oak Street.",
    author: "Driver Sahil",
    createdAt: Date.now() - 1e3 * 60 * 60 * 5
  },
  {
    id: "r3",
    text: "Bus 012 reported low fuel at 7:40 AM — refuelled at depot.",
    author: "Driver Vikas",
    createdAt: Date.now() - 1e3 * 60 * 60 * 6
  }
];
let reports = [...seed];
const listeners = /* @__PURE__ */ new Set();
function addReport(text, author = "You") {
  const r = {
    id: crypto.randomUUID(),
    text,
    author,
    createdAt: Date.now()
  };
  reports = [r, ...reports];
  listeners.forEach((l) => l(reports));
  return r;
}
function useReports() {
  const [r, setR] = reactExports.useState(reports);
  reactExports.useEffect(() => {
    listeners.add(setR);
    return () => {
      listeners.delete(setR);
    };
  }, []);
  return r;
}
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1e3);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
export {
  addReport as a,
  timeAgo as t,
  useReports as u
};
