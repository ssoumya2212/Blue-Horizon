import { r as reactExports, W as jsxRuntimeExports } from "./server-istEu6hz.js";
import { c as createLucideIcon, u as useNavigate, L as Link, a as Logo, o as objectType, s as stringType } from "./router-BsyVVfp8.js";
import { B as Button } from "./button-CavBh9lM.js";
import { I as Input } from "./input-CRWvdhoz.js";
import { u as useForm, a, T as Tabs, b as TabsList, c as TabsTrigger, e as LoaderCircle, L as Lock, E as EyeOff, d as Eye, f as sendOtp, v as verifyOtp, g as sendEmailOtp, h as verifyEmailOtp, i as signIn$1 } from "./zod-Be2bNEvv.js";
import { C as Card } from "./card-Bo6_-eoI.js";
import { T as ThemeToggle } from "./ThemeToggle-CT1EI-rk.js";
import { s as signIn, h as homeFor } from "./auth-ILkY_i2v.js";
import { toast } from "./index-DfOh3Nj3.js";
import { c as cn } from "./utils-BH6shBk-.js";
import { P as Phone } from "./phone-BamwcjZY.js";
import { M as Mail } from "./mail-DjzGoayh.js";
import { K as KeyRound } from "./key-round-wvTAT9Mv.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-BNcWPUAp.js";
import "./index-C1Q8V0C-.js";
import "./index-CrY51Zax.js";
import "./index-6_iX33Gv.js";
import "./index-CT11DaeY.js";
import "./index-DrzusK0R.js";
import "./index-Q0VUDqDg.js";
const __iconNode$1 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$1);
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
var Bt = Object.defineProperty, At = Object.defineProperties;
var kt = Object.getOwnPropertyDescriptors;
var Y = Object.getOwnPropertySymbols;
var gt = Object.prototype.hasOwnProperty, Et = Object.prototype.propertyIsEnumerable;
var vt = (r, s, e) => s in r ? Bt(r, s, { enumerable: true, configurable: true, writable: true, value: e }) : r[s] = e, St = (r, s) => {
  for (var e in s || (s = {})) gt.call(s, e) && vt(r, e, s[e]);
  if (Y) for (var e of Y(s)) Et.call(s, e) && vt(r, e, s[e]);
  return r;
}, bt = (r, s) => At(r, kt(s));
var Pt = (r, s) => {
  var e = {};
  for (var u in r) gt.call(r, u) && s.indexOf(u) < 0 && (e[u] = r[u]);
  if (r != null && Y) for (var u of Y(r)) s.indexOf(u) < 0 && Et.call(r, u) && (e[u] = r[u]);
  return e;
};
function ht(r) {
  let s = setTimeout(r, 0), e = setTimeout(r, 10), u = setTimeout(r, 50);
  return [s, e, u];
}
function _t(r) {
  let s = reactExports.useRef();
  return reactExports.useEffect(() => {
    s.current = r;
  }), s.current;
}
var Ot = 18, wt = 40, Gt = `${wt}px`, xt = ["[data-lastpass-icon-root]", "com-1password-button", "[data-dashlanecreated]", '[style$="2147483647 !important;"]'].join(",");
function Tt({ containerRef: r, inputRef: s, pushPasswordManagerStrategy: e, isFocused: u }) {
  let [P, D] = reactExports.useState(false), [G, H] = reactExports.useState(false), [F, W] = reactExports.useState(false), Z = reactExports.useMemo(() => e === "none" ? false : (e === "increase-width" || e === "experimental-no-flickering") && P && G, [P, G, e]), T = reactExports.useCallback(() => {
    let f = r.current, h = s.current;
    if (!f || !h || F || e === "none") return;
    let a2 = f, B = a2.getBoundingClientRect().left + a2.offsetWidth, A = a2.getBoundingClientRect().top + a2.offsetHeight / 2, z = B - Ot, q = A;
    document.querySelectorAll(xt).length === 0 && document.elementFromPoint(z, q) === f || (D(true), W(true));
  }, [r, s, F, e]);
  return reactExports.useEffect(() => {
    let f = r.current;
    if (!f || e === "none") return;
    function h() {
      let A = window.innerWidth - f.getBoundingClientRect().right;
      H(A >= wt);
    }
    h();
    let a2 = setInterval(h, 1e3);
    return () => {
      clearInterval(a2);
    };
  }, [r, e]), reactExports.useEffect(() => {
    let f = u || document.activeElement === s.current;
    if (e === "none" || !f) return;
    let h = setTimeout(T, 0), a2 = setTimeout(T, 2e3), B = setTimeout(T, 5e3), A = setTimeout(() => {
      W(true);
    }, 6e3);
    return () => {
      clearTimeout(h), clearTimeout(a2), clearTimeout(B), clearTimeout(A);
    };
  }, [s, u, e, T]), { hasPWMBadge: P, willPushPWMBadge: Z, PWM_BADGE_SPACE_WIDTH: Gt };
}
var jt = reactExports.createContext({}), Lt = reactExports.forwardRef((A, B) => {
  var z = A, { value: r, onChange: s, maxLength: e, textAlign: u = "left", pattern: P, placeholder: D, inputMode: G = "numeric", onComplete: H, pushPasswordManagerStrategy: F = "increase-width", pasteTransformer: W, containerClassName: Z, noScriptCSSFallback: T = Nt, render: f, children: h } = z, a2 = Pt(z, ["value", "onChange", "maxLength", "textAlign", "pattern", "placeholder", "inputMode", "onComplete", "pushPasswordManagerStrategy", "pasteTransformer", "containerClassName", "noScriptCSSFallback", "render", "children"]);
  var X, lt, ut, dt, ft;
  let [q, nt] = reactExports.useState(typeof a2.defaultValue == "string" ? a2.defaultValue : ""), i = r != null ? r : q, I = _t(i), x = reactExports.useCallback((t) => {
    s == null || s(t), nt(t);
  }, [s]), m = reactExports.useMemo(() => P ? typeof P == "string" ? new RegExp(P) : P : null, [P]), l = reactExports.useRef(null), K = reactExports.useRef(null), J = reactExports.useRef({ value: i, onChange: x, isIOS: typeof window != "undefined" && ((lt = (X = window == null ? void 0 : window.CSS) == null ? void 0 : X.supports) == null ? void 0 : lt.call(X, "-webkit-touch-callout", "none")) }), V = reactExports.useRef({ prev: [(ut = l.current) == null ? void 0 : ut.selectionStart, (dt = l.current) == null ? void 0 : dt.selectionEnd, (ft = l.current) == null ? void 0 : ft.selectionDirection] });
  reactExports.useImperativeHandle(B, () => l.current, []), reactExports.useEffect(() => {
    let t = l.current, o = K.current;
    if (!t || !o) return;
    J.current.value !== t.value && J.current.onChange(t.value), V.current.prev = [t.selectionStart, t.selectionEnd, t.selectionDirection];
    function d() {
      if (document.activeElement !== t) {
        L(null), N(null);
        return;
      }
      let c = t.selectionStart, b = t.selectionEnd, mt = t.selectionDirection, v = t.maxLength, C = t.value, _ = V.current.prev, g = -1, E = -1, w;
      if (C.length !== 0 && c !== null && b !== null) {
        let Dt = c === b, Ht = c === C.length && C.length < v;
        if (Dt && !Ht) {
          let y = c;
          if (y === 0) g = 0, E = 1, w = "forward";
          else if (y === v) g = y - 1, E = y, w = "backward";
          else if (v > 1 && C.length > 1) {
            let et = 0;
            if (_[0] !== null && _[1] !== null) {
              w = y < _[1] ? "backward" : "forward";
              let Wt = _[0] === _[1] && _[0] < v;
              w === "backward" && !Wt && (et = -1);
            }
            g = et + y, E = et + y + 1;
          }
        }
        g !== -1 && E !== -1 && g !== E && l.current.setSelectionRange(g, E, w);
      }
      let pt = g !== -1 ? g : c, Rt = E !== -1 ? E : b, yt = w != null ? w : mt;
      L(pt), N(Rt), V.current.prev = [pt, Rt, yt];
    }
    if (document.addEventListener("selectionchange", d, { capture: true }), d(), document.activeElement === t && Q(true), !document.getElementById("input-otp-style")) {
      let c = document.createElement("style");
      if (c.id = "input-otp-style", document.head.appendChild(c), c.sheet) {
        let b = "background: transparent !important; color: transparent !important; border-color: transparent !important; opacity: 0 !important; box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-text-fill-color: transparent !important;";
        $(c.sheet, "[data-input-otp]::selection { background: transparent !important; color: transparent !important; }"), $(c.sheet, `[data-input-otp]:autofill { ${b} }`), $(c.sheet, `[data-input-otp]:-webkit-autofill { ${b} }`), $(c.sheet, "@supports (-webkit-touch-callout: none) { [data-input-otp] { letter-spacing: -.6em !important; font-weight: 100 !important; font-stretch: ultra-condensed; font-optical-sizing: none !important; left: -1px !important; right: 1px !important; } }"), $(c.sheet, "[data-input-otp] + * { pointer-events: all !important; }");
      }
    }
    let R = () => {
      o && o.style.setProperty("--root-height", `${t.clientHeight}px`);
    };
    R();
    let p = new ResizeObserver(R);
    return p.observe(t), () => {
      document.removeEventListener("selectionchange", d, { capture: true }), p.disconnect();
    };
  }, []);
  let [ot, rt] = reactExports.useState(false), [j, Q] = reactExports.useState(false), [M, L] = reactExports.useState(null), [k, N] = reactExports.useState(null);
  reactExports.useEffect(() => {
    ht(() => {
      var R, p, c, b;
      (R = l.current) == null || R.dispatchEvent(new Event("input"));
      let t = (p = l.current) == null ? void 0 : p.selectionStart, o = (c = l.current) == null ? void 0 : c.selectionEnd, d = (b = l.current) == null ? void 0 : b.selectionDirection;
      t !== null && o !== null && (L(t), N(o), V.current.prev = [t, o, d]);
    });
  }, [i, j]), reactExports.useEffect(() => {
    I !== void 0 && i !== I && I.length < e && i.length === e && (H == null || H(i));
  }, [e, H, I, i]);
  let O = Tt({ containerRef: K, inputRef: l, pushPasswordManagerStrategy: F, isFocused: j }), st = reactExports.useCallback((t) => {
    let o = t.currentTarget.value.slice(0, e);
    if (o.length > 0 && m && !m.test(o)) {
      t.preventDefault();
      return;
    }
    typeof I == "string" && o.length < I.length && document.dispatchEvent(new Event("selectionchange")), x(o);
  }, [e, x, I, m]), at = reactExports.useCallback(() => {
    var t;
    if (l.current) {
      let o = Math.min(l.current.value.length, e - 1), d = l.current.value.length;
      (t = l.current) == null || t.setSelectionRange(o, d), L(o), N(d);
    }
    Q(true);
  }, [e]), ct = reactExports.useCallback((t) => {
    var g, E;
    let o = l.current;
    if (!W && (!J.current.isIOS || !t.clipboardData || !o)) return;
    let d = t.clipboardData.getData("text/plain"), R = W ? W(d) : d;
    t.preventDefault();
    let p = (g = l.current) == null ? void 0 : g.selectionStart, c = (E = l.current) == null ? void 0 : E.selectionEnd, v = (p !== c ? i.slice(0, p) + R + i.slice(c) : i.slice(0, p) + R + i.slice(p)).slice(0, e);
    if (v.length > 0 && m && !m.test(v)) return;
    o.value = v, x(v);
    let C = Math.min(v.length, e - 1), _ = v.length;
    o.setSelectionRange(C, _), L(C), N(_);
  }, [e, x, m, i]), It = reactExports.useMemo(() => ({ position: "relative", cursor: a2.disabled ? "default" : "text", userSelect: "none", WebkitUserSelect: "none", pointerEvents: "none" }), [a2.disabled]), it = reactExports.useMemo(() => ({ position: "absolute", inset: 0, width: O.willPushPWMBadge ? `calc(100% + ${O.PWM_BADGE_SPACE_WIDTH})` : "100%", clipPath: O.willPushPWMBadge ? `inset(0 ${O.PWM_BADGE_SPACE_WIDTH} 0 0)` : void 0, height: "100%", display: "flex", textAlign: u, opacity: "1", color: "transparent", pointerEvents: "all", background: "transparent", caretColor: "transparent", border: "0 solid transparent", outline: "0 solid transparent", boxShadow: "none", lineHeight: "1", letterSpacing: "-.5em", fontSize: "var(--root-height)", fontFamily: "monospace", fontVariantNumeric: "tabular-nums" }), [O.PWM_BADGE_SPACE_WIDTH, O.willPushPWMBadge, u]), Mt = reactExports.useMemo(() => reactExports.createElement("input", bt(St({ autoComplete: a2.autoComplete || "one-time-code" }, a2), { "data-input-otp": true, "data-input-otp-placeholder-shown": i.length === 0 || void 0, "data-input-otp-mss": M, "data-input-otp-mse": k, inputMode: G, pattern: m == null ? void 0 : m.source, "aria-placeholder": D, style: it, maxLength: e, value: i, ref: l, onPaste: (t) => {
    var o;
    ct(t), (o = a2.onPaste) == null || o.call(a2, t);
  }, onChange: st, onMouseOver: (t) => {
    var o;
    rt(true), (o = a2.onMouseOver) == null || o.call(a2, t);
  }, onMouseLeave: (t) => {
    var o;
    rt(false), (o = a2.onMouseLeave) == null || o.call(a2, t);
  }, onFocus: (t) => {
    var o;
    at(), (o = a2.onFocus) == null || o.call(a2, t);
  }, onBlur: (t) => {
    var o;
    Q(false), (o = a2.onBlur) == null || o.call(a2, t);
  } })), [st, at, ct, G, it, e, k, M, a2, m == null ? void 0 : m.source, i]), tt = reactExports.useMemo(() => ({ slots: Array.from({ length: e }).map((t, o) => {
    var c;
    let d = j && M !== null && k !== null && (M === k && o === M || o >= M && o < k), R = i[o] !== void 0 ? i[o] : null, p = i[0] !== void 0 ? null : (c = D == null ? void 0 : D[o]) != null ? c : null;
    return { char: R, placeholderChar: p, isActive: d, hasFakeCaret: d && R === null };
  }), isFocused: j, isHovering: !a2.disabled && ot }), [j, ot, e, k, M, a2.disabled, i]), Ct = reactExports.useMemo(() => f ? f(tt) : reactExports.createElement(jt.Provider, { value: tt }, h), [h, tt, f]);
  return reactExports.createElement(reactExports.Fragment, null, T !== null && reactExports.createElement("noscript", null, reactExports.createElement("style", null, T)), reactExports.createElement("div", { ref: K, "data-input-otp-container": true, style: It, className: Z }, Ct, reactExports.createElement("div", { style: { position: "absolute", inset: 0, pointerEvents: "none" } }, Mt)));
});
Lt.displayName = "Input";
function $(r, s) {
  try {
    r.insertRule(s);
  } catch (e) {
    console.error("input-otp could not insert CSS rule:", s);
  }
}
var Nt = `
[data-input-otp] {
  --nojs-bg: white !important;
  --nojs-fg: black !important;

  background-color: var(--nojs-bg) !important;
  color: var(--nojs-fg) !important;
  caret-color: var(--nojs-fg) !important;
  letter-spacing: .25em !important;
  text-align: center !important;
  border: 1px solid var(--nojs-fg) !important;
  border-radius: 4px !important;
  width: 100% !important;
}
@media (prefers-color-scheme: dark) {
  [data-input-otp] {
    --nojs-bg: black !important;
    --nojs-fg: white !important;
  }
}`;
const InputOTP = reactExports.forwardRef(({ className, containerClassName, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Lt,
  {
    ref,
    containerClassName: cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    ),
    className: cn("disabled:cursor-not-allowed", className),
    ...props
  }
));
InputOTP.displayName = "InputOTP";
const InputOTPGroup = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center", className), ...props }));
InputOTPGroup.displayName = "InputOTPGroup";
const InputOTPSlot = reactExports.forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = reactExports.useContext(jt);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref,
      className: cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      ),
      ...props,
      children: [
        char,
        hasFakeCaret && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px animate-caret-blink bg-foreground duration-1000" }) })
      ]
    }
  );
});
InputOTPSlot.displayName = "InputOTPSlot";
const InputOTPSeparator = reactExports.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, role: "separator", ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, {}) }));
InputOTPSeparator.displayName = "InputOTPSeparator";
const loginSchema = objectType({
  email: stringType().min(1, "Email and Password Required").email("Invalid email address"),
  password: stringType().min(1, "Email and Password Required").min(6, "Password must contain at least 6 characters")
});
const phoneSchema = objectType({
  phone: stringType().min(10, "Valid phone number required (e.g. +1234567890)")
});
const emailOtpSchema = objectType({
  email: stringType().min(1, "Email required").email("Invalid email address")
});
function LoginPage() {
  const [role, setRole] = reactExports.useState("parent");
  const [authMode, setAuthMode] = reactExports.useState("phone");
  const [step, setStep] = reactExports.useState("input");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [otpToken, setOtpToken] = reactExports.useState("");
  const navigate = useNavigate();
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: {
      errors: emailErrors
    }
  } = useForm({
    resolver: a(loginSchema)
  });
  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    getValues: getPhoneValues,
    formState: {
      errors: phoneErrors
    }
  } = useForm({
    resolver: a(phoneSchema)
  });
  const {
    register: registerEmailOtp,
    handleSubmit: handleEmailOtpSubmit,
    getValues: getEmailOtpValues,
    formState: {
      errors: emailOtpErrors
    }
  } = useForm({
    resolver: a(emailOtpSchema)
  });
  const onEmailSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await signIn$1(data.email, data.password);
      if (res && res.error) {
        toast.error(res.error, {
          className: "text-destructive border-destructive"
        });
        setIsLoading(false);
        return;
      }
      toast.success("Login Successful");
      signIn(data.email, role);
      navigate({
        to: homeFor(role)
      });
    } catch (err) {
      toast.error("Server Error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const onSendOtp = async (data) => {
    setIsLoading(true);
    try {
      const formattedPhone = data.phone.startsWith("+") ? data.phone : `+${data.phone}`;
      const res = await sendOtp(formattedPhone);
      if (res && res.error) {
        toast.error(res.error);
        const errStr = res.error.toLowerCase();
        if (errStr.includes("sms") || errStr.includes("provider") || errStr.includes("rate limit") || errStr.includes("not configured")) {
          toast.info("Proceeding to OTP screen for UI demonstration.");
          setStep("otp");
        }
        setIsLoading(false);
        return;
      }
      toast.success("OTP Sent! Check your messages.");
      setStep("otp");
    } catch (err) {
      toast.error("Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };
  const onVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpToken.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    setIsLoading(true);
    try {
      let phone = getPhoneValues("phone");
      phone = phone.startsWith("+") ? phone : `+${phone}`;
      const res = await verifyOtp(phone, otpToken);
      if (res && res.error) {
        toast.error(res.error);
        setIsLoading(false);
        return;
      }
      toast.success("Login Successful");
      signIn(phone, role);
      navigate({
        to: homeFor(role)
      });
    } catch (err) {
      toast.error("Failed to verify OTP.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendOtp = async () => {
    let phone = getPhoneValues("phone");
    if (!phone) return;
    phone = phone.startsWith("+") ? phone : `+${phone}`;
    setIsLoading(true);
    try {
      const res = await sendOtp(phone);
      if (res && res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("OTP Resent!");
    } catch {
      toast.error("Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };
  const onSendEmailOtp = async (data) => {
    setIsLoading(true);
    try {
      const res = await sendEmailOtp(data.email);
      if (res && res.error) {
        toast.error(res.error);
        const errStr = res.error.toLowerCase();
        if (errStr.includes("smtp") || errStr.includes("provider") || errStr.includes("rate limit") || errStr.includes("not configured")) {
          toast.info("Proceeding to OTP screen for UI demonstration.");
          setStep("otp");
        }
        setIsLoading(false);
        return;
      }
      toast.success("OTP Sent! Check your email inbox.");
      setStep("otp");
    } catch (err) {
      toast.error("Failed to send Email OTP.");
    } finally {
      setIsLoading(false);
    }
  };
  const onVerifyEmailOtp = async (e) => {
    e.preventDefault();
    if (otpToken.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    setIsLoading(true);
    try {
      const email = getEmailOtpValues("email");
      const res = await verifyEmailOtp(email, otpToken);
      if (res && res.error) {
        toast.error(res.error);
        setIsLoading(false);
        return;
      }
      toast.success("Login Successful");
      signIn(email, role);
      navigate({
        to: homeFor(role)
      });
    } catch (err) {
      toast.error("Failed to verify Email OTP.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendEmailOtp = async () => {
    const email = getEmailOtpValues("email");
    if (!email) return;
    setIsLoading(true);
    try {
      const res = await sendEmailOtp(email);
      if (res && res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("OTP Resent!");
    } catch {
      toast.error("Failed to resend Email OTP.");
    } finally {
      setIsLoading(false);
    }
  };
  const switchMode = (mode) => {
    setAuthMode(mode);
    setStep("input");
    setOtpToken("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex min-h-screen flex-col", style: {
    background: "var(--gradient-hero)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "container mx-auto flex items-center justify-between px-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { variant: "light" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-center justify-center px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card w-full max-w-md overflow-hidden p-0 border-0 rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: role, onValueChange: (v) => setRole(v), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, { className: "grid h-14 w-full grid-cols-3 rounded-none bg-black/10 backdrop-blur-md p-1 gap-1", children: ["parent", "driver", "admin"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: r, disabled: isLoading, className: "h-full rounded-xl capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300", children: r }, r)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Sign In" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground capitalize", children: [
            "Welcome back, ",
            role
          ] })
        ] }),
        authMode === "phone" && (step === "input" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handlePhoneSubmit(onSendOtp), className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${phoneErrors.phone ? "border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...registerPhone("phone"), placeholder: "Phone number (e.g. +1234567890)", className: "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0", disabled: isLoading })
            ] }),
            phoneErrors.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive mt-1 ml-1", children: phoneErrors.phone.message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "h-12 w-full text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all", disabled: isLoading, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : "Send SMS OTP" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onVerifyOtp, className: "space-y-6 flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground text-center", children: [
            "Enter the 6-digit code sent to ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: getPhoneValues("phone") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(InputOTP, { maxLength: 6, value: otpToken, onChange: (value) => setOtpToken(value), disabled: isLoading, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(InputOTPGroup, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 2 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(InputOTPGroup, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 3 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 4 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 5 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "h-12 w-full text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all", disabled: isLoading || otpToken.length !== 6, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : "Verify & Login" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setStep("input"), disabled: isLoading, className: "text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
                " Back"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: handleResendOtp, disabled: isLoading, className: "text-primary font-medium", children: "Resend Code" })
            ] })
          ] })
        ] })),
        authMode === "email_otp" && (step === "input" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEmailOtpSubmit(onSendEmailOtp), className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${emailOtpErrors.email ? "border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...registerEmailOtp("email"), placeholder: "Email address", className: "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0", disabled: isLoading })
            ] }),
            emailOtpErrors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive mt-1 ml-1", children: emailOtpErrors.email.message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "h-12 w-full text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all", disabled: isLoading, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : "Send Email OTP" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onVerifyEmailOtp, className: "space-y-6 flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground text-center", children: [
            "Enter the 6-digit code sent to ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: getEmailOtpValues("email") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(InputOTP, { maxLength: 6, value: otpToken, onChange: (value) => setOtpToken(value), disabled: isLoading, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(InputOTPGroup, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 2 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(InputOTPGroup, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 3 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 4 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 5 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "h-12 w-full text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all", disabled: isLoading || otpToken.length !== 6, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : "Verify & Login" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setStep("input"), disabled: isLoading, className: "text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
                " Back"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: handleResendEmailOtp, disabled: isLoading, className: "text-primary font-medium", children: "Resend Code" })
            ] })
          ] })
        ] })),
        authMode === "email_password" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEmailSubmit(onEmailSubmit), className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${emailErrors.email ? "border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...registerEmail("email"), placeholder: "Email address", className: "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0", disabled: isLoading })
              ] }),
              emailErrors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive mt-1 ml-1", children: emailErrors.email.message })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${emailErrors.password ? "border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: showPassword ? "text" : "password", ...registerEmail("password"), placeholder: "Password", className: "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0", disabled: isLoading }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "text-muted-foreground hover:text-foreground transition-colors", disabled: isLoading, children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-5 w-5" }) })
              ] }),
              emailErrors.password && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive mt-1 ml-1", children: emailErrors.password.message })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "h-12 w-full text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all", disabled: isLoading, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : "LOGIN" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative my-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-full border-t" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-background px-2 text-muted-foreground", children: "Or continue with" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
          authMode !== "phone" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", className: "w-full rounded-xl h-11 justify-start px-4", onClick: () => switchMode("phone"), disabled: isLoading, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "mr-3 h-4 w-4 text-muted-foreground" }),
            " ",
            "Continue with Phone (OTP)"
          ] }),
          authMode !== "email_otp" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", className: "w-full rounded-xl h-11 justify-start px-4", onClick: () => switchMode("email_otp"), disabled: isLoading, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "mr-3 h-4 w-4 text-muted-foreground" }),
            " ",
            "Continue with Email (OTP)"
          ] }),
          authMode !== "email_password" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", className: "w-full rounded-xl h-11 justify-start px-4", onClick: () => switchMode("email_password"), disabled: isLoading, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "mr-3 h-4 w-4 text-muted-foreground" }),
            " ",
            "Continue with Email & Password"
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pb-6 text-center text-xs text-white/70", children: "© 2025 Blue Horizon Public School – All Rights Reserved" })
  ] });
}
export {
  LoginPage as component
};
