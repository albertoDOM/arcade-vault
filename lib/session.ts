import type { SessionUser } from "@/lib/data";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((cb) => cb());
}

export function subscribeToSession(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/*
 * useSyncExternalStore exige que getSnapshot devuelva el mismo objeto por
 * referencia cuando el valor no ha cambiado. Sin caché, JSON.parse crearía
 * un objeto nuevo en cada llamada y React entraría en un bucle infinito.
 */
let _cachedRaw: string | null | undefined = undefined;
let _cachedUser: SessionUser | null = null;

export function getStoredUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem("av_user");
    if (raw === _cachedRaw) return _cachedUser;
    _cachedRaw = raw;
    _cachedUser = raw ? (JSON.parse(raw) as SessionUser) : null;
    return _cachedUser;
  } catch {
    return null;
  }
}

export function saveSessionUser(user: SessionUser) {
  const raw = JSON.stringify(user);
  localStorage.setItem("av_user", raw);
  _cachedRaw = raw;
  _cachedUser = user;
  notify();
}

export function clearSessionUser() {
  localStorage.removeItem("av_user");
  _cachedRaw = null;
  _cachedUser = null;
  notify();
}
