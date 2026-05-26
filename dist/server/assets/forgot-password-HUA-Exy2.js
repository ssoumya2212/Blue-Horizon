import { T as reactExports, K as jsxRuntimeExports } from "./server-Dv4jboWA.js";
import { u as useNavigate, L as Link, a as Logo } from "./router-6xa8Ve6B.js";
import { C as Card } from "./card-DhtMIOYd.js";
import { I as Input } from "./input-LPedmjRM.js";
import { B as Button } from "./button-DtL4ZNhn.js";
import { T as ThemeToggle } from "./ThemeToggle-BuC7ZsET.js";
import { P as Phone } from "./phone-BttuFrv3.js";
import { K as KeyRound } from "./key-round-pp1td6-z.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./utils-8RO4xBwZ.js";
import "./index-DGerINCC.js";
function Forgot() {
  const [step, setStep] = reactExports.useState("phone");
  const [phone, setPhone] = reactExports.useState("");
  const [otp, setOtp] = reactExports.useState("");
  const [resent, setResent] = reactExports.useState(false);
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", style: {
    background: "var(--gradient-hero)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "container mx-auto flex items-center justify-between px-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { variant: "light" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-center justify-center px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md p-8 shadow-[var(--shadow-elegant)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-center", children: "FORGOT PASSWORD" }),
      step === "phone" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        setStep("otp");
      }, className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg border bg-background px-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "Phone number", className: "border-0 px-0 shadow-none focus-visible:ring-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "h-11 w-full font-semibold", children: "SEND OTP" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        navigate({
          to: "/login"
        });
      }, className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg border bg-background px-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-5 w-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: otp, onChange: (e) => setOtp(e.target.value), placeholder: "Enter OTP", className: "border-0 px-0 shadow-none focus-visible:ring-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs font-semibold tracking-wider text-muted-foreground", children: resent ? "OTP SENT ALREADY!" : "OTP SENT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "h-11 w-full font-semibold", children: "ENTER" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setResent(true), children: "RESEND OTP" }) })
      ] })
    ] }) })
  ] });
}
export {
  Forgot as component
};
