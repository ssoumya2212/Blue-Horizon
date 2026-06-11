import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from "react-leaflet";

const center: [number, number] = [13.0850, 80.2030];

const schoolIcon = new L.DivIcon({
  html: '<div style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:white;border:3px solid #8b5cf6;box-shadow:0 6px 16px rgba(0,0,0,0.25);font-size:24px">🏫</div>',
  className: "custom-leaflet-icon",
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const busIcon = new L.DivIcon({
  html: '<div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:#3b82f6;color:white;font-size:18px;border:2px solid white;box-shadow:0 6px 16px rgba(0,0,0,0.25)">🚍</div>',
  className: "custom-leaflet-icon",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function MapController({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 15);
  }, [position, map]);
  return null;
}

export default function TrackingMapClient({ busLocation }: { busLocation?: { lat: number; lng: number } }) {
  const [position, setPosition] = useState<[number, number]>(center);

  useEffect(() => {
    if (busLocation) {
      setPosition([busLocation.lat, busLocation.lng]);
    }
  }, [busLocation]);

  return (
    <div style={{ width: "100%", height: "500px", zIndex: 10 }}>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        <MapController position={position} />
        
        <Marker position={center} icon={schoolIcon}>
          <Tooltip>Blue Horizon International School</Tooltip>
        </Marker>

        <Marker position={position} icon={busIcon}>
          <Tooltip>School Bus</Tooltip>
        </Marker>
      </MapContainer>
    </div>
  );
}
