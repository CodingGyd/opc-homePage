# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server
npm run build        # Static export to ./out
npm run lint         # ESLint (eslint-config-next)
```

No test framework is configured.

## Architecture

Next.js 15 App Router with **static export** (`output: 'export'`). All pages are SSG via `generateStaticParams()`. No runtime API routes — the current site is fully static HTML deployed to Cloudflare Pages (primary, `opclite.com`) and GitHub Pages (`BASE_PATH=/opc-homePage`).

### Dual Deployment

- **Cloudflare Pages** — primary, no base path, `public/_redirects` handles `/ -> /zh/`
- **GitHub Pages** — secondary, `BASE_PATH=/opc-homePage`

### i18n

`next-intl` with two locales: `en` (default) and `zh`, always prefix-style (`/en/...`, `/zh/...`). Messages in `i18n/messages/{en,zh}.json`. Product data (IDs 1-4) lives in both translation files and as JS constants in components.

### Critical: assetPath()

Use `assetPath('/images/...')` from `lib/utils.ts` for all static asset URLs. It auto-detects the deployment environment and prepends the correct base path. Never use raw `/images/...` paths.

### Component Pattern

- Server components call `setRequestLocale(locale)` then render client components
- Client components use `'use client'` + `useTranslations()`
- UI components in `components/ui/` follow shadcn/ui conventions (CVA, Radix, tailwind-merge)
- Icons from `lucide-react`

### Key Directories

- `components/home/` — Home page sections (Hero, Features, ProductShowcase, CTA, Supporter)
- `components/layout/` — Header, Footer
- `lib/` — Utilities (`utils.ts`), DB (`db.ts`), auth (`auth.ts`), Stripe (`stripe.ts`), license keys (`license.ts`), sponsor QR codes (`sponsor.ts`)
- `_api_backup/` — Archived Pages Router API routes (not active in static export)
- `public/versions/data-where.json` — Version metadata for DataWhere's in-app update checker
- `sql/schema.sql` — MySQL 8.0+ schema (used by backup API routes)

### Static Export Constraints

- `images: { unoptimized: true }` — no Next.js image optimization
- `trailingSlash: true` required
- No API routes, no middleware, no SSR

## Products

4 products with hardcoded IDs 1-4: DataWhere (desktop software), DevTools Suite (desktop tools), CloudDev Studio (SaaS), MoyuSpreadsheet (browser game). Product media URLs and download links are JS constants in component files, not in translation files.
