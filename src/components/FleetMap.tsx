import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { BusPosition } from "@/lib/tracking";

type Props = {
  buses: BusPosition[];
  className?: string;
  highlightId?: string;
  showUserLocation?: boolean;
  showAccessibleList?: boolean;
};

function userIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;transform:translate(-50%,-50%);">
        <span style="position:absolute;inset:-8px;border-radius:9999px;background:oklch(0.62 0.18 145 / 0.3);animation:bh-ping 1.6s cubic-bezier(0,0,0.2,1) infinite;"></span>
        <div style="position:relative;width:18px;height:18px;border-radius:9999px;background:oklch(0.55 0.2 145);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);"></div>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function busIcon(id: string, highlighted = false) {
  return L.divIcon({
    className: "",
    html: `
      <div style="position: relative; transform: translate(-50%, -50%);">
        <span style="
          position:absolute; inset:-6px;
          border-radius: 9999px;
          background: ${highlighted ? "oklch(0.65 0.18 25 / 0.35)" : "oklch(0.62 0.13 235 / 0.35)"};
          animation: bh-ping 1.6s cubic-bezier(0,0,0.2,1) infinite;
        "></span>
        <div style="
          position: relative;
          display:flex; align-items:center; justify-content:center;
          width:36px; height:36px;
          border-radius: 9999px;
          background: ${highlighted ? "oklch(0.55 0.2 25)" : "oklch(0.45 0.15 250)"};
          color: white;
          font-weight: 700; font-size: 12px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.25);
          border: 2px solid white;
        ">${id}</div>
      </div>
      <style>
        @keyframes bh-ping {
          0%   { transform: scale(1);   opacity: 0.7; }
          80%  { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      </style>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

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

export function FleetMap({
  buses,
  className,
  highlightId,
  showUserLocation = true,
  showAccessibleList = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const initialCenter = useMemo<[number, number]>(() => {
    if (buses.length === 0) return [19.076, 72.8777];
    const lat = buses.reduce((s, b) => s + b.lat, 0) / buses.length;
    const lng = buses.reduce((s, b) => s + b.lng, 0) / buses.length;
    return [lat, lng];
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !containerRef.current ||
      mapRef.current
    )
      return;
    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
      keyboard: true,
      keyboardPanDelta: 80,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);
    mapRef.current = map;
    setReady(true);
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
      userMarkerRef.current = null;
      userAccuracyRef.current = null;
    };
  }, [initialCenter]);

  useEffect(() => {
    if (
      !showUserLocation ||
      typeof window === "undefined" ||
      !("geolocation" in navigator)
    ) {
      if (typeof navigator !== "undefined" && !("geolocation" in navigator)) {
        setGeoError("Geolocation not supported");
      }
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !userPos) return;
    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker(userPos, {
        icon: userIcon(),
        keyboard: true,
        alt: "Your current location",
        title: "Your current location",
      }).addTo(map);
      userMarkerRef.current.bindPopup("<strong>You are here</strong>");
      userAccuracyRef.current = L.circle(userPos, {
        radius: 60,
        color: "oklch(0.55 0.2 145)",
        fillColor: "oklch(0.62 0.18 145)",
        fillOpacity: 0.1,
        weight: 1,
      }).addTo(map);
      map.setView(userPos, 15);
    } else {
      userMarkerRef.current.setLatLng(userPos);
      userAccuracyRef.current?.setLatLng(userPos);
    }
  }, [userPos, ready]);

  // Distances + sorted list
  const enriched = useMemo(() => {
    const list = buses.map((b) => ({
      ...b,
      distanceKm: userPos ? haversineKm(userPos, [b.lat, b.lng]) : null,
    }));
    if (userPos) list.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    return list;
  }, [buses, userPos]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const seen = new Set<string>();
    for (const b of buses) {
      seen.add(b.id);
      const existing = markersRef.current.get(b.id);
      const icon = busIcon(b.id, b.id === highlightId || b.id === focusedId);
      const label = `Bus ${b.id} on ${b.route}, driver ${b.driver}, status ${b.status}, ETA ${b.eta}`;
      if (existing) {
        existing.setLatLng([b.lat, b.lng]);
        existing.setIcon(icon);
      } else {
        const m = L.marker([b.lat, b.lng], {
          icon,
          keyboard: true,
          alt: label,
          title: label,
          riseOnHover: true,
        }).addTo(map);
        m.bindPopup(
          `<strong>Bus ${b.id}</strong><br/>${b.route} • ${b.driver}<br/>Status: ${b.status}<br/>ETA ${b.eta}`,
        );
        // Add ARIA role on the underlying DOM element
        const el = m.getElement();
        if (el) {
          el.setAttribute("role", "button");
          el.setAttribute("aria-label", label);
          el.setAttribute("tabindex", "0");
        }
        markersRef.current.set(b.id, m);
      }
    }
    for (const [id, m] of markersRef.current.entries()) {
      if (!seen.has(id)) {
        m.remove();
        markersRef.current.delete(id);
      }
    }
  }, [buses, highlightId, focusedId, ready]);

  const recenter = () => {
    const map = mapRef.current;
    if (!map) return;
    if (userPos && buses.length) {
      const bounds = L.latLngBounds([
        userPos,
        ...buses.map((b) => [b.lat, b.lng] as [number, number]),
      ]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    } else if (userPos) {
      map.setView(userPos, 16);
    } else if (buses.length) {
      map.setView([buses[0].lat, buses[0].lng], 15);
    }
  };

  const focusBus = (id: string) => {
    const map = mapRef.current;
    const marker = markersRef.current.get(id);
    if (!map || !marker) return;
    setFocusedId(id);
    map.setView(marker.getLatLng(), Math.max(map.getZoom(), 16), {
      animate: true,
    });
    marker.openPopup();
    const el = marker.getElement();
    if (el) (el as HTMLElement).focus?.();
  };

  const onListKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      focusBus(id);
    }
  };

  return (
    <div
      className={`relative ${className ?? "h-full w-full"}`}
      style={{ minHeight: 320 }}
    >
      <div
        ref={containerRef}
        className="h-full w-full"
        role="application"
        aria-label="Interactive live fleet map. Use arrow keys to pan, plus and minus to zoom, and Tab to move between bus markers."
      />
      <button
        type="button"
        onClick={recenter}
        className="absolute right-3 top-3 z-[400] rounded-lg bg-white px-3 py-2 text-xs font-semibold text-primary shadow-md hover:bg-primary hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        title="Center on me & buses"
        aria-label={
          userPos
            ? "Center map on my location and all buses"
            : "Locate me on the map"
        }
      >
        {userPos ? "Center my location" : "Locate me"}
      </button>
      {geoError && (
        <div
          role="alert"
          className="absolute bottom-3 left-3 z-[400] rounded-md bg-destructive/90 px-3 py-1.5 text-xs text-white shadow"
        >
          {geoError}
        </div>
      )}

      {/* Screen-reader live region with summary */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {enriched.length} buses on the map.
        {userPos && enriched[0]?.distanceKm != null
          ? ` Closest is bus ${enriched[0].id}, ${formatDistance(enriched[0].distanceKm)} away.`
          : ""}
      </div>

      {showAccessibleList && (
        <section
          aria-label="Buses near you (accessible list)"
          className="mt-3 rounded-xl border border-border bg-card p-4"
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
              const aria = `Bus ${b.id} on ${b.route}, driver ${b.driver}, status ${b.status}, ETA ${b.eta}, ${distLabel} from your location. Press Enter to focus on the map.`;
              return (
                <li
                  key={b.id}
                  role="button"
                  tabIndex={0}
                  aria-label={aria}
                  aria-pressed={focusedId === b.id}
                  onClick={() => focusBus(b.id)}
                  onKeyDown={(e) => onListKeyDown(e, b.id)}
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
