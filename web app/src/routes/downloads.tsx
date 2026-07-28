import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Download, Monitor, Smartphone, Globe, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { isNative } from "@/lib/platform";
import { DownloadWindowsButton } from "@/components/DownloadWindowsButton";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Download Blue Horizon" },
      {
        name: "description",
        content: "Get the Blue Horizon app for Android, Windows, or Web.",
      },
    ],
  }),
  component: DownloadsPage,
});

function DownloadsPage() {
  const { data: releases, isLoading } = useQuery({
    queryKey: ["app-releases-latest"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_releases")
        .select("*")
        .eq("is_latest", true);

      if (error) throw error;
      return data;
    },
  });

  if (isNative()) {
    return <Navigate to="/login" replace />;
  }

  const androidRelease = releases?.find((r) => r.platform === "android");
  const windowsRelease = releases?.find((r) => r.platform === "windows");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNav />

      <main className="flex-1 container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-primary">
            Download Center
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Get the Blue Horizon app for your device. Choose from our native
            Android app, Windows desktop application, or use the web app on any
            device.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Section A: Android */}
          <Card className="flex flex-col overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-colors">
            <div className="bg-primary/5 p-6 flex flex-col items-center justify-center border-b border-border text-center">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Smartphone className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold">Android App</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Native mobile experience
              </p>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4 mb-8">
                {isLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Version:</span>
                      <span className="font-medium text-right">
                        {androidRelease?.version || "1.0.0"}
                      </span>

                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium text-right">
                        {androidRelease?.file_size || "13 MB"}
                      </span>

                      <span className="text-muted-foreground">Released:</span>
                      <span className="font-medium text-right">
                        {androidRelease
                          ? new Date(
                              androidRelease.created_at,
                            ).toLocaleDateString()
                          : new Date().toLocaleDateString()}
                      </span>
                    </div>
                    {androidRelease?.release_notes && (
                      <div className="mt-4 text-sm bg-muted/50 p-3 rounded-lg border">
                        <p className="font-semibold mb-1 flex items-center gap-1">
                          <Info className="h-3 w-3" /> Release Notes
                        </p>
                        <p className="text-muted-foreground">
                          {androidRelease.release_notes}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <Button
                asChild
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <a
                  href={androidRelease?.file_url || "https://github.com/ssoumya2212/Blue-Horizon/releases/latest/download/app-debug.apk"}
                  target="_blank" rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-5 w-5" /> Download APK
                </a>
              </Button>
            </div>
          </Card>

          {/* Section B: Windows */}
          <Card className="flex flex-col overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-colors">
            <div className="bg-primary/5 p-6 flex flex-col items-center justify-center border-b border-border text-center">
              <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Monitor className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold">Windows App</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Standalone desktop software
              </p>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4 mb-8">
                {isLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Version:</span>
                      <span className="font-medium text-right">
                        {windowsRelease?.version || "1.0.0"}
                      </span>

                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium text-right">
                        {windowsRelease?.file_size || "65 MB"}
                      </span>

                      <span className="text-muted-foreground">Released:</span>
                      <span className="font-medium text-right">
                        {windowsRelease
                          ? new Date(
                              windowsRelease.created_at,
                            ).toLocaleDateString()
                          : new Date().toLocaleDateString()}
                      </span>
                    </div>
                    {windowsRelease?.release_notes && (
                      <div className="mt-4 text-sm bg-muted/50 p-3 rounded-lg border">
                        <p className="font-semibold mb-1 flex items-center gap-1">
                          <Info className="h-3 w-3" /> Release Notes
                        </p>
                        <p className="text-muted-foreground">
                          {windowsRelease.release_notes}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <DownloadWindowsButton className="w-full bg-blue-600 hover:bg-blue-700 text-white" />
            </div>
          </Card>

          {/* Section C: Web App */}
          <Card className="flex flex-col overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-colors">
            <div className="bg-primary/5 p-6 flex flex-col items-center justify-center border-b border-border text-center">
              <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Globe className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold">Web App</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Run anywhere in browser
              </p>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4 mb-8">
                <p className="text-sm text-muted-foreground">
                  Access Blue Horizon directly from your web browser without
                  downloading any files.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <p className="text-sm font-semibold mb-2">
                    Installation Guide:
                  </p>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                    <li>Open this site in Chrome or Edge.</li>
                    <li>
                      Look for the install icon in the address bar (near the
                      star).
                    </li>
                    <li>
                      Click Install to add it to your desktop or home screen.
                    </li>
                  </ol>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-2"
              >
                <a href="/login">Open Web App</a>
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
