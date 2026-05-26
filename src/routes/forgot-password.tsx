import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — Blue Horizon" },
      {
        name: "description",
        content: "Reset your Blue Horizon password via OTP.",
      },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resent, setResent] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--gradient-hero)" }}
    >
      <header className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/">
          <Logo variant="light" />
        </Link>
        <ThemeToggle />
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md p-8 shadow-[var(--shadow-elegant)]">
          <h1 className="text-2xl font-bold text-center">FORGOT PASSWORD</h1>

          {step === "phone" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("otp");
              }}
              className="mt-6 space-y-4"
            >
              <div className="flex items-center gap-3 rounded-lg border bg-background px-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="border-0 px-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <Button type="submit" className="h-11 w-full font-semibold">
                SEND OTP
              </Button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/login" });
              }}
              className="mt-6 space-y-4"
            >
              <div className="flex items-center gap-3 rounded-lg border bg-background px-3">
                <KeyRound className="h-5 w-5 text-muted-foreground" />
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="border-0 px-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <p className="text-center text-xs font-semibold tracking-wider text-muted-foreground">
                {resent ? "OTP SENT ALREADY!" : "OTP SENT"}
              </p>
              <Button type="submit" className="h-11 w-full font-semibold">
                ENTER
              </Button>
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setResent(true)}
                >
                  RESEND OTP
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
