import { T as reactExports, K as jsxRuntimeExports } from "./server-Dv4jboWA.js";
import { C as Card } from "./card-DhtMIOYd.js";
import { u as useControllableState, P as Primitive, c as composeEventHandlers, b as createContextScope } from "./index-CYgIzWx0.js";
import { u as useComposedRefs, B as Button } from "./button-DtL4ZNhn.js";
import { u as useSize } from "./index-DACX3frf.js";
import { a as cn } from "./utils-8RO4xBwZ.js";
import { I as Input } from "./input-LPedmjRM.js";
import { t as toast } from "./index-gz2JDtlF.js";
import { d as verifyOtp, v as verifyEmailOtp, a as sendOtp, s as sendEmailOtp } from "./auth-20Md6wYB.js";
import { I as InputOTP, a as InputOTPGroup, c as InputOTPSlot } from "./input-otp-t5Jwu0FP.js";
import { B as Bell } from "./bell-DEsH8yWS.js";
import { c as createLucideIcon } from "./router-6xa8Ve6B.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-DHHt66mv.js";
import "./index-DGerINCC.js";
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "22", x2: "18", y1: "12", y2: "12", key: "l9bcsi" }],
  ["line", { x1: "6", x2: "2", y1: "12", y2: "12", key: "13hhkx" }],
  ["line", { x1: "12", x2: "12", y1: "6", y2: "2", key: "10w3f3" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "18", key: "15g9kq" }]
];
const Crosshair = createLucideIcon("crosshair", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode$1);
const __iconNode = [
  ["path", { d: "M10 15H6a4 4 0 0 0-4 4v2", key: "1nfge6" }],
  ["path", { d: "m14.305 16.53.923-.382", key: "1itpsq" }],
  ["path", { d: "m15.228 13.852-.923-.383", key: "eplpkm" }],
  ["path", { d: "m16.852 12.228-.383-.923", key: "13v3q0" }],
  ["path", { d: "m16.852 17.772-.383.924", key: "1i8mnm" }],
  ["path", { d: "m19.148 12.228.383-.923", key: "1q8j1v" }],
  ["path", { d: "m19.53 18.696-.382-.924", key: "vk1qj3" }],
  ["path", { d: "m20.772 13.852.924-.383", key: "n880s0" }],
  ["path", { d: "m20.772 16.148.924.383", key: "1g6xey" }],
  ["circle", { cx: "18", cy: "15", r: "3", key: "gjjjvw" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCog = createLucideIcon("user-cog", __iconNode);
function usePrevious(value) {
  const ref = reactExports.useRef({ value, previous: value });
  return reactExports.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Thumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Root.displayName;
const defaultSettings = {
  arrivalNotifications: true,
  departureNotifications: true,
  delayAlerts: true,
  emergencyAlerts: true,
  shareLocation: true,
  dataRetention: false,
  thirdPartyData: false,
  preciseLocation: true,
  tripHistory: false,
  offlineMode: true,
  require2FA: false,
  emailOTP: true,
  phoneOTP: false,
  emailDigests: false
};
function useSettings() {
  const [settings, setSettings] = reactExports.useState(() => {
    try {
      const stored = localStorage.getItem("bh_user_settings");
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  });
  reactExports.useEffect(() => {
    localStorage.setItem("bh_user_settings", JSON.stringify(settings));
  }, [settings]);
  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };
  return { settings, updateSetting };
}
function SettingsOTPSection({
  type
}) {
  const [step, setStep] = reactExports.useState("input");
  const [target, setTarget] = reactExports.useState("");
  const [otp, setOtp] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleSend = async () => {
    if (!target) return;
    setLoading(true);
    try {
      if (type === "phone") {
        await sendOtp(target);
      } else {
        await sendEmailOtp(target);
      }
      toast.success(`${type === "phone" ? "SMS" : "Email"} OTP sent!`);
      setStep("verify");
    } catch (err) {
      const error = err;
      toast.error(error.message || "Failed to send OTP");
      if (error.message?.includes("provider") || error.message?.includes("rate limit")) {
        toast.success("Bypassing for UI Demo...");
        setStep("verify");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      if (type === "phone") {
        await verifyOtp(target, otp);
      } else {
        await verifyEmailOtp(target, otp);
      }
      toast.success(`${type === "phone" ? "Phone" : "Email"} verified successfully!`);
      setStep("input");
      setTarget("");
      setOtp("");
    } catch (err) {
      const error = err;
      toast.error(error.message || "Invalid OTP");
      if (error.message?.includes("provider")) {
        toast.success("Verification Bypassed (Demo)");
        setStep("input");
      }
    } finally {
      setLoading(false);
    }
  };
  if (step === "verify") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-3 p-3 border rounded-lg bg-background shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground", children: [
        "Enter the 6-digit code sent to ",
        target
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTP, { maxLength: 6, value: otp, onChange: setOtp, disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(InputOTPGroup, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 3 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 4 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 5 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: handleVerify, disabled: loading || otp.length !== 6, children: "Verify" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => setStep("input"), disabled: loading, children: "Cancel" })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: type === "email" ? "Enter Email" : "Enter Phone", value: target, onChange: (e) => setTarget(e.target.value), className: "h-8 text-xs max-w-[200px]", disabled: loading }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "h-8 text-xs", onClick: handleSend, disabled: loading || !target, children: "Send OTP" })
  ] });
}
function Settings() {
  const {
    settings,
    updateSetting
  } = useSettings();
  const handleToggle = (key, val) => {
    updateSetting(key, val);
    toast.success("Preference saved");
  };
  const groups = [{
    icon: Bell,
    title: "Notification Preferences",
    items: [{
      id: "arrivalNotifications",
      title: "Arrival Notifications",
      desc: "Get notified when bus is approaching",
      on: settings.arrivalNotifications
    }, {
      id: "departureNotifications",
      title: "Departure Notifications",
      desc: "Get notified when child boards/leaves bus",
      on: settings.departureNotifications
    }, {
      id: "delayAlerts",
      title: "Delay Alerts",
      desc: "Receive alerts for route delays",
      on: settings.delayAlerts
    }, {
      id: "emergencyAlerts",
      title: "Emergency Alerts",
      desc: "Critical safety notifications",
      on: settings.emergencyAlerts
    }]
  }, {
    icon: ShieldCheck,
    title: "Privacy & Data",
    items: [{
      id: "shareLocation",
      title: "Share Location Data",
      desc: "Allow location sharing for better service",
      on: settings.shareLocation
    }, {
      id: "dataRetention",
      title: "Data Retention Period",
      desc: "How long to keep your data",
      on: settings.dataRetention
    }, {
      id: "thirdPartyData",
      title: "Third-party Data Sharing",
      desc: "Share data with education partners",
      on: settings.thirdPartyData
    }]
  }, {
    icon: Crosshair,
    title: "Tracking Preferences",
    items: [{
      id: "preciseLocation",
      title: "Precise Location Tracking",
      desc: "More accurate but uses more battery",
      on: settings.preciseLocation
    }, {
      id: "tripHistory",
      title: "Trip History Retention",
      desc: "How long to keep trip records",
      on: settings.tripHistory
    }, {
      id: "offlineMode",
      title: "Offline Mode",
      desc: "Cache data for offline viewing",
      on: settings.offlineMode
    }]
  }, {
    icon: UserCog,
    title: "Account Management",
    items: [{
      id: "require2FA",
      title: "Two-factor Authentication (2FA)",
      desc: "Require code on sign-in",
      on: settings.require2FA
    }, {
      id: "emailOTP",
      title: "Email Verification (OTP)",
      desc: "Require OTP for sensitive changes",
      on: settings.emailOTP
    }, {
      id: "phoneOTP",
      title: "Phone Verification (SMS OTP)",
      desc: "Send OTP to mobile for alerts",
      on: settings.phoneOTP
    }, {
      id: "emailDigests",
      title: "Email digests",
      desc: "Weekly summary of your child's commute",
      on: settings.emailDigests
    }]
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold md:text-3xl", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Tune your notifications, privacy and tracking preferences." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2", children: groups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b bg-muted/40 px-5 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(g.icon, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: g.title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: g.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex flex-col gap-3 px-5 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: item.desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: item.on, onCheckedChange: (val) => handleToggle(item.id, val) })
        ] }),
        item.title === "Email Verification (OTP)" && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsOTPSection, { type: "email" }),
        item.title === "Phone Verification (SMS OTP)" && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsOTPSection, { type: "phone" }),
        item.title === "Two-factor Authentication (2FA)" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", size: "sm", className: "h-8 text-xs w-fit", onClick: () => {
          toast.info("2FA Enrollment coming soon!");
        }, children: "Configure Authenticator App" }) })
      ] }, item.id)) })
    ] }, g.title)) })
  ] });
}
export {
  Settings as component
};
