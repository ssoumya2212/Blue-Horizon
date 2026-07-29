import { useMemo, useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Polyline,
} from "react-leaflet";
import type { BusRoute } from "@/lib/routes";
import { buildRoutePath, buildRoutePathAsync } from "@/lib/route-path";

const defaultCenter: [number, number] = [13.0094, 80.0111];

const schoolIcon = new L.DivIcon({
  html: '<div style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:white;border:3px solid #8b5cf6;box-shadow:0 6px 16px rgba(0,0,0,0.25);font-size:24px">🏫</div>',
  className: "custom-leaflet-icon",
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const routeIcon = (index: number) =>
  new L.DivIcon({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:#ef4444;color:white;font-weight:bold;border:2px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3)">${index}</div>`,
    className: "custom-leaflet-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });

export default function RouteMapClient({
  filtered = [],
}: {
  filtered?: BusRoute[];
}) {
  const watchIdRef = useRef<number | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setUserPos([position.coords.latitude, position.coords.longitude]);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const [routeShapes, setRouteShapes] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    async function loadRoutes() {
      const shapes = [];
      for (const route of filtered) {
        const description = route.stopNames.length
          ? `stops_json:${JSON.stringify(route.stopNames)}`
          : route.start && route.end
            ? `${route.start} to ${route.end}`
            : route.start || route.end || "";
        
        const path = await buildRoutePathAsync(description);
        shapes.push({ route, path });
      }
      if (active) setRouteShapes(shapes);
    }
    loadRoutes();
    return () => { active = false; };
  }, [filtered]);

  const [userRole, setUserRole] = useState<string | null>(null);
  const [driverBusId, setDriverBusId] = useState<string | null>(null);

  useEffect(() => {
    import("@/lib/supabase").then(({ supabase }) => {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setUserRole(data.role);
                setDriverBusId(data.bus_id);
              }
            });
        }
      });
    });
  }, []);

  const schoolPosition = userRole === "admin" && userPos ? userPos : defaultCenter;

  const getBusIcon = (isHighlighted: boolean) =>
    new L.DivIcon({
      html: `<div style="position:relative"><div style="position:absolute;inset:-6px;border-radius:9999px;background:${isHighlighted ? "oklch(0.65 0.18 25 / 0.35)" : "oklch(0.62 0.13 235 / 0.35)"};animation:ping 1.6s cubic-bezier(0,0,0.2,1) infinite"></div><div style="position:relative;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9999px;background:${isHighlighted ? "oklch(0.55 0.2 25)" : "oklch(0.45 0.15 250)"};color:white;font-weight:700;font-size:18px;border:2px solid white;box-shadow:0 6px 16px rgba(0,0,0,0.25)">🚍</div></div>`,
      className: "custom-leaflet-icon",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });

  const userIcon = new L.DivIcon({
    html: '<div style="position:relative"><span style="position:absolute;inset:-8px;border-radius:9999px;background:oklch(0.62 0.18 145 / 0.3);animation:ping 1.6s cubic-bezier(0,0,0.2,1) infinite"></span><div style="position:relative;width:18px;height:18px;border-radius:9999px;background:oklch(0.55 0.2 145);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3)"></div></div>',
    className: "custom-leaflet-icon",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  return (
    <div style={{ width: "100%", height: "100%", zIndex: 10 }}>
      <MapContainer
        center={userPos || defaultCenter}
        zoom={12}
        scrollWheelZoom
        style={{ width: "100%", height: "100%", zIndex: 1 }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        <Marker position={schoolPosition as [number, number]} icon={schoolIcon}>
          <Tooltip>Blue Horizon International School</Tooltip>
        </Marker>

        {userPos && userRole !== "admin" && (
          userRole === "driver" ? (
            <Marker position={userPos} icon={getBusIcon(true)}>
              <Popup>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>
                  School Bus {driverBusId || "Unassigned"}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  Your Live Location
                </div>
                <div style={{ fontSize: 12, marginTop: 4, color: "#111" }}>
                  Status: <span style={{ fontWeight: 500 }}>On the way</span>
                </div>
              </Popup>
            </Marker>
          ) : (
            <Marker position={userPos} icon={userIcon}>
              <Tooltip>Your Location</Tooltip>
            </Marker>
          )
        )}

        {routeShapes.map(({ route, path }) => (
          <div key={route.id || route.name}>
            {path.polyline.length > 0 && (
              <Polyline
                positions={[...path.polyline, schoolPosition as [number, number]]}
                pathOptions={{ color: "#ef4444", weight: 4, opacity: 0.75 }}
              />
            )}

            {path.coordinates.map((stop, index) => (
              <Marker
                key={`${route.id || route.name}-${stop.name}-${index}`}
                position={stop.point}
                icon={routeIcon(index + 1)}
              >
                <Popup>
                  <strong>{route.name}</strong>
                  <br />
                  Stop {index + 1}: {stop.name}
                  <br />
                  Bus: {route.busId ? `Bus ${route.busId}` : "Unassigned"}
                  <br />
                  Driver: {route.driver || "Unassigned"}
                </Popup>
              </Marker>
            ))}
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
