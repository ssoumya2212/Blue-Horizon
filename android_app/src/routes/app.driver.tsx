import { supabase } from "@/lib/supabase";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MapPin, AlertTriangle, Phone } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, FileText, Send } from "lucide-react";
import { toast } from "sonner";
import { addReport, useReports, timeAgo } from "@/lib/reports";
import { addNotification } from "@/lib/notifications";

import { getSession } from "@/lib/auth";
import { redirect } from "@tanstack/react-router";
import { completeFirstLogin } from "@/server-functions/admin_actions";

export const Route = createFileRoute("/app/driver")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session || session.role !== "driver") {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({ meta: [{ title: "Driver Dashboard — Blue Horizon" }] }),
  component: DriverDashboard,
});

import type { Student, StudentStatus } from "@/types/db";

function DriverDashboard() {
  const [driverProfile, setDriverProfile] = useState<any>(null);
  const [assignedBus, setAssignedBus] = useState<any>(null);
  const [assignedRoute, setAssignedRoute] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  const [isGpsActive, setIsGpsActive] = useState(false);
  const [isSosCooldown, setIsSosCooldown] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const [activeTrip, setActiveTrip] = useState<any>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [q, setQ] = useState("");
  const [reportText, setReportText] = useState("");
  const reports = useReports();

  // Load Driver Profile & Assigned Bus/Route
  const loadDriverData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setDriverProfile(profile);

        // Try to find the bus this driver is assigned to
        const { data: busData } = await supabase
          .from("buses")
          .select("*")
          .eq("driver_id", user.id)
          .limit(1);

        let myBus = busData && busData.length > 0 ? busData[0] : null;

        if (!myBus && profile.bus_id) {
          // Fallback to profile bus_id
          const { data: busData2 } = await supabase
            .from("buses")
            .select("*")
            .eq("id", profile.bus_id)
            .single();
          myBus = busData2;
        }

        if (myBus) {
          setAssignedBus(myBus);

          if (myBus.route_id) {
            const { data: routeData } = await supabase
              .from("routes")
              .select("*")
              .eq("id", myBus.route_id)
              .single();
            if (routeData) setAssignedRoute(routeData);
          }

          // Fetch active trip if exists
          const { data: activeTrips } = await supabase
            .from("trips")
            .select("*")
            .eq("bus_id", myBus.id)
            .eq("status", "active")
            .limit(1);
          if (activeTrips && activeTrips.length > 0) {
            setActiveTrip(activeTrips[0]);
          }
        }
      }
    } catch (err) {
      console.error("Error loading driver dashboard data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDriverData();
  }, []);

  // Watch GPS Position (Only when assignedBus is loaded)
  useEffect(() => {
    if (!assignedBus?.id) return;

    let watchId: string | undefined;

    const startTracking = async () => {
      try {
        const { Geolocation } = await import("@capacitor/geolocation");
        await Geolocation.requestPermissions();
        watchId = await Geolocation.watchPosition(
          { enableHighAccuracy: true },
          async (position, err) => {
            if (err) {
              console.log("GPS Error:", err);
              setIsGpsActive(false);
              return;
            }
            if (position) {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              console.log("Bus Location:", lat, lng);
              setIsGpsActive(true);

              await supabase.from("bus_locations").upsert({
                bus_id: assignedBus.id,
                latitude: lat,
                longitude: lng,
                updated_at: new Date().toISOString(),
              });

              if (activeTrip) {
                await supabase.from("tracking_history").insert({
                  bus_id: assignedBus.id,
                  latitude: lat,
                  longitude: lng,
                  created_at: new Date().toISOString(),
                });
              }
            }
          },
        );
      } catch (error) {
        console.error("GPS init error", error);
      }
    };

    startTracking();

    return () => {
      if (watchId) {
        import("@capacitor/geolocation")
          .then(({ Geolocation }) => {
            Geolocation.clearWatch({ id: watchId as string }).catch(() => {});
          })
          .catch(() => {});
      }
    };
  }, [assignedBus?.id, activeTrip?.id]);

  // Load and Subscribe to Students for this Bus
  useEffect(() => {
    if (!assignedBus?.id) return;

    const fetchStudents = async () => {
      const { data } = await supabase
        .from("students")
        .select("*")
        .eq("bus_id", assignedBus.id)
        .order("name");
      if (data) setStudents(data);
    };

    fetchStudents();

    const channel = supabase
      .channel("driver_students_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "students",
          filter: `bus_id=eq.${assignedBus.id}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setStudents((prev) =>
              prev.map((s) =>
                s.id === payload.new.id ? (payload.new as Student) : s,
              ),
            );
          } else if (payload.eventType === "INSERT") {
            setStudents((prev) => [...prev, payload.new as Student]);
          } else if (payload.eventType === "DELETE") {
            setStudents((prev) => prev.filter((s) => s.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [assignedBus?.id]);

  const onboardCount = students.filter((s) => s.status === "picked").length;
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(q.toLowerCase()),
  );

  const handleStartTrip = async () => {
    if (!assignedBus?.id) {
      toast.error("No bus assigned. Cannot start trip.");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("trips")
        .insert({
          bus_id: assignedBus.id,
          status: "active",
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from("buses")
        .update({ status: "Running", last_updated: new Date().toISOString() })
        .eq("id", assignedBus.id);

      await supabase
        .from("students")
        .update({ status: "pending", last_updated: new Date().toISOString() })
        .eq("bus_id", assignedBus.id);

      setActiveTrip(data);
      setAssignedBus((prev: any) => ({ ...prev, status: "Running" }));
      toast.success("Trip started! Students status reset to pending.");

      await addNotification(
        `Bus ${assignedBus.id}`,
        `Started trip on Route ${assignedRoute?.name || "Unassigned"}.`,
        "route_update",
        "all"
      );
    } catch (err: any) {
      console.error("Error starting trip:", err);
      toast.error(err.message || "Failed to start trip.");
    }
  };

  const handleEndTrip = async () => {
    if (!activeTrip) return;
    try {
      const { error } = await supabase
        .from("trips")
        .update({
          status: "completed",
          ended_at: new Date().toISOString(),
        })
        .eq("id", activeTrip.id);

      if (error) throw error;

      await supabase
        .from("buses")
        .update({ status: "Active", last_updated: new Date().toISOString() })
        .eq("id", assignedBus.id);

      setActiveTrip(null);
      setAssignedBus((prev: any) => ({ ...prev, status: "Active" }));
      toast.success("Trip completed successfully!");

      await addNotification(
        `Bus ${assignedBus.id}`,
        `Completed trip. Status set to Idle.`,
        "route_update",
        "all"
      );
    } catch (err: any) {
      console.error("Error ending trip:", err);
      toast.error(err.message || "Failed to end trip.");
    }
  };

  const markPresent = async (student: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, status: "picked" } : s)),
    );
    await supabase
      .from("students")
      .update({ status: "picked", last_updated: new Date().toISOString() })
      .eq("id", student.id);

    await supabase.from("pickup_logs").insert({
      student_id: student.id,
      bus_id: assignedBus?.id || "007",
      location_name: student.pickup_address || "School Bus stop",
      created_at: new Date().toISOString(),
    });

    toast.success(`${student.name} marked present!`);
  };

  const markAbsent = async (student: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, status: "absent" } : s)),
    );
    await supabase
      .from("students")
      .update({ status: "absent", last_updated: new Date().toISOString() })
      .eq("id", student.id);
    toast.info(`${student.name} marked absent.`);
  };

  const markDropped = async (student: Student) => {
    if (student.status === "dropped") return;

    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, status: "dropped" } : s)),
    );

    try {
      if (!navigator.onLine) {
        const { addPendingAction } = await import("@/lib/offline-sync");
        addPendingAction("MARK_DROP", {
          student_id: student.id,
          drop_log: {
            student_id: student.id,
            bus_id: assignedBus?.id || "007",
            status: "dropped",
            location_name: student.drop_address,
          },
        });
        toast.warning(`Offline: ${student.name} drop queued for sync`);
      } else {
        await supabase
          .from("students")
          .update({ status: "dropped", last_updated: new Date().toISOString() })
          .eq("id", student.id);

        await supabase.from("drop_logs").insert({
          student_id: student.id,
          bus_id: assignedBus?.id || "007",
          status: "dropped",
          location_name: student.drop_address,
        });
      }
    } catch (e) {
      console.error("Failed to mark drop", e);
      toast.error("Failed to drop student");
    }

    addNotification(
      "Safe Drop-off 🚸",
      `Your child ${student.name} has been safely dropped at ${student.drop_address}.`,
      "attendance",
      "parent",
    );

    toast.success(`${student.name} marked as dropped!`);
  };

  const handleScan = (decodedText: string) => {
    setIsScannerOpen(false);

    const student = students.find(
      (s) =>
        s.id.toString() === decodedText || s.student_roll_no === decodedText,
    );

    if (student) {
      if (student.status === "dropped") {
        toast.info(`${student.name} is already dropped off.`);
      } else if (student.status === "picked") {
        markDropped(student);
      } else {
        markPresent(student);
      }
    } else {
      toast.error("Student not found in this bus.");
    }
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    const authorName = driverProfile?.full_name || "Driver";
    addReport(reportText.trim(), authorName);
    await addNotification(
      `Report from Driver ${authorName}`,
      reportText.trim(),
      "bus_delay",
      "parent",
    );
    setReportText("");
    toast.success("Report submitted");
  };

  const handleSOS = async () => {
    if (isSosCooldown) return;
    const busNum = assignedBus?.id || "007";

    await addNotification(
      "🚨 Emergency Alert",
      `Bus ${busNum} has triggered an emergency alert.`,
      "emergency",
      "all",
    );

    toast.error("Emergency Alert Sent! Authorities notified.", {
      className: "bg-destructive text-destructive-foreground border-none",
    });
    setIsSosModalOpen(false);
    setIsSosCooldown(true);

    setTimeout(() => setIsSosCooldown(false), 60000);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground animate-pulse">
          Loading driver dashboard details...
        </p>
      </div>
    );
  }

  if (driverProfile?.created_by_admin && !driverProfile?.password_changed) {
    return (
      <DriverFirstLoginOnboarding
        profile={driverProfile}
        onComplete={() => {
          setDriverProfile((prev: any) => ({ ...prev, password_changed: true }));
          toast.success("Account setup completed successfully!");
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            Welcome, {driverProfile?.full_name || "Driver"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Mark today's attendance for Route{" "}
            {assignedRoute?.name || "Unassigned"}.
          </p>
        </div>
        <div className="relative flex items-center gap-2">
          {activeTrip ? (
            <Button
              variant="destructive"
              onClick={handleEndTrip}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold shadow-md animate-in fade-in zoom-in-95 duration-200"
            >
              🛑 End Trip
            </Button>
          ) : (
            <Button
              onClick={handleStartTrip}
              className="bg-success hover:bg-success/90 text-success-foreground font-bold shadow-md animate-in fade-in zoom-in-95 duration-200"
            >
              🏁 Start Trip
            </Button>
          )}

          {isGpsActive && (
            <Badge
              variant="outline"
              className="border-success/50 text-success bg-success/10 py-1.5 hidden sm:flex items-center gap-1"
            >
              <MapPin className="h-3 w-3" /> Live GPS Active
            </Badge>
          )}

          <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 hidden sm:flex"
              >
                <Search className="mr-2 h-4 w-4" /> Scan ID
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md flex flex-col items-center">
              <DialogHeader>
                <DialogTitle>Scan Student E-Pass</DialogTitle>
                <DialogDescription className="text-center">
                  Align the QR code within the frame to automatically check in
                  or drop off the student.
                </DialogDescription>
              </DialogHeader>
              <div className="w-full flex flex-col gap-4 mt-2">
                <p className="text-sm text-muted-foreground text-center">
                  Camera scanning disabled in demo. Enter student Roll No
                  manually:
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const val = (
                      e.currentTarget.elements.namedItem(
                        "scanInput",
                      ) as HTMLInputElement
                    ).value;
                    if (val) handleScan(val);
                  }}
                  className="flex gap-2"
                >
                  <Input name="scanInput" placeholder="e.g. S123" />
                  <Button type="submit">Check In</Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isSosModalOpen} onOpenChange={setIsSosModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className={`shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all ${isSosCooldown ? "opacity-50" : "animate-pulse hover:shadow-[0_0_25px_rgba(239,68,68,0.8)]"}`}
                disabled={isSosCooldown}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                {isSosCooldown ? "SOS Cooldown" : "Emergency SOS"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-destructive flex items-center gap-2 text-xl">
                  <AlertTriangle className="h-6 w-6" /> Confirm Emergency
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to trigger an Emergency SOS? This will
                  instantly notify all parents, school administrators, and local
                  authorities.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-between gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsSosModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleSOS}>
                  Trigger SOS
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-primary/50 text-primary bg-primary/5 hover:bg-primary/10"
              >
                Quick Updates
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => {
                  addNotification(
                    "Bus Delayed",
                    `Bus ${assignedBus?.id || "007"} is experiencing a slight delay.`,
                    "delay",
                    "parent",
                  );
                  toast.success("Delay alert sent to parents");
                }}
              >
                Bus Delayed
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  addNotification(
                    "Route Changed",
                    `Bus ${assignedBus?.id || "007"} is taking an alternate route.`,
                    "route_update",
                    "parent",
                  );
                  toast.success("Route update sent to parents");
                }}
              >
                Route Changed
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  addNotification(
                    "Bus Arriving Soon",
                    `Bus ${assignedBus?.id || "007"} arriving in 5 minutes 🚍`,
                    "bus_arrival",
                    "parent",
                  );
                  toast.success("Arrival alert sent");
                }}
              >
                Arriving Soon
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search students"
              className="w-64 pl-9"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "BUS NO", value: assignedBus?.id || "—" },
          { label: "ROUTE", value: assignedRoute?.name || "Unassigned" },
          { label: "ONBOARD", value: onboardCount },
        ].map((s, i) => (
          <Card
            key={s.label}
            className="overflow-hidden border-0 p-5 text-white shadow-[var(--shadow-card)]"
            style={{
              background:
                i === 0
                  ? "linear-gradient(135deg, oklch(0.18 0.04 250), oklch(0.32 0.07 245))"
                  : i === 1
                    ? "linear-gradient(135deg, oklch(0.32 0.08 245), oklch(0.5 0.11 240))"
                    : "linear-gradient(135deg, oklch(0.55 0.12 235), oklch(0.72 0.13 225))",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
              {s.label}
            </p>
            <p className="mt-1 text-3xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b bg-muted/30 px-5 py-3">
          <h2 className="font-semibold">Student attendance</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Roll No</TableHead>
              <TableHead>Drop Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No students assigned or matching the search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s, i) => (
                <TableRow key={s.id}>
                  <TableCell className="text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono">
                    {s.student_roll_no || "N/A"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.drop_address || s.pickup_address}
                  </TableCell>
                  <TableCell>
                    {s.status === "dropped" ? (
                      <Badge className="bg-success text-success-foreground">
                        Dropped
                      </Badge>
                    ) : s.status === "picked" ? (
                      <Badge className="bg-primary text-primary-foreground">
                        Present
                      </Badge>
                    ) : s.status === "absent" ? (
                      <Badge variant="destructive">Absent</Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-warning/50 text-warning"
                      >
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      {s.parent_phone && (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="text-primary hover:bg-primary/10 transition-colors h-8 w-8 hidden sm:flex"
                        >
                          <a href={`tel:${s.parent_phone}`}>
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {s.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive border-destructive/50 hover:bg-destructive/10"
                            onClick={() => markAbsent(s)}
                          >
                            Absent
                          </Button>
                          <Button size="sm" onClick={() => markPresent(s)}>
                            Present
                          </Button>
                        </>
                      )}
                      {s.status === "absent" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markPresent(s)}
                        >
                          Mark Present
                        </Button>
                      )}
                      {s.status === "picked" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => markDropped(s)}
                        >
                          Drop Off
                        </Button>
                      )}
                      {s.status === "dropped" && (
                        <Button size="sm" variant="outline" disabled>
                          Dropped
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-semibold">Submit a report</h2>
              <p className="text-xs text-muted-foreground">
                Log incidents, delays or route notes.
              </p>
            </div>
          </div>
          <form onSubmit={submitReport} className="space-y-3">
            <Textarea
              rows={5}
              placeholder="What happened on the route?"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            />
            <Button type="submit" className="w-full sm:w-auto">
              <Send className="mr-1 h-4 w-4" /> Submit report
            </Button>
          </form>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">Nearby reports</h2>
          <p className="text-xs text-muted-foreground">
            Latest incidents across the fleet.
          </p>
          <ul className="mt-3 space-y-3">
            {reports.slice(0, 5).map((r) => (
              <li
                key={r.id}
                className="rounded-lg border-l-4 border-primary bg-primary/5 p-3 text-sm"
              >
                <p>{r.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.author} • {timeAgo(r.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function DriverFirstLoginOnboarding({
  profile,
  onComplete,
}: {
  profile: any;
  onComplete: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!acceptedTerms) {
      toast.error("You must accept the Terms and Conditions to proceed.");
      return;
    }

    setSubmitting(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token || "";
      const res = await completeFirstLogin({
        data: { token, userId: profile.id, password },
      });
      if (res.success) {
        onComplete();
      } else {
        toast.error(res.error || "Failed to update password.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden border-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-card backdrop-blur-md">
        <div className="p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Welcome Driver
            </h1>
            <p className="text-sm text-muted-foreground">
              Please complete your account setup to access the driver portal.
            </p>
          </div>

          <div className="rounded-xl bg-muted/40 p-4 border border-border/50 text-xs space-y-1">
            <p className="font-semibold text-foreground/80">Account Info:</p>
            <p className="text-muted-foreground font-medium">
              Email:{" "}
              <span className="font-semibold text-foreground">
                {profile.email}
              </span>
            </p>
            <p className="text-muted-foreground font-medium">
              Assigned Bus:{" "}
              <span className="font-semibold text-foreground">
                {profile.bus_id || "Unassigned"}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                New Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1 cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-xs text-muted-foreground leading-normal cursor-pointer select-none"
              >
                I accept the{" "}
                <span className="font-medium text-primary hover:underline">
                  Terms & Conditions
                </span>{" "}
                and consent to share my GPS location while on active trips.
              </label>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md py-6 rounded-xl text-base font-semibold"
            >
              {submitting
                ? "Saving Settings..."
                : "Complete Setup & Launch Dashboard"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
