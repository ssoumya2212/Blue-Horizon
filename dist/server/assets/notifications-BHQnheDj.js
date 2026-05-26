import { b as supabase } from "./router-BsyVVfp8.js";
async function fetchNotifications(role) {
  const { data, error } = await supabase.from("notifications").select("*").in("user_role", [role, "all"]).order("created_at", { ascending: false }).limit(20);
  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
  return data;
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
      if (newRecord && (newRecord.user_role === role || newRecord.user_role === "all")) {
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
