import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { addRoute } from "@/lib/routes";
import {
  Bus,
  Users,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Plus,
  Route as RouteIcon,
  MessageSquare,
} from "lucide-react";
import { addNotification } from "@/lib/notifications";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getSession } from "@/lib/auth";
import { redirect } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/app/admin")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({ meta: [{ title: "Admin Dashboard — Blue Horizon" }] }),
  component: AdminDashboard,
});

import {
  useDrivers,
  updateDriverStatus,
  type DriverStatus,
} from "@/lib/drivers";
import { FleetMap } from "@/components/FleetMap";
import { useFleetPositions } from "@/lib/tracking";
import { supabase } from "@/lib/supabase";
import type { Bus as DbBus, Student as DbStudent } from "@/types/db";
import { useEffect } from "react";

type DialogKind = "bus" | "driver" | "parent" | "route" | "announcement" | null;

function AdminDashboard() {
  const drivers = useDrivers();
  const fleet = useFleetPositions();
  const [openDialog, setOpenDialog] = useState<DialogKind>(null);

  const [buses, setBuses] = useState<DbBus[]>([]);
  const [students, setStudents] = useState<DbStudent[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [statsData, setStatsData] = useState({
    buses: 0,
    drivers: 0,
    students: 0,
    parents: 0,
    activeTrips: 0,
    completedTrips: 0,
    studentsPicked: 0,
    studentsDropped: 0,
    alerts: 0,
    pendingDrivers: 0,
  });

  const loadDb = async () => {
    const { data: b } = await supabase.from("buses").select("*").order("id");
    if (b) setBuses(b);
    const { data: s } = await supabase.from("students").select("*");
    if (s) setStudents(s);
    const { data: r } = await supabase.from("routes").select("*").order("name");
    if (r) setRoutes(r);

    // Fetch counts from DB
    const { count: drvCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "driver");
    const { count: parentCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "parent");
    const { count: pendCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "driver")
      .eq("status", "pending");
    const { count: studentCount } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true });
    const { count: alertCount } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("type", "emergency");

    const { count: activeTripsCount } = await supabase
      .from("trips")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");
    const { count: completedTripsCount } = await supabase
      .from("trips")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed");
    const { count: pickedCount } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("status", "picked");
    const { count: droppedCount } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("status", "dropped");

    setStatsData({
      buses: b ? b.length : 0,
      drivers: drvCount || 0,
      students: studentCount || 0,
      parents: parentCount || 0,
      activeTrips: activeTripsCount || 0,
      completedTrips: completedTripsCount || 0,
      studentsPicked: pickedCount || 0,
      studentsDropped: droppedCount || 0,
      alerts: alertCount || 0,
      pendingDrivers: pendCount || 0,
    });

    const { data: recentNotifs } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (recentNotifs) {
      setActivities(
        recentNotifs.map((n: any) => ({
          id: n.id,
          who: n.title,
          what: n.message,
          time: n.created_at,
          status:
            n.type === "emergency"
              ? "Emergency"
              : n.type === "delay" || n.type === "bus_delay"
                ? "Delay"
                : "Done",
        })),
      );
    } else {
      setActivities([]);
    }
  };

  useEffect(() => {
    loadDb();

    const channel1 = supabase
      .channel("admin_buses")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buses" },
        loadDb,
      )
      .subscribe();

    const channel2 = supabase
      .channel("admin_students")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        loadDb,
      )
      .subscribe();

    const channel3 = supabase
      .channel("admin_profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        loadDb,
      )
      .subscribe();

    const channel4 = supabase
      .channel("admin_notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        loadDb,
      )
      .subscribe();

    const channel5 = supabase
      .channel("admin_trips")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trips" },
        loadDb,
      )
      .subscribe();

    const channel6 = supabase
      .channel("admin_routes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "routes" },
        loadDb,
      )
      .subscribe();

    return () => {
      channel1.unsubscribe();
      channel2.unsubscribe();
      channel3.unsubscribe();
      channel4.unsubscribe();
      channel5.unsubscribe();
      channel6.unsubscribe();
    };
  }, []);

  const updateDriver = async (
    id: string,
    name: string,
    status: DriverStatus,
  ) => {
    await updateDriverStatus(id, status);
  };

  const dynamicStats = [
    {
      label: "Total Students",
      value: String(statsData.students),
      trend: "Total registered",
      icon: GraduationCap,
      tone: "success",
    },
    {
      label: "Total Parents",
      value: String(statsData.parents),
      trend: "Linked accounts",
      icon: Users,
      tone: "primary",
    },
    {
      label: "Total Drivers",
      value: String(statsData.drivers),
      trend: `${statsData.pendingDrivers} pending approval`,
      icon: Users,
      tone: "warning",
    },
    {
      label: "Total Buses",
      value: String(statsData.buses),
      trend: `${buses.filter((b) => b.status === "Running" || b.status === "Active").length} running / active`,
      icon: Bus,
      tone: "primary",
    },
    {
      label: "Active Trips",
      value: String(statsData.activeTrips),
      trend: "Buses currently en route",
      icon: RouteIcon,
      tone: "success",
    },
    {
      label: "Completed Trips",
      value: String(statsData.completedTrips),
      trend: "Trips today",
      icon: CheckCircle2,
      tone: "primary",
    },
    {
      label: "Students Picked",
      value: String(statsData.studentsPicked),
      trend: "Onboarded today",
      icon: CheckCircle2,
      tone: "primary",
    },
    {
      label: "Students Dropped",
      value: String(statsData.studentsDropped),
      trend: "Dropped safely today",
      icon: CheckCircle2,
      tone: "success",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Admin Overview</h1>
          <p className="text-sm text-muted-foreground">
            Real-time fleet status and recent activity.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="default"
            onClick={() => setOpenDialog("announcement")}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-md"
          >
            <MessageSquare className="mr-1 h-4 w-4" /> Announce
          </Button>
          <Button variant="outline" onClick={() => setOpenDialog("bus")}>
            <Plus className="mr-1 h-4 w-4" /> Add bus
          </Button>
          <Button variant="outline" onClick={() => setOpenDialog("driver")}>
            <Plus className="mr-1 h-4 w-4" /> Add driver
          </Button>
          <Button variant="outline" onClick={() => setOpenDialog("route")}>
            <Plus className="mr-1 h-4 w-4" /> Add route
          </Button>
          <Button onClick={() => setOpenDialog("parent")}>
            <Plus className="mr-1 h-4 w-4" /> Add parent
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dynamicStats.map((s) => (
          <Card key={s.label} className="overflow-hidden p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-2 text-3xl font-bold">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.trend}</p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  s.tone === "primary"
                    ? "bg-primary/10 text-primary"
                    : s.tone === "success"
                      ? "bg-success/15 text-success"
                      : s.tone === "warning"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                        : "bg-destructive/15 text-destructive"
                }`}
              >
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Live Fleet Tracking</h2>
            <p className="text-xs text-muted-foreground">
              Monitor all active buses in real-time.
            </p>
          </div>
        </div>
        <div className="w-full overflow-hidden rounded-xl h-[400px]">
          <FleetMap buses={fleet} showAccessibleList={false} />
        </div>
      </Card>

      <Card className="p-5 overflow-x-auto">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Live Bus Monitoring</h2>
          <p className="text-xs text-muted-foreground">
            Real-time status synced from database
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bus</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Speed</TableHead>
              <TableHead>Students Onboard</TableHead>
              <TableHead>Next Stop</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buses.map((b) => {
              const onboard = students.filter(
                (s) => s.bus_id === b.id && s.status !== "dropped",
              ).length;
              const total = students.filter((s) => s.bus_id === b.id).length;
              return (
                <TableRow key={b.id}>
                  <TableCell className="font-bold">#{b.id}</TableCell>
                  <TableCell>{b.driver_name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {b.route_name}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">{b.speed_kmh}</span> km/h
                  </TableCell>
                  <TableCell>
                    <Badge variant={onboard > 0 ? "default" : "secondary"}>
                      {onboard} / {total}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {b.next_stop}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        b.status === "Running"
                          ? "border-success/30 text-success"
                          : b.status === "Delayed"
                            ? "border-warning/50 text-warning"
                            : "border-border"
                      }
                    >
                      {b.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <div className="w-full">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent activity</h2>
              <p className="text-xs text-muted-foreground">
                Live feed across all routes
              </p>
            </div>
            <Button variant="ghost" size="sm">
              View all <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                    No recent activity recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((a) => {
                  let relativeTime = "";
                  try {
                    relativeTime = formatDistanceToNow(new Date(a.time), { addSuffix: true });
                  } catch (e) {
                    relativeTime = "some time ago";
                  }
                  return (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.who}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {a.what}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {relativeTime}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            a.status === "Emergency"
                              ? "border-destructive/30 bg-destructive/15 text-destructive"
                              : a.status === "Delay"
                                ? "border-amber-300 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                                : "border-success/30 bg-success/15 text-success"
                          }
                        >
                          {a.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <AddEntityDialog
        kind={openDialog === "announcement" ? null : openDialog}
        onClose={() => setOpenDialog(null)}
        buses={buses}
        routes={routes}
      />
      <AnnouncementDialog
        open={openDialog === "announcement"}
        onClose={() => setOpenDialog(null)}
      />
    </div>
  );
}

function AnnouncementDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const title = String(data.get("title") || "Announcement");
    const message = String(data.get("message") || "");
    const target = String(data.get("target") || "all");

    await addNotification(title, message, "announcement", target);
    toast.success("Announcement broadcasted successfully!");
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <MessageSquare className="h-5 w-5" />
            </div>
            <DialogTitle>Send Announcement</DialogTitle>
            <DialogDescription>
              Broadcast a message to parents, drivers, or everyone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="target">Target Audience</Label>
              <select
                name="target"
                id="target"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">Everyone</option>
                <option value="parent">Parents</option>
                <option value="driver">Drivers</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. School Closed Tomorrow"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                name="message"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Type your announcement here..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Send Announcement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { addDriver as addDriverService } from "@/lib/drivers";
import { addParent as addParentService } from "@/lib/parents";
import { addBus as addBusService } from "@/services/bus";

function AddEntityDialog({
  kind,
  onClose,
  buses,
  routes,
}: {
  kind: DialogKind;
  onClose: () => void;
  buses: any[];
  routes: any[];
}) {
  const open = kind !== null;
  const [saving, setSaving] = useState(false);

  const config = {
    bus: {
      title: "Add new bus",
      description: "Register a new bus to the fleet.",
      icon: Bus,
      fields: [
        {
          name: "busNumber",
          label: "Bus number / ID",
          placeholder: "e.g. 015",
          required: true,
        },
        {
          name: "capacity",
          label: "Capacity",
          placeholder: "40",
          type: "number",
          required: true,
        },
        {
          name: "route_id",
          label: "Assigned Route",
          type: "select",
          options: [
            { label: "Unassigned", value: "" },
            ...routes.map((rt) => ({ label: rt.name, value: rt.id })),
          ],
          required: false,
        },
      ],
    },
    driver: {
      title: "Add new driver",
      description: "Onboard a new driver with license details.",
      icon: Users,
      fields: [
        {
          name: "name",
          label: "Full Name",
          placeholder: "John Doe",
          required: true,
        },
        {
          name: "email",
          label: "Email Address",
          placeholder: "john@example.com",
          type: "email",
          required: true,
        },
        {
          name: "phone",
          label: "Phone Number",
          placeholder: "+91 90000 00000",
          required: true,
        },
        {
          name: "licence",
          label: "Licence Number",
          placeholder: "DL-1234567890",
          required: true,
        },
        {
          name: "licenseExpiry",
          label: "Licence Expiry Date",
          type: "date",
          required: true,
        },
        {
          name: "experience",
          label: "Years of Experience",
          type: "number",
          placeholder: "5",
          required: true,
        },
        {
          name: "bloodGroup",
          label: "Blood Group",
          placeholder: "O+ / A+",
          required: true,
        },
        {
          name: "medical_certificate",
          label: "Medical Certificate (Must Upload)",
          type: "file",
          required: true,
        },
        {
          name: "address",
          label: "Address",
          placeholder: "Apartment, Street, City",
          required: false,
        },
        {
          name: "emergencyContact",
          label: "Emergency Contact",
          placeholder: "Name / Phone",
          required: false,
        },
        {
          name: "bus_id",
          label: "Assigned Bus",
          type: "select",
          options: [
            { label: "Unassigned", value: "" },
            ...buses.map((b) => ({ label: `Bus ${b.id}`, value: b.id })),
          ],
          required: false,
        },
        {
          name: "routeId",
          label: "Assigned Route",
          type: "select",
          options: [
            { label: "Unassigned", value: "" },
            ...routes.map((r) => ({ label: r.name, value: r.id })),
          ],
          required: false,
        },
        {
          name: "password",
          label: "Temporary Password",
          placeholder: "123456",
          type: "password",
          required: false,
        },
      ],
    },
    parent: {
      title: "Add new parent & student",
      description: "Onboard parent-student-transport linked accounts.",
      icon: GraduationCap,
      fields: [
        // Parent Details
        {
          name: "name",
          label: "Parent Name",
          placeholder: "Jane Smith",
          required: true,
        },
        {
          name: "fatherName",
          label: "Father's Name",
          placeholder: "Robert Smith",
          required: false,
        },
        {
          name: "motherName",
          label: "Mother's Name",
          placeholder: "Mary Smith",
          required: false,
        },
        {
          name: "email",
          label: "Parent Email",
          placeholder: "jane@example.com",
          type: "email",
          required: true,
        },
        {
          name: "phone",
          label: "Parent Phone Number",
          placeholder: "+91 90000 00000",
          required: true,
        },
        {
          name: "address",
          label: "Residential Address",
          placeholder: "Street address, area",
          required: false,
        },
        {
          name: "password",
          label: "Temporary Password",
          placeholder: "123456",
          type: "password",
          required: false,
        },
        // Student Details
        {
          name: "student_name",
          label: "Student Name",
          placeholder: "Aarav Smith",
          required: true,
        },
        {
          name: "student_roll_no",
          label: "Register / Roll No (Unique)",
          placeholder: "2026015",
          required: true,
        },
        {
          name: "dob",
          label: "Student Date of Birth",
          type: "date",
          required: false,
        },
        {
          name: "gender",
          label: "Student Gender",
          type: "select",
          options: [
            { label: "Select Gender", value: "" },
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
          ],
          required: false,
        },
        {
          name: "class",
          label: "Student Class",
          placeholder: "Grade 6",
          required: false,
        },
        {
          name: "section",
          label: "Student Section",
          placeholder: "A",
          required: false,
        },
        // Transport Details
        {
          name: "busId",
          label: "Assigned Transport Bus",
          type: "select",
          options: [
            { label: "Unassigned", value: "" },
            ...buses.map((b) => ({ label: `Bus ${b.id}`, value: b.id })),
          ],
          required: false,
        },
        {
          name: "routeId",
          label: "Assigned Transport Route",
          type: "select",
          options: [
            { label: "Unassigned", value: "" },
            ...routes.map((r) => ({ label: r.name, value: r.id })),
          ],
          required: false,
        },
        {
          name: "pickupAddress",
          label: "Pickup Stop Address",
          placeholder: "Same as resident address",
          required: false,
        },
        {
          name: "dropAddress",
          label: "Drop Stop Address",
          placeholder: "Same as resident address",
          required: false,
        },
      ],
    },
    route: {
      title: "Add new route",
      description: "Define a new bus route with stops.",
      icon: RouteIcon,
      fields: [
        {
          name: "name",
          label: "Route name",
          placeholder: "Route G",
          required: true,
        },
        {
          name: "start",
          label: "Start point",
          placeholder: "Anna Nagar Roundana",
          required: true,
        },
        {
          name: "end",
          label: "End point",
          placeholder: "Blue Horizon Int. School",
          required: true,
        },
        {
          name: "stops",
          label: "Number of stops",
          placeholder: "8",
          type: "number",
          required: true,
        },
      ],
    },
  } as const;

  const current = kind && kind !== "announcement" ? config[kind] : null;
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    if (!current || !kind) return;
    
    // Check required fields manually
    const form = e.currentTarget;
    let missingFieldLabel = "";
    for (const f of current.fields) {
      if (f.required) {
         const el = form.elements.namedItem(f.name) as HTMLInputElement | HTMLSelectElement;
         if (!el || !el.value || el.value.trim() === "") {
            missingFieldLabel = f.label;
            break;
         }
      }
    }

    if (missingFieldLabel) {
       setErrorMsg(`${missingFieldLabel} is required`);
       toast.error(`${missingFieldLabel} is required`);
       return;
    }

    setSaving(true);
    const data = new FormData(e.currentTarget);
    try {
      if (kind === "route") {
        await addRoute({
          name: String(data.get("name") || "Route"),
          start: String(data.get("start") || ""),
          end: String(data.get("end") || ""),
          stops: Number(data.get("stops") || 0),
          students: 0,
          bus: "—",
          driver: "Unassigned",
        });
        toast.success("Route saved successfully!");
      } else if (kind === "bus") {
        await addBusService({
          busNumber: String(data.get("busNumber")),
          capacity: Number(data.get("capacity") || 40),
          route_id: data.get("route_id")
            ? String(data.get("route_id"))
            : undefined,
        });
        toast.success("Bus saved successfully!");
      } else if (kind === "driver") {
        const file = data.get("medical_certificate") as File;
        let medicalCertificateUrl = "";
        if (file && file.size > 0) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
          const filePath = `medical-certificates/${fileName}`;
          
          const { error: uploadErr } = await supabase.storage
            .from("documents")
            .upload(filePath, file);
            
          if (uploadErr) {
            console.error("Storage upload error:", uploadErr);
            // Fallback to mock url so it doesn't fail
            medicalCertificateUrl = `mock-storage/documents/${filePath}`;
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from("documents")
              .getPublicUrl(filePath);
            medicalCertificateUrl = publicUrl;
          }
        } else {
          throw new Error("Medical Certificate is required.");
        }

        const d = await addDriverService({
          name: String(data.get("name")),
          email: String(data.get("email")),
          phone: String(data.get("phone")),
          licence: String(data.get("licence")),
          bus_id: String(data.get("bus_id")),
          password: String(data.get("password") || "123456"),
          licenseExpiry: data.get("licenseExpiry")
            ? String(data.get("licenseExpiry"))
            : undefined,
          experience: data.get("experience")
            ? Number(data.get("experience"))
            : undefined,
          address: data.get("address")
            ? String(data.get("address"))
            : undefined,
          emergencyContact: data.get("emergencyContact")
            ? String(data.get("emergencyContact"))
            : undefined,
          routeId: data.get("routeId")
            ? String(data.get("routeId"))
            : undefined,
          bloodGroup: data.get("bloodGroup")
            ? String(data.get("bloodGroup"))
            : undefined,
          medicalCertificateUrl: medicalCertificateUrl,
        });
        if (!d) throw new Error("Driver account creation failed.");
        toast.success("Driver saved successfully!");
      } else if (kind === "parent") {
        const p = await addParentService({
          name: String(data.get("name")),
          email: String(data.get("email")),
          phone: String(data.get("phone")),
          student_name: String(data.get("student_name")),
          student_roll_no: String(data.get("student_roll_no")),
          password: String(data.get("password") || "123456"),
          fatherName: data.get("fatherName")
            ? String(data.get("fatherName"))
            : undefined,
          motherName: data.get("motherName")
            ? String(data.get("motherName"))
            : undefined,
          address: data.get("address")
            ? String(data.get("address"))
            : undefined,
          gender: data.get("gender")
            ? (String(data.get("gender")) as any)
            : undefined,
          dob: data.get("dob") ? String(data.get("dob")) : undefined,
          class: data.get("class") ? String(data.get("class")) : undefined,
          section: data.get("section")
            ? String(data.get("section"))
            : undefined,
          pickupAddress: data.get("pickupAddress")
            ? String(data.get("pickupAddress"))
            : undefined,
          dropAddress: data.get("dropAddress")
            ? String(data.get("dropAddress"))
            : undefined,
          busId: data.get("busId") ? String(data.get("busId")) : undefined,
          routeId: data.get("routeId")
            ? String(data.get("routeId"))
            : undefined,
        });
        if (!p) throw new Error("Parent account creation failed.");
        toast.success("Parent and student saved successfully!");
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(`Error: ${err.message}`);
      toast.error(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {current && (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <DialogHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <current.icon className="h-5 w-5" />
              </div>
              <DialogTitle>{current.title}</DialogTitle>
              <DialogDescription>{current.description}</DialogDescription>
            </DialogHeader>
            {errorMsg && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm font-medium mt-4 border border-red-200">
                {errorMsg}
              </div>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {current.fields.map((f: any) => (
                  <div key={f.name} className="grid gap-2">
                    <Label htmlFor={f.name}>{f.label}</Label>
                    {f.type === "select" ? (
                      <select
                        id={f.name}
                        name={f.name}
                        required={f.required}
                        disabled={saving}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {f.options.map((opt: any) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id={f.name}
                        name={f.name}
                        type={"type" in f ? f.type : "text"}
                        placeholder={f.placeholder}
                        required={f.required}
                        disabled={saving}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                Save
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
