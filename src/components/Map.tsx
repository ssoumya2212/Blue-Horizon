import { useEffect, useState } from "react";

export default function Map({ busLocation }: { busLocation?: { lat: number; lng: number } }) {
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    import("./TrackingMapClient").then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  if (!MapComponent) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center bg-muted/20 animate-pulse text-muted-foreground p-4 text-center rounded-xl">
        Loading interactive map...
      </div>
    );
  }

  return <MapComponent busLocation={busLocation} />;
}
