import { useEffect, useState } from "react";
import type { BusPosition } from "@/lib/tracking";

export function FleetMap(props: {
  buses: BusPosition[];
  className?: string;
  highlightId?: string;
  showUserLocation?: boolean;
  showAccessibleList?: boolean;
}) {
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    import("./FleetMapClient").then((mod) => {
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

  return <MapComponent {...props} />;
}
