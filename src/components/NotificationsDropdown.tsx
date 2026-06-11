import { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  MapPin,
  MessageSquare,
  Route,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchNotifications,
  subscribeToNotifications,
  markAsRead,
  AppNotification,
  NotificationType,
} from "@/lib/notifications";

export function NotificationsDropdown({ role }: { role: string }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Request push notification permission natively and for web
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }

    // Dynamically import Capacitor to prevent SSR crashes
    import("@capacitor/local-notifications")
      .then(({ LocalNotifications }) => {
        LocalNotifications.requestPermissions().catch(() => {});
      })
      .catch(() => {});

    // Initial fetch
    fetchNotifications(role).then((data) => {
      setNotifications(data);
    });

    // Subscribe to realtime updates
    const subscription = subscribeToNotifications(role, (payload: any) => {
      if (payload.eventType === "INSERT") {
        setNotifications((prev) => [payload.new, ...prev]);

        // Trigger browser push notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(payload.new.title, {
            body: payload.new.message,
          });
        }

        // Trigger Capacitor native notification
        import("@capacitor/local-notifications")
          .then(({ LocalNotifications }) => {
            LocalNotifications.schedule({
              notifications: [
                {
                  title: payload.new.title,
                  body: payload.new.message,
                  id: Date.now(),
                  schedule: { at: new Date(Date.now() + 100) },
                },
              ],
            }).catch(() => {});
          })
          .catch(() => {});
      } else if (payload.eventType === "UPDATE") {
        setNotifications((prev) =>
          prev.map((n) => (n.id === payload.new.id ? payload.new : n)),
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [role]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    await markAsRead(id);
  };

  const markAllAsRead = () => {
    notifications.forEach((n) => {
      if (!n.read) handleMarkAsRead(n.id);
    });
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "bus_arrival":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "bus_delay":
      case "delay":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "emergency":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "gps_update":
        return <MapPin className="h-4 w-4 text-emerald-500" />;
      case "attendance":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "announcement":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "route_update":
        return <Route className="h-4 w-4 text-indigo-500" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-destructive shadow-[0_0_0_2px_var(--background)]" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0 shadow-[var(--shadow-card)]"
      >
        <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/20">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-sm text-muted-foreground">
              <div className="mb-3 rounded-full bg-muted p-3">
                <Bell className="h-6 w-6 opacity-40" />
              </div>
              <p>No new notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 p-4 transition-colors hover:bg-muted/50 cursor-pointer ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                  onClick={() => {
                    if (!notification.read) handleMarkAsRead(notification.id);
                  }}
                >
                  <div className="mt-0.5 shrink-0 rounded-full border bg-background p-2 shadow-sm">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p
                      className={`text-sm leading-tight ${!notification.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {notification.message}
                    </p>
                    <p className="text-[10px] font-medium text-muted-foreground pt-1">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
