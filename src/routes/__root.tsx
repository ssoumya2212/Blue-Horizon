import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SplashScreen } from "@/components/SplashScreen";
import { useState, useEffect } from "react";
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error?.message ||
            "Something went wrong on our end. You can try refreshing or head back home."}
        </p>
        <pre className="mt-8 text-red-500 text-left text-xs bg-red-50 p-4 rounded overflow-auto max-w-full">
          {error
            ? JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
            : "No error object"}
        </pre>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Blue Horizon" },
        { name: "description", content: "School Bus Tracking Platform" },
        { name: "author", content: "Blue Horizon" },
        { property: "og:title", content: "Blue Horizon" },
        { property: "og:description", content: "School Bus Tracking Platform" },
        { property: "og:type", content: "website" },
        {
          property: "og:url",
          content: "https://blue-horizon.trackmybus.workers.dev",
        },
        {
          property: "og:image",
          content: "https://blue-horizon.trackmybus.workers.dev/icon-512.png",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@BlueHorizon" },
        {
          name: "twitter:image",
          content: "https://blue-horizon.trackmybus.workers.dev/icon-512.png",
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "manifest",
          href: "/manifest.json",
        },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { Button } from "@/components/ui/button";
import { MapPin, Bell, ShieldCheck } from "lucide-react";
import { useAutoUpdate } from "@/hooks/useAutoUpdate";

function RootComponent() {
  useAutoUpdate();
  const { queryClient } = Route.useRouteContext();
  const [showSplash, setShowSplash] = useState(true);

  const [permissionsGranted, setPermissionsGranted] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("permissions_granted") !== "true") {
      setPermissionsGranted(false);
    }
  }, []);

  const [locGranted, setLocGranted] = useState(false);
  const [notifGranted, setNotifGranted] = useState(false);

  useEffect(() => {
    if (locGranted && notifGranted) {
      localStorage.setItem("permissions_granted", "true");
      setPermissionsGranted(true);
    }
  }, [locGranted, notifGranted]);

  const requestLocation = async () => {
    try {
      const { Geolocation } = await import("@capacitor/geolocation");
      await Geolocation.requestPermissions();
    } catch (err) {
      console.warn("Location permission fallback:", err);
    } finally {
      setLocGranted(true);
    }
  };

  const requestNotif = async () => {
    try {
      const { Capacitor } = await import("@capacitor/core");
      if (Capacitor.isNativePlatform()) {
        const { LocalNotifications } =
          await import("@capacitor/local-notifications");
        await LocalNotifications.requestPermissions();
      } else if (
        "Notification" in window &&
        Notification.permission === "default"
      ) {
        await Notification.requestPermission();
      }
    } catch (err) {
      console.warn("Notification permission fallback:", err);
    } finally {
      setNotifGranted(true);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : null}
      <div
        className={`transition-opacity duration-700 ${showSplash ? "opacity-0" : "opacity-100"} min-h-screen`}
      >
        {!permissionsGranted ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
              <ShieldCheck className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Welcome to Blue Horizon</h1>
            <p className="text-muted-foreground max-w-md mb-8">
              To keep students safe, this app requires live location tracking
              and real-time push notifications.
            </p>
            <div className="space-y-4 mb-8 text-left max-w-sm w-full">
              <div className="flex items-center justify-between gap-3 bg-muted/50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary h-6 w-6" />
                  <div>
                    <p className="font-medium">Location Access</p>
                    <p className="text-xs text-muted-foreground">
                      Required for live bus tracking
                    </p>
                  </div>
                </div>
                <Button
                  variant={locGranted ? "default" : "secondary"}
                  size="sm"
                  onClick={requestLocation}
                  disabled={locGranted}
                  className={
                    locGranted
                      ? "bg-success hover:bg-success text-success-foreground"
                      : ""
                  }
                >
                  {locGranted ? "Allowed" : "Allow"}
                </Button>
              </div>
              <div className="flex items-center justify-between gap-3 bg-muted/50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="text-primary h-6 w-6" />
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Required for safe drop alerts
                    </p>
                  </div>
                </div>
                <Button
                  variant={notifGranted ? "default" : "secondary"}
                  size="sm"
                  onClick={requestNotif}
                  disabled={notifGranted}
                  className={
                    notifGranted
                      ? "bg-success hover:bg-success text-success-foreground"
                      : ""
                  }
                >
                  {notifGranted ? "Allowed" : "Allow"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </QueryClientProvider>
  );
}
