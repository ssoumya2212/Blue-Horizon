import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useSearchQuery } from "@/lib/search";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Blue Horizon" }] }),
  component: Notifications,
});

const items = [
  {
    icon: CheckCircle2,
    tone: "success",
    title: "Aarav boarded Bus 007",
    time: "2 min ago",
  },
  {
    icon: Clock,
    tone: "primary",
    title: "Bus 007 will arrive at 4:15 PM",
    time: "12 min ago",
  },
  {
    icon: AlertTriangle,
    tone: "warning",
    title: "Minor delay near Stop 6 due to traffic",
    time: "30 min ago",
  },
  {
    icon: Bell,
    tone: "muted",
    title: "Weekly attendance report is ready",
    time: "Yesterday",
  },
];

function Notifications() {
  const q = useSearchQuery().toLowerCase();
  const filtered = q
    ? items.filter((n) => n.title.toLowerCase().includes(q))
    : items;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Real-time updates from your child's commute.
        </p>
      </div>
      <Card className="divide-y p-0">
        {filtered.map((n, i) => (
          <div key={i} className="flex items-start gap-3 p-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                n.tone === "success"
                  ? "bg-success/15 text-success"
                  : n.tone === "primary"
                    ? "bg-primary/10 text-primary"
                    : n.tone === "warning"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                      : "bg-muted text-muted-foreground"
              }`}
            >
              <n.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.time}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
