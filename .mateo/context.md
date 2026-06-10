# .mateo/context.md — LeCoquette Luxury Spa (web)

Cliente: LeCoquette Luxury Spa — nail/brow/beauty en Gainesville, FL.
Tipo: single-page landing (Next.js App Router). Deploy: **Vercel**.

## Stack actual
- Next.js 16.2 (App Router, Turbopack) · React 19 · TypeScript 6
- Tailwind CSS v4 (CSS-first, **`@theme` en `src/app/globals.css`**)
- Animación: **solo GSAP 3 + @gsap/react + ScrollTrigger** (Framer Motion ELIMINADO)
- Lenis (smooth scroll desktop) · lucide-react (iconos; OJO: v1.7 NO trae brand icons)
- Fonts: Cormorant Garamond (display) + Manrope (body) vía next/font

## Design system / tokens (single source of truth)
Bloque `@theme` en globals.css define todos los colores como tokens → generan utilidades
(`bg-primary`, `text-foreground-strong`, `border-border`, `ease-standard`, etc.).
**Regla: cero literales `oklch()` en componentes.** Color sólido → utilidad Tailwind;
color en gradiente/shadow inline → `var(--color-*)`; alpha → `color-mix(in oklab, var(--color-*) N%, transparent)`.
Tokens clave: primary (terracotta), background (cream), foreground-strong, foreground-muted,
border, noir / noir-deep / noir-foreground / noir-accent, surface / surface-alt / surface-mute.

## Componentes
- Secciones: hero, services (mobile stacked + desktop pinned scroll), about (takeover), contact.
- Layout: site-header (tone-adaptive via `data-header-theme`), mobile-nav (drawer GSAP),
  site-footer, brand-loader.
- UI: `ButtonLink` (button.tsx), `Eyebrow` (flexible: tone primary/accent, lines start/end/both/none),
  `LeCoquetteWordmark` (PNG mask, tone ink/warm).
- **Brand loader → hero handoff (una sola escena)**: el loader pinta la composición EXACTA del
  hero (mismo wordmark warm, mismo tamaño/posición) sobre un velo crema opaco; al salir disuelve el
  velo revelando la foto del hero detrás del mismo wordmark. ~1.9s, GSAP, reduced-motion, sessionStorage.
  Coordina con el hero vía evento `loader:reveal`: en primera visita el wordmark del hero nace asentado
  (sin salto) y la tagline/scroll-hint (`.hero-reveal`) entran al recibir el evento. En revisita el hero
  hace su entrada normal. La identidad geométrica se logra replicando el layout del hero en el loader
  (incl. una tagline-twin invisible para igualar el centro vertical del wordmark).

## Trabajo hecho (sesión 2026-06-09, audit + impecable)
1. Footer: bug doble-arroba arreglado (AtSign → glifo Instagram inline SVG + handle).
2. Loader reescrito (antes: conflicto CSS-keyframe vs GSAP, ~2.4-3.2s tapando LCP).
3. Tokenización: añadido `@theme`; reemplazados **89 literales oklch** por tokens.
4. Borrados componentes muertos: PageTransitionShell, SectionHeading, Button.
5. Framer Motion eliminado (mobile-nav → GSAP); quitado de package.json.
6. `next.config`: `images.unoptimized` OFF → AVIF/WebP (Vercel optimiza). Verificado: imágenes
   ahora pasan por `/_next/image`.
7. Eyebrows inline (7×) unificados en el componente `Eyebrow`.

## Sesión 2 (2026-06-09)
8. Desktop services: Add-Ons igualado a los rituals (quitado `max-w-sm` → lista a ancho de panel, 585px).
9. Loader rediseñado como handoff "una sola escena" con el hero (ver arriba), ~1.1s → ~1.9s.
10. Footer: crédito discreto centrado "Sitio por TheMonkeys" → https://themonkeys.do (target _blank).

## Pendiente / acciones manuales
- **SEO crítico**: setear `NEXT_PUBLIC_SITE_URL` en Vercel (env). Sin él, el sitio se auto-marca
  `noindex` y usa `example.com` de base (ver `src/lib/site.ts` DEFAULT_SITE_URL).
- `getBookingLink(source)` ignora el `source` → todos los CTAs van a la misma Square URL sin UTM.
- Shadows neutras `rgba(...)` (no-marca) se dejaron literales a propósito (no son tokens de color).
- Tras pull, correr `npm install` para podar framer-motion del árbol.

## Verificación
`npm run build` verde (TS strict OK, static export 5 páginas). QA visual con Playwright en
1440 + 375: loader, hero, footer (single @), drawer GSAP abre/cierra/desmonta, sin scroll horizontal.
