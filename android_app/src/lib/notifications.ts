import { supabase } from "./supabase";

export type NotificationType =
  | "bus_arrival"
  | "bus_delay"
  | "attendance"
  | "emergency"
  | "gps_update"
  | "announcement"
  | "route_update"
  | "delay";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  created_at: string;
  user_role: string;
  read: boolean;
}

function shouldShowNotification(type: NotificationType): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem("bh_user_settings");
    if (!stored) return true;
    const settings = JSON.parse(stored);

    if (type === "bus_arrival" && settings.arrivalNotifications === false)
      return false;
    if (
      (type === "bus_delay" || type === "delay" || type === "route_update") &&
      settings.delayAlerts === false
    )
      return false;
    if (type === "emergency" && settings.emergencyAlerts === false)
      return false;
    if (type === "attendance" && settings.departureNotifications === false)
      return false;
  } catch (e) {
    return true;
  }
  return true;
}

export async function fetchNotifications(
  role: string,
): Promise<AppNotification[]> {
  let query = supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (role !== "admin") {
    query = query.in("user_role", [role, "all"]);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return (data as AppNotification[]).filter((n) =>
    shouldShowNotification(n.type),
  );
}

export async function addNotification(
  title: string,
  message: string,
  type: NotificationType,
  user_role: string = "all",
) {
  const { error } = await supabase.from("notifications").insert([
    {
      title,
      message,
      type,
      user_role,
    },
  ]);

  if (error) {
    console.error("Error adding notification:", error);
  }
}

export async function markAsRead(id: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);

  if (error) {
    console.error("Error marking as read:", error);
  }
}

export function subscribeToNotifications(
  role: string,
  onNotification: (payload: unknown) => void,
) {
  const channelId = `notifications_${Math.random().toString(36).substring(7)}`;
  return supabase
    .channel(channelId)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications" },
      (payload) => {
        const newRecord = payload.new as AppNotification;
        if (
          newRecord &&
          (role === "admin" ||
            newRecord.user_role === role ||
            newRecord.user_role === "all") &&
          shouldShowNotification(newRecord.type)
        ) {
          onNotification(payload);
        }
      },
    )
    .subscribe();
}
