const KEY = "bh_session";
function getSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function signIn(username, role) {
  localStorage.setItem(KEY, JSON.stringify({ username, role }));
}
function signOut() {
  localStorage.removeItem(KEY);
}
function homeFor(role) {
  if (role === "parent") return "/app/parent";
  if (role === "driver") return "/app/driver";
  return "/app/admin";
}
export {
  signOut as a,
  getSession as g,
  homeFor as h,
  signIn as s
};
