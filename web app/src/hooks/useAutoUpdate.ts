import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";

// Current version of the app (this would ideally be injected during build time)
const CURRENT_VERSION = "1.0.0";

export function useAutoUpdate() {
  useEffect(() => {
    const checkForUpdates = async () => {
      // Determine the platform
      let platform = "web";
      if (Capacitor.isNativePlatform()) {
        platform = "android"; // Simplification: assume android if native in this context
      } else if (window.navigator.userAgent.includes("Electron")) {
        platform = "windows";
      }

      // If it's just a web browser, we don't necessarily prompt for APK/EXE downloads
      if (platform === "web") return;

      try {
        const { data, error } = await supabase
          .from("app_releases")
          .select("*")
          .eq("platform", platform)
          .eq("is_latest", true)
          .single();

        if (error || !data) return;

        // Simple version comparison (assumes semver e.g., 1.0.0)
        const isNewer = compareVersions(data.version, CURRENT_VERSION) > 0;

        if (isNewer) {
          toast(`New ${platform} update available: v${data.version}`, {
            description: "Please download the latest release.",
            action: {
              label: "Download",
              onClick: () => {
                window.open("/downloads", "_blank");
              },
            },
            duration: 10000,
          });
        }
      } catch (e) {
        console.error("Failed to check for updates", e);
      }
    };

    checkForUpdates();
  }, []);
}

// Helper to compare semver strings
function compareVersions(v1: string, v2: string) {
  const p1 = v1.split(".").map(Number);
  const p2 = v2.split(".").map(Number);
  for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
    const num1 = p1[i] || 0;
    const num2 = p2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}
