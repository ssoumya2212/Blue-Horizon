import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchQuery } from "@/lib/search";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/app/buses")({
  head: () => ({ meta: [{ title: "Buses — Blue Horizon" }] }),
  component: Buses,
});

type BusData = {
  id: string;
  route_name: string;
  driver_name: string;
  capacity: number;
  status: string;
};

function Buses() {
  const [buses, setBuses] = useState<BusData[]>([]);
  
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("buses").select("*");
      if (data) setBuses(data);
    };
    load();
    const sub = supabase.channel("buses_channel").on("postgres_changes", { event: "*", schema: "public", table: "buses" }, load).subscribe();
    return () => { sub.unsubscribe(); };
  }, []);

  const q = useSearchQuery().toLowerCase();
  const filtered = q
    ? buses.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.route_name?.toLowerCase().includes(q) ||
          b.driver_name?.toLowerCase().includes(q) ||
          b.status?.toLowerCase().includes(q),
      )
    : buses;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Buses</h1>
          <p className="text-sm text-muted-foreground">
            Manage the school bus fleet.
          </p>
        </div>
        <Button>
          <Plus className="mr-1 h-4 w-4" /> Add bus
        </Button>
      </div>
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bus</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">Bus {b.id}</TableCell>
                <TableCell>{b.route_name}</TableCell>
                <TableCell>{b.driver_name}</TableCell>
                <TableCell>{b.capacity}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className={
                      b.status === "Active" || b.status === "Running"
                        ? "border-success/30 bg-success/10 text-success"
                        : b.status === "Delayed"
                          ? "border-amber-300 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                          : "border-border text-muted-foreground"
                    }
                  >
                    {b.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
