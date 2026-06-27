"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import type { SessionUser } from "@/lib/data";

/* ── Micro-store de sesión ────────────────────────────────────────────── */

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((cb) => cb());
}

function subscribeToUser(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getStoredUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem("av_user");
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

/* Funciones exportadas para que Auth y otras páginas puedan escribir sesión */
export function saveSessionUser(user: SessionUser) {
  localStorage.setItem("av_user", JSON.stringify(user));
  notifyListeners();
}

export function clearSessionUser() {
  localStorage.removeItem("av_user");
  notifyListeners();
}

/* ── Layout ───────────────────────────────────────────────────────────── */

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  /* useSyncExternalStore: sin useState ni useEffect — sin cascading renders */
  const user = useSyncExternalStore(
    subscribeToUser,
    getStoredUser,
    () => null, // snapshot en SSR
  );

  return (
    <>
      <Nav user={user} onSignOut={clearSessionUser} pathname={pathname} />
      <main className="av-main">{children}</main>
      <footer
        style={{
          borderTop: "1px solid var(--line)",
          padding: "20px 32px",
          textAlign: "center",
          color: "var(--ink-faint)",
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "0.16em",
        }}
      >
        © 2026 ARCADE VAULT · HECHO CON PIXELES Y NEÓN · v2.6.0
      </footer>
    </>
  );
}
