import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Clock,
  MapPin,
  Phone,
  AlertCircle,
  Settings as SettingsIcon,
  MessageSquare,
  Send,
} from "lucide-react";
import { FleetMap } from "@/components/FleetMap";
import { useFleetPositions } from "@/lib/tracking";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  fetchNotifications,
  subscribeToNotifications,
  addNotification,
  type AppNotification,
} from "@/lib/notifications";

export const Route = createFileRoute("/app/parent")({
  head: () => ({ meta: [{ title: "Parent Dashboard — Blue Horizon" }] }),
  component: ParentDashboard,
});

const stops = [
  {
    name: "Oak Street & 5th Ave",
    time: "3:25 PM",
    dist: "0.8 mi away",
    state: "Current",
  },
  {
    name: "Blue Horizon Elementary",
    time: "3:30 PM",
    dist: "1.2 mi away",
    state: "Next",
  },
  {
    name: "Central Park Stop",
    time: "3:35 PM",
    dist: "1.8 mi away",
    state: "",
  },
];

function ParentDashboard() {
  const fleet = useFleetPositions();
  const myBus = fleet.find((b) => b.id === "007");

  const [busLocation, setBusLocation] = useState<
    { lat: number; lng: number } | undefined
  >();
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitial = async () => {
      const { data } = await supabase
        .from("bus_locations")
        .select("*")
        .eq("bus_id", "007")
        .single();
      if (data) {
        setBusLocation({ lat: data.latitude, lng: data.longitude });
        setLastUpdated(data.updated_at);
      }
    };
    fetchInitial();

    const channel = supabase
      .channel("bus_locations_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bus_locations",
          filter: "bus_id=eq.007",
        },
        (payload) => {
          const newLoc = payload.new as Record<string, unknown>;
          if (newLoc) {
            setBusLocation({
              lat: Number(newLoc.latitude),
              lng: Number(newLoc.longitude),
            });
            setLastUpdated(String(newLoc.updated_at));
          }
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card
        className="overflow-hidden border-0 p-6 text-white shadow-[var(--shadow-card)]"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Aarav S</h1>
              <p className="text-white/80">Grade 5 • Bus 007</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
                <MapPin className="h-3.5 w-3.5" /> Gandhi Nagar
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-success text-success-foreground">On Bus</Badge>
            <Badge className="bg-white text-primary hover:bg-white">
              Present
            </Badge>
            <Badge
              className="bg-white/15 text-white border-white/20"
              variant="outline"
            >
              <Clock className="mr-1 h-3 w-3" /> 4:15 PM ETA
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming stops</h2>
            <Badge variant="outline">Route A</Badge>
          </div>
          <ul className="space-y-2">
            {stops.map((s) => (
              <li
                key={s.name}
                className={`flex items-center justify-between rounded-xl border p-4 ${
                  s.state === "Current"
                    ? "border-primary/30 bg-primary/5"
                    : s.state === "Next"
                      ? "border-success/30 bg-success/5"
                      : "border-border"
                }`}
              >
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.dist}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{s.time}</p>
                  {s.state && (
                    <Badge
                      variant="outline"
                      className={
                        s.state === "Current"
                          ? "border-primary/30 text-primary"
                          : "border-success/30 text-success"
                      }
                    >
                      {s.state}
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold">Live map</h2>
          <p className="text-xs text-muted-foreground">
            Bus 007 —{" "}
            {lastUpdated
              ? `last updated ${formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}`
              : "waiting for location..."}
          </p>
          <div className="mt-3 w-full overflow-hidden rounded-xl h-[300px]">
            <FleetMap buses={myBus ? [myBus] : []} highlightId="007" />
          </div>
        </Card>
      </div>

      <div className="grid gap-6">
        <MessagesBoard />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Button
          variant="outline"
          className="h-14 justify-start gap-3 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary"
          onClick={() => {
            window.location.href = "tel:+919876543210";
          }}
        >
          <Phone className="h-5 w-5" /> Call Driver
        </Button>
        <Button
          variant="outline"
          className="h-14 justify-start gap-3 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary"
          onClick={() => {
            window.location.href = "tel:+18005550199";
          }}
        >
          <Phone className="h-5 w-5" /> Call School
        </Button>
        <Link to="/app/reports">
          <Button
            variant="outline"
            className="h-14 w-full justify-start gap-3 text-foreground"
          >
            <AlertCircle className="h-5 w-5 text-muted-foreground" /> Report issue
          </Button>
        </Link>
        <Link to="/app/settings">
          <Button
            variant="outline"
            className="h-14 w-full justify-start gap-3 text-foreground"
          >
            <SettingsIcon className="h-5 w-5 text-muted-foreground" /> Settings
          </Button>
        </Link>
      </div>
    </div>
  );
}

function MessagesBoard() {
  const [messages, setMessages] = useState<AppNotification[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchNotifications("parent");
      setMessages(data);
    };
    load();

    const channel = subscribeToNotifications("parent", (payload) => {
      const newRecord = payload.new as AppNotification;
      setMessages((prev) => [newRecord, ...prev]);
    });
    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setLoading(true);
    await addNotification(
      "Message from Parent (Aarav S)",
      msgInput,
      "announcement",
      "all",
    );
    toast.success("Message sent to driver");
    setMsgInput("");
    setLoading(false);
  };

  return (
    <Card className="p-5 flex flex-col h-[400px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" /> Messages &
          Announcements
        </h2>
        <Badge variant="secondary">
          {messages.filter((m) => !m.read).length} Unread
        </Badge>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            No messages yet.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-1">
              <p className="font-medium text-sm">{m.title}</p>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                {formatDistanceToNow(new Date(m.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{m.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2 mt-auto">
        <Input
          placeholder="Message the driver..."
          value={msgInput}
          onChange={(e) => setMsgInput(e.target.value)}
          disabled={loading}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={loading || !msgInput.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Send className="h-4 w-4 mr-2" /> Send
        </Button>
      </form>
    </Card>
  );
}
