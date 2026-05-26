import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { useSearchQuery } from "@/lib/search";

export const Route = createFileRoute("/app/drivers")({
  head: () => ({ meta: [{ title: "Drivers — Blue Horizon" }] }),
  component: Drivers,
});

import { useDrivers } from "@/lib/drivers";

function Drivers() {
  const drivers = useDrivers();
  const q = useSearchQuery().toLowerCase();
  const filtered = q
    ? drivers.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.route.toLowerCase().includes(q) ||
          d.phone.toLowerCase().includes(q) ||
          d.status.toLowerCase().includes(q),
      )
    : drivers;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Drivers</h1>
          <p className="text-sm text-muted-foreground">
            Approve, assign and manage drivers.
          </p>
        </div>
        <Button>
          <Plus className="mr-1 h-4 w-4" /> Add driver
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filtered.map((d) => (
          <Card key={d.name} className="p-5">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {d.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.route}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{d.phone}</p>
            <Badge
              variant="outline"
              className={
                d.status === "approved"
                  ? "mt-3 border-success/30 bg-success/10 text-success"
                  : "mt-3 border-amber-300 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
              }
            >
              <span className="capitalize">{d.status}</span>
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
