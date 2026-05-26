import { e as supabase } from "./router-CEqblTjI.js";
function shouldShowNotification(type) {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem("bh_user_settings");
    if (!stored) return true;
    const settings = JSON.parse(stored);
    if (type === "bus_arrival" && settings.arrivalNotifications === false)
      return false;
    if ((type === "bus_delay" || type === "delay" || type === "route_update") && settings.delayAlerts === false)
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
async function fetchNotifications(role) {
  let query = supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(20);
  if (role !== "admin") {
    query = query.in("user_role", [role, "all"]);
  }
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
  return data.filter(
    (n) => shouldShowNotification(n.type)
  );
}
async function addNotification(title, message, type, user_role = "all") {
  const { error } = await supabase.from("notifications").insert([
    {
      title,
      message,
      type,
      user_role
    }
  ]);
  if (error) {
    console.error("Error adding notification:", error);
  }
}
async function markAsRead(id) {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
  if (error) {
    console.error("Error marking as read:", error);
  }
}
function subscribeToNotifications(role, onNotification) {
  const channelId = `notifications_${Math.random().toString(36).substring(7)}`;
  return supabase.channel(channelId).on(
    "postgres_changes",
    { event: "*", schema: "public", table: "notifications" },
    (payload) => {
      const newRecord = payload.new;
      if (newRecord && (role === "admin" || newRecord.user_role === role || newRecord.user_role === "all") && shouldShowNotification(newRecord.type)) {
        onNotification(payload);
      }
    }
  ).subscribe();
}
export {
  addNotification as a,
  fetchNotifications as f,
  markAsRead as m,
  subscribeToNotifications as s
};
