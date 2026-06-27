# SPEC 01 — MVP visual de Arcade Vault

**Estado:** Aprobado
**Depende de:** — 
**Fecha:** 2026-06-27
**Objetivo:** Implementar las cinco pantallas visuales de Arcade Vault (Biblioteca, Detalle, Reproductor, Auth, Salón de la Fama) como páginas Next.js con App Router, datos mock en TypeScript y estilos con Tailwind 4.

---

## Alcance

**Dentro:**

- Componente `Nav` con navegación desktop y panel móvil, contador de créditos y botón de sesión.
- Página `/` → `Library`: hero, buscador, filtros por categoría, grid de tarjetas con efecto tilt.
- Página `/juego/[id]` → `GameDetail`: portada, tags, estadísticas, leaderboard mock, botones de acción.
- Página `/juego/[id]/jugar` → `GamePlayer`: HUD (puntuación, vidas, nivel, jugador), pantalla CRT animada, simulación de puntuación con `setInterval`, modal de fin de juego con guardado en `localStorage`.
- Página `/auth` → `Auth`: tabs login/registro, formulario mock, acceso como invitado, botones sociales decorativos.
- Página `/salon` → `HallOfFame`: podio top-3, tabla completa, fila destacada para el usuario autenticado.
- Archivo `lib/data.ts` con `GAMES`, `CATS` y `seededScores` exportados como módulo TypeScript.
- Variables CSS y reset mínimo en `app/globals.css`; estilos de componente con utilidades Tailwind 4.
- Estado de sesión en `localStorage` (`av_user`) gestionado en el layout raíz.
- Estado de puntuaciones en `localStorage` (`av_scores`) guardado desde el Reproductor.

**Fuera de alcance (para specs futuros):**

- Autenticación real con backend (cualquier login acepta cualquier credencial).
- Integración con proveedores OAuth (Google, GitHub — los botones son decorativos).
- Lógica de juego real (la simulación de puntuación con `setInterval` del template es suficiente).
- API o base de datos de puntuaciones (los leaderboards usan `seededScores` mock).
- Modo multijugador.
- Versión móvil nativa / PWA.
- Internacionalización.

---

## Modelo de datos

```ts
// lib/data.ts

export interface Game {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: string;
  cover: string;
  color: "cyan" | "magenta" | "green" | "yellow";
  best: number;
  plays: string;
}

export interface ScoreRow {
  rank: number;
  name: string;
  score: number;
  date: string;
}

export interface SessionUser {
  name: string;
}

export interface SavedScore {
  game: string;
  score: number;
  name: string;
  at: number;
}
```

Convenciones:

- `GAMES: Game[]` — los 8 juegos del catálogo, datos estáticos.
- `CATS: string[]` — `["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"]`.
- `seededScores(seed, count): ScoreRow[]` — generador determinista de leaderboards mock.
- `SessionUser` — guardado en `localStorage` bajo la clave `av_user`.
- `SavedScore` — guardado en `localStorage` bajo la clave `av_scores` como array JSON.

---

## Plan de implementación

1. Crear `lib/data.ts` con `GAMES`, `CATS` y `seededScores` tipados y exportados.
   Verificación: `import { GAMES } from "@/lib/data"` compila sin errores.

2. Portar variables CSS y reset mínimo a `app/globals.css` (colores neon, fuentes, `--line`, `--ink-*`). Importar en `app/layout.tsx`.
   Verificación: la app arranca sin errores de CSS en consola.

3. Crear `app/layout.tsx` con el `<Nav>` y el `<footer>` globales. Implementar
   `SessionUser` en estado del layout con lectura/escritura en `localStorage`.
   Verificación: la barra de navegación se renderiza en todas las rutas.

4. Implementar `components/Nav.tsx` (desktop + panel móvil, botón de sesión,
   contador de créditos). Recibe `user`, `onSignOut` y `pathname` como props.
   Verificación: los enlaces activos se resaltan correctamente en cada ruta.

5. Crear `app/page.tsx` → pantalla `Library`. Buscador, filtros por categoría y
   grid de `GameCard` con efecto tilt. Navega a `/juego/[id]` al hacer clic.
   Verificación: el filtro reduce las tarjetas visibles; "sin resultados" aparece
   cuando no hay coincidencias.

6. Crear `app/juego/[id]/page.tsx` → pantalla `GameDetail`. Portada, tags,
   estadísticas, leaderboard con `seededScores` y botón "JUGAR AHORA".
   Verificación: cada juego muestra su título y leaderboard correcto.

7. Crear `app/juego/[id]/jugar/page.tsx` → pantalla `GamePlayer`. HUD, pantalla
   CRT animada, simulación con `setInterval`, modal de fin de juego con input de
   nombre y guardado en `localStorage` bajo `av_scores`.
   Verificación: la puntuación sube automáticamente; el modal aparece al pulsar FIN;
   la puntuación se persiste en `localStorage`.

8. Crear `app/auth/page.tsx` → pantalla `Auth`. Tabs login/registro, formulario
   mock, acceso como invitado, botones sociales decorativos. Al confirmar, guarda
   `SessionUser` en `localStorage` bajo `av_user` y redirige a `/`.
   Verificación: tras el login el nombre del usuario aparece en el `Nav`.

9. Crear `app/salon/page.tsx` → pantalla `HallOfFame`. Tabs por juego, podio top-3,
   tabla completa y fila destacada del usuario autenticado.
   Verificación: cambiar de tab actualiza el podio y la tabla; la fila del usuario
   solo aparece cuando hay sesión activa.

---

## Criterios de aceptación

- [ ] La app arranca sin errores en consola (`npm run dev`).
- [ ] `lib/data.ts` compila en modo strict sin errores de TypeScript.
- [ ] El `Nav` muestra el enlace activo resaltado según la ruta actual.
- [ ] El botón "Iniciar Sesión" del `Nav` navega a `/auth`; tras el login muestra el nombre del usuario.
- [ ] Cerrar sesión desde el `Nav` borra `av_user` de `localStorage` y vuelve a mostrar "Iniciar Sesión".
- [ ] La Biblioteca muestra las 8 tarjetas de juego al cargar.
- [ ] El buscador de la Biblioteca filtra tarjetas en tiempo real por nombre.
- [ ] Los chips de categoría filtran las tarjetas correctamente; "TODOS" las muestra todas.
- [ ] Hacer clic en una tarjeta o en "JUGAR" navega a `/juego/[id]`.
- [ ] El Detalle muestra el título, descripción, estadísticas y leaderboard del juego correcto.
- [ ] El botón "JUGAR AHORA" del Detalle navega a `/juego/[id]/jugar`.
- [ ] En el Reproductor, la puntuación aumenta automáticamente sin interacción del usuario.
- [ ] El botón "PAUSA" detiene el contador; "REANUDAR" lo reanuda.
- [ ] El botón "FIN" muestra el modal de fin de juego con la puntuación final.
- [ ] El input del modal acepta solo mayúsculas y máximo 10 caracteres.
- [ ] "GUARDAR PUNTUACIÓN" persiste la entrada en `localStorage` bajo `av_scores` y muestra "PUNTUACIÓN GUARDADA_".
- [ ] "JUGAR DE NUEVO" reinicia puntuación, vidas y nivel sin recargar la página.
- [ ] El formulario de Auth acepta cualquier credencial y loguea al usuario.
- [ ] "JUGAR COMO INVITADO" navega a `/` sin guardar sesión.
- [ ] El Salón de la Fama muestra el podio top-3 del juego seleccionado en el tab activo.
- [ ] La fila del usuario autenticado aparece al final de la tabla del Salón de la Fama.
- [ ] La fila del usuario no aparece cuando no hay sesión activa.
- [ ] El footer aparece en todas las páginas.

---

## Decisiones

- **Sí:** Rutas reales de Next.js App Router (`/`, `/juego/[id]`, `/juego/[id]/jugar`, `/auth`, `/salon`). Razón: es la convención natural del stack; facilita SEO y navegación futura. El enrutamiento hash del template era un artefacto de la demo HTML de una sola página.
- **Sí:** `lib/data.ts` con exports nombrados y tipos explícitos. Razón: elimina las variables globales en `window` del template, que son incompatibles con el modelo de módulos de Next.js y TypeScript strict.
- **Sí:** Incluir la simulación de puntuación con `setInterval` del Reproductor. Razón: forma parte de la experiencia visual del MVP; sin ella la pantalla es inerte.
- **Sí:** Tailwind 4 para todos los estilos de componente, con solo variables CSS y reset en `globals.css`. Razón: evita un refactor posterior y es coherente con el stack declarado en el proyecto.
- **No:** CSS global con clases custom portadas directamente. Razón: aunque más rápido a corto plazo, requeriría reescritura completa para adoptar Tailwind después.
- **Sí:** Auth completamente mock (acepta cualquier credencial). Razón: el alcance es solo visual; la autenticación real va en un spec futuro.
- **No:** OAuth con Google / GitHub. Razón: los botones son decorativos en el MVP; la integración real requiere configuración de proveedor fuera del alcance visual.
- **No:** API o base de datos de puntuaciones. Razón: `seededScores` y `localStorage` son suficientes para validar la UI en el MVP.

---

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Tailwind 4 usa `@import "tailwindcss"` en lugar de las directivas `@tailwind` — rompe si se usa la sintaxis antigua. | Verificar que `globals.css` solo use `@import "tailwindcss"` antes de arrancar. |
| `useEffect` con `setInterval` en el Reproductor genera advertencias en React 19 Strict Mode por doble montaje. | Limpiar el intervalo en el `return` del efecto (ya está en el template). |
| `localStorage` no está disponible en SSR — `params` y `searchParams` son asíncronos en Next.js 16. | Acceder a `localStorage` solo en `useEffect`; usar `await props.params` en todas las páginas dinámicas. |

---

## Qué NO está en este spec

- Autenticación real con backend (cualquier credencial es válida).
- Integración OAuth con Google o GitHub (los botones son decorativos).
- Lógica de juego real (la simulación con `setInterval` es suficiente para el MVP).
- API o base de datos de puntuaciones (los leaderboards usan datos mock).
- Modo multijugador.
- PWA o versión móvil nativa.
- Internacionalización.

Cada uno de estos puntos, si se implementa, irá en su propio spec.
