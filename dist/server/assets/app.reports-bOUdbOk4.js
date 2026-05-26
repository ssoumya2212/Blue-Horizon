import { r as reactExports, W as jsxRuntimeExports } from "./server-istEu6hz.js";
import { C as Card } from "./card-Bo6_-eoI.js";
import { B as Button } from "./button-CavBh9lM.js";
import { T as Textarea } from "./textarea-CrslPvpQ.js";
import { toast } from "./index-DfOh3Nj3.js";
import { u as useReports, t as timeAgo, a as addReport } from "./reports-CuZ3otH8.js";
import { u as useSearchQuery } from "./search-C5CAsgh8.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./utils-BH6shBk-.js";
import "./index-BNcWPUAp.js";
import "./router-BsyVVfp8.js";
function Reports() {
  const reports = useReports();
  const [text, setText] = reactExports.useState("");
  const q = useSearchQuery().toLowerCase();
  const filtered = q ? reports.filter((r) => r.text.toLowerCase().includes(q) || r.author.toLowerCase().includes(q)) : reports;
  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addReport(text.trim());
    setText("");
    toast.success("Report submitted");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold md:text-3xl", children: "Reports" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Submit and review incident reports." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "New report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-4 space-y-3", onSubmit: submit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 8, placeholder: "Enter Report Details…", value: text, onChange: (e) => setText(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full sm:w-auto", children: "SUBMIT" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Recent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-3 space-y-3", children: [
          filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-lg border-l-4 border-primary bg-primary/5 p-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: r.text }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
              r.author,
              " • ",
              timeAgo(r.createdAt)
            ] })
          ] }, r.id)),
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-sm text-muted-foreground", children: "No reports match your search." })
        ] })
      ] })
    ] })
  ] });
}
export {
  Reports as component
};
