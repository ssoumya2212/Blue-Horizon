import { contextBridge, ipcRenderer } from "electron";

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  retryConnection: () => ipcRenderer.send("retry-connection"),
});
