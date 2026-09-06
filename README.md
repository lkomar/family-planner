Family Planner is a themeable, multi-language family task/planning app built with
Next.js (App Router). A household's dashboard, kids' school planner, shared
grocery list, and trash/recycling guide, backed by a real database — gated
behind a single shared household password so it's safe to put on a public
subdomain.

## Getting started

```bash
cp .env.example .env   # fill in SITE_PASSWORD and AUTH_SECRET (see Authentication below)
npm install
npx prisma migrate dev # creates dev.db from prisma/schema.prisma
npx prisma db seed     # seeds one demo household
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be asked for the
household password, then redirected to a locale-prefixed URL such as `/en`.

## Features

- **Dashboard** (`/`) — today's trash pickup, a todo list, a sticky-notes
  preview, a grocery-watch preview, and an editable "dinner tonight" note.
- **Kids & Lessons** (`/planner`) — each child's weekly class timetable,
  after-school activities, homework, and the full sticky-notes board.
- **Grocery List** (`/groceries`) — a shared list with category filters
  (real, bookmarkable URLs via `searchParams`) and inline add.
- **Trash Guide** (`/trash`) — the household's weekly collection schedule
  with today highlighted, plus a searchable sorting-guide dictionary.

Almost everything is a Server Component reading Prisma directly, with
mutations as Server Actions bound straight to `<form action>` — including
per-row toggle/delete via `.bind()` — so there's close to no client JS. The
one exception is the trash guide's live search, which needs client state for
instant local filtering.

## Data

[Prisma](https://prisma.io) on SQLite (`prisma/schema.prisma`), using the
`better-sqlite3` driver adapter Prisma 7 requires even for SQLite. Every model
hangs off a `Household`, though there's no accounts/multi-household UI yet —
`lib/household.ts` resolves "the current household" from the single seeded
row, which is the seam to plug a real session lookup into later.

```bash
npx prisma migrate dev --name <change>   # after editing schema.prisma
npx prisma studio                        # browse the data
```

`dev.db` and `.env` are git-ignored — never commit either.

## Authentication

There's no per-user accounts — just one shared household password gating the
whole app, since the goal is keeping the public out of a personal deployment,
not per-user identity:

- `proxy.ts` checks every request (except `/unlock` itself) for a signed
  session cookie. No cookie, or an expired/tampered one → redirect to
  `/unlock`.
- `app/[locale]/unlock/page.tsx` is a plain password form; its Server Action
  (`features/auth/actions.ts`) checks the submission against `SITE_PASSWORD`
  and, on success, sets an `httpOnly`, `Secure` (in production), signed cookie
  valid for 30 days (`lib/auth.ts`).
- The cookie is a signed, expiring token (`<expiry>.<HMAC-SHA256>`, signed
  with `AUTH_SECRET`) — no session table, no database lookup on every request.

Required environment variables (see `.env.example`):

| Variable        | Purpose                                              |
| --------------- | ----------------------------------------------------- |
| `SITE_PASSWORD` | The household password entered on `/unlock`.           |
| `AUTH_SECRET`   | Signs the session cookie. Generate with `openssl rand -hex 32`. |

Rotate access by changing `SITE_PASSWORD` (kicks out anyone not already
signed in) or `AUTH_SECRET` (kicks out *everyone*, including already-unlocked
sessions).

**Deployment note**: this app needs an always-on Node.js server — Server
Actions, `proxy.ts`, and Prisma all run at request time. A static export
(`next export` / `output: "export"`) will not work. Deploy it as a normal
Next.js server (`next start`) behind your reverse proxy on the target
subdomain, or on a Node-runtime host; if the host's filesystem is ephemeral
(e.g. most serverless platforms), swap SQLite for a hosted database (Postgres,
Turso) first, since `dev.db` won't survive a redeploy there.

## Internationalization

Routing is locale-prefixed (`app/[locale]/...`) via [next-intl](https://next-intl.dev).

- `proxy.ts` (Next 16's renamed `middleware.ts`) detects the visitor's preferred
  locale and redirects `/` to it — after the password check above.
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
app/[locale]/(app)/  the 4 pages, sharing a header/nav layout
app/[locale]/unlock/ the password gate — outside the (app) shell
components/          shared UI — components/ui/ is shadcn-generated
config/brand.ts      brand token types + active-brand resolution
config/brands/       one file per brand's color palette
features/            one folder per feature: actions.ts + components
i18n/                next-intl routing, request config, navigation helpers
lib/                 db client, auth, theme generation, enum → icon/label maps
messages/            translated strings, one file per locale
prisma/              schema, migrations, seed script
proxy.ts             password gate + locale-detection redirect
```

## Stack

Next.js 16 (App Router, Turbopack) · React 19.2 · TypeScript · Tailwind CSS v4 ·
shadcn/ui · lucide-react · next-intl · next-themes · Prisma 7 (SQLite) · Zod ·
Biome (lint/format).
