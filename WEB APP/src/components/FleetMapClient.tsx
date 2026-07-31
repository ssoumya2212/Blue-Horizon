import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Tooltip,
  Polyline,
} from "react-leaflet";
import type { BusPosition } from "@/lib/tracking";

function haversineKm(a: [number, number], b: [number, number]) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(km < 10 ? 2 : 1)} km`;
}

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const schoolIcon = new L.DivIcon({
  html: '<div style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:white;border:3px solid #8b5cf6;box-shadow:0 6px 16px rgba(0,0,0,0.25);font-size:24px">🏫</div>',
  className: "custom-leaflet-icon",
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const stopIcon = (index: number) =>
  new L.DivIcon({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:#f97316;color:white;font-weight:700;font-size:12px;border:2px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.25)">${index}</div>`,
    className: "custom-leaflet-icon",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });

const getBusIcon = (isHighlighted: boolean, busId?: string) =>
  new L.DivIcon({
    html: `<div style="position:relative"><div style="position:absolute;inset:-6px;border-radius:9999px;background:${isHighlighted ? "oklch(0.65 0.18 25 / 0.35)" : "oklch(0.62 0.13 235 / 0.35)"};animation:ping 1.6s cubic-bezier(0,0,0.2,1) infinite"></div><div style="position:relative;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9999px;background:${isHighlighted ? "oklch(0.55 0.2 25)" : "oklch(0.45 0.15 250)"};color:white;font-weight:700;font-size:14px;border:2px solid white;box-shadow:0 6px 16px rgba(0,0,0,0.25)">${busId ? busId : '🚍'}</div></div>`,
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

type RouteStop = {
  name: string;
  point: [number, number];
};

function MapController({
  userPos,
  buses,
  focusedId,
}: {
  userPos: [number, number] | null;
  buses: BusPosition[];
  focusedId: string | null;
}) {
  const map = useMap();
  const busesRef = useRef(buses);
  
  useEffect(() => {
    busesRef.current = buses;
  }, [buses]);

  useEffect(() => {
    if (focusedId) {
      const bus = busesRef.current.find((item) => item.id === focusedId);
      if (bus) {
        const L = window.L as any;
        if (L) {
          const bounds = L.latLngBounds([bus.lat, bus.lng], schoolPosition as [number, number]);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
      }
    }
  }, [focusedId, map]);

  return null;
}

import { useRoutes } from "@/lib/routes";
import { buildRoutePath, buildRoutePathAsync } from "@/lib/route-path";

export default function FleetMapClient({
  buses,
  className,
  highlightId,
  showUserLocation = true,
  showAccessibleList = true,
  routeStops = [],
  showAllRoutes = false,
}: {
  buses: BusPosition[];
  className?: string;
  highlightId?: string;
  showUserLocation?: boolean;
  showAccessibleList?: boolean;
  routeStops?: RouteStop[];
  showAllRoutes?: boolean;
}) {
  const watchIdRef = useRef<number | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  const allRoutes = useRoutes();
  const [routeShapes, setRouteShapes] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    if (!showAllRoutes) {
      setRouteShapes([]);
      return;
    }
    
    async function loadRoutes() {
      const shapes = [];
      for (const route of allRoutes) {
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
  }, [allRoutes, showAllRoutes]);

  const initialCenter = useMemo(() => {
    if (buses.length > 0) {
      const lat = buses.reduce((sum, bus) => sum + bus.lat, 0) / buses.length;
      const lng = buses.reduce((sum, bus) => sum + bus.lng, 0) / buses.length;
      return { lat, lng };
    }

    if (routeStops.length > 0) {
      const lat =
        routeStops.reduce((sum, stop) => sum + stop.point[0], 0) / routeStops.length;
      const lng =
        routeStops.reduce((sum, stop) => sum + stop.point[1], 0) / routeStops.length;
      return { lat, lng };
    }

    return { lat: 13.0094, lng: 80.0111 };
  }, [buses, routeStops]);

  useEffect(() => {
    if (
      !showUserLocation ||
      typeof window === "undefined" ||
      !("geolocation" in navigator)
    ) {
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
  }, [showUserLocation]);

  const enriched = useMemo(() => {
    const list = buses.map((bus) => ({
      ...bus,
      distanceKm: userPos ? haversineKm(userPos, [bus.lat, bus.lng]) : null,
    }));

    if (userPos) {
      list.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    }

    return list;
  }, [buses, userPos]);

  const recenter = () => {
    if (!mapRef) return;

    const routePoints = routeStops.map((stop) => stop.point);

    if (userPos && (buses.length || routePoints.length)) {
      const bounds = L.latLngBounds([
        ...buses.map((bus) => [bus.lat, bus.lng] as [number, number]),
        ...routePoints,
        userPos,
      ]);
      mapRef.fitBounds(bounds, { padding: [50, 50] });
    } else if (routePoints.length > 0) {
      const bounds = L.latLngBounds(routePoints);
      mapRef.fitBounds(bounds, { padding: [50, 50] });
    } else if (userPos) {
      mapRef.flyTo(userPos, 16);
    } else if (buses.length) {
      mapRef.flyTo([buses[0].lat, buses[0].lng], 15);
    }
  };

  const focusBus = (id: string) => {
    const bus = buses.find((item) => item.id === id);
    if (!mapRef || !bus) return;
    setFocusedId(id);
    mapRef.flyTo([bus.lat, bus.lng], 16);
  };

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

  const schoolPosition = userRole === "admin" && userPos ? userPos : [13.0094, 80.0111];

  return (
    <div
      className={`relative ${className ?? "h-full w-full"}`}
      style={{ minHeight: 320, zIndex: 10 }}
    >
      <MapContainer
        center={[initialCenter.lat, initialCenter.lng]}
        zoom={14}
        scrollWheelZoom
        style={{ width: "100%", height: "100%", zIndex: 1 }}
        ref={setMapRef}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        <MapController userPos={userPos} buses={buses} focusedId={focusedId} />

        <Marker position={schoolPosition as [number, number]} icon={schoolIcon}>
          <Tooltip>Blue Horizon International School</Tooltip>
        </Marker>

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
                icon={stopIcon(index + 1)}
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

        {routeStops.length > 0 && !showAllRoutes && (
          <Polyline
            positions={[...routeStops.map((stop) => stop.point), schoolPosition as [number, number]]}
            pathOptions={{ color: "#f97316", weight: 4, opacity: 0.9 }}
          />
        )}

        {!showAllRoutes && routeStops.map((stop, index) => (
          <Marker
            key={`${stop.name}-${index}`}
            position={stop.point}
            icon={stopIcon(index + 1)}
          >
            <Popup>
              <strong>{stop.name}</strong>
              <br />
              Stop {index + 1}
            </Popup>
          </Marker>
        ))}

        {userPos && userRole !== "admin" && (
          userRole === "driver" ? (
            <Marker position={userPos} icon={getBusIcon(true, driverBusId || "")}>
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

        {buses.map((bus) => {
          const isHighlighted = bus.id === highlightId || bus.id === focusedId;
          return (
            <Marker
              key={bus.id}
              position={[bus.lat, bus.lng]}
              icon={getBusIcon(isHighlighted, bus.id)}
              eventHandlers={{
                click: () => {
                  setFocusedId(bus.id);
                },
              }}
            >
              <Popup autoPan={false}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>
                  School Bus {bus.id}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {bus.route} • Driver: {bus.driver}
                </div>
                <div style={{ fontSize: 12, marginTop: 4, color: "#111" }}>
                  Status: <span style={{ fontWeight: 500 }}>{bus.status}</span>
                </div>
                <div style={{ fontSize: 12, color: "#111" }}>ETA: {bus.eta}</div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <button
        type="button"
        onClick={recenter}
        className="absolute right-3 top-3 z-[400] rounded-lg bg-white px-3 py-2 text-xs font-semibold text-primary shadow-md transition hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {userPos ? "Center my location" : "Locate me"}
      </button>

      {showAccessibleList && (
        <section
          aria-label="Buses near you (accessible list)"
          className="relative z-[400] mt-3 rounded-xl border border-border bg-card p-4"
        >
          <header className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Buses near you</h3>
            <span className="text-xs text-muted-foreground">
              {userPos ? "Sorted by distance" : "Enable location to see distances"}
            </span>
          </header>
          <ul className="divide-y divide-border" role="list">
            {enriched.length === 0 && (
              <li className="py-3 text-sm text-muted-foreground">
                No buses are reporting positions right now.
              </li>
            )}
            {enriched.map((bus) => {
              const distLabel =
                bus.distanceKm != null
                  ? formatDistance(bus.distanceKm)
                  : "Distance unavailable";
              return (
                <li
                  key={bus.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => focusBus(bus.id)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    focusedId === bus.id ? "bg-primary/5" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">
                      Bus {bus.id}{" "}
                      <span className="text-muted-foreground">• {bus.route}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bus.driver} • {bus.status} • ETA {bus.eta}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{distLabel}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
