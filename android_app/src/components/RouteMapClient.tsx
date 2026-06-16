import { useMemo } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import type { BusRoute } from "@/lib/routes";

const center: [number, number] = [13.085, 80.203];

// Generate dummy coordinates around center based on route name
const getCoordinatesForRoute = (
  name: string,
  index: number,
): [number, number] => {
  const offsetLat = (index % 3 === 0 ? 1 : -1) * (0.01 * (index + 1));
  const offsetLng = (index % 2 === 0 ? 1 : -1) * (0.015 * (index + 1));
  return [center[0] + offsetLat, center[1] + offsetLng];
};

const schoolIcon = new L.DivIcon({
  html: '<div style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:white;border:3px solid #8b5cf6;box-shadow:0 6px 16px rgba(0,0,0,0.25);font-size:24px">🏫</div>',
  className: "custom-leaflet-icon",
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const routeIcon = (index: number) =>
  new L.DivIcon({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#ef4444;color:white;font-weight:bold;border:2px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3)">${index}</div>`,
    className: "custom-leaflet-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

export default function RouteMapClient({
  filtered = [],
}: {
  filtered?: BusRoute[];
}) {
  const markers = useMemo(() => {
    return filtered.map((route, index) => ({
      ...route,
      position: getCoordinatesForRoute(route.name, index),
    }));
  }, [filtered]);

  return (
    <div style={{ width: "100%", height: "100%", zIndex: 10 }}>
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        <Marker position={center} icon={schoolIcon}>
          <Tooltip>Blue Horizon International School</Tooltip>
        </Marker>

        {markers.map((marker, i) => (
          <Marker key={i} position={marker.position} icon={routeIcon(i + 1)}>
            <Popup>
              <strong>{marker.name}</strong>
              <br />
              Driver: {marker.driver}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
