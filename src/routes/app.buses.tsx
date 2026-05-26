import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/app/buses")({
  head: () => ({ meta: [{ title: "Buses — Blue Horizon" }] }),
  component: Buses,
});

const buses = [
  {
    id: "007",
    route: "Route A",
    driver: "Ravi S.",
    capacity: 24,
    status: "Active",
  },
  {
    id: "012",
    route: "Route B",
    driver: "Sahil K.",
    capacity: 28,
    status: "Active",
  },
  {
    id: "018",
    route: "Route C",
    driver: "Rita J.",
    capacity: 22,
    status: "Maintenance",
  },
  {
    id: "021",
    route: "Route D",
    driver: "Vikas P.",
    capacity: 30,
    status: "Idle",
  },
];

function Buses() {
  const q = useSearchQuery().toLowerCase();
  const filtered = q
    ? buses.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.route.toLowerCase().includes(q) ||
          b.driver.toLowerCase().includes(q) ||
          b.status.toLowerCase().includes(q),
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
                <TableCell>{b.route}</TableCell>
                <TableCell>{b.driver}</TableCell>
                <TableCell>{b.capacity}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className={
                      b.status === "Active"
                        ? "border-success/30 bg-success/10 text-success"
                        : b.status === "Maintenance"
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
