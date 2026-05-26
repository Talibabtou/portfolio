# AGENTS.md

Personal portfolio for **Guillaume Dumas** (Talibabtou). Web3/fintech product-engineering tone — not a generic template.

**Stack:** Next.js 16, React 19, TS, Tailwind 4, Biome, ESLint, GSAP · **Live:** talibabtou.dev

Setup, scripts, CI, and project tree: **`README.md`**.

## Common Commands

- `pnpm run dev` starts the local Next.js dev server on port 3000.
- `pnpm run fix` runs Biome checks with write/unsafe fixes.
- `pnpm run check` runs fixes, ESLint, TypeScript, and a production build.
- `pnpm run build` creates a production build.

## Where to edit

- **Copy / projects / stack:** `src/lib/data.ts` (edit here first)
- **Homepage sections:** `src/app/_components/` → `src/app/page.tsx`
- **Demo Lab:** `src/app/_components/demos/` — export `DemoTrack`, register in `demo-tracks.ts`
- **Protocol revenue terminal:** `src/app/protocol-revenue-terminal/` + `src/lib/protocol-revenue-terminal.ts`
- **Project pages:** `src/app/projects/[slug]/`
- **Shared UI:** `src/components/` · **Motion:** `@/lib/gsap`, `use-section-gsap.ts`
- **Tokens:** `src/app/globals.css` (`--primary` retints globally)
- **Shared types/constants:** `src/types/index.ts`, `src/lib/constants.ts` (when reused in 3+ files)

## Dependencies

## Rules

- Scoped changes only; don't edit unrelated local work.
- Never touch `.vercel/`, `.env*`; don't commit secrets.
- Do not invent employers, metrics, or URLs. Remote images: hosts in `next.config.ts` only.
- Do not commit, push, or open PRs unless the user asks.
- `pnpm` for scripts; `rg` for search. Reuse a running dev server if present, or let the user manage it

**Demos:** `preload` heavy deps; respect `isActive` (pause timers/animations); smallest change in large demo files unless refactor requested; keep logic in `demos/`, not `DemoLab.tsx`.

**UI/code:** Match existing patterns. GSAP from `@/lib/gsap` only; clean up ScrollTriggers/listeners on unmount. `rem` over `px`; `import type` for type-only imports; explicit `button type`; stable React keys; decorative SVGs `aria-hidden`.

## Verify

```bash
pnpm run check
```
