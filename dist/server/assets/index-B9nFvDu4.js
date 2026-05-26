import { K as jsxRuntimeExports } from "./server-Dv4jboWA.js";
import { c as createLucideIcon, L as Link } from "./router-6xa8Ve6B.js";
import { B as Button } from "./button-DtL4ZNhn.js";
import { C as Card } from "./card-DhtMIOYd.js";
import { a as PublicNav, P as PublicFooter } from "./PublicFooter-CNFfBORd.js";
import { B as Bus, U as Users } from "./users-mC5OFBzL.js";
import { M as MapPin } from "./map-pin-9qI4ZE2z.js";
import { B as Bell } from "./bell-DEsH8yWS.js";
import { S as Shield } from "./shield-BIk8jzUI.js";
import { C as CircleCheck } from "./circle-check-CagRrRpP.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-DGerINCC.js";
import "./utils-8RO4xBwZ.js";
import "./ThemeToggle-BuC7ZsET.js";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$1);
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode);
const stats = [{
  label: "Active Buses",
  value: "15+",
  icon: Bus
}, {
  label: "Students Daily",
  value: "200+",
  icon: Users
}, {
  label: "Real-Time Tracking",
  value: "100%",
  icon: Activity
}];
const features = [{
  icon: MapPin,
  title: "Real-Time GPS Tracking",
  desc: "Follow every bus on a live map with stop-by-stop ETAs."
}, {
  icon: Users,
  title: "Attendance Management",
  desc: "Drivers mark each student in seconds. Parents see it instantly."
}, {
  icon: Bell,
  title: "Smart Notifications",
  desc: "Arrival, departure and delay alerts tuned to each parent."
}, {
  icon: Shield,
  title: "Emergency Alerts",
  desc: "One-tap SOS reaches the school, parents and admins."
}, {
  icon: Activity,
  title: "Route Management",
  desc: "Plan optimal routes and reassign buses on the fly."
}, {
  icon: CircleCheck,
  title: "Driver Approval",
  desc: "Admins verify and onboard drivers with full audit trails."
}];
function LandingPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", style: {
      background: "var(--gradient-hero)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,oklch(0.72_0.15_230)_0%,transparent_60%)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 md:py-24 lg:py-32", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-center text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-400 animate-pulse" }),
            "Live for the 2025–26 school year"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl", children: [
            "Smart.",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent", children: "Safe." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Reliable."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-lg text-lg text-white/80", children: "Parents need to ensure student safety and transparent communication. Blue Horizon delivers safe, secure and smart travel for every child." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "bg-white text-primary hover:bg-white/90", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/login", children: [
              "Login ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "outline", className: "border-white/30 bg-white/10 text-white hover:bg-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: "Create account" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid grid-cols-3 gap-3", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "mb-2 h-5 w-5 text-sky-300" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: s.value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-white/70", children: s.label })
          ] }, s.label)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-400/30 to-cyan-300/10 blur-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative space-y-4 rounded-3xl border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur dark:bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground", children: "BUS NO" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-primary", children: "007" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success", children: "On Route" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-primary/10 p-3 text-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase", children: "Stops" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: "12" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-accent/40 p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase", children: "Students" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: "16" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-success/15 p-3 text-success", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase", children: "Present" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: "14" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [{
              stop: "Oak Street & 5th Ave",
              time: "3:25 PM",
              tag: "Current"
            }, {
              stop: "Blue Horizon Elementary",
              time: "3:30 PM",
              tag: "Next"
            }, {
              stop: "Central Park Stop",
              time: "3:35 PM",
              tag: ""
            }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: s.stop }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.time })
              ] }),
              s.tag && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground", children: s.tag })
            ] }, s.stop)) })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container mx-auto px-4 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto mb-12 max-w-2xl text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold uppercase tracking-wider text-primary", children: "Features" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-3xl font-bold md:text-4xl", children: "Everything your school transport needs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Built for parents, drivers and administrators — one platform, one source of truth." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group relative overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: f.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: f.desc })
      ] }, f.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-4 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden border-0 p-10 text-center text-white md:p-16", style: {
      background: "var(--gradient-primary)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold md:text-4xl", children: "Ready to ride safer?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-xl text-white/80", children: "Join hundreds of families and drivers already using Blue Horizon for daily peace of mind." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "bg-white text-primary hover:bg-white/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: "Get started" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "outline", className: "border-white/40 bg-transparent text-white hover:bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", children: "Talk to us" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicFooter, {})
  ] });
}
export {
  LandingPage as component
};
