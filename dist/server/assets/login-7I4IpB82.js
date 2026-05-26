import { T as reactExports, K as jsxRuntimeExports } from "./server-R_mBchsc.js";
import { c as createLucideIcon, u as useNavigate, L as Link, a as Logo, o as objectType, s as stringType } from "./router-CEqblTjI.js";
import { B as Button } from "./button-DVt9JBnU.js";
import { I as Input } from "./input-DrmQmEmz.js";
import { e as useForm, u, T as Tabs, c as TabsList, d as TabsTrigger, L as LoaderCircle, b as Lock, a as EyeOff, E as Eye } from "./zod-SNifna5A.js";
import { C as Card } from "./card-B7CuyrHp.js";
import { T as ThemeToggle } from "./ThemeToggle-GrrcEe-E.js";
import { s as signIn, h as homeFor } from "./auth-ILkY_i2v.js";
import { a as sendOtp, d as verifyOtp, s as sendEmailOtp, v as verifyEmailOtp, b as signIn$1 } from "./auth-DpcDNhtC.js";
import { t as toast } from "./index-C4HfW7Dv.js";
import { I as InputOTP, a as InputOTPGroup, c as InputOTPSlot, b as InputOTPSeparator } from "./input-otp-ZrSrc_ci.js";
import { P as Phone } from "./phone-BvqSOp6X.js";
import { M as Mail } from "./mail-BKQps140.js";
import { K as KeyRound } from "./key-round-DQEJWFrB.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-DGerINCC.js";
import "./utils-8RO4xBwZ.js";
import "./index-B8AOILd2.js";
import "./index-Lhd0usrm.js";
import "./index-CPSIAqeD.js";
import "./index-DX3xhyrQ.js";
import "./index-B0xEJS19.js";
import "./index-DVrpuVCN.js";
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode);
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
    resolver: u(loginSchema)
  });
  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    getValues: getPhoneValues,
    formState: {
      errors: phoneErrors
    }
  } = useForm({
    resolver: u(phoneSchema)
  });
  const {
    register: registerEmailOtp,
    handleSubmit: handleEmailOtpSubmit,
    getValues: getEmailOtpValues,
    formState: {
      errors: emailOtpErrors
    }
  } = useForm({
    resolver: u(emailOtpSchema)
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
