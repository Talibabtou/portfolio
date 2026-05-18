# Portfolio Codebase Audit

Date: 2026-05-18

This portfolio is now a personalized fork for Talibabtou / Guillaume Dumas. The
first cleanup pass replaced the original owner's visible identity, removed the
old analytics, moved source code under `src/`, added path aliases, tightened
lint/type checks, and rebuilt the content around Web3, fintech, 42 Lyon,
Jupiter, Adrena, Versus, Magicake / Doge Capital, and Hermes.

The site is directionally correct, but it can still become much more impressive
for a recruiter. The next work should focus less on generic template polish and
more on proof: concrete outcomes, real screenshots, clear case studies, fast
loading, accessible navigation, and a visual system that feels like a sharp
product engineer's portfolio.

## Current Tech Stack

- Framework: Next.js 15 App Router under `src/app`.
- UI: React, TypeScript, Tailwind CSS.
- Animation: GSAP, `@gsap/react`, ScrollTrigger, Lenis smooth scrolling.
- Icons: `lucide-react`, custom SVG generated through SVGR.
- Fonts: Google Fonts through `next/font`: Anton and Roboto Flex.
- Content model: hard-coded TypeScript data in `src/lib/data.ts`.
- Images/assets: static files under root `public/`.
- Package manager: pnpm, with `pnpm-lock.yaml`.
- Code quality: Biome formatting, ESLint with zero warnings, TypeScript
  checking.

## Site Structure

- `src/app/page.tsx`: homepage composition: banner, about, skills, experience,
  projects.
- `src/app/layout.tsx`: global shell, metadata, navbar, footer, cursor,
  preloader, particles, scroll progress, sticky email.
- `src/app/projects/[slug]/page.tsx`: static project detail route generated from
  `PROJECTS`.
- `src/app/_components/*`: homepage sections.
- `src/components/*`: shared UI, navigation, animation helpers, cursor, footer.
- `src/lib/data.ts`: personal information, social links, stack, projects,
  experience.
- `src/app/globals.css` and `tailwind.config.ts`: color tokens, typography,
  layout sizing.

## Done Since The First Audit

- Replaced original owner data in `src/lib/data.ts`.
- Updated metadata and sitemap to Talibabtou positioning/domain.
- Removed Google Analytics and Hotjar from `src/app/layout.tsx`.
- Reworked the footer to use `Talibabtou/portfolio` GitHub stats with fallback.
- Replaced original projects and experience entries with CV-derived content.
- Added CV and LinkedIn/GitHub links.
- Added fork attribution to `README.md`.
- Moved source code under `src/` and configured `@/*` aliases to `src/*`.
- Moved `public/` back to the root so Next can serve images and CV assets.
- Removed explicit `any` usage and unused refs/imports.
- Enabled stricter ESLint rules and made `pnpm run check` run Biome, ESLint,
  and TypeScript.
- Removed the unreachable duplicate return block in `Skills.tsx`.
- Added accessible menu button label and expanded state.
- Added `rel="noreferrer noopener"` to external project image links.
- Made `ParticleBackground` client-only after mount to avoid hydration mismatch
  from randomized particles.

## Good Habits To Keep

- The portfolio now has a clear content angle: Web3 / fintech frontend and
  product engineering.
- The project and experience content is centralized in `src/lib/data.ts`.
- App Router is used correctly for static project pages with
  `generateStaticParams`.
- TypeScript strict mode is enabled.
- Path aliases keep imports readable after the `src/` migration.
- Tailwind theme uses CSS variables, so a visual redesign can be done cleanly.
- `next/font` avoids runtime font layout shifts.
- `next/image` is used for many images.
- The site has memorable motion and a bold identity, which can work well if the
  motion becomes more intentional and less decorative.

## Remaining Bad Habits And Risks

- `ParticleBackground` remains purely decorative and random. It no longer causes
  hydration mismatch, but it still adds animation work without proving skill.
- Most sections are client components because of GSAP. This ships more JS than a
  portfolio needs.
- `html-react-parser` renders HTML strings from project data. It is trusted
  local content, but structured fields would be safer and easier to maintain.
- Some project images still use generic alt text such as `alt="Project"`.
- `Button.tsx` still references Tailwind classes like `bg-primary-hover`,
  `bg-secondary-hover`, and `bg-background-active` that are not defined in the
  Tailwind theme.
- `generateMetadata` can produce weak metadata if a project is missing, and
  project descriptions are still HTML-like strings.
- No `robots.ts`, Open Graph image, Twitter card metadata, or rich social preview
  exists yet.
- No Lighthouse budget, accessibility check, Playwright smoke test, or CI
  workflow exists yet.
- The current dark neon green/blue palette still reads like the original
  developer template more than Web3/fintech product tooling.
- The project visuals are placeholders from the fork. This is the largest
  recruiter-facing weakness: strong copy cannot compensate for irrelevant
  screenshots.
- The React packages are still React 19 release candidate builds with React 18
  type packages. This is an avoidable compatibility smell for a professional
  portfolio.

## Recruiter Impact Priorities

1. Replace placeholder project visuals.
   - Use real screenshots, cropped product states, diagrams, or tasteful mockups
     for Jupiter, Adrena, Versus, and ft_transcendence.
   - Recruiters should immediately see dashboards, market flows, wallet-aware
     UX, or real-time interfaces.

2. Convert project pages into short case studies.
   - Add sections for context, constraints, contribution, technical decisions,
     outcome, and stack.
   - Keep each page skimmable: bullets, screenshots, and concrete verbs.
   - Avoid vague claims like "improved UI"; say what changed and why it mattered.

3. Add a high-signal "Current Focus" section.
   - Example themes: Web3 product interfaces, trading dashboards, prediction
     markets, wallet-aware UX, API-connected dashboards, full-stack growth.
   - This helps recruiters map the profile to roles without reading everything.

4. Make the hero more precise.
   - Current direction is good, but the headline should be immediately
     role-shaped: "Frontend Developer for Web3 & Fintech Interfaces" or
     "Frontend / Product Engineer for Trading Interfaces".
   - Keep the CTA to LinkedIn, but add a secondary CV download CTA somewhere
     visible.

5. Make the Hermes differentiator explicit but concise.
   - The point is not nostalgia; it is precision, repeatability, finish quality,
     and quality standards.
   - This can become a small credibility block or timeline detail.

6. Improve trust signals.
   - Add GitHub, LinkedIn, CV, location, language fluency, target roles, and
     availability in a recruiter-friendly area.
   - Add links to live products or repositories where possible.

## Visual Direction Recommendation

- Move away from the inherited neon template identity.
- Better direction: graphite/black base, off-white typography, one precise accent
  color, subtle market-grid/data-line details, and calmer motion.
- Keep the bold typography only where it helps hierarchy.
- Replace decorative particles with product-specific visual language: market
  ticks, order-book rhythm, wallet states, dashboard panels, or code/data
  fragments.
- Make the site feel like someone who builds serious product interfaces, not
  just someone who customized an animated portfolio.

## Accessibility And Performance Plan

1. Add reduced-motion support.
   - Disable or simplify GSAP, Lenis, particles, cursor effects, and preloader
     when `prefers-reduced-motion` is enabled.

2. Restore native affordances.
   - Stop hiding the global cursor by default.
   - Stop hiding scrollbars globally.
   - Keep custom cursor only as progressive enhancement on devices where it adds
     value.

3. Reduce JS shipped to the browser.
   - Convert static sections to Server Components where possible.
   - Isolate GSAP into smaller client wrappers instead of marking whole sections
     client-only.

4. Remove or shorten the preloader.
   - If kept, show it only on first visit via session storage.
   - Prefer immediate content access for recruiters.

5. Improve image accessibility.
   - Replace generic image alt text with project-specific descriptions.
   - Ensure hover-only image previews have equivalent visible information on
     mobile and keyboard navigation.

## SEO And Sharing Plan

- Add `robots.ts`.
- Add an Open Graph image and metadata for the homepage.
- Add project-specific metadata that strips HTML and handles missing projects
  cleanly.
- Add a stable canonical URL once the final domain is confirmed.
- Delete the old Google verification file and add a new one only when connected
  to Guillaume's own Search Console.
- Consider JSON-LD `Person` structured data with name, role, sameAs links,
  location, and portfolio URL.

## Engineering Plan

1. Stabilize dependencies.
   - Move from React 19 RC packages and React 18 type packages to stable matching
     versions.
   - Verify Next version compatibility after the change.

2. Improve the content model.
   - Replace HTML strings with structured project fields.
   - Keep descriptions, bullets, role, results, and links as typed arrays/fields.

3. Add lightweight automated verification.
   - `pnpm run check` already covers formatting, lint, and typecheck.
   - Add a Playwright smoke test for homepage load, project page load, and main
     links.
   - Add a Lighthouse/accessibility checklist before publishing.

4. Add CI.
   - GitHub Actions can run `pnpm install --frozen-lockfile`, `pnpm run check`,
     and optionally `pnpm run build`.

5. Review runtime fetches.
   - Footer GitHub stats are acceptable with fallback, but keep the page useful
     if GitHub API rate-limits or fails.

## Suggested Next Work Sessions

1. Visual/content proof pass:
   - Replace placeholder project images.
   - Rewrite each project page as a recruiter-readable case study.

2. Accessibility/performance pass:
   - Reduced motion.
   - Native cursor/scrollbar restoration.
   - Preloader and particle simplification.

3. SEO/social pass:
   - Open Graph image.
   - `robots.ts`.
   - richer metadata.
   - delete old Google verification file.

4. Design direction pass:
   - New color system.
   - calmer fintech/product visual language.
   - tighter mobile and desktop hierarchy.

5. Engineering hardening pass:
   - stable React packages.
   - structured project data.
   - CI and smoke tests.
