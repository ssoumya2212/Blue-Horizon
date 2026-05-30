import { contextBridge } from 'electron';

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // You can add IPC methods here if needed in the future
  platform: process.platform,
});
