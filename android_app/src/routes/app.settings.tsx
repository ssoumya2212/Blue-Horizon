import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ShieldCheck,
  Crosshair,
  UserCog,
  User,
  Lock,
  LogOut,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  sendOtp,
  verifyOtp,
  sendEmailOtp,
  verifyEmailOtp,
  signOut,
  updatePassword,
} from "@/services/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "@tanstack/react-router";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useSettings, type AppSettings } from "@/lib/settings";
import { AdminReleasesSection } from "@/components/AdminReleasesSection";

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
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [pwdOtp, setPwdOtp] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data || { email: user.email, role: "User" });
      }
    };
    fetchProfile();
  }, []);

  const handleToggle = (key: keyof AppSettings, val: boolean) => {
    updateSetting(key, val);
    toast.success("Preference saved");
  };

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  const handleSendPwdOtp = async () => {
    if (!profile?.email) return toast.error("No email found");
    setIsChangingPwd(true);
    const { error } = await sendEmailOtp(profile.email);
    setIsChangingPwd(false);
    if (error) return toast.error(error);
    toast.success("OTP sent to your email!");
    setOtpStep(true);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");
    if (newPassword.length < 6) return toast.error("Password too weak");

    setIsChangingPwd(true);
    // Verify OTP first
    const { error: otpError } = await verifyEmailOtp(profile?.email, pwdOtp);
    if (otpError) {
      setIsChangingPwd(false);
      return toast.error("Invalid OTP");
    }

    const { error } = await updatePassword(newPassword);
    setIsChangingPwd(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Password updated successfully!");
      setShowPasswordChange(false);
      setNewPassword("");
      setConfirmPassword("");
      setPwdOtp("");
      setOtpStep(false);
    }
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
        <Card className="overflow-hidden md:col-span-2">
          <div className="flex items-center gap-2 border-b bg-muted/40 px-5 py-3">
            <User className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Profile Details</h2>
          </div>
          <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="font-medium text-lg">
                {profile?.full_name || "Loading..."}
              </p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <p className="text-xs text-muted-foreground capitalize mt-1 border rounded px-2 py-0.5 inline-block bg-muted/30">
                {profile?.role}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
              >
                <Lock className="h-4 w-4 mr-2" /> Change Password
              </Button>
              <div className="flex items-center gap-2 border rounded-md px-3 py-1">
                <span className="text-sm">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
          {showPasswordChange && (
            <div className="border-t p-5 bg-muted/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="font-medium text-sm">Secure Password Change</h3>
              {!otpStep ? (
                <div className="space-y-3 max-w-sm">
                  <p className="text-xs text-muted-foreground">
                    We need to verify your email before changing the password.
                  </p>
                  <Button onClick={handleSendPwdOtp} disabled={isChangingPwd}>
                    {isChangingPwd && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Send Verification OTP
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-w-sm">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={pwdOtp}
                    onChange={(e) => setPwdOtp(e.target.value)}
                    maxLength={6}
                  />
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleChangePassword}
                      disabled={
                        isChangingPwd || pwdOtp.length !== 6 || !newPassword
                      }
                    >
                      {isChangingPwd && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Update Password
                    </Button>
                    <Button variant="ghost" onClick={() => setOtpStep(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

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

        {profile?.role === "admin" && (
          <div className="md:col-span-2">
            <AdminReleasesSection />
          </div>
        )}
      </div>
      <div className="pt-4 flex justify-end">
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  );
}
