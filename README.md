Family Planner is a Next.js (App Router) foundation for a themeable, multi-language
family task/planning product. This document describes the foundation that's in
place before any app-specific features are built.

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to a
locale-prefixed URL such as `/en`.

## Internationalization

Routing is locale-prefixed (`app/[locale]/...`) via [next-intl](https://next-intl.dev).

- `proxy.ts` (Next 16's renamed `middleware.ts`) detects the visitor's preferred
  locale and redirects `/` to it.
- `i18n/routing.ts` is the single source of truth for supported locales and the
  default. Currently ships `en` (default) and `pl`.
- `messages/<locale>.json` holds the translated strings, namespaced by page/feature.
- `i18n/navigation.ts` re-exports `Link`, `redirect`, `usePathname`, `useRouter`
  locale-aware — use these instead of the plain `next/link` / `next/navigation`
  equivalents anywhere a link or route change should keep the current locale.
- Server Components read strings with `getTranslations()` (see
  `app/[locale]/page.tsx`); Client Components use `useTranslations()` (see
  `components/language-switcher.tsx`).

**To add a language**: add its code to `i18n/routing.ts`'s `locales` array and
create a matching `messages/<locale>.json`. Nothing else changes.

## UI

[shadcn/ui](https://ui.shadcn.com) is initialized on Tailwind v4 with the Radix
base and [lucide-react](https://lucide.dev) icons (`components.json`). Generated
primitives live in `components/ui/` — per `CLAUDE.md`, don't hand-edit them in
place; wrap or compose around them instead so a future `shadcn add` doesn't
silently overwrite your changes. Add more primitives with:

```bash
npx shadcn@latest add <component>
```

## Per-brand theming

Every color in the app is a token defined in `config/brand.ts` /
`config/brands/*.ts`, not hardcoded CSS. `lib/theme/generate-theme-css.ts`
renders the active brand's tokens into the `:root` / `.dark` custom properties
that `app/globals.css`'s `@theme inline` block maps onto Tailwind's `bg-primary`,
`text-foreground`, etc. The root layout injects the result as an inline
`<style>`, computed server-side — no client JS, no build step.

**To deploy this codebase under a different brand**: copy
`config/brands/family-planner.ts`, give it a new `id` and palette, register it
in `config/brand.ts`, and set `NEXT_PUBLIC_BRAND=<id>` at build time. No
component or Tailwind changes needed.

Dark mode follows the visitor's OS color scheme automatically via
[next-themes](https://github.com/pacocoursey/next-themes) (`components/theme-provider.tsx`),
using the same brand-driven tokens (`config/brand.ts`'s `theme.dark`).

## Project structure

```
app/[locale]/       route-specific UI (layout, pages)
components/         shared UI — components/ui/ is shadcn-generated
config/brand.ts     brand token types + active-brand resolution
config/brands/      one file per brand's color palette
i18n/                next-intl routing, request config, navigation helpers
lib/theme/           brand tokens → CSS custom properties
messages/            translated strings, one file per locale
proxy.ts             locale-detection redirect (Next 16's `middleware.ts`)
```

## Stack

Next.js 16 (App Router, Turbopack) · React 19.2 · TypeScript · Tailwind CSS v4 ·
shadcn/ui · lucide-react · next-intl · next-themes · Biome (lint/format).
