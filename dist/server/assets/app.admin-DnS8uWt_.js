import { r as reactExports, W as jsxRuntimeExports } from "./server-istEu6hz.js";
import { C as Card } from "./card-Bo6_-eoI.js";
import { B as Button } from "./button-CavBh9lM.js";
import { B as Badge } from "./badge-CPcfVpy8.js";
import { I as Input } from "./input-CRWvdhoz.js";
import { L as Label } from "./label-2paNXirr.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CCPwr--M.js";
import { toast } from "./index-DfOh3Nj3.js";
import { a as addRoute } from "./routes-CJmnvL-i.js";
import { a as addNotification } from "./notifications-BHQnheDj.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CocCKFEQ.js";
import { u as useDrivers, a as updateDriverStatus } from "./drivers-BxCkqVSn.js";
import { M as MessageSquare } from "./message-square-Cst-03T9.js";
import { P as Plus } from "./plus-bqKfSfgY.js";
import { B as Bus, U as Users } from "./users-Dr4PhbIQ.js";
import { c as createLucideIcon, G as GraduationCap } from "./router-BsyVVfp8.js";
import { T as TriangleAlert } from "./triangle-alert-DTPd1MMQ.js";
import { C as CircleCheck } from "./circle-check-CDfb0e6E.js";
import { R as Route } from "./route-DzPNR4tc.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./utils-BH6shBk-.js";
import "./index-BNcWPUAp.js";
import "./index-CCEVeydi.js";
import "./index-C1Q8V0C-.js";
import "./index-CrY51Zax.js";
import "./index-CT11DaeY.js";
import "./index-DrzusK0R.js";
const __iconNode = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode);
const stats = [{
  label: "Total Buses",
  value: "15",
  trend: "+2 this month",
  icon: Bus,
  tone: "primary"
}, {
  label: "Drivers",
  value: "22",
  trend: "3 pending approval",
  icon: Users,
  tone: "warning"
}, {
  label: "Students",
  value: "248",
  trend: "+12 new",
  icon: GraduationCap,
  tone: "success"
}, {
  label: "Active Alerts",
  value: "4",
  trend: "2 resolved today",
  icon: TriangleAlert,
  tone: "destructive"
}];
const activity = [{
  id: 1,
  who: "Bus 007",
  what: "Departed from Oak Street",
  time: "2 min ago",
  status: "On Route"
}, {
  id: 2,
  who: "Driver Ravi",
  what: "Marked attendance for Route A",
  time: "8 min ago",
  status: "Done"
}, {
  id: 3,
  who: "Bus 012",
  what: "Reported minor delay near Stop 6",
  time: "15 min ago",
  status: "Delay"
}, {
  id: 4,
  who: "Parent K. Mehta",
  what: "Updated emergency contact",
  time: "1 hr ago",
  status: "Done"
}, {
  id: 5,
  who: "Driver Sahil",
  what: "Submitted onboarding documents",
  time: "3 hr ago",
  status: "Pending"
}];
function AdminDashboard() {
  const drivers = useDrivers();
  const [openDialog, setOpenDialog] = reactExports.useState(null);
  const updateDriver = (name, status) => {
    updateDriverStatus(name, status);
    toast.success(`${name} ${status === "approved" ? "approved" : "rejected"}`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold md:text-3xl", children: "Admin Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Real-time fleet status and recent activity." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "default", onClick: () => setOpenDialog("announcement"), className: "bg-purple-600 hover:bg-purple-700 text-white shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "mr-1 h-4 w-4" }),
          " Announce"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setOpenDialog("bus"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
          " Add bus"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setOpenDialog("driver"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
          " Add driver"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setOpenDialog("route"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
          " Add route"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setOpenDialog("parent"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
          " Add parent"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: s.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-3xl font-bold", children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: s.trend })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-11 w-11 items-center justify-center rounded-xl ${s.tone === "primary" ? "bg-primary/10 text-primary" : s.tone === "success" ? "bg-success/15 text-success" : s.tone === "warning" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" : "bg-destructive/15 text-destructive"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-5 w-5" }) })
    ] }) }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Recent activity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Live feed across all routes" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", children: [
            "View all ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "ml-1 h-3 w-3" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Source" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Activity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: activity.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: a.who }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: a.what }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: a.time }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: a.status === "On Route" ? "border-primary/30 bg-primary/10 text-primary" : a.status === "Done" ? "border-success/30 bg-success/15 text-success" : a.status === "Pending" ? "border-amber-300 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" : "border-destructive/30 bg-destructive/15 text-destructive", children: a.status }) })
          ] }, a.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Driver approvals" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
            drivers.filter((d) => d.status === "pending").length,
            " pending"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: drivers.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: d.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              d.route,
              " • ",
              d.licence
            ] })
          ] }),
          d.status === "pending" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "text-destructive hover:bg-destructive/10", onClick: () => updateDriver(d.name, "rejected"), children: "Reject" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => updateDriver(d.name, "approved"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-1 h-3 w-3" }),
              " Approve"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: d.status === "approved" ? "border-success/30 bg-success/15 text-success" : "border-destructive/30 bg-destructive/15 text-destructive", children: d.status === "approved" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-1 h-3 w-3" }),
            " Allowed"
          ] }) : "Rejected" })
        ] }, d.name)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddEntityDialog, { kind: openDialog === "announcement" ? null : openDialog, onClose: () => setOpenDialog(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnnouncementDialog, { open: openDialog === "announcement", onClose: () => setOpenDialog(null) })
  ] });
}
function AnnouncementDialog({
  open,
  onClose
}) {
  const [loading, setLoading] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const title = String(data.get("title") || "Announcement");
    const message = String(data.get("message") || "");
    const target = String(data.get("target") || "all");
    await addNotification(title, message, "announcement", target);
    toast.success("Announcement broadcasted successfully!");
    setLoading(false);
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Send Announcement" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Broadcast a message to parents, drivers, or everyone." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "target", children: "Target Audience" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { name: "target", id: "target", className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Everyone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "parent", children: "Parents" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "driver", children: "Drivers" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "title", children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "title", name: "title", placeholder: "e.g. School Closed Tomorrow", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "message", children: "Message" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "message", name: "message", className: "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", placeholder: "Type your announcement here...", required: true })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, disabled: loading, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, className: "bg-purple-600 hover:bg-purple-700 text-white", children: "Send Announcement" })
    ] })
  ] }) }) });
}
function AddEntityDialog({
  kind,
  onClose
}) {
  const open = kind !== null;
  const config = {
    bus: {
      title: "Add new bus",
      description: "Register a new bus to the fleet.",
      icon: Bus,
      fields: [{
        name: "busNumber",
        label: "Bus number",
        placeholder: "e.g. Bus 015"
      }, {
        name: "plate",
        label: "Plate number",
        placeholder: "MH-12-AB-1234"
      }, {
        name: "capacity",
        label: "Capacity",
        placeholder: "40",
        type: "number"
      }, {
        name: "route",
        label: "Assigned route",
        placeholder: "Route A"
      }]
    },
    driver: {
      title: "Add new driver",
      description: "Onboard a new driver to your fleet.",
      icon: Users,
      fields: [{
        name: "name",
        label: "Full name",
        placeholder: "John Doe"
      }, {
        name: "phone",
        label: "Phone",
        placeholder: "+91 90000 00000"
      }, {
        name: "licence",
        label: "Licence number",
        placeholder: "MH-12-AB-9999"
      }, {
        name: "route",
        label: "Assigned route",
        placeholder: "Route A"
      }]
    },
    parent: {
      title: "Add new parent",
      description: "Create a parent account linked to a student.",
      icon: GraduationCap,
      fields: [{
        name: "name",
        label: "Parent name",
        placeholder: "Jane Smith"
      }, {
        name: "email",
        label: "Email",
        placeholder: "jane@example.com",
        type: "email"
      }, {
        name: "phone",
        label: "Phone",
        placeholder: "+91 90000 00000"
      }, {
        name: "child",
        label: "Child name",
        placeholder: "Aarav S"
      }]
    },
    route: {
      title: "Add new route",
      description: "Define a new bus route with stops.",
      icon: Route,
      fields: [{
        name: "name",
        label: "Route name",
        placeholder: "Route G"
      }, {
        name: "start",
        label: "Start point",
        placeholder: "Oak Street"
      }, {
        name: "end",
        label: "End point",
        placeholder: "School Gate"
      }, {
        name: "stops",
        label: "Number of stops",
        placeholder: "8",
        type: "number"
      }]
    }
  };
  const current = kind ? config[kind] : null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!current || !kind) return;
    const data = new FormData(e.currentTarget);
    if (kind === "route") {
      addRoute({
        name: String(data.get("name") || "Route"),
        start: String(data.get("start") || ""),
        end: String(data.get("end") || ""),
        stops: Number(data.get("stops") || 0),
        students: 0,
        bus: "—",
        driver: "Unassigned"
      });
    }
    toast.success(`${current.title.replace("Add new ", "")} added successfully`);
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-md", children: current && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(current.icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: current.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: current.description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 py-4", children: current.fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: f.name, children: f.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: f.name, name: f.name, type: "type" in f ? f.type : "text", placeholder: f.placeholder, required: true })
    ] }, f.name)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Save" })
    ] })
  ] }) }) });
}
export {
  AdminDashboard as component
};
