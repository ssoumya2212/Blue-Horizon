import { T as reactExports, K as jsxRuntimeExports } from "./server-R_mBchsc.js";
import { C as Card } from "./card-B7CuyrHp.js";
import { B as Button } from "./button-DVt9JBnU.js";
import { I as Input } from "./input-DrmQmEmz.js";
import { L as Label } from "./label-CcDhm36Q.js";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-6251ZPZx.js";
import { t as toast } from "./index-C4HfW7Dv.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-eSYhC3KP.js";
import { g as getPassengers, b as addPassenger } from "./router-CEqblTjI.js";
import { P as Plus } from "./plus-BspBzVKp.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./utils-8RO4xBwZ.js";
import "./index-DGerINCC.js";
import "./index-Yn_FMhK4.js";
import "./index-B8AOILd2.js";
import "./index-Lhd0usrm.js";
import "./index-DX3xhyrQ.js";
import "./index-B0xEJS19.js";
function Students() {
  const [students, setStudents] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    fetchStudents();
  }, []);
  const fetchStudents = async () => {
    setLoading(true);
    const data = await getPassengers();
    if (data && data.length > 0) {
      setStudents(data);
    } else {
      setStudents([{
        id: 1,
        name: "Aarav Sharma",
        class: "10-A",
        stop: "Oak Street"
      }, {
        id: 2,
        name: "Kiara Patel",
        class: "8-B",
        stop: "Maple Drive"
      }, {
        id: 3,
        name: "Vihaan Singh",
        class: "12-C",
        stop: "Pine Avenue"
      }, {
        id: 4,
        name: "Ananya Gupta",
        class: "9-A",
        stop: "Cedar Lane"
      }]);
    }
    setLoading(false);
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStudent = {
      name: String(formData.get("name")),
      class: String(formData.get("class")),
      stop: String(formData.get("stop"))
    };
    await addPassenger(newStudent);
    toast.success("Student added successfully");
    setOpen(false);
    fetchStudents();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold md:text-3xl", children: "Students" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage student records from Supabase backend." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
        "Add Student"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Class" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Stop" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 4, className: "text-center py-8", children: "Loading..." }) }) : students.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 4, className: "text-center py-8", children: "No students found." }) }) : students.map((student) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: student.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: student.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: student.class }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: student.stop })
      ] }, student.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAdd, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Student" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Save student data into Supabase database." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Student Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", name: "name", placeholder: "Soumya", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "class", children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "class", name: "class", placeholder: "10A", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "stop", children: "Stop" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "stop", name: "stop", placeholder: "Main Road", required: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Save" })
      ] })
    ] }) }) })
  ] });
}
export {
  Students as component
};
