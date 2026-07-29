import { supabase } from "./supabase";

export type Role = "parent" | "driver" | "admin";

export type Session = { username: string; role: Role; id: string } | null;

export async function getSession(): Promise<Session> {
  if (typeof window === "undefined") return null;
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", session.user.id)
      .single();

    return {
      id: session.user.id,
      username:
        profile?.full_name ||
        session.user?.user_metadata?.full_name ||
        session.user?.email ||
        "User",
      role: (profile?.role || "parent") as Role,
    };
  } catch (err) {
    console.error("Auth error:", err);
    return null;
  }
}

export async function signOut() {
  await supabase.auth.signOut({ scope: "global" });
}

export function homeFor(role: Role) {
  if (role === "parent") return "/app/parent";
  if (role === "driver") return "/app/driver";
  return "/app/admin";
}
