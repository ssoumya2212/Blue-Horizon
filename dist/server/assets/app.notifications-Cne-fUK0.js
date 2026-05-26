import { K as jsxRuntimeExports } from "./server-R_mBchsc.js";
import { C as Card } from "./card-B7CuyrHp.js";
import { u as useSearchQuery } from "./search-DhcfBx7I.js";
import { C as CircleCheck } from "./circle-check-D5Nzq6kC.js";
import { C as Clock } from "./clock-CMyR9fRF.js";
import { T as TriangleAlert } from "./triangle-alert-CuWiplCJ.js";
import { B as Bell } from "./bell-DwENp9y3.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./utils-8RO4xBwZ.js";
import "./router-CEqblTjI.js";
const items = [{
  icon: CircleCheck,
  tone: "success",
  title: "Aarav boarded Bus 007",
  time: "2 min ago"
}, {
  icon: Clock,
  tone: "primary",
  title: "Bus 007 will arrive at 4:15 PM",
  time: "12 min ago"
}, {
  icon: TriangleAlert,
  tone: "warning",
  title: "Minor delay near Stop 6 due to traffic",
  time: "30 min ago"
}, {
  icon: Bell,
  tone: "muted",
  title: "Weekly attendance report is ready",
  time: "Yesterday"
}];
function Notifications() {
  const q = useSearchQuery().toLowerCase();
  const filtered = q ? items.filter((n) => n.title.toLowerCase().includes(q)) : items;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold md:text-3xl", children: "Notifications" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Real-time updates from your child's commute." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "divide-y p-0", children: filtered.map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${n.tone === "success" ? "bg-success/15 text-success" : n.tone === "primary" ? "bg-primary/10 text-primary" : n.tone === "warning" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" : "bg-muted text-muted-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(n.icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: n.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: n.time })
      ] })
    ] }, i)) })
  ] });
}
export {
  Notifications as component
};
