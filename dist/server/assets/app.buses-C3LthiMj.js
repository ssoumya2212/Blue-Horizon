import { W as jsxRuntimeExports } from "./server-istEu6hz.js";
import { C as Card } from "./card-Bo6_-eoI.js";
import { B as Button } from "./button-CavBh9lM.js";
import { B as Badge } from "./badge-CPcfVpy8.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CocCKFEQ.js";
import { u as useSearchQuery } from "./search-C5CAsgh8.js";
import { P as Plus } from "./plus-bqKfSfgY.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./utils-BH6shBk-.js";
import "./index-BNcWPUAp.js";
import "./router-BsyVVfp8.js";
const buses = [{
  id: "007",
  route: "Route A",
  driver: "Ravi S.",
  capacity: 24,
  status: "Active"
}, {
  id: "012",
  route: "Route B",
  driver: "Sahil K.",
  capacity: 28,
  status: "Active"
}, {
  id: "018",
  route: "Route C",
  driver: "Rita J.",
  capacity: 22,
  status: "Maintenance"
}, {
  id: "021",
  route: "Route D",
  driver: "Vikas P.",
  capacity: 30,
  status: "Idle"
}];
function Buses() {
  const q = useSearchQuery().toLowerCase();
  const filtered = q ? buses.filter((b) => b.id.toLowerCase().includes(q) || b.route.toLowerCase().includes(q) || b.driver.toLowerCase().includes(q) || b.status.toLowerCase().includes(q)) : buses;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold md:text-3xl", children: "Buses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage the school bus fleet." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
        " Add bus"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Bus" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Route" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Driver" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Capacity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-medium", children: [
          "Bus ",
          b.id
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: b.route }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: b.driver }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: b.capacity }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: b.status === "Active" ? "border-success/30 bg-success/10 text-success" : b.status === "Maintenance" ? "border-amber-300 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" : "border-border text-muted-foreground", children: b.status }) })
      ] }, b.id)) })
    ] }) })
  ] });
}
export {
  Buses as component
};
