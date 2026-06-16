import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { ipcMain } from "electron";

const TARGET_URL =
  "https://blue-horizon.trackmybus.workers.dev/?platform=electron";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: "Blue Horizon",
    autoHideMenuBar: true,
    show: false, // Don't show until ready
  });

  // Create loading window
  const loadingWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  loadingWindow.loadFile(path.join(__dirname, "loading.html"));
  loadingWindow.center();

  // Handle successful load
  mainWindow.webContents.on("did-finish-load", () => {
    // Only switch windows if the main window isn't showing an offline error
    if (!mainWindow.webContents.getURL().includes("offline.html")) {
      if (loadingWindow && !loadingWindow.isDestroyed()) {
        loadingWindow.close();
      }
      mainWindow.show();
    }
  });

  // Handle offline / failure to load
  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      console.error("Failed to load:", errorCode, errorDescription);
      mainWindow.loadFile(path.join(__dirname, "offline.html"));
      if (loadingWindow && !loadingWindow.isDestroyed()) {
        loadingWindow.close();
      }
      mainWindow.show();
    },
  );

  // Load the web app
  mainWindow.loadURL(TARGET_URL);

  // Allow retry from offline screen
  ipcMain.on("retry-connection", () => {
    mainWindow.loadURL(TARGET_URL);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
