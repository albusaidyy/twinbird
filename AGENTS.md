<!-- BEGIN:nextjs-agent-rules -->

## General Workflow Rules

- **NEVER commit code unless explicitly asked to do so**
- **NEVER push to remote unless explicitly asked**
- **NEVER install packages or dependencies** — provide the command for the user to run manually
- **Create planning files in docs/plans/ only when explicitly asked or for highly complex changes**

## Code Quality Standards

### TypeScript & Linting
- **ALWAYS** ensure all new code is free of ESLint errors and TypeScript type errors
- **NEVER** leave unresolved linting or TypeScript issues
- Use TypeScript strict mode compliance; avoid `any` types unless absolutely necessary
- Use proper type annotations for all functions and variables
- Remove unused imports and variables before finishing any task
- Run `npm run build` mentally — all code must pass Vercel's build process

### React Rules
- Follow the React Rules of Hooks: call hooks only at component boundaries
- Custom helpers in `_components/` or `_lib/` must receive data/functions as props — do NOT call `useRouter`, `useState`, etc. inside shared helpers
- Always handle auth/permission loading states gracefully (spinner or placeholder while context hydrates)
- Enforce auth/permission gates on the server first; client-side hooks should only hide per-action UI, not repeat page-level guards

---

## Project Structure

- `app/` — routing only (layouts, pages, route handlers) + per-route colocation
- `_components/`, `_lib/` — private folders for route-specific internals
- `components/` — shared reusable UI
- `lib/` — shared utilities
- `lib/services/` — server-only business logic (Prisma, audit, etc.)
- `types/` — shared TypeScript types
- Use TypeScript for all new files
- Use route groups to organize without affecting URLs (e.g., `app/(main)/...`)

---

## React & Rendering

- Server Components by default; Client Components only when interactivity is required
- Protected server pages must gate access server-side before rendering any UI
- Co-locate per-route UI logic in `app/.../_components/` and `_lib/`

---
## UI Components

- Use shadcn/ui components for consistency
- All Radix Dialog components should include `onOpenAutoFocus={(e) => e.preventDefault()}` on `DialogContent` to prevent scroll jump on close
- Ensure responsive design and accessibility

---


## Tailwind & Styles

- Tailwind CSS v4; use standard utilities and custom properties in `:root`
- Global tokens in `app/globals.css`
- Dark mode via `prefers-color-scheme` or top-level class — be consistent

---

<!-- END:nextjs-agent-rules -->
