import { T as reactExports, K as jsxRuntimeExports } from "./server-Dv4jboWA.js";
import { u as useJsApiLoader, G as GoogleMap, M as Marker } from "./esm-C2Lp6Yo7.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-6xa8Ve6B.js";
const center = {
  lat: 13.0827,
  lng: 80.2707
};
const getCoordinatesForRoute = (name, index) => {
  const offsetLat = (index % 3 === 0 ? 1 : -1) * (0.01 * (index + 1));
  const offsetLng = (index % 2 === 0 ? 1 : -1) * (0.015 * (index + 1));
  return {
    lat: center.lat + offsetLat,
    lng: center.lng + offsetLng
  };
};
function RouteMap({ filtered = [] }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    // Fallback to the existing dummy key if the env variable isn't found
    googleMapsApiKey: "AIzaSyAFwqoFJGkXhGllBWdfRS-2PKtWhGiVKRk"
  });
  const markers = reactExports.useMemo(() => {
    return filtered.map((route, index) => ({
      ...route,
      position: getCoordinatesForRoute(route.name, index)
    }));
  }, [filtered]);
  if (!isLoaded) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full bg-muted animate-pulse flex items-center justify-center text-muted-foreground", children: "Loading Map..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    GoogleMap,
    {
      mapContainerStyle: {
        width: "100%",
        height: "100%"
      },
      center,
      zoom: 12,
      options: {
        disableDefaultUI: true,
        zoomControl: true
      },
      children: markers.map((marker, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Marker,
        {
          position: marker.position,
          title: `${marker.name} (Driver: ${marker.driver})`,
          label: (i + 1).toString()
        },
        i
      ))
    }
  );
}
export {
  RouteMap as default
};
