# Portfolio Audit

Last updated: 2026-05-20

## Good Habits To Keep

- `pnpm run check` is now the single command for confidence: Biome fixes, ESLint,
  TypeScript and production build.
- Theme tokens live in `src/app/globals.css`, so accent and light/dark changes
  are clean.
- Dark mode is the default, light mode is prepared, and the navbar has a direct
  theme toggle ready for final icons.
- The topographic background now follows theme tokens instead of hardcoded
  white.
- Project and profile content is centralized in `src/lib/data.ts`.
- App Router static project pages use `generateStaticParams`.
- `next/font`, `next/image`, TypeScript, path aliases, Biome and ESLint are all
  good professional signals.
- The site has a memorable motion identity without becoming a standard SaaS
  landing page.

## Bad Habits And Risks

- The project visuals still look like placeholders. This is the largest
  recruiter-facing weakness.
- Project pages are descriptions, not full case studies yet. They need context,
  constraints, contribution, decisions and result.
- Several sections are client components because animation is embedded directly
  in the section.
- Some images still use generic alt text such as `alt="Project"`.
- SEO/social sharing.

## Highest Recruiter Impact

1. Replace all placeholder project visuals.
   - Jupiter: show prediction market UI, market states, wallet-aware flows or a
     precise recreated mock if private work cannot be shown.
   - Adrena: show dashboard, leaderboard, trading/product screens or component
     work.
   - Versus: show product concept, betting/prediction flow, architecture or
     roadmap screens.
   - ft_transcendence: show game flow, tournament UI, WebSocket/game state or
     architecture.

2. Turn project pages into case studies.
   - Use the same structure for every project: Context, Problem, Contribution,
     Technical Decisions, Result, Links.
   - Keep them skimmable. Recruiters scan first and read second.
   - Add 3 to 5 bullets per project that prove ownership and judgment.

3. Add an immediate proof band after the hero.
   - Example labels: Web3 Interfaces, Trading Dashboards, Wallet UX,
     API-Connected Products.
   - This helps a recruiter understand the profile in five seconds.

4. Add a "What I can demo" section.
   - A recruiter likes clickable evidence: live product, repository, case study,
     architecture note, UI flow, before/after, performance or accessibility
     improvement.
   - This section can be compact and very high signal.

5. Make the Hermes and 42 story sharper.
   - 42 means autonomy, fundamentals, algorithms, systems, peer review.
   - Hermes means precision, repeatability, finish quality, patience and craft.
   - Together they make a stronger human differentiator than generic "passion
     for frontend".

## Features Recruiters Like As Talent Demos

- Real project screenshots with captions explaining what the user is doing.
- Short case studies with tradeoffs, constraints and decisions.
- Before/after improvements, even small ones.
- A clear link to GitHub, LinkedIn and CV.
- Live links when possible, with fallback screenshots when work is private.
- A visible stack, but tied to outcomes rather than just logos.
- Accessibility care: keyboard, focus, reduced motion, useful alt text.
- Performance care: image optimization, no unnecessary blocking animation,
  strong Lighthouse story.
- Product thinking: why a screen exists, what was confusing, what changed.
- Engineering judgment: typed data model, reusable components, test/check
  command, CI, clean README.
- A small interactive demo if it is directly related to the target role:
  wallet-state mock, market-card interaction, order/position widget, dashboard
  filter, realtime status panel or WebSocket mini demo.

## Recommended Next Build Order

1. Project proof pass.
   - Replace placeholder images.
   - Add project-specific alt text.
   - Add captions or short labels under screenshots.

2. Case study pass.
   - Extend `IProject` with richer fields:
     `summary`, `context`, `problem`, `contributions`, `decisions`, `results`.
   - Render these fields consistently on project pages.

3. Recruiter scan pass.
   - Fix hero copy.
   - Add Current Focus / What I Can Demo.
   - Make CV and contact options obvious without making the page feel busy.

4. Accessibility and motion pass.
   - Audit remaining GSAP section animations under reduced motion.
   - Consider session-gating the preloader for non-reduced-motion users.
   - Keep custom cursor as progressive enhancement only.
   - Restore or reconsider hidden scrollbars before launch.

5. SEO and sharing pass.
   - Add homepage Open Graph metadata and image.
   - Add project-specific metadata with plain text descriptions.
   - Add `robots.ts`, canonical URL and JSON-LD Person data.

6. Engineering proof pass.
   - Add GitHub Actions running `pnpm install --frozen-lockfile` and
     `pnpm run check`.
   - Add one Playwright smoke test for homepage, project page and nav links.
   - Keep `AGENTS.md` updated with project rules.

## Specific Fixes Spotted In Current Code

- Hero copy currently says "prediction markets" twice.
- Project list preview images use `alt="Project"`; use project titles instead.
- Project descriptions are now typed arrays; next step is richer case-study
  fields instead of only prose paragraphs.
- Project metadata uses raw description strings and optional project fields;
  strip markup and handle missing projects explicitly.
- The light/dark toggle now persists the theme; visually test the first-load
  transition before launch.
- Navbar panel width is now responsive, but should be visually checked on mobile
  once the logo/theme control is final.

## The ideal recruiter impression

"This person can build polished frontend product interfaces, understands
technical constraints, communicates clearly, and has enough product judgment to
work on complex Web3 or fintech screens."
