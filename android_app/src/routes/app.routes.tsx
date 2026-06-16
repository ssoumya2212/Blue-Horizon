import { createFileRoute } from "@tanstack/react-router";
import { useState, lazy, Suspense, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Route as RouteIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { addRoute, useRoutes } from "@/lib/routes";
import { useSearchQuery } from "@/lib/search";

import { getSession } from "@/lib/auth";
import { redirect } from "@tanstack/react-router";

const RouteMap = lazy(() => import("@/components/RouteMap"));

export const Route = createFileRoute("/app/routes")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "driver")) {
      throw redirect({ to: "/login" });
    }
    return { role: session.role };
  },
  head: () => ({ meta: [{ title: "Routes — Blue Horizon" }] }),
  component: Routes,
});

function Routes() {
  const { role } = Route.useRouteContext();
  const routes = useRoutes();
  const q = useSearchQuery().toLowerCase();
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filtered = q
    ? routes.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.driver.toLowerCase().includes(q) ||
          r.bus.toLowerCase().includes(q),
      )
    : routes;

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check required fields manually
    const form = e.currentTarget;
    let missingFieldLabel = "";
    const requiredInputs = form.querySelectorAll("[required]");
    for (let i = 0; i < requiredInputs.length; i++) {
      const input = requiredInputs[i] as HTMLInputElement | HTMLSelectElement;
      if (!input.value || input.value.trim() === "") {
        const label = form.querySelector(`label[for="${input.id}"]`);
        missingFieldLabel = label ? label.textContent || input.name : input.name;
        break;
      }
    }

    if (missingFieldLabel) {
      toast.error(`${missingFieldLabel} is required`);
      return;
    }
    const data = new FormData(form);
    addRoute({
      name: String(data.get("name") || "Route"),
      start: String(data.get("start") || ""),
      end: String(data.get("end") || ""),
      stops: Number(data.get("stops") || 0),
      students: Number(data.get("students") || 0),
      bus: String(data.get("bus") || "—"),
      driver: String(data.get("driver") || "Unassigned"),
    });
    toast.success("Route added");
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Routes</h1>
          <p className="text-sm text-muted-foreground">
            Plan and assign bus routes.
            {q &&
              ` — ${filtered.length} match${filtered.length === 1 ? "" : "es"} for "${q}"`}
          </p>
        </div>
        {role === "admin" && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> New route
          </Button>
        )}
      </div>

      {/* Interactive Map */}
      <Card className="overflow-hidden border-0 shadow-[var(--shadow-card)] h-[300px] relative z-0">
        {isMounted ? (
          <Suspense
            fallback={<div className="h-full w-full bg-muted animate-pulse" />}
          >
            <RouteMap filtered={filtered} />
          </Suspense>
        ) : (
          <div className="h-full w-full bg-muted animate-pulse" />
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filtered.map((r) => (
          <Card
            key={r.name}
            className="p-5 hover:-translate-y-0.5 transition hover:shadow-[var(--shadow-card)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <RouteIcon className="h-5 w-5" />
              </div>
              <Badge variant="outline">Bus {r.bus}</Badge>
            </div>
            <h3 className="text-lg font-semibold">{r.name}</h3>
            <p className="text-xs text-muted-foreground">Driver {r.driver}</p>
            {(r.start || r.end) && (
              <p className="mt-1 text-xs text-muted-foreground">
                {r.start || "—"} → {r.end || "—"}
              </p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-muted p-2">
                <p className="text-lg font-bold">{r.stops}</p>
                <p className="text-[10px] uppercase text-muted-foreground">
                  Stops
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <p className="text-lg font-bold">{r.students}</p>
                <p className="text-[10px] uppercase text-muted-foreground">
                  Students
                </p>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
            No routes match your search.
          </p>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAdd}>
            <DialogHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <RouteIcon className="h-5 w-5" />
              </div>
              <DialogTitle>New route</DialogTitle>
              <DialogDescription>
                Define a new bus route with stops.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Route name</Label>
                <Input id="name" name="name" placeholder="Route G" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="start">Start point</Label>
                  <Input
                    id="start"
                    name="start"
                    placeholder="Anna Nagar Roundana"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end">End point</Label>
                  <Input
                    id="end"
                    name="end"
                    placeholder="School Gate"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="stops">Stops</Label>
                  <Input
                    id="stops"
                    name="stops"
                    type="number"
                    placeholder="8"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="students">Students</Label>
                  <Input
                    id="students"
                    name="students"
                    type="number"
                    placeholder="14"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bus">Bus</Label>
                  <Input id="bus" name="bus" placeholder="025" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver">Driver</Label>
                <Input id="driver" name="driver" placeholder="Driver name" />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save route</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
