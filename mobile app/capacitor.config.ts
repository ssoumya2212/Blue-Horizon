import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bluehorizon.bus",
  appName: "Blue Horizon",
  webDir: "../web app/dist/client",
  server: {
    url: "https://blue-horizon.trackmybus.workers.dev",
    cleartext: true,
  },
};

export default config;
