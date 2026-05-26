import { useState, useEffect } from "react";

export type AppSettings = {
  // Notification Preferences
  arrivalNotifications: boolean;
  departureNotifications: boolean;
  delayAlerts: boolean;
  emergencyAlerts: boolean;

  // Privacy & Data
  shareLocation: boolean;
  dataRetention: boolean;
  thirdPartyData: boolean;

  // Tracking Preferences
  preciseLocation: boolean;
  tripHistory: boolean;
  offlineMode: boolean;

  // Account Management
  require2FA: boolean;
  emailOTP: boolean;
  phoneOTP: boolean;
  emailDigests: boolean;
};

const defaultSettings: AppSettings = {
  arrivalNotifications: true,
  departureNotifications: true,
  delayAlerts: true,
  emergencyAlerts: true,

  shareLocation: true,
  dataRetention: false,
  thirdPartyData: false,

  preciseLocation: true,
  tripHistory: false,
  offlineMode: true,

  require2FA: false,
  emailOTP: true,
  phoneOTP: false,
  emailDigests: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem("bh_user_settings");
      return stored
        ? { ...defaultSettings, ...JSON.parse(stored) }
        : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem("bh_user_settings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
}
