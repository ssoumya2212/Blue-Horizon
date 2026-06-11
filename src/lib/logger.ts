import { supabase } from "./supabase";

export async function logAdminAction(
  action: string,
  entity_type: string,
  entity_id?: string,
  details?: Record<string, any>
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase.from("audit_logs").insert({
      admin_id: user.id,
      action,
      entity_type,
      entity_id,
      details
    });
  } catch (err) {
    console.error("Failed to insert audit log", err);
  }
}
