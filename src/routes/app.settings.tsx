import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, ShieldCheck, Crosshair, UserCog } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  sendOtp,
  verifyOtp,
  sendEmailOtp,
  verifyEmailOtp,
} from "@/services/auth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useSettings, type AppSettings } from "@/lib/settings";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — Blue Horizon" }] }),
  component: Settings,
});

function SettingsOTPSection({ type }: { type: "email" | "phone" }) {
  const [step, setStep] = useState<"input" | "verify">("input");
  const [target, setTarget] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!target) return;
    setLoading(true);
    try {
      if (type === "phone") {
        await sendOtp(target);
      } else {
        await sendEmailOtp(target);
      }
      toast.success(`${type === "phone" ? "SMS" : "Email"} OTP sent!`);
      setStep("verify");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to send OTP");
      if (
        error.message?.includes("provider") ||
        error.message?.includes("rate limit")
      ) {
        toast.success("Bypassing for UI Demo...");
        setStep("verify");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      if (type === "phone") {
        await verifyOtp(target, otp);
      } else {
        await verifyEmailOtp(target, otp);
      }
      toast.success(
        `${type === "phone" ? "Phone" : "Email"} verified successfully!`,
      );
      setStep("input");
      setTarget("");
      setOtp("");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Invalid OTP");
      if (error.message?.includes("provider")) {
        toast.success("Verification Bypassed (Demo)");
        setStep("input");
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <div className="mt-3 space-y-3 p-3 border rounded-lg bg-background shadow-sm">
        <p className="text-xs font-medium text-muted-foreground">
          Enter the 6-digit code sent to {target}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleVerify}
              disabled={loading || otp.length !== 6}
            >
              Verify
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("input")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <Input
        placeholder={type === "email" ? "Enter Email" : "Enter Phone"}
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        className="h-8 text-xs max-w-[200px]"
        disabled={loading}
      />
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs"
        onClick={handleSend}
        disabled={loading || !target}
      >
        Send OTP
      </Button>
    </div>
  );
}

function Settings() {
  const { settings, updateSetting } = useSettings();

  const handleToggle = (key: keyof AppSettings, val: boolean) => {
    updateSetting(key, val);
    toast.success("Preference saved");
  };

  const groups = [
    {
      icon: Bell,
      title: "Notification Preferences",
      items: [
        {
          id: "arrivalNotifications",
          title: "Arrival Notifications",
          desc: "Get notified when bus is approaching",
          on: settings.arrivalNotifications,
        },
        {
          id: "departureNotifications",
          title: "Departure Notifications",
          desc: "Get notified when child boards/leaves bus",
          on: settings.departureNotifications,
        },
        {
          id: "delayAlerts",
          title: "Delay Alerts",
          desc: "Receive alerts for route delays",
          on: settings.delayAlerts,
        },
        {
          id: "emergencyAlerts",
          title: "Emergency Alerts",
          desc: "Critical safety notifications",
          on: settings.emergencyAlerts,
        },
      ],
    },
    {
      icon: ShieldCheck,
      title: "Privacy & Data",
      items: [
        {
          id: "shareLocation",
          title: "Share Location Data",
          desc: "Allow location sharing for better service",
          on: settings.shareLocation,
        },
        {
          id: "dataRetention",
          title: "Data Retention Period",
          desc: "How long to keep your data",
          on: settings.dataRetention,
        },
        {
          id: "thirdPartyData",
          title: "Third-party Data Sharing",
          desc: "Share data with education partners",
          on: settings.thirdPartyData,
        },
      ],
    },
    {
      icon: Crosshair,
      title: "Tracking Preferences",
      items: [
        {
          id: "preciseLocation",
          title: "Precise Location Tracking",
          desc: "More accurate but uses more battery",
          on: settings.preciseLocation,
        },
        {
          id: "tripHistory",
          title: "Trip History Retention",
          desc: "How long to keep trip records",
          on: settings.tripHistory,
        },
        {
          id: "offlineMode",
          title: "Offline Mode",
          desc: "Cache data for offline viewing",
          on: settings.offlineMode,
        },
      ],
    },
    {
      icon: UserCog,
      title: "Account Management",
      items: [
        {
          id: "require2FA",
          title: "Two-factor Authentication (2FA)",
          desc: "Require code on sign-in",
          on: settings.require2FA,
        },
        {
          id: "emailOTP",
          title: "Email Verification (OTP)",
          desc: "Require OTP for sensitive changes",
          on: settings.emailOTP,
        },
        {
          id: "phoneOTP",
          title: "Phone Verification (SMS OTP)",
          desc: "Send OTP to mobile for alerts",
          on: settings.phoneOTP,
        },
        {
          id: "emailDigests",
          title: "Email digests",
          desc: "Weekly summary of your child's commute",
          on: settings.emailDigests,
        },
      ],
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Tune your notifications, privacy and tracking preferences.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {groups.map((g) => (
          <Card key={g.title} className="overflow-hidden">
            <div className="flex items-center gap-2 border-b bg-muted/40 px-5 py-3">
              <g.icon className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">{g.title}</h2>
            </div>
            <ul className="divide-y">
              {g.items.map((item) => (
                <li key={item.id} className="flex flex-col gap-3 px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Switch
                      checked={item.on}
                      onCheckedChange={(val) =>
                        handleToggle(item.id as keyof AppSettings, val)
                      }
                    />
                  </div>

                  {item.title === "Email Verification (OTP)" && (
                    <SettingsOTPSection type="email" />
                  )}
                  {item.title === "Phone Verification (SMS OTP)" && (
                    <SettingsOTPSection type="phone" />
                  )}

                  {item.title === "Two-factor Authentication (2FA)" && (
                    <div className="mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs w-fit"
                        onClick={() => {
                          toast.info("2FA Enrollment coming soon!");
                        }}
                      >
                        Configure Authenticator App
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
