import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bluehorizon.app',
  appName: 'Blue Horizon',
  webDir: 'dist/client',
  server: {
    url: 'https://bluehorizon.blue-horizon.workers.dev',
    cleartext: true
  }
};

export default config;
