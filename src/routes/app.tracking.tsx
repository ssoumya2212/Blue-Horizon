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
            trackingSource === "supabase"
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-success/30 bg-success/10 text-success"
          }
        >
          <Radio className="mr-1 h-3 w-3 animate-pulse" />
          Live (Supabase)
        </Badge>
      </div>
      <div className="w-full">
        <Card className="overflow-hidden p-3">
          <div className="h-[600px] w-full overflow-hidden rounded-xl">
            <FleetMap
              buses={fleet}
              highlightId={selected}
              className="h-full w-full"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
