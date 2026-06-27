"use client";

import { useState } from "react";
import Link from "next/link";
import type { SessionUser } from "@/lib/data";

interface NavProps {
  user: SessionUser | null;
  onSignOut: () => void;
  pathname: string;
}

export default function Nav({ user, onSignOut, pathname }: NavProps) {
  const [open, setOpen] = useState(false);

  /* Biblioteca activa también en rutas de juego */
  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/" || pathname.startsWith("/juego/");
    return pathname === href || pathname.startsWith(href + "/");
  };

  const close = () => setOpen(false);

  return (
    <>
      <nav className="av-nav">
        <Link href="/" className="logo" onClick={close}>
          <div className="logo-mark" />
          <div className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </Link>

        <div className="links">
          <Link href="/" className={isActive("/") ? "active" : ""}>
            Biblioteca
          </Link>
          <Link href="/salon" className={isActive("/salon") ? "active" : ""}>
            Salón de la Fama
          </Link>
        </div>

        <div className="spacer" />

        <div className="coin-counter">
          <span className="coin" />
          <span>CRÉDITOS · 03</span>
        </div>

        {user ? (
          <button className="btn ghost auth-btn" onClick={onSignOut}>
            {user.name} ▾
          </button>
        ) : (
          <Link href="/auth" className="btn auth-btn">
            Iniciar Sesión
          </Link>
        )}

        <button
          className="btn ghost hamburger"
          onClick={() => setOpen(true)}
          aria-label="Menú"
        >
          ≡
        </button>
      </nav>

      {/* Fondo semitransparente del panel móvil */}
      <div
        className={`av-mobile-backdrop${open ? " open" : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel móvil deslizante */}
      <aside className={`av-mobile-panel${open ? " open" : ""}`}>
        <div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>
          MENÚ
        </div>
        <Link
          href="/"
          className={isActive("/") ? "active" : ""}
          onClick={close}
        >
          Biblioteca
        </Link>
        <Link
          href="/salon"
          className={isActive("/salon") ? "active" : ""}
          onClick={close}
        >
          Salón de la Fama
        </Link>
        <Link
          href="/auth"
          className={isActive("/auth") ? "active" : ""}
          onClick={close}
        >
          {user ? "Cuenta" : "Iniciar Sesión"}
        </Link>
        <div style={{ flex: 1 }} />
        <div className="pixel" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.16em" }}>
          CRÉDITOS · 03
        </div>
      </aside>
    </>
  );
}
