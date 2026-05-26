import { r as reactExports, W as jsxRuntimeExports } from "./server-istEu6hz.js";
import { C as Card } from "./card-Bo6_-eoI.js";
import { B as Button } from "./button-CavBh9lM.js";
import { B as Badge } from "./badge-CPcfVpy8.js";
import { I as Input } from "./input-CRWvdhoz.js";
import { L as LoadScript, G as GoogleMap, M as Marker } from "./esm-uIkikaOH.js";
import { u as useFleetPositions } from "./tracking-vVcJev-t.js";
import { c as createLucideIcon, b as supabase, G as GraduationCap } from "./router-BsyVVfp8.js";
import { toast } from "./index-DfOh3Nj3.js";
import { s as subscribeToNotifications, f as fetchNotifications, a as addNotification } from "./notifications-BHQnheDj.js";
import { M as MapPin } from "./map-pin-Vq_TLiGH.js";
import { C as Clock } from "./clock-H7SAUFP4.js";
import { f as formatDistanceToNow, S as Settings } from "./formatDistanceToNow-CkCwV2Ww.js";
import { P as Phone } from "./phone-BamwcjZY.js";
import { M as MessageSquare } from "./message-square-Cst-03T9.js";
import { S as Send } from "./send-B_VDxW6P.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./utils-BH6shBk-.js";
import "./index-BNcWPUAp.js";
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
const center = {
  lat: 13.0827,
  lng: 80.2707
};
function Map({
  busLocation
}) {
  const [position, setPosition] = reactExports.useState(center);
  reactExports.useEffect(() => {
    if (busLocation) {
      setPosition(busLocation);
    }
  }, [busLocation]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    LoadScript,
    {
      googleMapsApiKey: "AIzaSyAFwqoFJGkXhGllBWdfRS-2PKtWhGiVKRk",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        GoogleMap,
        {
          mapContainerStyle: {
            width: "100%",
            height: "500px"
          },
          center: position,
          zoom: 15,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Marker, { position, title: "School Bus", label: "🚍" })
        }
      )
    }
  );
}
const stops = [{
  name: "Oak Street & 5th Ave",
  time: "3:25 PM",
  dist: "0.8 mi away",
  state: "Current"
}, {
  name: "Blue Horizon Elementary",
  time: "3:30 PM",
  dist: "1.2 mi away",
  state: "Next"
}, {
  name: "Central Park Stop",
  time: "3:35 PM",
  dist: "1.8 mi away",
  state: ""
}];
function ParentDashboard() {
  const fleet = useFleetPositions();
  fleet.find((b) => b.id === "007");
  const [busLocation, setBusLocation] = reactExports.useState();
  const [lastUpdated, setLastUpdated] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const fetchInitial = async () => {
      const {
        data
      } = await supabase.from("bus_locations").select("*").eq("bus_id", "007").single();
      if (data) {
        setBusLocation({
          lat: data.latitude,
          lng: data.longitude
        });
        setLastUpdated(data.updated_at);
      }
    };
    fetchInitial();
    const channel = supabase.channel("bus_locations_changes").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "bus_locations",
      filter: "bus_id=eq.007"
    }, (payload) => {
      const newLoc = payload.new;
      if (newLoc) {
        setBusLocation({
          lat: Number(newLoc.latitude),
          lng: Number(newLoc.longitude)
        });
        setLastUpdated(String(newLoc.updated_at));
      }
    }).subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden border-0 p-6 text-white shadow-[var(--shadow-card)]", style: {
      background: "var(--gradient-primary)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-7 w-7" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Aarav S" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80", children: "Grade 5 • Bus 007" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 flex items-center gap-1 text-sm text-white/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }),
            " Gandhi Nagar"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-success text-success-foreground", children: "On Bus" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-white text-primary hover:bg-white", children: "Present" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-white/15 text-white border-white/20", variant: "outline", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "mr-1 h-3 w-3" }),
          " 4:15 PM ETA"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Upcoming stops" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: "Route A" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: stops.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `flex items-center justify-between rounded-xl border p-4 ${s.state === "Current" ? "border-primary/30 bg-primary/5" : s.state === "Next" ? "border-success/30 bg-success/5" : "border-border"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: s.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.dist })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: s.time }),
            s.state && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: s.state === "Current" ? "border-primary/30 text-primary" : "border-success/30 text-success", children: s.state })
          ] })
        ] }, s.name)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Live map" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Bus 007 —",
          " ",
          lastUpdated ? `last updated ${formatDistanceToNow(new Date(lastUpdated), {
            addSuffix: true
          })}` : "waiting for location..."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 w-full overflow-hidden rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { busLocation }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessagesBoard, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "h-14 justify-start gap-3 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "tel:+919876543210", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5" }),
        " Call Driver"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "h-14 justify-start gap-3 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "tel:+18005550199", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5" }),
        " Call School"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-14 justify-start gap-3 text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-muted-foreground" }),
        " Report issue"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-14 justify-start gap-3 text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5 text-muted-foreground" }),
        " Settings"
      ] })
    ] })
  ] });
}
function MessagesBoard() {
  const [messages, setMessages] = reactExports.useState([]);
  const [msgInput, setMsgInput] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const load = async () => {
      const data = await fetchNotifications("parent");
      setMessages(data);
    };
    load();
    const channel = subscribeToNotifications("parent", (payload) => {
      const newRecord = payload.new;
      setMessages((prev) => [newRecord, ...prev]);
    });
    return () => {
      channel.unsubscribe();
    };
  }, []);
  const handleSend = async (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setLoading(true);
    await addNotification("Message from Parent (Aarav S)", msgInput, "announcement", "driver");
    toast.success("Message sent to driver");
    setMsgInput("");
    setLoading(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 flex flex-col h-[400px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5 text-primary" }),
        " Messages & Announcements"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
        messages.filter((m) => !m.read).length,
        " Unread"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto space-y-3 mb-4 pr-2", children: [
      messages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center mt-4", children: "No messages yet." }),
      messages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: m.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap ml-2", children: formatDistanceToNow(new Date(m.created_at), {
            addSuffix: true
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: m.message })
      ] }, m.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSend, className: "flex gap-2 mt-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Message the driver...", value: msgInput, onChange: (e) => setMsgInput(e.target.value), disabled: loading, className: "flex-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: loading || !msgInput.trim(), className: "bg-primary text-primary-foreground hover:bg-primary/90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
        " Send"
      ] })
    ] })
  ] });
}
export {
  ParentDashboard as component
};
