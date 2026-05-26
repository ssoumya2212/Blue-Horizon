import { T as reactExports, K as jsxRuntimeExports } from "./server-Dv4jboWA.js";
import { c as createLucideIcon, u as useNavigate, L as Link, a as Logo, o as objectType, s as stringType, l as literalType } from "./router-6xa8Ve6B.js";
import { C as Card } from "./card-DhtMIOYd.js";
import { I as Input } from "./input-LPedmjRM.js";
import { B as Button } from "./button-DtL4ZNhn.js";
import { e as useForm, u, T as Tabs, c as TabsList, d as TabsTrigger, b as Lock, a as EyeOff, E as Eye, L as LoaderCircle } from "./zod-CIfu899C.js";
import { T as ThemeToggle } from "./ThemeToggle-BuC7ZsET.js";
import { s as signIn, h as homeFor } from "./auth-ILkY_i2v.js";
import { c as signUp } from "./auth-20Md6wYB.js";
import { t as toast } from "./index-gz2JDtlF.js";
import { M as Mail } from "./mail-DnfCuGJ2.js";
import { P as Phone } from "./phone-BttuFrv3.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./utils-8RO4xBwZ.js";
import "./index-DGerINCC.js";
import "./index-CYgIzWx0.js";
import "./index-DHHt66mv.js";
import "./index-BM__C8jw.js";
import "./index-BlRSmZ-w.js";
import "./index-Bv_FXs5l.js";
import "./index-vLNJ0FKc.js";
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const signupSchema = objectType({
  name: stringType().min(2, "Name is required"),
  email: stringType().email("Invalid email address"),
  phone: stringType().min(10, "Phone number is too short").optional().or(literalType("")),
  password: stringType().min(6, "Password must be at least 6 characters")
});
function Signup() {
  const [role, setRole] = reactExports.useState("parent");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm({
    resolver: u(signupSchema)
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await signUp(data.email, data.password);
      if (res && res.error) {
        let msg = "Server Error. Please try again.";
        const err = res.error.toLowerCase();
        if (err.includes("already registered") || err.includes("already exists")) {
          msg = "User already exists. Please log in.";
        } else if (err.includes("network") || err.includes("fetch")) {
          msg = "Server Error. Please try again.";
        } else {
          msg = res.error;
        }
        toast.error(msg, {
          className: "text-destructive border-destructive"
        });
        setIsLoading(false);
        return;
      }
      toast.success("Account created successfully!", {
        className: "text-success border-success"
      });
      signIn(data.name, role);
      navigate({
        to: homeFor(role)
      });
    } catch (err) {
      toast.error("Server Error. Please try again.", {
        className: "text-destructive border-destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col relative", style: {
    background: "var(--gradient-hero)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "container mx-auto flex items-center justify-between px-4 py-4 relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { variant: "light" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-center justify-center px-4 py-8 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card w-full max-w-md p-8 shadow-[var(--shadow-elegant)] border-0 rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Create account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Join Blue Horizon" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: role, onValueChange: (v) => setRole(v), className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, { className: "grid h-14 w-full grid-cols-3 rounded-xl bg-black/10 backdrop-blur-md p-1 gap-1", children: ["parent", "driver", "admin"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: r, disabled: isLoading, className: "capitalize h-full rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300", children: r }, r)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "mt-8 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.name ? "border-destructive focus-within:border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...register("name"), placeholder: "Full name", className: "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0", disabled: isLoading })
          ] }),
          errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive mt-1 ml-1", children: errors.name.message })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.email ? "border-destructive focus-within:border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...register("email"), placeholder: "Email address", type: "email", className: "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0", disabled: isLoading })
          ] }),
          errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive mt-1 ml-1", children: errors.email.message })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.phone ? "border-destructive focus-within:border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...register("phone"), placeholder: "Phone number (optional)", className: "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0", disabled: isLoading })
          ] }),
          errors.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive mt-1 ml-1", children: errors.phone.message })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.password ? "border-destructive focus-within:border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: showPassword ? "text" : "password", ...register("password"), placeholder: "Password", className: "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0", disabled: isLoading }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "text-muted-foreground hover:text-foreground transition-colors", disabled: isLoading, children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-5 w-5" }) })
          ] }),
          errors.password && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive mt-1 ml-1", children: errors.password.message })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "h-12 w-full mt-6 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all", disabled: isLoading, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : "Create account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "font-medium text-primary hover:underline", children: "Sign in" })
      ] })
    ] }) })
  ] });
}
export {
  Signup as component
};
