# AGENTS.md

## Project

This is Talibabtou's personal portfolio website.

It is a Next.js app using React, TypeScript, Tailwind CSS, Biome, ESLint, and
GSAP animations. The project favors a polished visual portfolio experience with
careful animation, responsive layout, and clean accessibility defaults.

## Basic Rules

- Respect the existing design and component style before adding new patterns.
- Keep changes scoped to the user's request.
- Do not revert unrelated local changes.
- Use `pnpm` for package scripts.
- Prefer `rg` for searching files and code.
- Use `apply_patch` for manual file edits.
- Keep TypeScript imports type-only when they are only used as types.
- Treat SVGs used only as decoration as `aria-hidden="true"`.
- Give every `<button>` an explicit `type`.
- Avoid array indexes as React keys when a stable value is available.

## Common Commands

- `pnpm run dev` starts the local Next.js dev server on port 3000.
- `pnpm run fix` runs Biome checks with write/unsafe fixes.
- `pnpm run check` runs fixes, ESLint, TypeScript, and a production build.
- `pnpm run build` creates a production build.

## Dev Server

If `pnpm run dev` is already running, reuse the existing server instead of
starting a second one. If a new server is needed and port 3000 is busy, use a
different port and mention the URL.

## Verification

After code changes, run:

```bash
pnpm run check
```
