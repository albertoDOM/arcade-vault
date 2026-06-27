"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import {
  subscribeToSession,
  getStoredUser,
  clearSessionUser,
} from "@/lib/session";

export { saveSessionUser, clearSessionUser } from "@/lib/session";

/* ── Layout ───────────────────────────────────────────────────────────── */

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  /* useSyncExternalStore: sin useState ni useEffect — sin cascading renders */
  const user = useSyncExternalStore(
    subscribeToSession,
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
