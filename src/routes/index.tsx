import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import {
  MapPin,
  Bus,
  Users,
  Bell,
  Shield,
  Activity,
  ArrowRight,
  CheckCircle2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";

import { ThemeToggle } from "@/components/ThemeToggle";

import { isNative } from "@/lib/platform";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blue Horizon — Smart School Bus Tracking" },
      {
        name: "description",
        content:
          "Blue Horizon is a smart, safe and reliable school bus tracking platform for parents, drivers and admins.",
      },
      { property: "og:title", content: "Blue Horizon — School Bus Tracking" },
      {
        property: "og:description",
        content:
          "Real-time GPS tracking, attendance and notifications for safer school commutes.",
      },
    ],
  }),
  component: LandingPage,
});

const stats = [
  { label: "Active Buses", value: "15+", icon: Bus },
  { label: "Students Daily", value: "200+", icon: Users },
  { label: "Real-Time Tracking", value: "100%", icon: Activity },
];

const features = [
  {
    icon: MapPin,
    title: "Real-Time GPS Tracking",
    desc: "Follow every bus on a live map with stop-by-stop ETAs.",
  },
  {
    icon: Users,
    title: "Attendance Management",
    desc: "Drivers mark each student in seconds. Parents see it instantly.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Arrival, departure and delay alerts tuned to each parent.",
  },
  {
    icon: Shield,
    title: "Emergency Alerts",
    desc: "One-tap SOS reaches the school, parents and admins.",
  },
  {
    icon: Activity,
    title: "Route Management",
    desc: "Plan optimal routes and reassign buses on the fly.",
  },
  {
    icon: CheckCircle2,
    title: "Driver Approval",
    desc: "Admins verify and onboard drivers with full audit trails.",
  },
];

function LandingPage() {
  if (isNative()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,oklch(0.72_0.15_230)_0%,transparent_60%)]" />

        <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 md:py-24 lg:py-32">
          <div className="flex flex-col justify-center text-white">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live for the 2025–26 school year
            </span>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Smart.
              <br />
              <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
                Safe.
              </span>
              <br />
              Reliable.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/80">
              Parents need to ensure student safety and transparent
              communication. Blue Horizon delivers safe, secure and smart travel
              for every child.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                <Link to="/login">
                  Launch App <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {!isNative() && (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="bg-emerald-500 text-white hover:bg-emerald-600"
                  >
                    <a href="/Blue-Horizon-App.apk" download>
                      <Download className="mr-2 h-4 w-4" /> Android (.apk)
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="bg-sky-500 text-white hover:bg-sky-600"
                  >
                    <a
                      href="https://github.com/ssoumya2212/Blue-Horizon/releases/latest/download/Blue.Horizon.Setup.1.0.0.exe"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="mr-2 h-4 w-4" /> Windows (.exe)
                    </a>
                  </Button>
                </>
              )}
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur"
                >
                  <s.icon className="mb-2 h-5 w-5 text-sky-300" />
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-white/70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero illustration card */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-400/30 to-cyan-300/10 blur-2xl" />
              <Card className="relative space-y-4 rounded-3xl border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur dark:bg-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      BUS NO
                    </p>
                    <p className="text-2xl font-bold text-primary">007</p>
                  </div>
                  <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
                    On Route
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <p className="text-[10px] font-semibold uppercase">Stops</p>
                    <p className="text-xl font-bold">12</p>
                  </div>
                  <div className="rounded-xl bg-accent/40 p-3">
                    <p className="text-[10px] font-semibold uppercase">
                      Students
                    </p>
                    <p className="text-xl font-bold">16</p>
                  </div>
                  <div className="rounded-xl bg-success/15 p-3 text-success">
                    <p className="text-[10px] font-semibold uppercase">
                      Present
                    </p>
                    <p className="text-xl font-bold">14</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      stop: "Anna Nagar Roundana",
                      time: "3:25 PM",
                      tag: "Current",
                    },
                    {
                      stop: "Blue Horizon International School",
                      time: "3:30 PM",
                      tag: "Next",
                    },
                    { stop: "T. Nagar Bus Terminus", time: "3:35 PM", tag: "" },
                  ].map((s) => (
                    <div
                      key={s.stop}
                      className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{s.stop}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.time}
                        </p>
                      </div>
                      {s.tag && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                          {s.tag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            Everything your school transport needs
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built for parents, drivers and administrators — one platform, one
            source of truth.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group relative overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <Card
          className="relative overflow-hidden border-0 p-10 text-center text-white md:p-16"
          style={{ background: "var(--gradient-primary)" }}
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to ride safer?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Join hundreds of families and drivers already using Blue Horizon for
            daily peace of mind.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              <Link to="/contact">Talk to us</Link>
            </Button>
          </div>
        </Card>
      </section>

      <PublicFooter />
    </div>
  );
}
