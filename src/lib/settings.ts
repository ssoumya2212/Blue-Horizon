import { useState, useEffect } from "react";
import { supabase } from "./supabase";

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
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("bh_user_settings");
        return stored
          ? { ...defaultSettings, ...JSON.parse(stored) }
          : defaultSettings;
      }
      return defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  });

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadDbSettings = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
      setUserId(session.user.id);

      const { data, error } = await supabase
        .from("user_settings")
        .select("settings")
        .eq("user_id", session.user.id)
        .single();

      if (data && data.settings) {
        const combined = { ...defaultSettings, ...data.settings };
        setSettings(combined);
        localStorage.setItem("bh_user_settings", JSON.stringify(combined));
      }
    };
    loadDbSettings();
  }, []);

  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem("bh_user_settings", JSON.stringify(updated));

      if (userId) {
        supabase
          .from("user_settings")
          .upsert({
            user_id: userId,
            settings: updated,
            updated_at: new Date().toISOString(),
          })
          .then();
      }

      return updated;
    });
  };

  return { settings, updateSetting };
}
