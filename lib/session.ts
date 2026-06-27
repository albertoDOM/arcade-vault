import type { SessionUser } from "@/lib/data";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((cb) => cb());
}

export function subscribeToSession(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getStoredUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem("av_user");
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function saveSessionUser(user: SessionUser) {
  localStorage.setItem("av_user", JSON.stringify(user));
  notify();
}

export function clearSessionUser() {
  localStorage.removeItem("av_user");
  notify();
}
