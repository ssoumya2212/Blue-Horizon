import { useEffect, useState } from "react";
import type { BusRoute } from "@/lib/routes";

export default function RouteMap({ filtered = [] }: { filtered?: BusRoute[] }) {
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    import("./RouteMapClient").then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  if (!MapComponent) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/20 animate-pulse text-muted-foreground p-4 text-center rounded-xl">
        Loading interactive map...
      </div>
    );
  }

  return <MapComponent filtered={filtered} />;
}
