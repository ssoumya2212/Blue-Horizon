import { T as reactExports, K as jsxRuntimeExports } from "./server-Dv4jboWA.js";
import { C as Card } from "./card-DhtMIOYd.js";
import { B as Button } from "./button-DtL4ZNhn.js";
import { B as Badge } from "./badge-_UWZcQX2.js";
import { I as Input } from "./input-LPedmjRM.js";
import { L as Label } from "./label-BcyR5HvE.js";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-B96AXIVY.js";
import { t as toast } from "./index-gz2JDtlF.js";
import { u as useRoutes, a as addRoute } from "./routes-ViqGlWFt.js";
import { u as useSearchQuery } from "./search-DSPp0iB8.js";
import { P as Plus } from "./plus-BJrSP5jN.js";
import { R as Route } from "./route-FpbiMppK.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./utils-8RO4xBwZ.js";
import "./index-DGerINCC.js";
import "./router-6xa8Ve6B.js";
import "./index-DF9-WQnG.js";
import "./index-CYgIzWx0.js";
import "./index-DHHt66mv.js";
import "./index-BlRSmZ-w.js";
import "./index-Bv_FXs5l.js";
const RouteMap = reactExports.lazy(() => import("./RouteMap-egO6vysJ.js"));
function Routes() {
  const routes = useRoutes();
  const q = useSearchQuery().toLowerCase();
  const [open, setOpen] = reactExports.useState(false);
  const [isMounted, setIsMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setIsMounted(true);
  }, []);
  const filtered = q ? routes.filter((r) => r.name.toLowerCase().includes(q) || r.driver.toLowerCase().includes(q) || r.bus.toLowerCase().includes(q)) : routes;
  const handleAdd = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    addRoute({
      name: String(data.get("name") || "Route"),
      start: String(data.get("start") || ""),
      end: String(data.get("end") || ""),
      stops: Number(data.get("stops") || 0),
      students: Number(data.get("students") || 0),
      bus: String(data.get("bus") || "—"),
      driver: String(data.get("driver") || "Unassigned")
    });
    toast.success("Route added");
    setOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold md:text-3xl", children: "Routes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Plan and assign bus routes.",
          q && ` — ${filtered.length} match${filtered.length === 1 ? "" : "es"} for "${q}"`
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
        " New route"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden border-0 shadow-[var(--shadow-card)] h-[300px] relative z-0", children: isMounted ? /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full bg-muted animate-pulse" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(RouteMap, { filtered }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full bg-muted animate-pulse" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
      filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 hover:-translate-y-0.5 transition hover:shadow-[var(--shadow-card)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", children: [
            "Bus ",
            r.bus
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: r.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Driver ",
          r.driver
        ] }),
        (r.start || r.end) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          r.start || "—",
          " → ",
          r.end || "—"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", children: r.stops }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-muted-foreground", children: "Stops" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", children: r.students }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-muted-foreground", children: "Students" })
          ] })
        ] })
      ] }, r.name)),
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "col-span-full py-8 text-center text-sm text-muted-foreground", children: "No routes match your search." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAdd, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New route" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Define a new bus route with stops." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Route name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", name: "name", placeholder: "Route G", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "start", children: "Start point" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "start", name: "start", placeholder: "Oak Street", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "end", children: "End point" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "end", name: "end", placeholder: "School Gate", required: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "stops", children: "Stops" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "stops", name: "stops", type: "number", placeholder: "8", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "students", children: "Students" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "students", name: "students", type: "number", placeholder: "14" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bus", children: "Bus" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "bus", name: "bus", placeholder: "025" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "driver", children: "Driver" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "driver", name: "driver", placeholder: "Driver name" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Save route" })
      ] })
    ] }) }) })
  ] });
}
export {
  Routes as component
};
