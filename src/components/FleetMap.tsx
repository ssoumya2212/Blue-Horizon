import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import type { BusPosition } from "@/lib/tracking";

type Props = {
  buses: BusPosition[];
  className?: string;
  highlightId?: string;
  showUserLocation?: boolean;
  showAccessibleList?: boolean;
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

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
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyAFwqoFJGkXhGllBWdfRS-2PKtWhGiVKRk",
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const initialCenter = useMemo(() => {
    if (buses.length === 0) return { lat: 13.0850, lng: 80.2030 };
    const lat = buses.reduce((s, b) => s + b.lat, 0) / buses.length;
    const lng = buses.reduce((s, b) => s + b.lng, 0) / buses.length;
    return { lat, lng };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

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

  // Distances + sorted list
  const enriched = useMemo(() => {
    const list = buses.map((b) => ({
      ...b,
      distanceKm: userPos ? haversineKm(userPos, [b.lat, b.lng]) : null,
    }));
    if (userPos) list.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    return list;
  }, [buses, userPos]);

  const recenter = () => {
    const map = mapRef.current;
    if (!map) return;
    if (userPos && buses.length) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: userPos[0], lng: userPos[1] });
      buses.forEach((b) => bounds.extend({ lat: b.lat, lng: b.lng }));
      map.fitBounds(bounds);
    } else if (userPos) {
      map.panTo({ lat: userPos[0], lng: userPos[1] });
      map.setZoom(16);
    } else if (buses.length) {
      map.panTo({ lat: buses[0].lat, lng: buses[0].lng });
      map.setZoom(15);
    }
  };

  const focusBus = (id: string) => {
    const map = mapRef.current;
    const b = buses.find((b) => b.id === id);
    if (!map || !b) return;
    setFocusedId(id);
    setActivePopup(id);
    map.panTo({ lat: b.lat, lng: b.lng });
    map.setZoom(Math.max(map.getZoom() || 16, 16));
  };

  const onListKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      focusBus(id);
    }
  };

  if (loadError) {
    return <div className="p-4 bg-destructive/10 text-destructive rounded-xl">Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div className="flex h-full w-full items-center justify-center p-4"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div></div>;
  }

  return (
    <div
      className={`relative ${className ?? "h-full w-full"}`}
      style={{ minHeight: 320 }}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={initialCenter}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
        }}
      >
        {userPos && (
          <OverlayView
            position={{ lat: userPos[0], lng: userPos[1] }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", inset: -8, borderRadius: 9999, background: "oklch(0.62 0.18 145 / 0.3)", animation: "ping 1.6s cubic-bezier(0,0,0.2,1) infinite" }}></span>
                <div style={{ position: "relative", width: 18, height: 18, borderRadius: 9999, background: "oklch(0.55 0.2 145)", border: "3px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}></div>
              </div>
            </div>
          </OverlayView>
        )}

        <OverlayView
          position={{ lat: 13.0850, lng: 80.2030 }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div style={{ position: "absolute", transform: "translate(-50%, -50%)", cursor: "help" }} title="Blue Horizon International School&#10;No. 45, Green Valley Road, Anna Nagar West&#10;Chennai - 600101">
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: "white", border: "3px solid #8b5cf6", boxShadow: "0 6px 16px rgba(0,0,0,0.25)", fontSize: 24 }}>
              🏫
            </div>
          </div>
        </OverlayView>

        {buses.map((b) => {
          const isHighlighted = b.id === highlightId || b.id === focusedId;
          const bgOuter = isHighlighted ? "oklch(0.65 0.18 25 / 0.35)" : "oklch(0.62 0.13 235 / 0.35)";
          const bgInner = isHighlighted ? "oklch(0.55 0.2 25)" : "oklch(0.45 0.15 250)";
          
          return (
            <OverlayView
              key={b.id}
              position={{ lat: b.lat, lng: b.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div 
                style={{ position: "absolute", transform: "translate(-50%, -50%)", cursor: "pointer" }}
                onClick={() => {
                  setActivePopup(activePopup === b.id ? null : b.id);
                  setFocusedId(b.id);
                }}
              >
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", inset: -6, borderRadius: 9999, background: bgOuter, animation: "ping 1.6s cubic-bezier(0,0,0.2,1) infinite" }}></span>
                  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 9999, background: bgInner, color: "white", fontWeight: 700, fontSize: 18, border: "2px solid white", boxShadow: "0 6px 16px rgba(0,0,0,0.25)" }}>
                    🚍
                  </div>
                </div>

                {activePopup === b.id && (
                  <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translate(-50%, -12px)", background: "white", padding: "8px 12px", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", minWidth: 160, zIndex: 50 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>School Bus {b.id}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{b.route} • Driver: {b.driver}</div>
                    <div style={{ fontSize: 12, marginTop: 4, color: "#111" }}>Status: <span style={{ fontWeight: 500 }}>{b.status}</span></div>
                    <div style={{ fontSize: 12, color: "#111" }}>ETA: {b.eta}</div>
                    <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid white" }}></div>
                  </div>
                )}
              </div>
            </OverlayView>
          );
        })}
      </GoogleMap>

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
