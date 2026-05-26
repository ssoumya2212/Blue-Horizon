import { K as jsxRuntimeExports } from "./server-R_mBchsc.js";
import { a as PublicNav, P as PublicFooter } from "./PublicFooter-DR_bcxU4.js";
import { C as Card } from "./card-B7CuyrHp.js";
import { I as Input } from "./input-DrmQmEmz.js";
import { T as Textarea } from "./textarea-DUf8kuks.js";
import { B as Button } from "./button-DVt9JBnU.js";
import { M as Mail } from "./mail-BKQps140.js";
import { P as Phone } from "./phone-BvqSOp6X.js";
import { M as MapPin } from "./map-pin-Czc0Xtzb.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-CEqblTjI.js";
import "./ThemeToggle-GrrcEe-E.js";
import "./utils-8RO4xBwZ.js";
import "./index-DGerINCC.js";
function Contact() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold uppercase tracking-wider text-primary", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 text-4xl font-bold", children: "Let's talk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "We typically reply within one business day." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-primary" }),
            " hello@bluehorizon.school"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-primary" }),
            " +1 (555) 010-2025"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
            " 12 Cedar Ave, Springfield"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-3", onSubmit: (e) => e.preventDefault(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Your name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Email", type: "email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "How can we help?", rows: 5 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", children: "Send message" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicFooter, {})
  ] });
}
export {
  Contact as component
};
