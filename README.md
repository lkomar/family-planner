Family Planner is a themeable, multi-language family task/planning app built with
Next.js (App Router). A household's dashboard, kids' school planner, shared
grocery list, and trash/recycling guide, backed by Postgres — multi-tenant, so
each family gets its own space at its own subdomain, gated behind its own
shared password.

## Getting started

```bash
cp .env.example .env       # fill in AUTH_SECRET (see Authentication below)
npm install
docker compose up -d db    # local Postgres
npx prisma migrate dev     # applies prisma/schema.prisma
npx prisma db seed         # seeds one demo household (subdomain "demo")
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — with no `ROOT_DOMAIN`
configured, every local request resolves to the seeded "demo" household (see
Multi-tenancy below), so you'll be asked for its password (`letmein-dev`),
then redirected to a locale-prefixed URL such as `/en`.

## Features

- **Dashboard** (`/`) — today's trash pickup, a todo list, a sticky-notes
  preview, a grocery-watch preview, and an editable "dinner tonight" note.
- **Kids & Lessons** (`/planner`) — each child's weekly class timetable,
  after-school activities, homework, and the full sticky-notes board.
- **Grocery List** (`/groceries`) — a shared list with category filters
  (real, bookmarkable URLs via `searchParams`) and inline add.
- **Trash Guide** (`/trash`) — the household's weekly collection schedule
  with today highlighted, plus a searchable sorting-guide dictionary.
- **Family** (`/family`) — rename the household and add, edit, or remove
  children. A new child starts with an empty timetable/activities/homework
  (there's no timetable *editor* yet — that still goes through Prisma
  directly, e.g. `npx prisma studio`).
- **Signup** (`/signup`) — reachable only from the bare root domain (no
  subdomain): creates a new household with its own subdomain and password.

Almost everything is a Server Component reading Prisma directly, with
mutations as Server Actions bound straight to `<form action>` — including
per-row toggle/delete via `.bind()` — so there's close to no client JS. The
one exception is the trash guide's live search, which needs client state for
instant local filtering.

## Multi-tenancy

Every household is a tenant, and every request is routed to one by its
subdomain — there's no login/account picker, the *host* is the identity:

- `lib/tenant.ts` turns a request's hostname into a subdomain slug (or
  `null` for the bare root domain), purely from the `ROOT_DOMAIN` environment
  variable — nothing about a specific domain is hardcoded anywhere.
- `lib/household.ts`'s `getCurrentHousehold()` resolves the current tenant by
  that subdomain and 404s if it doesn't match a household. Every model in
  `prisma/schema.prisma` is already scoped by `householdId`, so a family's
  data can never cross into another family's space.
- `proxy.ts` resolves the subdomain straight from the request (before
  `next/headers` is available) and gates the whole tenant behind its
  session cookie — see Authentication.
- **Local dev** has no real subdomain to route by: with `ROOT_DOMAIN` unset,
  every request resolves to `DEV_SUBDOMAIN` (default `"demo"`, matching the
  seed script) regardless of host. To test real subdomain routing locally
  instead, set `ROOT_DOMAIN=lvh.me` and visit `http://acme.lvh.me:3000` —
  `*.lvh.me` is a public DNS record that always resolves to `127.0.0.1`, no
  `/etc/hosts` editing needed.
- **New households** are created via `/signup` (reachable only on the bare
  root domain) — picks a subdomain + password, nothing else needed.

## Data

[Prisma](https://prisma.io) on Postgres (`prisma/schema.prisma`), using the
`@prisma/adapter-pg` driver adapter Prisma 7 requires explicitly. Locally,
`docker compose up -d db` runs Postgres in a container matching the
production driver exactly (no SQLite-vs-Postgres divergence to debug around).

```bash
npx prisma migrate dev --name <change>   # after editing schema.prisma
npx prisma studio                        # browse the data
```

## Authentication

There are no per-user accounts within a household — one shared password per
family, since the goal is keeping each family's space private, not per-user
identity inside it:

- `proxy.ts` checks every request (except `/unlock` and `/signup`) for a
  signed, tenant-bound session cookie. No cookie, or one that's
  expired/tampered/issued for a *different* subdomain → redirect to
  `/unlock`.
- `app/[locale]/unlock/page.tsx` is a plain password form; its Server Action
  (`features/auth/actions.ts`) looks up the current tenant's
  `Household.passwordHash` and, on success, sets an `httpOnly`,
  `Secure`-in-production cookie valid for 30 days (`lib/auth.ts`).
- The cookie is a signed, expiring token
  (`<subdomain>.<expiry>.<HMAC-SHA256>`, signed with `AUTH_SECRET`) — no
  session table, no database lookup on every request. Binding the subdomain
  into the signature means a cookie valid for one family can never unlock
  another's space, even though every tenant shares the same `AUTH_SECRET`.
- Passwords are hashed with Node's built-in `scrypt` (`lib/auth.ts`) — no
  extra dependency, no native addon.

Required environment variables (see `.env.example`):

| Variable       | Purpose                                                          |
| -------------- | ----------------------------------------------------------------- |
| `DATABASE_URL` | Postgres connection string (use a *pooled* one in production).    |
| `AUTH_SECRET`  | Signs session cookies. Generate with `openssl rand -hex 32`.      |
| `ROOT_DOMAIN`  | The domain households get a subdomain under. Unset until you have one. |
| `DEV_SUBDOMAIN`| Local-only: which household to resolve to when `ROOT_DOMAIN` is unset. |

Rotate a household's access by changing its password from `/family` (once
that's wired up — today, update `Household.passwordHash` directly) or
`AUTH_SECRET` (kicks out *every* tenant's sessions at once — a blunt,
global reset, not a per-family one).

## Deploying (Vercel)

This app needs a live Node.js server at request time — Server Actions,
`proxy.ts`, and Prisma all run per-request — so a static export
(`next export` / `output: "export"`) won't work. Vercel's normal Next.js
deployment (not a static export) handles this with no extra configuration:

1. Push to GitHub, import the repo in Vercel.
2. Add Postgres from Vercel's **Storage** tab (Neon under the hood) — this
   auto-injects a pooled `DATABASE_URL`, which is exactly what serverless
   functions need (a normal, unpooled Postgres connection string will run out
   of connections under concurrent invocations).
3. Set `AUTH_SECRET` (generate with `openssl rand -hex 32`).
4. Run `npx prisma migrate deploy` against that `DATABASE_URL` (e.g. from a
   one-off Vercel deployment step, or locally with the production URL) and
   seed a first household — there's no admin UI for that yet, so either run
   `prisma db seed` against production once, or insert the row by hand.
5. Once you've bought a domain: add it in Vercel's **Domains** tab as a
   wildcard (`*.yourdomain.com`), point its DNS at Vercel, and set
   `ROOT_DOMAIN=yourdomain.com`. Every household then resolves by subdomain
   automatically — nothing else in the app is domain-specific. Leave
   `ROOT_DOMAIN` unset to keep developing/demoing against `DEV_SUBDOMAIN`
   even after deploying, for as long as you don't have a domain yet.

## Internationalization

Routing is locale-prefixed (`app/[locale]/...`) via [next-intl](https://next-intl.dev).

- `proxy.ts` (Next 16's renamed `middleware.ts`) detects the visitor's preferred
  locale and redirects `/` to it — after the tenant/password checks above.
- `i18n/routing.ts` is the single source of truth for supported locales and the
  default. Currently ships `en` (default) and `pl`.
- `messages/<locale>.json` holds the translated strings, namespaced by page/feature.
- `i18n/navigation.ts` re-exports `Link`, `redirect`, `usePathname`, `useRouter`
  locale-aware — use these instead of the plain `next/link` / `next/navigation`
  equivalents anywhere a link or route change should keep the current locale.
- Server Components read strings with `getTranslations()`; Client Components
  use `useTranslations()` (see `components/language-switcher.tsx`).

Only fixed app vocabulary (categories, weekdays, waste types, nav labels) is
translated. Family-entered content (names, note text, homework, timetable
subjects) is stored and shown as-is, in whatever language the family uses —
the same way any multi-language app treats user data.

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
app/[locale]/(app)/  the app's pages, sharing a header/nav layout
app/[locale]/unlock/ the per-tenant password gate — outside the (app) shell
app/[locale]/signup/ creates a new household — reachable only with no tenant
components/          shared UI — components/ui/ is shadcn-generated
config/brand.ts      brand token types + active-brand resolution
config/brands/       one file per brand's color palette
features/            one folder per feature: actions.ts + components
i18n/                next-intl routing, request config, navigation helpers
lib/                 db client, auth, tenant resolution, theme generation, enum → icon/label maps
messages/            translated strings, one file per locale
prisma/              schema, migrations, seed script
proxy.ts             tenant resolution + password gate + locale-detection redirect
docker-compose.yml   local Postgres for development
```

## Stack

Next.js 16 (App Router, Turbopack) · React 19.2 · TypeScript · Tailwind CSS v4 ·
shadcn/ui · lucide-react · next-intl · next-themes · Prisma 7 (Postgres) · Zod ·
Biome (lint/format).
