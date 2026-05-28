import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const center = {
  lat: 13.0850,
  lng: 80.2030,
};

export default function Map({
  busLocation,
}: {
  busLocation?: { lat: number; lng: number };
}) {
  const [position, setPosition] = useState(center);

  useEffect(() => {
    if (busLocation) {
      setPosition(busLocation);
    }
  }, [busLocation]);

  return (
    <LoadScript
      googleMapsApiKey={
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
        "AIzaSyAFwqoFJGkXhGllBWdfRS-2PKtWhGiVKRk"
      }
    >
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "500px",
        }}
        center={position}
        zoom={15}
      >
        <Marker position={center} title="Blue Horizon International School" label="🏫" />
        <Marker position={position} title="School Bus" label="🚍" />
      </GoogleMap>
    </LoadScript>
  );
}
