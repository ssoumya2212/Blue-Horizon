import { createFileRoute, redirect } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  addRoute,
  deleteRoute,
  getRouteAssignmentOptions,
  updateRoute,
  useRoutes,
  type BusRoute,
} from "@/lib/routes";
import { useSearchQuery } from "@/lib/search";
import { getSession } from "@/lib/auth";
import {
  Plus,
  Route as RouteIcon,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Users,
  Bus,
  UserRound,
  MapPinned,
} from "lucide-react";

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

type AssignmentBus = {
  id: string;
  route_id?: string | null;
  route_name?: string | null;
  driver_id?: string | null;
  driver_name?: string | null;
};

type AssignmentDriver = {
  id: string;
  full_name: string;
  status?: string | null;
};

type AssignmentStudent = {
  id: string;
  name: string;
  student_roll_no?: string | null;
  bus_id?: string | null;
  route_id?: string | null;
};

type FormState = {
  name: string;
  busId: string;
  driverId: string;
  stopNames: string[];
};

const emptyFormState = (): FormState => ({
  name: "",
  busId: "",
  driverId: "",
  stopNames: ["", ""],
});

function Routes() {
  const { role } = Route.useRouteContext();
  const routes = useRoutes();
  const q = useSearchQuery().toLowerCase();

  const [isMounted, setIsMounted] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingRoute, setEditingRoute] = useState<BusRoute | null>(null);
  const [form, setForm] = useState<FormState>(emptyFormState());
  const [buses, setBuses] = useState<AssignmentBus[]>([]);
  const [drivers, setDrivers] = useState<AssignmentDriver[]>([]);
  const [students, setStudents] = useState<AssignmentStudent[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadOptions = async () => {
    const options = await getRouteAssignmentOptions();
    setBuses(options.buses as AssignmentBus[]);
    setDrivers(options.drivers as AssignmentDriver[]);
    setStudents(options.students as AssignmentStudent[]);
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const filtered = q
    ? routes.filter(
        (route) =>
          route.name.toLowerCase().includes(q) ||
          route.driver.toLowerCase().includes(q) ||
          route.bus.toLowerCase().includes(q) ||
          route.stopNames.some((stop) => stop.toLowerCase().includes(q)),
      )
    : routes;

  const selectedBus = useMemo(
    () => buses.find((bus) => bus.id === form.busId),
    [buses, form.busId],
  );

  const studentsForSelectedBus = useMemo(() => {
    if (!form.busId) return [];
    return students.filter((student) => student.bus_id === form.busId);
  }, [students, form.busId]);

  const resetForm = () => {
    setForm(emptyFormState());
    setEditingRoute(null);
  };

  const openCreateDialog = async () => {
    await loadOptions();
    resetForm();
    setOpenAdd(true);
  };

  const openEditDialog = async (route: BusRoute) => {
    await loadOptions();
    setEditingRoute(route);
    setForm({
      name: route.name,
      busId: route.busId || "",
      driverId: route.driverId || "",
      stopNames:
        route.stopNames.length >= 2
          ? [...route.stopNames]
          : [route.start || "", route.end || ""],
    });
    setOpenEdit(true);
  };

  const updateStop = (index: number, value: string) => {
    setForm((prev) => {
      const nextStops = [...prev.stopNames];
      nextStops[index] = value;
      return { ...prev, stopNames: nextStops };
    });
  };

  const addStopField = () => {
    setForm((prev) => ({ ...prev, stopNames: [...prev.stopNames, ""] }));
  };

  const removeStopField = (index: number) => {
    setForm((prev) => {
      if (prev.stopNames.length <= 2) return prev;
      return {
        ...prev,
        stopNames: prev.stopNames.filter(
          (_, currentIndex) => currentIndex !== index,
        ),
      };
    });
  };

  const validateForm = () => {
    const routeName = form.name.trim();
    const cleanedStops = form.stopNames
      .map((stop) => stop.trim())
      .filter(Boolean);

    if (!routeName) {
      toast.error("Route name is required");
      return null;
    }

    if (cleanedStops.length < 2) {
      toast.error("Please add at least a first stop and a last stop");
      return null;
    }

    return {
      name: routeName,
      busId: form.busId || undefined,
      driverId: form.driverId || undefined,
      stopNames: cleanedStops,
    };
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = validateForm();
    if (!payload) return;

    try {
      setSaving(true);
      await addRoute(payload);
      toast.success("Route created successfully");
      setOpenAdd(false);
      resetForm();
      await loadOptions();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create route";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingRoute?.id) return;

    const payload = validateForm();
    if (!payload) return;

    try {
      setSaving(true);
      await updateRoute(editingRoute.id, payload);
      toast.success("Route updated successfully");
      setOpenEdit(false);
      resetForm();
      await loadOptions();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update route";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (route: BusRoute) => {
    if (!route.id) return;
    if (!confirm(`Delete route ${route.name}?`)) return;

    try {
      await deleteRoute(route.id);
      toast.success("Route deleted successfully");
      await loadOptions();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete route";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Routes</h1>
          <p className="text-sm text-muted-foreground">
            Create clear stop-based routes, assign buses and drivers, and keep student linking easy.
            {q &&
              ` — ${filtered.length} match${filtered.length === 1 ? "" : "es"} for "${q}"`}
          </p>
        </div>
        {role === "admin" && (
          <Button onClick={openCreateDialog}>
            <Plus className="mr-1 h-4 w-4" /> New route
          </Button>
        )}
      </div>

      <Card className="relative z-0 h-[300px] overflow-hidden border-0 shadow-[var(--shadow-card)]">
        {isMounted ? (
          <Suspense
            fallback={<div className="h-full w-full animate-pulse bg-muted" />}
          >
            <RouteMap filtered={filtered} />
          </Suspense>
        ) : (
          <div className="h-full w-full animate-pulse bg-muted" />
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((route) => {
          const assignedStudents = students.filter(
            (student) => student.route_id === route.id,
          );

          return (
            <Card
              key={route.id || route.name}
              className="p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <RouteIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{route.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {route.start || "—"} → {route.end || "—"}
                    </p>
                  </div>
                </div>

                {role === "admin" && (
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
                      <DropdownMenuItem onClick={() => openEditDialog(route)}>
                        <Edit2 className="mr-2 h-4 w-4" /> Edit route
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(route)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete route
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-muted p-3">
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase text-muted-foreground">
                    <MapPinned className="h-3.5 w-3.5" /> Stops
                  </div>
                  <p className="text-lg font-bold">{route.stopNames.length}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase text-muted-foreground">
                    <Bus className="h-3.5 w-3.5" /> Bus
                  </div>
                  <p className="text-sm font-semibold">
                    {route.busId ? `Bus ${route.busId}` : "Unassigned"}
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase text-muted-foreground">
                    <UserRound className="h-3.5 w-3.5" /> Driver
                  </div>
                  <p className="text-sm font-semibold">
                    {route.driver || "Unassigned"}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase text-muted-foreground">
                    <Search className="h-3.5 w-3.5" /> Route stops
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {route.stopNames.length > 0 ? (
                      route.stopNames.map((stop, index) => (
                        <Badge
                          key={`${route.id}-${stop}-${index}`}
                          variant="secondary"
                        >
                          {index + 1}. {stop}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No stops added
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> Students on this route
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {assignedStudents.length > 0 ? (
                      assignedStudents.map((student) => (
                        <Badge key={student.id} variant="outline">
                          {student.name}
                          {student.student_roll_no
                            ? ` (${student.student_roll_no})`
                            : ""}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No students linked yet
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
            No routes match your search.
          </p>
        )}
      </div>

      <Dialog
        open={openAdd}
        onOpenChange={(value) => {
          setOpenAdd(value);
          if (!value) resetForm();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <RouteForm
            title="Create route"
            description="Add stops in order, then assign the correct bus and driver from dropdowns."
            form={form}
            setForm={setForm}
            buses={buses}
            drivers={drivers}
            studentsForSelectedBus={studentsForSelectedBus}
            selectedBus={selectedBus}
            saving={saving}
            onSubmit={handleCreate}
            onCancel={() => setOpenAdd(false)}
            addStopField={addStopField}
            removeStopField={removeStopField}
            updateStop={updateStop}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openEdit}
        onOpenChange={(value) => {
          setOpenEdit(value);
          if (!value) resetForm();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <RouteForm
            title="Edit route"
            description="Update stop order and assignments so admins can manage routes cleanly."
            form={form}
            setForm={setForm}
            buses={buses}
            drivers={drivers}
            studentsForSelectedBus={studentsForSelectedBus}
            selectedBus={selectedBus}
            saving={saving}
            onSubmit={handleUpdate}
            onCancel={() => setOpenEdit(false)}
            addStopField={addStopField}
            removeStopField={removeStopField}
            updateStop={updateStop}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

type RouteFormProps = {
  title: string;
  description: string;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  buses: AssignmentBus[];
  drivers: AssignmentDriver[];
  studentsForSelectedBus: AssignmentStudent[];
  selectedBus?: AssignmentBus;
  saving: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  addStopField: () => void;
  removeStopField: (index: number) => void;
  updateStop: (index: number, value: string) => void;
};

function RouteForm({
  title,
  description,
  form,
  setForm,
  buses,
  drivers,
  studentsForSelectedBus,
  selectedBus,
  saving,
  onSubmit,
  onCancel,
  addStopField,
  removeStopField,
  updateStop,
}: RouteFormProps) {
  const availableDrivers = useMemo(() => {
    if (!selectedBus?.driver_id) return drivers;

    return [...drivers].sort((a, b) => {
      if (a.id === selectedBus.driver_id) return -1;
      if (b.id === selectedBus.driver_id) return 1;
      return a.full_name.localeCompare(b.full_name);
    });
  }, [drivers, selectedBus?.driver_id]);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <DialogHeader>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <RouteIcon className="h-5 w-5" />
        </div>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="route-name">Route name</Label>
          <Input
            id="route-name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Route A"
            disabled={saving}
          />
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label>Stops in order</Label>
              <p className="text-xs text-muted-foreground">
                Add first stop, middle stops, and final stop in the exact route order.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStopField}
            >
              <Plus className="mr-1 h-4 w-4" /> Add stop
            </Button>
          </div>

          <div className="grid gap-3">
            {form.stopNames.map((stop, index) => (
              <div key={`stop-${index}`} className="flex items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-semibold">
                  {index + 1}
                </div>
                <Input
                  value={stop}
                  onChange={(e) => updateStop(index, e.target.value)}
                  placeholder={
                    index === 0
                      ? "First stop"
                      : index === form.stopNames.length - 1
                        ? "Last stop"
                        : `Stop ${index + 1}`
                  }
                  disabled={saving}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStopField(index)}
                  disabled={saving || form.stopNames.length <= 2}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="route-bus">Assign bus</Label>
            <select
              id="route-bus"
              value={form.busId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, busId: e.target.value }))
              }
              disabled={saving}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select bus</option>
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {`Bus ${bus.id}${
                    bus.route_name && bus.route_name !== "Unassigned"
                      ? ` — ${bus.route_name}`
                      : ""
                  }`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="route-driver">Assign driver</Label>
            <select
              id="route-driver"
              value={form.driverId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, driverId: e.target.value }))
              }
              disabled={saving}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select driver</option>
              {availableDrivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Card className="p-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">Assignment preview</h4>
              <p className="text-sm text-muted-foreground">
                Students already linked to the selected bus will follow this route automatically.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs uppercase text-muted-foreground">
                  Selected bus
                </p>
                <p className="mt-1 font-semibold">
                  {form.busId ? `Bus ${form.busId}` : "No bus selected"}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs uppercase text-muted-foreground">
                  Selected driver
                </p>
                <p className="mt-1 font-semibold">
                  {form.driverId
                    ? availableDrivers.find(
                        (driver) => driver.id === form.driverId,
                      )?.full_name || "Assigned driver"
                    : "No driver selected"}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs uppercase text-muted-foreground">
                  Students on bus
                </p>
                <p className="mt-1 font-semibold">
                  {studentsForSelectedBus.length}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {studentsForSelectedBus.length > 0 ? (
                studentsForSelectedBus.map((student) => (
                  <Badge key={student.id} variant="outline">
                    {student.name}
                    {student.student_roll_no
                      ? ` (${student.student_roll_no})`
                      : ""}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  Select a bus to see linked students.
                </span>
              )}
            </div>
          </div>
        </Card>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save route"}
        </Button>
      </DialogFooter>
    </form>
  );
}
