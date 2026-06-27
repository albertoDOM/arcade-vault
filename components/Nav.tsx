"use client";

import Link from "next/link";
import type { SessionUser } from "@/lib/data";

interface NavProps {
  user: SessionUser | null;
  onSignOut: () => void;
  pathname: string;
}

export default function Nav({ user, onSignOut, pathname }: NavProps) {
  return (
    <nav className="av-nav">
      <Link href="/" className="logo">
        <div className="logo-mark" />
        <div className="logo-text neon-cyan">
          ARCADE <span className="neon-magenta">VAULT</span>
        </div>
      </Link>
      <div className="links">
        <Link href="/" className={pathname === "/" ? "active" : ""}>Biblioteca</Link>
        <Link href="/salon" className={pathname === "/salon" ? "active" : ""}>Salón de la Fama</Link>
      </div>
      <div className="spacer" />
      <div className="coin-counter">
        <span className="coin" />
        <span>CRÉDITOS · 03</span>
      </div>
      {user ? (
        <button className="btn ghost auth-btn" onClick={onSignOut}>{user.name} ▾</button>
      ) : (
        <Link href="/auth" className="btn auth-btn">Iniciar Sesión</Link>
      )}
    </nav>
  );
}
