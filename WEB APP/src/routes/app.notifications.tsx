import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle2, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useSearchQuery } from "@/lib/search";
import { getSession } from "@/lib/auth";
import { useEffect, useState } from "react";
import {
  fetchNotifications,
  subscribeToNotifications,
  deleteNotification,
  clearAllNotifications,
  editNotification,
  type AppNotification,
} from "@/lib/notifications";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Blue Horizon" }] }),
  component: Notifications,
});

function Notifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("parent");
  const q = useSearchQuery().toLowerCase();

  // Edit State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<AppNotification | null>(null);
  const [editMessage, setEditMessage] = useState("");

  const loadNotifications = async () => {
    const session = await getSession();
    const role = session?.role || "parent";
    setUserRole(role);
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

  const handleClearHistory = async () => {
    if (confirm("Are you sure you want to clear ALL notifications for all users?")) {
      const ok = await clearAllNotifications();
      if (ok) {
        toast.success("All notifications cleared");
        loadNotifications();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this notification?")) {
      const ok = await deleteNotification(id);
      if (ok) {
        toast.success("Notification deleted");
        loadNotifications();
      }
    }
  };

  const handleEditClick = (n: AppNotification) => {
    setEditingNotification(n);
    setEditMessage(n.message);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingNotification) return;
    if (!editMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    const ok = await editNotification(editingNotification.id, editMessage);
    if (ok) {
      toast.success("Notification updated");
      setEditDialogOpen(false);
      loadNotifications();
    }
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
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-end">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Real-time updates from your child's commute.
          </p>
        </div>
        {userRole === "admin" && notifications.length > 0 && (
          <Button variant="outline" className="text-destructive border-destructive/30" onClick={handleClearHistory}>
            Clear History
          </Button>
        )}
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
              <div key={n.id} className="flex items-start gap-3 p-4 relative group">
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
                <div className="flex-1 pr-8">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-wrap">
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(n.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {userRole === "admin" && (
                  <div className="absolute right-4 top-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(n)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(n.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            );
          })
        )}
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Notification</DialogTitle>
            <DialogDescription>
              Update the message of this notification.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Message</Label>
              <Textarea 
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
