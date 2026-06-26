# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Proyecto

Arcade Vault es una plataforma de juegos online donde los usuarios compiten por la mayor cantidad de puntos.

## Comandos

```bash
npm run dev      # Servidor de desarrollo (Turbopack por defecto)
npm run build    # Build de producción (Turbopack por defecto)
npm run start    # Servidor de producción
npm run lint     # ESLint v9
```

Para desactivar Turbopack en build: `next build --webpack`

## Stack

- **Next.js 16.2.9** — App Router, Turbopack por defecto
- **React 19.2** — incluye View Transitions, `useEffectEvent`, Activity
- **TypeScript 5** — strict mode, path alias `@/*` apunta a la raíz del proyecto
- **Tailwind CSS 4** — sintaxis `@import "tailwindcss"` (no `@tailwind base/components/utilities`)
- **ESLint 9** — flat config en `eslint.config.mjs`, reemplaza `.eslintrc`

## Arquitectura

App Router en `app/`. No existe directorio `pages/`. Las rutas se crean añadiendo `page.tsx` dentro de subcarpetas de `app/`.

El proyecto usa **Spec Driven Design**: la funcionalidad se especifica primero en `/spec` y se implementa en `/spec-impl`, siguiendo las prácticas de [Klerith/fernando-skills](https://github.com/Klerith/fernando-skills). Estas carpetas aún no existen — deben crearse al comenzar el desarrollo de features.

## Breaking changes críticos de Next.js 16

### APIs de Request son exclusivamente asíncronas

`cookies()`, `headers()`, `draftMode()`, `params` y `searchParams` **ya no tienen acceso síncrono**. Siempre usar `await`:

```tsx
// INCORRECTO — Next.js 15 o anterior
export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug
}

// CORRECTO — Next.js 16
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
}
```

Ejecutar `npx next typegen` para generar los helpers de tipo `PageProps`, `LayoutProps` y `RouteContext`.

### `revalidateTag` requiere segundo argumento

```ts
// INCORRECTO
revalidateTag('posts')

// CORRECTO
revalidateTag('posts', 'max')
```

Para expiración inmediata usar `updateTag` en Server Actions.

### `turbopack` ya no está bajo `experimental`

```ts
// next.config.ts — Next.js 16
const nextConfig: NextConfig = {
  turbopack: { /* opciones */ },
}
```

### `middleware.ts` renombrado a `proxy.ts`

El archivo de middleware de Next.js 15 (`middleware.ts`) se llama ahora `proxy.ts` en Next.js 16.

### React Compiler disponible (no habilitado por defecto)

```ts
// next.config.ts — para habilitar
const nextConfig: NextConfig = {
  reactCompiler: true,
}
```

Requiere instalar `babel-plugin-react-compiler` y aumenta los tiempos de compilación.

## Importaciones Sass desde node_modules

Turbopack no soporta el prefijo `~`. Usar la ruta sin tilde:

```scss
/* INCORRECTO */  @import '~bootstrap/dist/css/bootstrap.min.css';
/* CORRECTO */    @import 'bootstrap/dist/css/bootstrap.min.css';
```
