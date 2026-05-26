import { supabase } from "@/lib/supabase";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MapPin, AlertTriangle, Phone } from "lucide-react";
import { Geolocation } from "@capacitor/geolocation";
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

export const Route = createFileRoute("/app/driver")({
  head: () => ({ meta: [{ title: "Driver Dashboard — Blue Horizon" }] }),
  component: DriverDashboard,
});

type Student = { id: number; name: string; stop: string; present: boolean };

const initial: Student[] = [
  { id: 1, name: "Aarav S", stop: "Stop 5", present: true },
  { id: 2, name: "Advik N", stop: "Stop 3", present: true },
  { id: 3, name: "Anaya R", stop: "Stop 7", present: true },
  { id: 4, name: "Anvi K", stop: "Stop 8", present: true },
  { id: 5, name: "Arjun M", stop: "Stop 5", present: true },
  { id: 6, name: "Aarohi D", stop: "Stop 6", present: true },
  { id: 7, name: "Diya S", stop: "Stop 7", present: true },
  { id: 8, name: "Ishika R", stop: "Stop 8", present: true },
];

function DriverDashboard() {
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [isSosCooldown, setIsSosCooldown] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);

  useEffect(() => {
    let watchId: string | undefined;

    const startTracking = async () => {
      try {
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
                bus_id: "007",
                latitude: lat,
                longitude: lng,
                updated_at: new Date().toISOString(),
              });
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
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, []);
  const [students, setStudents] = useState(initial);
  const [q, setQ] = useState("");
  const [reportText, setReportText] = useState("");
  const reports = useReports();
  const present = students.filter((s) => s.present).length;
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(q.toLowerCase()),
  );
  const toggle = (id: number) => {
    setStudents((arr) => {
      const student = arr.find((s) => s.id === id);
      if (student) {
        const isNowPresent = !student.present;
        addNotification(
          "Attendance Update",
          `${student.name} was marked ${isNowPresent ? "Present" : "Absent"}.`,
          "attendance",
          "parent",
        );
      }
      return arr.map((s) => (s.id === id ? { ...s, present: !s.present } : s));
    });
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    addReport(reportText.trim(), "Driver Ravi");
    await addNotification(
      "Report from Driver Ravi",
      reportText.trim(),
      "bus_delay",
      "parent",
    );
    setReportText("");
    toast.success("Report submitted");
  };

  const handleSOS = async () => {
    if (isSosCooldown) return;

    await addNotification(
      "🚨 Emergency Alert",
      "Bus 007 has triggered an emergency alert.",
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Welcome, Ravi</h1>
          <p className="text-sm text-muted-foreground">
            Mark today's attendance for Route A.
          </p>
        </div>
        <div className="relative flex items-center gap-2">
          {isGpsActive && (
            <Badge
              variant="outline"
              className="border-success/50 text-success bg-success/10 py-1.5 hidden sm:flex items-center gap-1"
            >
              <MapPin className="h-3 w-3" /> Live GPS Active
            </Badge>
          )}

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
                    "Bus 007 is experiencing a slight delay.",
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
                    "Bus 007 is taking an alternate route.",
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
                    "Bus 007 arriving in 5 minutes 🚍",
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
          { label: "BUS NO", value: "007" },
          { label: "STOPS", value: "12" },
          { label: "STUDENTS", value: `${present}/${students.length}` },
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
              <TableHead>Stop</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s, i) => (
              <TableRow key={s.id}>
                <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {s.stop}
                </TableCell>
                <TableCell>
                  {s.present ? (
                    <Badge className="bg-success text-success-foreground">
                      Present
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-destructive/30 text-destructive"
                    >
                      Absent
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="text-primary hover:bg-primary/10 transition-colors h-8 w-8 hidden sm:flex"
                    >
                      <a href={`tel:+91987654321${i}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant={s.present ? "outline" : "default"}
                      onClick={() => toggle(s.id)}
                    >
                      {s.present ? "Mark absent" : "Mark present"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
