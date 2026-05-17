# Portfolio Codebase Audit

Date: 2026-05-17

This project is a downloaded personal portfolio for Tajmirul Islam. It can be used as a base, but it still contains the original author's identity, analytics, links, projects, README attribution request, license copyright, and SEO metadata. Before publishing, it needs a real content and design pass so the final site represents talibabtou instead of looking like a lightly edited fork.

## Current Tech Stack

- Framework: Next.js 15 App Router.
- UI: React, TypeScript, Tailwind CSS.
- Animation: GSAP, `@gsap/react`, ScrollTrigger, Lenis smooth scrolling.
- Icons: `lucide-react`, custom SVG generated through SVGR.
- Fonts: Google Fonts through `next/font`: Anton and Roboto Flex.
- Content model: mostly hard-coded TypeScript data in `lib/data.ts`.
- Images/assets: static files under `public/`.
- Analytics/tracking: Google Analytics and Hotjar are currently embedded in `app/layout.tsx`.
- Package manager: pnpm, with `pnpm-lock.yaml`.

## Site Structure

- `app/page.tsx`: homepage composition: banner, about, skills, experience, projects.
- `app/layout.tsx`: global shell, fonts, metadata, analytics, navbar, footer, cursor, preloader, background particles, sticky email.
- `app/projects/[slug]/page.tsx`: static project detail route generated from `PROJECTS`.
- `app/_components/*`: page sections.
- `components/*`: shared UI, navigation, animation helpers, cursor, footer.
- `lib/data.ts`: personal information, social links, stack, projects, experience.
- `app/globals.css` and `tailwind.config.ts`: color tokens, typography, layout sizing.

## Good Habits To Keep

- Clear data-driven project model: projects and experience are centralized in `lib/data.ts`, making content replacement straightforward.
- App Router is used correctly for static project pages with `generateStaticParams`.
- TypeScript is enabled in strict mode.
- Tailwind theme uses CSS variables, so changing the color palette can be clean.
- `next/font` avoids layout shifts from external font loading.
- Components are split by section, which makes redesigning one section at a time practical.
- Project detail pages are already present, which is useful for a job-search portfolio.
- `next/image` is used in several places for optimized images.
- The site has a strong visual identity: bold typography, motion, custom cursor, project hover previews.
- The existing design is memorable enough to serve as a creative base if heavily personalized.

## Bad Habits And Risks

- Original identity remains everywhere: names, links, email, projects, GitHub URLs, metadata, sitemap, footer, analytics IDs, and Google verification file.
- `app/layout.tsx` includes Google Analytics and Hotjar for the original site. These should be removed immediately unless replaced with your own privacy-conscious analytics.
- The original README asks for attribution and says the project was not intended as a starter theme. We should either keep credit visibly or substantially redesign the site.
- `components/Footer.tsx` fetches GitHub stats from the original author's repo at runtime. This adds an external dependency and displays irrelevant stars/forks.
- `html-react-parser` renders HTML strings from `lib/data.ts`. It is acceptable only for trusted local content, but it is still a weaker content pattern than structured project fields.
- Too many client components. Most sections are marked `'use client'` because of GSAP. This increases JS shipped to the browser.
- Heavy motion stack: GSAP, Lenis, preloader, particles, custom cursor, page transitions, and scroll triggers. Nice visually, but risky for performance and accessibility.
- No reduced-motion support was found. Users who prefer less motion still get animations.
- Global `!cursor-none` hides the native cursor everywhere on desktop. This can hurt usability, accessibility, and debugging.
- Scrollbar is hidden globally. This removes a familiar navigation affordance.
- The preloader is decorative and delays access to content.
- `ParticleBackground` creates random particles with `Math.random()` on the client. It is visually non-deterministic and purely decorative.
- Some code is duplicated: `Skills.tsx` has a second unreachable `return` block.
- Several `any` casts are used around GSAP event handlers and refs.
- `Button.tsx` references Tailwind classes like `bg-primary-hover`, `bg-secondary-hover`, and `bg-background-active` that are not defined in the Tailwind theme.
- Project image `alt` text is generic (`alt="Project"`), which is weak for accessibility and SEO.
- Menu button lacks an accessible label and expanded state.
- External image links in project details should include `rel="noreferrer noopener"`.
- `generateMetadata` can produce weak metadata if a project is missing, and project descriptions include HTML strings.
- `app/sitemap.ts` points to `https://me.toinfinite.dev`, not the future talibabtou domain.
- `public/googleb73ec97d9cf6ea95.html` belongs to the original owner's Google Search Console verification and should be deleted.
- The project uses React 19 release candidate packages with `@types/react` 18, which is an avoidable compatibility smell for a personal portfolio.
- `next lint` is configured as a script, but Next.js has moved away from `next lint` in newer versions. We should verify and modernize linting later.
- No tests, accessibility checks, Lighthouse budget, or CI workflow are present.
- No `robots.ts`, Open Graph image, or rich social metadata exists yet.
- The current palette is a dark neon green/blue developer aesthetic. It may not fit talibabtou's Web3/fintech/product positioning unless refined.

## CV Content Direction For talibabtou

The CV positions talibabtou as:

- Frontend Developer focused on Web3, fintech, trading dashboards, and product interfaces.
- 42 Lyon Common Core graduate.
- Former Hermes leatherwork artisan with precision and quality standards.
- Growing toward full-stack engineering, product ownership, and architecture.
- Strong themes: clarity, APIs, dashboards, maintainable UI, wallet-aware UX, Solana, prediction markets, product sense.

The portfolio should not be a generic "creative frontend developer" site. It should say, quickly and concretely:

- Frontend / Product Engineer for Web3 and fintech interfaces.
- Experience with Jupiter, Adrena, Versus, Magicake / Doge Capital, 42 projects.
- Strength in data-heavy product screens, trading workflows, wallet-aware UX, and polished implementation.
- Personal differentiator: technical rigor from 42 plus high-end craft standards from Hermes.

## Recommended Personalization Plan

1. Remove or replace all original owner data:
   - `lib/data.ts`
   - `app/layout.tsx`
   - `app/sitemap.ts`
   - `components/Footer.tsx`
   - `README.md`
   - `LICENSE` attribution handling
   - `public/googleb73ec97d9cf6ea95.html`

2. Rebuild content around talibabtou:
   - Hero: "Frontend / Product Engineer" plus Web3 and fintech positioning.
   - About: combine 42 engineering rigor, product judgment, and Hermes craft background.
   - Experience: Jupiter, Adrena, Versus, Magicake / Doge Capital, with earlier career secondary.
   - Projects: Jupiter Prediction Market, Adrena contributions, Versus, ft_transcendence, selected 42 work.
   - Stack: TypeScript, React, Next.js, Node.js, Python, WebSockets, Solana, Rust learning, Docker, Git, C/C++.

3. Change the visual direction:
   - Move away from the original neon green identity.
   - Better direction: dark graphite base, precise off-white typography, one sharp accent color, and subtle market/data-inspired visuals.
   - Keep the bold typography if desired, but reduce decorative motion and make the site feel more product/fintech than template portfolio.

4. Improve accessibility and performance:
   - Add reduced-motion handling.
   - Restore native cursor or make custom cursor optional.
   - Stop hiding scrollbars globally.
   - Remove or simplify preloader and particle background.
   - Add accessible labels to icon/menu controls.
   - Improve image alt text.

5. Improve SEO and hiring usefulness:
   - Add talibabtou-specific title, description, Open Graph metadata, and sitemap domain.
   - Add downloadable CV link.
   - Add contact CTA using talibabtou's email and LinkedIn/GitHub.
   - Make project pages concise and recruiter-readable.
   - Add a simple "Target roles" or "Current focus" section.

## Hosting Options

Best fit for this project: Vercel Hobby.

Reason: this is a Next.js app, and Vercel has the smoothest Next.js deployment path. The official Vercel Hobby docs say the Hobby plan is free for personal projects and small-scale apps, with included monthly usage limits.

Also viable:

- Cloudflare Pages: strong free tier, global network, Git integration, no credit card language on the product page, and official limits showing 500 builds/month on the Free plan. It may require extra Next.js adaptation depending on features.
- Netlify Free: good Git-based workflow and custom domains, but its current pricing is credit-based. Official FAQ says the free plan has hard monthly limits and cannot incur costs if auto-recharge stays off.

Recommendation for discussion:

- Use Vercel first for fastest deployment.
- Consider Cloudflare Pages if you want a very generous static/frontend hosting model.
- Avoid adding server features until the portfolio is stable and deployed.

Official references checked on 2026-05-17:

- Vercel Hobby Plan: https://vercel.com/docs/plans/hobby
- Netlify Pricing: https://www.netlify.com/pricing/
- Cloudflare Pages product page: https://www.cloudflare.com/products/pages/
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/

## Next Work Session Proposal

Before touching design, do a cleanup pass:

1. Remove tracking and original verification.
2. Replace identity, metadata, sitemap, and footer.
3. Replace `lib/data.ts` with talibabtou's real CV-derived content.
4. Simplify the heaviest motion/accessibility problems.
5. Then redesign colors, typography rhythm, and project presentation.
