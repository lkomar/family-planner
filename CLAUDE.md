@AGENTS.md

# Working Instructions

Distilled from patterns that worked well across other Next.js projects. Keep this generic — it describes *how* to build a Next.js/React/TypeScript app well, not what this particular app does.

## Working Style

- Discover existing patterns in the codebase before introducing a new one. If a component, hook, or util already does something close to what's needed, extend or reuse it instead of writing a parallel version.
- For non-trivial changes, think through the approach first (which files, which layer, what breaks) before editing. For anything ambiguous or broad, ask a clarifying question rather than guessing.
- Fully implement what's asked — no `TODO`s, stubs, or placeholder logic standing in for real behavior.
- Favor readability over cleverness unless performance is explicitly the goal.
- Don't invent scope: no unrelated refactors, renames, or "while I'm here" changes bundled into a focused task. Preserve unrelated existing code and structure.
- Make edits file-by-file when a change spans several files, so each one is easy to review on its own.
- Don't pad responses with apologies, summaries of what was just done, or requests to confirm things already visible in the code — state results plainly.

## Project Structure (App Router)

- Use the `app/` directory router; colocate route-specific UI (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`) with the route.
- Shared, cross-route UI goes in a top-level `components/` (or `src/components/`); shared non-UI logic in `lib/`.
- Directory names use lowercase-with-dashes (`components/date-picker`, not `DatePicker`).
- When a feature grows beyond a couple of files, group it as `features/<feature-name>/` with at most `components/`, `hooks/`, `utils/`, `types.ts` inside — don't scatter its pieces across the generic folders.
- Keep type definitions close to where they're used; only promote a type to a shared `types.ts` once a second module actually needs it.

## Components

- Server Components are the default. Add `"use client"` only on the leaf component that actually needs interactivity, state, or browser APIs — not on the page/layout that contains it.
- Wrap client components that suspend (data fetching, lazy import) in `<Suspense fallback=...>`; give routes a `loading.tsx`/`error.tsx` instead of ad-hoc spinners scattered in components.
- Prefer composition (children/slots) over prop-driven branching for layout variants.
- One responsibility per component. If a component needs a comment explaining what it does, it's a sign to split it.
- Never reach for raw HTML elements when an existing project component already wraps them (buttons, inputs, links) — consistency matters more than saving an import.

## Data & State

- Fetch data in Server Components / Route Handlers / Server Actions whenever possible — don't ship a client-side fetch for data that could be resolved on the server.
- Use Server Actions for mutations from forms where the App Router pattern fits, with server-side validation (Zod is a good default) — never trust client-only validation for anything that matters.
- Keep state as close as possible to where it's used; don't lift to Context or a global store until two unrelated parts of the tree actually need it.
- Prefer resolving derived state in the event handler that causes it over a `useEffect` that reacts to a state change. Reserve `useEffect` for genuine side effects — subscriptions, syncing with something outside React, imperative DOM/3rd-party integration.
- If a client-side data layer is introduced (e.g. TanStack Query), organize each resource consistently: a `types.ts`, a query-key factory (`{resource}Keys.ts`, hierarchical: `all → lists()/list(opts) → detail(id)`), a plain fetch layer, and separate query/mutation hooks. Invalidate the relevant keys on every mutation's `onSuccess`/`onSettled`.

## TypeScript

- Interfaces for object shapes; `type` for unions, intersections, and mapped types.
- No `any`; reach for `unknown` plus a narrowing check instead.
- Name things for what they do, not what they react to: `saveFormAndClose`, `extractIdsFromResponse` — not `handleSubmit`/`handleClick`/`handleChange`.
- Presentational components define their own prop types from scratch, scoped to exactly what they render — don't import a wider domain type just because it happens to contain the right fields.
- Components that fetch or receive domain data may import the type from wherever that data is defined/fetched.
- Booleans: use `Boolean(x)`, not `!!x`.
- Enable/keep strict mode; don't relax `tsconfig` strictness to silence an error — fix the type instead.

## Styling (Tailwind)

- Utility classes first; drop to a custom CSS rule only for things Tailwind genuinely can't express.
- Mobile-first breakpoints; design the small viewport, then add `md:`/`lg:` overrides.
- If the project has a component library (e.g. shadcn/ui) installed, don't hand-edit the generated primitives in place — a re-generation will silently overwrite the change. Wrap or compose a new component around the primitive instead, and keep the wrapper visually close enough to the original name to stay recognizable (e.g. a customized `Button` → `AppButton`, not something unrelated).

## Naming & Clean Code

- Replace magic numbers/strings with named constants, except literal values inline in JSX that exist purely to render.
- Extract duplicated logic into a shared function the moment it appears a second time — don't wait for a third.
- Comments explain *why*, not *what* — the code itself should read clearly enough not to need a what-comment.
- Hide implementation details behind a clear function/component interface; move nested conditionals into a well-named helper rather than stacking ternaries or `if`s.
- Prefer early returns over nested `if`/`else` chains.

## Testing

- New logic gets tests alongside it: happy path, edge cases, and at least one failure/error case.
- Follow Arrange-Act-Assert, one behavior per test, descriptive test names that state the expected behavior.
- Mock external dependencies (network, time, randomness) rather than letting a unit test depend on them.
- When fixing a bug, add the regression test first so it fails against the old code, then fix.

## Git & Commits

- Never commit directly to `main`; branch first (`feat/<short-description>`, `fix/<short-description>`).
- Commit messages: `type(scope): short imperative summary` — `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`. Keep the subject to one sentence; body only if the "why" isn't obvious from the diff.
- Small, focused commits over one large one — each commit should leave the app in a working state.

## Collaboration Notes

- Verify claims against the actual code before stating them — don't speculate about behavior you haven't checked.
- Don't suggest whitespace-only diffs or unrelated formatting churn.
- When referencing a file, link the real path — not a placeholder.
