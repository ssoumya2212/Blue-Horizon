import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bluehorizon.bus',
  appName: 'Blue Horizon',
  webDir: 'dist/client',
  server: {
    // Replace this with your actual production URL after you deploy to Vercel/Cloudflare
    url: 'https://bluehorizon-production.vercel.app',
    cleartext: true
  }
};

export default config;
