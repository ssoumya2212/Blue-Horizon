import { supabase } from "./supabase";

type PendingAction = {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
};

const SYNC_KEY = "bh_offline_sync";

export function getPendingActions(): PendingAction[] {
  try {
    const raw = localStorage.getItem(SYNC_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addPendingAction(type: string, payload: any) {
  const actions = getPendingActions();
  actions.push({
    id: crypto.randomUUID(),
    type,
    payload,
    timestamp: Date.now(),
  });
  localStorage.setItem(SYNC_KEY, JSON.stringify(actions));

  if (navigator.onLine) {
    syncOfflineActions();
  }
}

export async function syncOfflineActions() {
  const actions = getPendingActions();
  if (actions.length === 0) return;

  const remaining: PendingAction[] = [];

  for (const action of actions) {
    try {
      if (action.type === "UPDATE_LOCATION") {
        await supabase.from("bus_locations").upsert(action.payload);
      } else if (action.type === "MARK_DROP") {
        await supabase
          .from("students")
          .update({ status: "dropped" })
          .eq("id", action.payload.student_id);
        await supabase.from("drop_logs").insert(action.payload.drop_log);
      }
      // Add more cases as needed
    } catch (e) {
      console.error("Sync failed for action", action, e);
      remaining.push(action);
    }
  }

  localStorage.setItem(SYNC_KEY, JSON.stringify(remaining));
}

// Auto-sync when coming back online
if (typeof window !== "undefined") {
  window.addEventListener("online", syncOfflineActions);
}
