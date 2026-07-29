import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: "/",
    ssr: {
      noExternal: true
    }
  },
  tanstackStart: {
    server: {
      entry: "server",
      preset: "cloudflare-workers",
    },
  },
});
