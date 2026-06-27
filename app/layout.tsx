import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

/* Fuente pixel — solo peso 400 disponible en Press Start 2P */
const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
  display: "swap",
});

/* Fuente mono — todos los pesos para máxima flexibilidad */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arcade Vault",
  description: "Plataforma de juegos online donde los usuarios compiten por la mayor cantidad de puntos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${pressStart2P.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {/* Capas de fondo fijas: rejilla + viñeta */}
        <div className="av-bg" aria-hidden="true" />
        {/* Capa de ruido de película */}
        <div className="av-noise" aria-hidden="true" />
        {/* Marco principal de la aplicación */}
        <div id="root">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}
