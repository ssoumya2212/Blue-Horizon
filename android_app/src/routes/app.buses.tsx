import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSearchQuery } from "@/lib/search";
import { supabase } from "@/lib/supabase";
import { addBus, updateBus, deleteBus } from "@/services/bus";

export const Route = createFileRoute("/app/buses")({
  head: () => ({ meta: [{ title: "Buses — Blue Horizon" }] }),
  component: Buses,
});

type BusData = {
  id: string;
  route_id: string;
  route_name: string;
  driver_id: string;
  driver_name: string;
  capacity: number;
  status: string;
};

type RouteItem = {
  id: string;
  name: string;
};

type DriverItem = {
  id: string;
  full_name: string;
};

function Buses() {
  const [buses, setBuses] = useState<BusData[]>([]);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [drivers, setDrivers] = useState<DriverItem[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingBus, setEditingBus] = useState<BusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadBuses = async () => {
    setLoading(true);
    const { data } = await supabase.from("buses").select("*").order("id");
    if (data) setBuses(data as BusData[]);
    setLoading(false);
  };

  const loadDropdowns = async () => {
    const { data: r } = await supabase.from("routes").select("id, name");
    if (r) setRoutes(r as RouteItem[]);
    const { data: d } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "driver");
    if (d) setDrivers(d as DriverItem[]);
  };

  useEffect(() => {
    loadBuses();
    loadDropdowns();

    const sub = supabase
      .channel("buses_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buses" },
        loadBuses,
      )
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, []);

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    setSaving(true);
    const data = new FormData(form);
    const busNum = String(data.get("busNumber"));
    const capacityVal = Number(data.get("capacity") || 40);
    const routeIdVal = String(data.get("route_id") || "");
    const driverIdVal = String(data.get("driver_id") || "");

    const selectedRoute = routes.find((r) => r.id === routeIdVal);
    const selectedDriver = drivers.find((d) => d.id === driverIdVal);

    try {
      const res = await addBus({
        id: busNum,
        route_id: routeIdVal || null,
        route_name: selectedRoute ? selectedRoute.name : "Unassigned",
        driver_id: driverIdVal || null,
        driver_name: selectedDriver ? selectedDriver.full_name : "Unassigned",
        capacity: capacityVal,
        status: "Active",
      });

      if (res) {
        toast.success("Bus registered successfully");
        setOpenAdd(false);
        loadBuses();
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (bus: BusData) => {
    setEditingBus(bus);
    setOpenEdit(true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBus) return;

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

    setSaving(true);
    const data = new FormData(form);
    const capacityVal = Number(data.get("capacity") || 40);
    const routeIdVal = String(data.get("route_id") || "");
    const driverIdVal = String(data.get("driver_id") || "");
    const statusVal = String(data.get("status") || "Active");

    const selectedRoute = routes.find((r) => r.id === routeIdVal);
    const selectedDriver = drivers.find((d) => d.id === driverIdVal);

    try {
      const res = await updateBus(editingBus.id, {
        route_id: routeIdVal || null,
        route_name: selectedRoute ? selectedRoute.name : "Unassigned",
        driver_id: driverIdVal || null,
        driver_name: selectedDriver ? selectedDriver.full_name : "Unassigned",
        capacity: capacityVal,
        status: statusVal,
      });

      if (res) {
        toast.success("Bus updated successfully");
        setOpenEdit(false);
        loadBuses();
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = async (bus: BusData) => {
    if (confirm(`Are you sure you want to delete Bus ${bus.id}?`)) {
      const ok = await deleteBus(bus.id);
      if (ok) {
        toast.success("Bus deleted successfully");
        loadBuses();
      } else {
        toast.error("Failed to delete bus");
      }
    }
  };

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
        <Button onClick={() => setOpenAdd(true)}>
          <Plus className="mr-1 h-4 w-4" /> Add bus
        </Button>
      </div>

      <Card className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bus ID</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Loading buses...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No buses found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-bold">Bus {b.id}</TableCell>
                  <TableCell>{b.route_name || "—"}</TableCell>
                  <TableCell>{b.driver_name || "—"}</TableCell>
                  <TableCell>{b.capacity}</TableCell>
                  <TableCell>
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(b)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(b)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ADD BUS DIALOG */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle>Add Bus</DialogTitle>
              <DialogDescription>
                Register a new bus in the fleet.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="add-busNum">Bus ID / Number</Label>
                <Input
                  id="add-busNum"
                  name="busNumber"
                  placeholder="e.g. 015"
                  required
                  disabled={saving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-capacity">Capacity</Label>
                <Input
                  id="add-capacity"
                  name="capacity"
                  type="number"
                  defaultValue="40"
                  placeholder="40"
                  required
                  disabled={saving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-route">Assigned Route</Label>
                <select
                  id="add-route"
                  name="route_id"
                  disabled={saving}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Unassigned</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-driver">Assigned Driver</Label>
                <select
                  id="add-driver"
                  name="driver_id"
                  disabled={saving}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Unassigned</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenAdd(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                Add Bus
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT BUS DIALOG */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md">
          {editingBus && (
            <form onSubmit={handleEditSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Bus</DialogTitle>
                <DialogDescription>
                  Update bus configurations.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-busNum">Bus ID</Label>
                  <Input
                    id="edit-busNum"
                    name="busNumber"
                    defaultValue={editingBus.id}
                    readOnly
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-capacity">Capacity</Label>
                  <Input
                    id="edit-capacity"
                    name="capacity"
                    type="number"
                    defaultValue={editingBus.capacity}
                    required
                    disabled={saving}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-route">Assigned Route</Label>
                  <select
                    id="edit-route"
                    name="route_id"
                    defaultValue={editingBus.route_id || ""}
                    disabled={saving}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Unassigned</option>
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-driver">Assigned Driver</Label>
                  <select
                    id="edit-driver"
                    name="driver_id"
                    defaultValue={editingBus.driver_id || ""}
                    disabled={saving}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Unassigned</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    name="status"
                    defaultValue={editingBus.status}
                    disabled={saving}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Active">Active / Ready</option>
                    <option value="Running">Running / On Route</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenEdit(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
