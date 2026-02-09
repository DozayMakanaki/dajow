# Copilot / AI Agent Instructions for dajow

Purpose
- Provide concise, actionable guidance so an AI coding agent can make safe, minimal, and high-confidence edits to this Next.js app.

Big picture
- Framework: Next.js (app directory) using React + TypeScript (`next` 16.x, `react` 19.x).
- Layout: top-level UI lives in `app/` (see [app/page.tsx](app/page.tsx) and [app/layout.tsx](app/layout.tsx#L1-L40)).
- Styling: TailwindCSS v4 + PostCSS; global styles in [app/globals.css](app/globals.css).
- Fonts: `next/font` is used in `app/layout.tsx` (keep font variables and metadata intact).
- Paths: TypeScript path alias `@/*` -> project root (see `tsconfig.json`).

Build / dev / lint
- Run dev server: `npm run dev` (runs `next dev`).
- Build for production: `npm run build` (runs `next build`).
- Start production server: `npm run start` (runs `next start`).
- Linting: `npm run lint` (runs `eslint` with default config). There are no test scripts present.

Conventions & patterns to follow
- Keep routes and page/ui code inside `app/` using the App Router patterns (server/edge components may exist later).
- Prefer TypeScript types and `readonly` props patterns as in `app/layout.tsx` (maintain strict typing/`strict: true` in `tsconfig.json`).
- Preserve HTML metadata in `app/layout.tsx` (the `metadata` export) when editing layout/SEO.
- Tailwind utility classes are used heavily; avoid replacing with custom CSS unless necessary and add to `globals.css` if global.
- Image usage: use `next/image` (see `app/page.tsx`) and keep `priority`/sizing when appropriate.

Integration & dependencies
- No server-side API routes are present in the repo root. This is a frontend-only Next.js app scaffold.
- Key deps: `next`, `react`, `react-dom`. Dev tools: `eslint`, `tailwindcss`, `postcss`.

When making changes
- Small UI changes: edit files under `app/` and run `npm run dev` to validate locally.
- Large changes: open an issue or request before refactoring app routing or replacing major dependencies.
- Avoid adding new build-time dependencies without user confirmation.

Examples (use these as patterns)
- Update copy: edit [app/page.tsx](app/page.tsx#L1-L120) and preserve surrounding layout and className structure.
- Add a global utility: add CSS to [app/globals.css](../app/globals.css) and reference via className.
- Add a new page/route: create a folder under `app/` with `page.tsx` (App Router convention).

What not to do
- Do not change `next.config.ts` or TypeScript compiler targets unless asked.
- Do not add server/database code—there are no backend integration points in this repo.

If uncertain
- Prefer minimal, well-typed edits and ask the user before larger structural changes.
- When you need to run commands, instruct the user to run them locally (e.g., `npm run dev`) and report results.

Contact for follow-up
- After applying a non-trivial change, open a PR and include a short note describing why the change was needed and how it was tested.

---
Generated from scanning: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, and `README.md`.
