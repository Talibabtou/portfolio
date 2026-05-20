# Portfolio Audit

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

4. Build out the new "What I can demo" section.
   - The section now exists as a full-viewport product lab before the footer.
   - Next step: make one rail real first. Best first options:
     - GitHub Radar: fetch public GitHub API data, rank repositories, show
       loading/error/rate-limit states.
     - Market Chart: embed or recreate a TradingView-style chart with
       position/risk context.
     - World Map: plot public API locations or mocked network nodes with clear
       hover/focus states.
   - Do not build five weak demos. One polished demo is stronger than five
     placeholders.

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

2. Demo lab proof pass.
   - Turn one carousel rail into a real interactive module.
   - Recommended first choice: GitHub Radar, because it demonstrates public API
     integration, data modeling, loading states, sorting/filtering and product
     UI in one compact surface.

3. Recruiter scan pass.
   - Fix hero copy.
   - Consider a compact Current Focus / proof band if the page still needs a
     faster five-second read after visuals improve.
   - Make CV and contact options obvious without making the page feel busy.

4. SEO and sharing pass.
   - Add homepage Open Graph metadata and image.
   - Add project-specific metadata with plain text descriptions.
   - Add `robots.ts`, canonical URL and JSON-LD Person data.

5. Engineering proof pass.
   - Add GitHub Actions running `pnpm install --frozen-lockfile` and
     `pnpm run check`.
   - Keep `AGENTS.md` updated with project rules.

## Must Do Before Launch

### Security Check

- Add or verify production security headers at the hosting layer or in
  `next.config.ts`: `X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options` or CSP `frame-ancestors`, and a minimal
  `Permissions-Policy`.
- Consider a CSP after the page-transition/theme inline script strategy is
  stable. Avoid rushing this with `unsafe-inline` unless it is documented and
  intentionally temporary.
- Run dependency/security review before launch after the final dependency lock:
  `pnpm audit` or the hosting provider's security advisory check.
- Re-check any future public API demo rail for rate-limit handling, error
  states and untrusted data rendering.

### SEO Check

- Add `robots.ts` with the production host and sitemap reference.
- Expand `sitemap.ts` to include every static project page, not only the
  homepage.
- Add canonical URLs through metadata for the homepage and project pages.
- Add Open Graph and Twitter metadata, including a real sharing image.
- Add project-specific metadata using `summary` where available and handle
  missing projects explicitly in `generateMetadata`.
- Add JSON-LD Person/ProfilePage data once final name, role, links and CV URL
  are stable.
- Improve image alt text before launch, especially project thumbnails and
  screenshots.

### Responsive Check

- A full tablet and mobile visual pass is planned later, after the main desktop
  structure and content are stronger.
- Re-test navbar width, theme toggle position, demo carousel behavior, project
  image layout and footer spacing across mobile and tablet sizes.
- Replace all px values with rem values and don;t forget to add the sm, md, lg conditions

## Specific Fixes Spotted In Current Code

- Hero copy currently says "prediction markets" twice.
- Project list preview images use `alt="Project"`; use project titles instead.
- Project metadata now prefers `summary`; next step is handling missing projects
  explicitly in `generateMetadata`.

## The ideal recruiter impression

"This person can build polished frontend product interfaces, understands
technical constraints, communicates clearly, and has enough product judgment to
work on complex Web3 or fintech screens."
