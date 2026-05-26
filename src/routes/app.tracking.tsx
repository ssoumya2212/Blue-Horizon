import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Radio } from "lucide-react";
import { FleetMap } from "@/components/FleetMap";
import { useFleetPositions, trackingSource } from "@/lib/tracking";

export const Route = createFileRoute("/app/tracking")({
  head: () => ({ meta: [{ title: "Live Tracking — Blue Horizon" }] }),
  component: Tracking,
});

function Tracking() {
  const fleet = useFleetPositions();
  const [selected, setSelected] = useState<string | undefined>(undefined);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Live GPS Tracking</h1>
          <p className="text-sm text-muted-foreground">
            All buses, all routes, in real time.
          </p>
        </div>
        <Badge
          variant="outline"
          className={
            trackingSource === "firebase"
              ? "border-success/30 bg-success/10 text-success"
              : "border-primary/30 bg-primary/10 text-primary"
          }
        >
          <Radio className="mr-1 h-3 w-3 animate-pulse" />
          {trackingSource === "firebase" ? "Firebase live" : "Live (simulated)"}
        </Badge>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden p-3 lg:col-span-2">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-xl">
            <FleetMap
              buses={fleet}
              highlightId={selected}
              className="h-full w-full"
            />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-lg font-semibold">Fleet</h2>
          <ul className="mt-3 space-y-2">
            {fleet.map((b) => (
              <li
                key={b.id}
                onMouseEnter={() => setSelected(b.id)}
                onMouseLeave={() => setSelected(undefined)}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition ${
                  selected === b.id ? "border-primary bg-primary/5" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium">
                    Bus {b.id} • {b.route}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {b.driver}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant="outline"
                    className={
                      b.status === "On Route"
                        ? "border-success/30 bg-success/10 text-success"
                        : b.status === "Delay"
                          ? "border-amber-300 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                          : "border-border text-muted-foreground"
                    }
                  >
                    {b.status}
                  </Badge>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ETA {b.eta}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
