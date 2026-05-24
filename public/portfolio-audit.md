# Portfolio Audit

## Current Engineering Audit - May 2026

### Navigation Freeze / External Return

The current failure mode is most likely caused by a fullscreen GSAP layer being
restored in a bad visual state after browser back/forward cache, not by the
topographic background itself.

High-risk files:

- `src/app/template.tsx`
  - Owns the fullscreen `.page-transition` and `.page-transition--inner`
    overlays.
  - These layers are `fixed`, full viewport and `z-5`, so if a GSAP transform
    is restored at `yPercent: 0`, the whole site is hidden behind the transition
    color.
  - The component resets on `pageshow`, `popstate` and `visibilitychange`, but
    not before the page is cached on `pagehide`.
  - The overlay is not hidden by default in markup. It depends on GSAP running
    successfully to move it out of view.
  - Audit recommendation: make the transition overlay fail-safe by default
    (`-translate-y-full` / hidden initial state), and only bring it onscreen
    during intentional internal transitions.

- `src/components/TransitionLink.tsx`
  - Prevents default navigation for every wrapped link and waits for a GSAP
    timeline before calling `router.push` or `router.back`.
  - If the transition timeline is interrupted by leaving the site, browser
    restore, reduced motion, or an exception, navigation can leave the overlay
    in the visible state.
  - Audit recommendation: keep transition navigation scoped to internal links
    only. External links should never run this transition layer.

- `src/components/Preloader.tsx`
  - Another fullscreen layer, `fixed inset-0 z-6`, controlled by GSAP
    `autoAlpha`.
  - It currently reappears per mount because "seen preloader" session storage
    was removed from the earlier implementation.
  - Audit recommendation: either restore session-level "preloader seen" state
    or remove the preloader during navigation debugging. Do not allow both
    preloader and page-transition fullscreen layers to overlap during route
    changes.

- `src/components/ScrollProgressIndicator.tsx`
  - Shows a full bar if its inline transform is missing or stale.
  - It updates on `scroll` only, so bfcache restores or visibility changes can
    show stale progress until the next scroll.
  - Audit recommendation: update on `pageshow`, `visibilitychange`, and
    `resize`, and give the inner bar a safe default transform that represents
    top-of-page.

### GSAP / ScrollTrigger Risks

- Several scroll animations create `ScrollTrigger` timelines but do not call
  `ScrollTrigger.refresh()` after route transitions, image loads, or bfcache
  restore.
- `LenisProvider` uses Lenis smooth scrolling, but there is no explicit
  Lenis/ScrollTrigger bridge (`lenis.on('scroll', ScrollTrigger.update)` and a
  shared ticker). This can cause scroll-linked GSAP state to feel stale after
  browser history restoration.
- `src/lib/use-section-gsap.ts` abstracts reveal/exit timelines but does not
  enable `invalidateOnRefresh`, so trigger calculations can drift when content
  height changes after demos/images mount.
- Several animations use global selectors:
  - `#banner-arrow-svg`
  - `.slide-up-and-fade`
  - `#info`
  - `#images > div`
  These are easy to break when a page is cached, partially remounted, or when
  two route segments temporarily coexist.

Audit recommendation:

1. First make fullscreen overlays fail-safe. This should be fixed before
   touching Lenis, topo or route remounting.
2. Then add a small `GsapRuntime` component that only refreshes
   `ScrollTrigger` after route changes and `pageshow`. Do not remount
   `TopographicBackground`.
3. Finally move global GSAP selectors toward refs or scoped selectors, one
   component at a time.

### Performance / Lag Risks

- `src/lib/topography.ts`
  - Generates a 300 x 300 contour field plus padding, then animates 40 SVG
    paths indefinitely.
  - This is acceptable on desktop, but expensive for lower-end laptops and
    mobile/tablet GPUs.
  - Recommendation: keep it disabled or simplified for reduced motion and
    consider lowering grid size or line count on small screens.

- `src/components/TopographicBackground.tsx`
  - Runs infinite GSAP tweens on all contour paths.
  - Recommendation: pause or avoid starting these animations when the document
    is hidden, and resume only when visible.

- `src/app/_components/demos/WorldMapDemo.tsx`
  - Dynamically loads `react-globe.gl` and `three`, which is heavy.
  - It fetches country GeoJSON and earthquake data, then renders a 3D globe.
  - Recommendation: keep it lazy and do not mount it until the demo is likely to
    be viewed. The current dynamic import is good, but verify that the selected
    demo is the only heavy one actively rendering.

- `src/app/_components/demos/GitHubRadarDemo.tsx`
  - Fetches remote avatars and converts them to base64 data URLs for session
    storage.
  - Recommendation: watch storage size and memory use. Prefer normal image URLs
    or Next image optimization unless base64 caching is clearly needed.

- `src/app/_components/ProjectList.tsx`
  - Registers a `mousemove` listener on `window` and calls `gsap.to` frequently.
  - Recommendation: use `quickTo` / `quickSetter` or throttle via GSAP ticker
    if this feels janky on desktop.

- `src/components/CustomCursor.tsx`
  - Also listens to every `mousemove`.
  - Recommendation: keep it simple and CSS-driven. The current `html:hover`
    visibility pattern is better than JS state for leaving the page.

### Prioritized Technical Fix Plan

1. Fix the fullscreen overlay failure mode.
   - Make `.page-transition` hidden by default in markup/CSS.
   - Add a `pagehide` cleanup so bfcache snapshots the hidden state.
   - Keep external links outside transition handling.

2. Restore stable preloader behavior.
   - Restore session storage for "preloader seen", or temporarily remove
     `Preloader` until routing is stable.
   - Avoid two competing fullscreen GSAP layers.
   - Once routing is stable, use the preloader window as a startup coordinator
     for critical work: generate topo data, warm hero/portrait/experience
     images, and start demo data requests in the background with a timeout.

3. Add minimal GSAP runtime refresh.
   - On `pageshow`, `popstate`, and pathname changes, call
     `ScrollTrigger.refresh()` after a `requestAnimationFrame`.
   - Do not regenerate topography and do not key/remount layout components.

4. Refactor high-risk GSAP selectors.
   - Start with `ProjectDetails` (`#info`, `#images > div`) and `Banner`
     (`.slide-up-and-fade`).
   - Prefer component refs and `gsap.utils.selector(scope)`.

5. Performance pass.
   - Profile the demo section with the browser Performance panel.
   - Confirm that globe/three code does not run before the demo is viewed.
   - Reduce topo animation cost if frame time is unstable.

### Current Launch Blockers

- External back navigation can restore a fullscreen GSAP transition layer in a
  visible state.
- The preloader and page-transition layers both own fullscreen z-index states.
- Scroll progress can show stale state after browser restore.
- Lenis and ScrollTrigger are not explicitly synchronized.
- The heaviest demos need profiling before launch.

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
