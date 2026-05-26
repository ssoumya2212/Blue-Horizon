import { K as jsxRuntimeExports } from "./server-Dv4jboWA.js";
import { C as Card } from "./card-DhtMIOYd.js";
import { B as Button } from "./button-DtL4ZNhn.js";
import { B as Badge } from "./badge-_UWZcQX2.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-BReVWF7w.js";
import { u as useSearchQuery } from "./search-DSPp0iB8.js";
import { a as useDrivers } from "./drivers-U3LJplwZ.js";
import { P as Plus } from "./plus-BJrSP5jN.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./utils-8RO4xBwZ.js";
import "./index-DGerINCC.js";
import "./index-Bv_FXs5l.js";
import "./index-DHHt66mv.js";
import "./router-6xa8Ve6B.js";
function Drivers() {
  const drivers = useDrivers();
  const q = useSearchQuery().toLowerCase();
  const filtered = q ? drivers.filter((d) => d.name.toLowerCase().includes(q) || d.route.toLowerCase().includes(q) || d.phone.toLowerCase().includes(q) || d.status.toLowerCase().includes(q)) : drivers;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold md:text-3xl", children: "Drivers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Approve, assign and manage drivers." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
        " Add driver"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: filtered.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-12 w-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary", children: d.name[0] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: d.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: d.route })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: d.phone }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: d.status === "approved" ? "mt-3 border-success/30 bg-success/10 text-success" : "mt-3 border-amber-300 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: d.status }) })
    ] }, d.name)) })
  ] });
}
export {
  Drivers as component
};
