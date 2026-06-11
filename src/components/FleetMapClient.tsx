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
} from "react-leaflet";
import type { BusPosition } from "@/lib/tracking";

// Haversine distance in km
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

// Fix leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
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

  useEffect(() => {
    if (focusedId) {
      const b = buses.find((b) => b.id === focusedId);
      if (b) {
        map.flyTo([b.lat, b.lng], 16);
      }
    }
  }, [focusedId, buses, map]);

  return null;
}

export default function FleetMapClient({
  buses,
  className,
  highlightId,
  showUserLocation = true,
  showAccessibleList = true,
}: {
  buses: BusPosition[];
  className?: string;
  highlightId?: string;
  showUserLocation?: boolean;
  showAccessibleList?: boolean;
}) {
  const watchIdRef = useRef<number | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  const initialCenter = useMemo(() => {
    if (buses.length === 0) return { lat: 13.085, lng: 80.203 };
    const lat = buses.reduce((s, b) => s + b.lat, 0) / buses.length;
    const lng = buses.reduce((s, b) => s + b.lng, 0) / buses.length;
    return { lat, lng };
  }, [buses]);

  useEffect(() => {
    if (
      !showUserLocation ||
      typeof window === "undefined" ||
      !("geolocation" in navigator)
    ) {
      return;
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      (p) => {
        setGeoError(null);
        setUserPos([p.coords.latitude, p.coords.longitude]);
      },
      (err) => setGeoError(err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
    return () => {
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [showUserLocation]);

  const enriched = useMemo(() => {
    const list = buses.map((b) => ({
      ...b,
      distanceKm: userPos ? haversineKm(userPos, [b.lat, b.lng]) : null,
    }));
    if (userPos) list.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    return list;
  }, [buses, userPos]);

  const recenter = () => {
    if (!mapRef) return;
    if (userPos && buses.length) {
      const bounds = L.latLngBounds(buses.map((b) => [b.lat, b.lng]));
      bounds.extend(userPos);
      mapRef.fitBounds(bounds, { padding: [50, 50] });
    } else if (userPos) {
      mapRef.flyTo(userPos, 16);
    } else if (buses.length) {
      mapRef.flyTo([buses[0].lat, buses[0].lng], 15);
    }
  };

  const focusBus = (id: string) => {
    const b = buses.find((b) => b.id === id);
    if (!mapRef || !b) return;
    setFocusedId(id);
    setActivePopup(id);
    mapRef.flyTo([b.lat, b.lng], 16);
  };

  return (
    <div
      className={`relative ${className ?? "h-full w-full"}`}
      style={{ minHeight: 320, zIndex: 10 }}
    >
      <MapContainer
        center={[initialCenter.lat, initialCenter.lng]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
        ref={setMapRef}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        <MapController userPos={userPos} buses={buses} focusedId={focusedId} />

        <Marker position={[13.085, 80.203]} icon={schoolIcon}>
          <Tooltip>Blue Horizon International School</Tooltip>
        </Marker>

        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Tooltip>Your Location</Tooltip>
          </Marker>
        )}

        {buses.map((b) => {
          const isHighlighted = b.id === highlightId || b.id === focusedId;
          return (
            <Marker
              key={b.id}
              position={[b.lat, b.lng]}
              icon={getBusIcon(isHighlighted)}
              eventHandlers={{
                click: () => {
                  setFocusedId(b.id);
                  setActivePopup(b.id);
                },
              }}
            >
              <Popup>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>
                  School Bus {b.id}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {b.route} • Driver: {b.driver}
                </div>
                <div style={{ fontSize: 12, marginTop: 4, color: "#111" }}>
                  Status: <span style={{ fontWeight: 500 }}>{b.status}</span>
                </div>
                <div style={{ fontSize: 12, color: "#111" }}>ETA: {b.eta}</div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <button
        type="button"
        onClick={recenter}
        className="absolute right-3 top-3 z-[400] rounded-lg bg-white px-3 py-2 text-xs font-semibold text-primary shadow-md hover:bg-primary hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {userPos ? "Center my location" : "Locate me"}
      </button>

      {showAccessibleList && (
        <section
          aria-label="Buses near you (accessible list)"
          className="mt-3 rounded-xl border border-border bg-card p-4 relative z-[400]"
        >
          <header className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Buses near you</h3>
            <span className="text-xs text-muted-foreground">
              {userPos
                ? "Sorted by distance"
                : "Enable location to see distances"}
            </span>
          </header>
          <ul className="divide-y divide-border" role="list">
            {enriched.length === 0 && (
              <li className="py-3 text-sm text-muted-foreground">
                No buses are reporting positions right now.
              </li>
            )}
            {enriched.map((b) => {
              const distLabel =
                b.distanceKm != null
                  ? formatDistance(b.distanceKm)
                  : "Distance unavailable";
              return (
                <li
                  key={b.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => focusBus(b.id)}
                  className={`flex cursor-pointer items-center justify-between gap-3 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 ${
                    focusedId === b.id ? "bg-primary/5" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">
                      Bus {b.id}{" "}
                      <span className="text-muted-foreground">• {b.route}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.driver} • {b.status} • ETA {b.eta}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">
                      {distLabel}
                    </p>
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
