// Mock auth — replace with Firebase / Lovable Cloud later
export type Role = "parent" | "driver" | "admin";

export type Session = { username: string; role: Role } | null;

const KEY = "bh_session";

export function getSession(): Session {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(username: string, role: Role) {
  localStorage.setItem(KEY, JSON.stringify({ username, role }));
}

export function signOut() {
  localStorage.removeItem(KEY);
}

export function homeFor(role: Role) {
  if (role === "parent") return "/app/parent";
  if (role === "driver") return "/app/driver";
  return "/app/admin";
}
