import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useMemo } from "react";
import type { BusRoute } from "@/lib/routes";

const center = {
  lat: 13.0827,
  lng: 80.2707,
};

// Generate some dummy coordinates around the center based on the route name for demonstration
const getCoordinatesForRoute = (name: string, index: number) => {
  const offsetLat = (index % 3 === 0 ? 1 : -1) * (0.01 * (index + 1));
  const offsetLng = (index % 2 === 0 ? 1 : -1) * (0.015 * (index + 1));
  return {
    lat: center.lat + offsetLat,
    lng: center.lng + offsetLng,
  };
};

export default function RouteMap({ filtered = [] }: { filtered?: BusRoute[] }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    // Fallback to the existing dummy key if the env variable isn't found
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      "AIzaSyAFwqoFJGkXhGllBWdfRS-2PKtWhGiVKRk",
  });

  const markers = useMemo(() => {
    return filtered.map((route, index) => ({
      ...route,
      position: getCoordinatesForRoute(route.name, index),
    }));
  }, [filtered]);

  if (!isLoaded) {
    return (
      <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center text-muted-foreground">
        Loading Map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "100%",
      }}
      center={center}
      zoom={12}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {markers.map((marker, i) => (
        <Marker
          key={i}
          position={marker.position}
          title={`${marker.name} (Driver: ${marker.driver})`}
          label={(i + 1).toString()}
        />
      ))}
    </GoogleMap>
  );
}
