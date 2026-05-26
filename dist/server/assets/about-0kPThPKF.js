import { K as jsxRuntimeExports } from "./server-R_mBchsc.js";
import { a as PublicNav, P as PublicFooter } from "./PublicFooter-DR_bcxU4.js";
import { C as Card } from "./card-B7CuyrHp.js";
import { c as createLucideIcon } from "./router-CEqblTjI.js";
import { S as Shield } from "./shield-CzuNQvLf.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./button-DVt9JBnU.js";
import "./index-DGerINCC.js";
import "./utils-8RO4xBwZ.js";
import "./ThemeToggle-GrrcEe-E.js";
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
      key: "mvr1a0"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$1);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
];
const Target = createLucideIcon("target", __iconNode);
function About() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container mx-auto px-4 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold uppercase tracking-wider text-primary", children: "About us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 text-4xl font-bold md:text-5xl", children: "A safer ride, every day" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-lg text-muted-foreground", children: "Blue Horizon was born from a simple idea: parents should never have to wonder where the school bus is. We build tools that bring clarity, calm and care to the daily commute." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3", children: [{
        icon: Target,
        title: "Our mission",
        body: "Make school transport transparent, safe and stress-free."
      }, {
        icon: Heart,
        title: "Our values",
        body: "Care, transparency and reliability in every journey."
      }, {
        icon: Shield,
        title: "Our promise",
        body: "Every child accounted for, every trip tracked."
      }].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "mb-3 h-6 w-6 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: c.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: c.body })
      ] }, c.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicFooter, {})
  ] });
}
export {
  About as component
};
