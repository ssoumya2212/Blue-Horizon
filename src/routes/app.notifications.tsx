import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useSearchQuery } from "@/lib/search";
import { getSession } from "@/lib/auth";
import { useEffect, useState } from "react";
import {
  fetchNotifications,
  subscribeToNotifications,
  type AppNotification,
} from "@/lib/notifications";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Blue Horizon" }] }),
  component: Notifications,
});

function Notifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const q = useSearchQuery().toLowerCase();

  const loadNotifications = async () => {
    const session = await getSession();
    const role = session?.role || "parent";
    const data = await fetchNotifications(role);
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();

    let channel: any;

    const setupSubscription = async () => {
      const session = await getSession();
      const role = session?.role || "parent";
      channel = subscribeToNotifications(role, () => {
        loadNotifications();
      });
    };

    setupSubscription();

    return () => {
      if (channel) channel.unsubscribe();
    };
  }, []);

  const getIconAndTone = (type: string) => {
    if (type === "bus_arrival" || type === "attendance") {
      return { icon: CheckCircle2, tone: "success" };
    }
    if (type === "bus_delay" || type === "delay" || type === "route_update") {
      return { icon: AlertTriangle, tone: "warning" };
    }
    if (type === "emergency") {
      return { icon: AlertTriangle, tone: "destructive" };
    }
    return { icon: Bell, tone: "primary" };
  };

  const filtered = q
    ? notifications.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q),
      )
    : notifications;

  if (loading) {
    return (
      <div className="p-8 text-center animate-pulse text-muted-foreground">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Real-time updates from your child's commute.
        </p>
      </div>
      <Card className="divide-y p-0 overflow-hidden border border-border">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No notifications yet. Only notifications sent in the system will be
            displayed here.
          </div>
        ) : (
          filtered.map((n) => {
            const { icon: Icon, tone } = getIconAndTone(n.type);
            return (
              <div key={n.id} className="flex items-start gap-3 p-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    tone === "success"
                      ? "bg-success/15 text-success"
                      : tone === "warning"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                        : tone === "destructive"
                          ? "bg-destructive/15 text-destructive"
                          : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(n.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
}
