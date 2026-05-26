import { K as jsxRuntimeExports } from "./server-Dv4jboWA.js";
import { C as Card } from "./card-DhtMIOYd.js";
import { B as Button } from "./button-DtL4ZNhn.js";
import { t as toast } from "./index-gz2JDtlF.js";
import { a as addNotification } from "./notifications-BMG8igOt.js";
import { P as Phone } from "./phone-BttuFrv3.js";
import { c as createLucideIcon } from "./router-6xa8Ve6B.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./utils-8RO4xBwZ.js";
import "./index-DGerINCC.js";
const __iconNode$1 = [
  ["path", { d: "M12 16h.01", key: "1drbdi" }],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  [
    "path",
    {
      d: "M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z",
      key: "1fd625"
    }
  ]
];
const OctagonAlert = createLucideIcon("octagon-alert", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode);
function Emergency() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold md:text-3xl", children: "Emergency contact" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "One tap reaches the school, the driver and admin." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "mb-3 h-6 w-6 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: "School office" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "+1 (555) 010-2025" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4 w-full", onClick: () => {
          window.location.href = "tel:+15550102025";
        }, children: "Call now" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "mb-3 h-6 w-6 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: "Driver — Bus 007" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Ravi S. • +1 (555) 233-1180" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "mt-4 w-full", onClick: () => {
          window.location.href = "tel:+15552331180";
        }, children: "Call driver" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 border-destructive/40 bg-destructive/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonAlert, { className: "mb-3 h-6 w-6 text-destructive" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: "SOS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Notifies school, parents and admin instantly." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", className: "mt-4 w-full", onClick: async () => {
          toast.error("SOS Alert Triggered!");
          await addNotification("🚨 SOS TRIGGERED", "Emergency SOS triggered by Parent (Aarav S).", "emergency", "all");
        }, children: "Trigger SOS" })
      ] })
    ] })
  ] });
}
export {
  Emergency as component
};
