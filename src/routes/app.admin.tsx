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

export const Route = createFileRoute("/app/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Blue Horizon" }] }),
  component: AdminDashboard,
});

const stats = [
  {
    label: "Total Buses",
    value: "15",
    trend: "+2 this month",
    icon: Bus,
    tone: "primary",
  },
  {
    label: "Drivers",
    value: "22",
    trend: "3 pending approval",
    icon: Users,
    tone: "warning",
  },
  {
    label: "Students",
    value: "248",
    trend: "+12 new",
    icon: GraduationCap,
    tone: "success",
  },
  {
    label: "Active Alerts",
    value: "4",
    trend: "2 resolved today",
    icon: AlertTriangle,
    tone: "destructive",
  },
];

const activity = [
  {
    id: 1,
    who: "Bus 007",
    what: "Departed from Oak Street",
    time: "2 min ago",
    status: "On Route",
  },
  {
    id: 2,
    who: "Driver Ravi",
    what: "Marked attendance for Route A",
    time: "8 min ago",
    status: "Done",
  },
  {
    id: 3,
    who: "Bus 012",
    what: "Reported minor delay near Stop 6",
    time: "15 min ago",
    status: "Delay",
  },
  {
    id: 4,
    who: "Parent K. Mehta",
    what: "Updated emergency contact",
    time: "1 hr ago",
    status: "Done",
  },
  {
    id: 5,
    who: "Driver Sahil",
    what: "Submitted onboarding documents",
    time: "3 hr ago",
    status: "Pending",
  },
];

import {
  useDrivers,
  updateDriverStatus,
  type DriverStatus,
} from "@/lib/drivers";

type DialogKind = "bus" | "driver" | "parent" | "route" | "announcement" | null;

function AdminDashboard() {
  const drivers = useDrivers();
  const [openDialog, setOpenDialog] = useState<DialogKind>(null);

  const updateDriver = (name: string, status: DriverStatus) => {
    updateDriverStatus(name, status);
    toast.success(`${name} ${status === "approved" ? "approved" : "rejected"}`);
  };

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
        {stats.map((s) => (
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
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
              {activity.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.who}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {a.what}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {a.time}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        a.status === "On Route"
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : a.status === "Done"
                            ? "border-success/30 bg-success/15 text-success"
                            : a.status === "Pending"
                              ? "border-amber-300 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                              : "border-destructive/30 bg-destructive/15 text-destructive"
                      }
                    >
                      {a.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Driver approvals</h2>
            <Badge variant="secondary">
              {drivers.filter((d) => d.status === "pending").length} pending
            </Badge>
          </div>
          <ul className="space-y-3">
            {drivers.map((d) => (
              <li
                key={d.name}
                className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.route} • {d.licence}
                  </p>
                </div>
                {d.status === "pending" ? (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => updateDriver(d.name, "rejected")}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateDriver(d.name, "approved")}
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Approve
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant="outline"
                    className={
                      d.status === "approved"
                        ? "border-success/30 bg-success/15 text-success"
                        : "border-destructive/30 bg-destructive/15 text-destructive"
                    }
                  >
                    {d.status === "approved" ? (
                      <>
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Allowed
                      </>
                    ) : (
                      "Rejected"
                    )}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <AddEntityDialog
        kind={openDialog === "announcement" ? null : openDialog}
        onClose={() => setOpenDialog(null)}
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

function AddEntityDialog({
  kind,
  onClose,
}: {
  kind: DialogKind;
  onClose: () => void;
}) {
  const open = kind !== null;

  const config = {
    bus: {
      title: "Add new bus",
      description: "Register a new bus to the fleet.",
      icon: Bus,
      fields: [
        { name: "busNumber", label: "Bus number", placeholder: "e.g. Bus 015" },
        { name: "plate", label: "Plate number", placeholder: "MH-12-AB-1234" },
        {
          name: "capacity",
          label: "Capacity",
          placeholder: "40",
          type: "number",
        },
        { name: "route", label: "Assigned route", placeholder: "Route A" },
      ],
    },
    driver: {
      title: "Add new driver",
      description: "Onboard a new driver to your fleet.",
      icon: Users,
      fields: [
        { name: "name", label: "Full name", placeholder: "John Doe" },
        { name: "phone", label: "Phone", placeholder: "+91 90000 00000" },
        {
          name: "licence",
          label: "Licence number",
          placeholder: "MH-12-AB-9999",
        },
        { name: "route", label: "Assigned route", placeholder: "Route A" },
      ],
    },
    parent: {
      title: "Add new parent",
      description: "Create a parent account linked to a student.",
      icon: GraduationCap,
      fields: [
        { name: "name", label: "Parent name", placeholder: "Jane Smith" },
        {
          name: "email",
          label: "Email",
          placeholder: "jane@example.com",
          type: "email",
        },
        { name: "phone", label: "Phone", placeholder: "+91 90000 00000" },
        { name: "child", label: "Child name", placeholder: "Aarav S" },
      ],
    },
    route: {
      title: "Add new route",
      description: "Define a new bus route with stops.",
      icon: RouteIcon,
      fields: [
        { name: "name", label: "Route name", placeholder: "Route G" },
        { name: "start", label: "Start point", placeholder: "Oak Street" },
        { name: "end", label: "End point", placeholder: "School Gate" },
        {
          name: "stops",
          label: "Number of stops",
          placeholder: "8",
          type: "number",
        },
      ],
    },
  } as const;

  const current = kind ? config[kind] : null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!current || !kind) return;
    const data = new FormData(e.currentTarget);
    if (kind === "route") {
      addRoute({
        name: String(data.get("name") || "Route"),
        start: String(data.get("start") || ""),
        end: String(data.get("end") || ""),
        stops: Number(data.get("stops") || 0),
        students: 0,
        bus: "—",
        driver: "Unassigned",
      });
    }
    toast.success(
      `${current.title.replace("Add new ", "")} added successfully`,
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        {current && (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <current.icon className="h-5 w-5" />
              </div>
              <DialogTitle>{current.title}</DialogTitle>
              <DialogDescription>{current.description}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {current.fields.map((f) => (
                <div key={f.name} className="grid gap-2">
                  <Label htmlFor={f.name}>{f.label}</Label>
                  <Input
                    id={f.name}
                    name={f.name}
                    type={"type" in f ? f.type : "text"}
                    placeholder={f.placeholder}
                    required
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
