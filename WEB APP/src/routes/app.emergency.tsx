import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, AlertOctagon, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { addNotification } from "@/lib/notifications";

export const Route = createFileRoute("/app/emergency")({
  head: () => ({ meta: [{ title: "Emergency — Blue Horizon" }] }),
  component: Emergency,
});

function Emergency() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Emergency contact</h1>
        <p className="text-sm text-muted-foreground">
          One tap reaches the school, the driver and admin.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <Phone className="mb-3 h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">School office</h3>
          <p className="text-sm text-muted-foreground">+1 (555) 010-2025</p>
          <Button
            className="mt-4 w-full"
            onClick={() => {
              window.location.href = "tel:+15550102025";
            }}
          >
            Call now
          </Button>
        </Card>
        <Card className="p-6">
          <ShieldAlert className="mb-3 h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Driver — Bus 007</h3>
          <p className="text-sm text-muted-foreground">
            Ravi S. • +1 (555) 233-1180
          </p>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => {
              window.location.href = "tel:+15552331180";
            }}
          >
            Call driver
          </Button>
        </Card>
        <Card className="p-6 border-destructive/40 bg-destructive/5">
          <AlertOctagon className="mb-3 h-6 w-6 text-destructive" />
          <h3 className="text-lg font-semibold">SOS</h3>
          <p className="text-sm text-muted-foreground">
            Notifies school, parents and admin instantly.
          </p>
          <Button
            variant="destructive"
            className="mt-4 w-full"
            onClick={async () => {
              toast.error("SOS Alert Triggered!");
              await addNotification(
                "🚨 SOS TRIGGERED",
                "Emergency SOS triggered by Parent (Aarav S).",
                "emergency",
                "all",
              );
            }}
          >
            Trigger SOS
          </Button>
        </Card>
      </div>
    </div>
  );
}
