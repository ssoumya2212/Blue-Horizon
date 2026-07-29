import { Capacitor } from "@capacitor/core";

/**
 * Detects if the app is running in a native Android environment via Capacitor.
 */
export const isAndroid = () => {
  return Capacitor.isNativePlatform();
};

/**
 * Detects if the app is running in a native Windows environment via Electron.
 */
export const isElectron = () => {
  if (typeof window === "undefined") return false;
  const hasApi = typeof (window as any).electronAPI !== "undefined";
  const hasUserAgent = navigator.userAgent.toLowerCase().includes("electron");
  const hasUrlParam = window.location.search.includes("platform=electron");
  return hasApi || hasUserAgent || hasUrlParam;
};

/**
 * Detects if the app is running as an installed Progressive Web App (PWA) or standalone mode.
 */
export const isPWA = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
};

/**
 * Detects if the app is running in any native environment (Android, Windows, or installed PWA).
 */
export const isNative = () => {
  return isAndroid() || isElectron() || isPWA();
};

/**
 * Detects if the app is running in a standard web browser.
 */
export const isWeb = () => {
  return !isNative();
};
