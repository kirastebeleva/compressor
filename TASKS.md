# Tasks

## Phase 0 — Architecture spike
- [x] Choose frontend framework (SEO-first)
- [x] Define project structure
- [x] Define routing & page generation strategy

## Phase 1 — Browser-only compression spike
- [x] Research browser-compatible image compression approach
- [x] Implement compression playground (upload → compress → download)
- [x] Implement presets: Fast / Balanced / Max
- [x] Add WebWorker

## Phase 2 — Universal page template
- [x] Implement ToolPage template (UniversalLandingTemplate)
- [x] Implement ToolBlock (upload / result states)
- [x] Add SEO head & schema (FAQ schema + metadata builder)

## Phase 3 — Page config & routing
- [x] Define PageConfig type
- [x] Load pages from config
- [x] Auto-generate routes & sitemap

## Phase 4 — First pages
- [x] /compress-image
- [x] /compress-image-under-1mb
- [x] Image-compression cluster (17 pages)
- [x] PDF tools stub pages (3 pages)
- [x] Converter tools stub pages (3 pages)

---

## Phase 5 — SEO Infrastructure (before indexing)

### 5.1 — robots.txt
- [x] Create `app/robots.ts` (Next.js Metadata API)
- [x] Allow all crawlers for production pages
- [x] Disallow internal/utility routes if any
- [x] Reference sitemap URL

### 5.2 — Sitemap improvements
- [x] Replace placeholder domain `compressor.example.com` with real domain
- [x] Differentiate priority by intent type (base=1.0, format=0.9, size/platform=0.8, generic=0.7, stub=0.5)
- [x] Replace `new Date()` with real content-change dates (or build date as fallback)

### 5.3 — 301 redirects for synonyms
- [x] Add `redirects()` to `next.config.ts` per PROJECT_RULES §2.4
- [x] Redirect synonym URLs: `/reduce-image` → `/compress-image`, `/shrink-image` → `/compress-image`, etc.
- [x] Redirect `/optimize-image`, `/minimise-image`, `/compress-photo`, `/compress-picture`

### 5.4 — Trailing slash consistency
- [x] Set `trailingSlash: false` in `next.config.ts` explicitly
- [x] Verify canonical URLs match (no trailing slash)

### 5.5 — Custom 404 page
- [x] Create `app/not-found.tsx` with navigation links and search suggestion
- [x] Style consistently with the rest of the site

---

## Phase 6 — SEO Meta & Structured Data

### 6.1 — Open Graph + Twitter Card
- [x] Extend `buildToolPageMetadata()` to generate `og:title`, `og:description`, `og:type`, `og:url`
- [x] Add `twitter:card`, `twitter:title`, `twitter:description`
- [x] Add default `og:image` (branded social preview image)
- [x] Add `og:image` field to `PageConfig` for per-page override (optional)

### 6.2 — BreadcrumbList schema
- [x] Add BreadcrumbList JSON-LD to `UniversalLandingTemplate`
- [x] Structure: Home → Section (e.g. "Compress Tools") → Current page

### 6.3 — WebApplication schema
- [x] Add SoftwareApplication / WebApplication JSON-LD for tool pages
- [x] Include applicationCategory, offers (Free), operatingSystem (Any)

### 6.4 — noindex for stub pages
- [x] Add mechanism to mark pages with `mode: "stub"` as `noindex` until tool is functional
- [x] Or: add `indexable: boolean` field to PageConfig with default `true`

---

## Phase 7 — SEO Cannibalization Fixes

### 7.1 — Resolve "for-website" vs "for-web" overlap
- [x] Merged: removed `/compress-image-for-web` page, 301 redirect → `/compress-image-for-website`
- [x] Enriched `/compress-image-for-website` with best content from both pages
- [x] Updated all related links across the cluster

### 7.2 — Strengthen "compress-jpg" vs "compress-jpeg" differentiation
- [x] Added `canonical: "/compress-jpg"` to compress-jpeg page config
- [x] Differentiated content: JPEG page now focuses on technical JPEG details and camera workflows

### 7.3 — Protect hub page from generic modifiers
- [x] Verified `/free-image-compressor` and `/online-image-compressor` link back to `/compress-image` as hub
- [x] Expanded hub `/compress-image` related links from 2 to 6 (all key spoke pages)
- [x] Sitemap priority already lowered for generics to 0.6 (Phase 5)

---

## Phase 8 — Config Scalability

### 8.1 — Split config files (1 file per page or small cluster)
- [x] Deleted `image-compress-cluster.ts` (1850 lines)
- [x] Split into 5 focused files under `pages/image-compress/`: `format.ts`, `size.ts`, `platform.ts`, `generic.ts`, `batch.ts`
- [x] Each file exports individual PageConfig constants + a `pages` array

### 8.2 — Auto-discovery of page configs
- [x] Created barrel `pages/image-compress/index.ts` re-exporting all `pages` arrays
- [x] Rewrote `pages.config.ts` to import cluster via barrel (`...formatPages`, `...sizePages`, etc.)
- [x] Adding a new page = edit one file + add to its `pages` array — barrel handles the rest

### 8.3 — Auto-generate related links
- [x] Created `related-links.ts` with `hydrateRelatedLinks()` utility
- [x] Scoring: same section (+10), hub/base intent (+5), same category (+3), active mode (+2), diversity (+1)
- [x] Wired into `pages.config.ts` — pages without `related` get auto-generated links; manual overrides preserved

### 8.4 — Fix orphan config: resizeImagePage
- [x] Registered `resizeImagePage` in `allPages` (was defined in `image-tools.ts` but never imported)
- [x] Now generates `/resize-image` page (34 static pages total, was 31)

### 8.5 — Stricter intent taxonomy for converters
- [x] Renamed bare intents: `"format"` → `"convert-jpg-png"`, `"quality"` → `"convert-png-webp"`, `"device"` → `"convert-heic-jpg"`
- [x] Added `convert-${string}` pattern to `ToolIntent` type in `types.ts`

---

## Phase 9 — Code Quality & DX

### 9.1 — Extract shared utilities
- [x] Extracted `formatBytes()` and `buildOutputName()` to `src/lib/format.ts`
- [x] Updated `tool-block.tsx`, `results-section.tsx`, `compression-playground.tsx` to use shared module

### 9.2 — Expand ToolKind system
- [x] Added ToolKind values: `"image-resize"`, `"image-convert"`, `"pdf-compress"`, `"pdf-merge"`, `"pdf-to-image"`
- [x] Created per-kind defaults in `defaults.ts`: `IMAGE_RESIZE_TOOL_DEFAULTS`, `IMAGE_CONVERT_TOOL_DEFAULTS`, `PDF_COMPRESS_TOOL_DEFAULTS`, `PDF_MERGE_TOOL_DEFAULTS`, `PDF_TO_IMAGE_TOOL_DEFAULTS`
- [x] Updated `pdf-tools.ts`, `converter-tools.ts`, `image-tools.ts` (resize, convert-to-webp) to use correct defaults

### 9.3 — Add config validation tests
- [x] Validate: all `related.links[].href` resolve to existing slugs in `allPages`
- [x] Validate: `meta.title` length ≤ 60 chars, `meta.description` length ≤ 160 chars (warnings)
- [x] Validate: no two pages have the same H1
- [x] All checks run at module load in `validate.ts` — build fails immediately on errors

### 9.4 — Error boundary for template
- [x] Created `LandingErrorBoundary` component (`ErrorBoundary.tsx`)
- [x] Wrapped `UniversalLandingTemplate` in both `[slug]/page.tsx` and `compress-image/page.tsx`
- [x] One broken config renders fallback UI instead of crashing the build

---

## Phase 10 — Performance & Caching

### 10.1 — Cache headers
- [x] Added `headers()` to `next.config.ts`
- [x] Static assets (`/_next/static/*`, icons): `Cache-Control: public, max-age=31536000, immutable`
- [x] Security headers on all routes: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`

### 10.2 — CSS optimization
- [x] Audited `globals.css` (1222 lines) — well-structured with clear section comments
- [x] Decision: keep single file. Next.js already bundles/minifies CSS; splitting would add complexity without measurable benefit for a statically generated site of this size

### 10.3 — Font loading
- [x] Switched to `next/font/google` with `Inter` (latin + cyrillic subsets, `display: "swap"`)
- [x] Applied `inter.className` to `<body>` and `inter.variable` to `<html>` for CSS variable support
- [x] Updated `globals.css` to prefer `var(--font-inter)` over hardcoded `"Inter"` string

---

## Phase 11 — Internal Linking & Navigation

### 11.1 — Footer expansion
- [x] Created `SiteFooter` component with auto-generated links grouped by section
- [x] Built `footerSections` in `navigation.ts` — ranks pages by intent + mode, shows top 5 per section
- [x] Replaced old 2-link footer in `UniversalLandingTemplate` and `not-found.tsx`
- [x] Footer now shows Compress Tools, PDF Tools, Converter Tools with top links each

### 11.2 — Breadcrumbs UI
- [x] Created `Breadcrumbs` component: Home / Section / Page — matches BreadcrumbList JSON-LD from Phase 6.2
- [x] Added to `UniversalLandingTemplate` above the hero section
- [x] Added CSS in `globals.css` (`.breadcrumbs`, `.breadcrumb-list`, etc.)

### 11.3 — Hub-spoke model
- [x] Expanded `/compress-image` related links from 6 to 10 — now covers all spoke categories
- [x] Renamed section title to "All Compression Tools" for hub clarity
- [x] Added: under-500kb (size), instagram (platform), batch, free-image-compressor (generic)

---

## Phase 12 — Analytics & Monitoring

### 12.1 — Compression event tracking
- [x] Created `src/lib/analytics.ts` — type-safe wrappers for gtag + Yandex.Metrika
- [x] `compression_completed` event fires on every successful compression (real + stub)
- [x] Dimensions: `page_slug`, `tool_intent`, `tool_mode`, `preset`, `input_size_bucket`, `input_bytes`, `output_bytes`, `compression_ratio`, `elapsed_ms`
- [x] Also fires `reachGoal("compression_completed")` in Yandex.Metrika with same params
- [x] Added `preset` field to `ToolExecutionResult` type for analytics flow

### 12.2 — Page-type dimensions
- [x] `page_meta` event fires on mount in `ToolRuntime` with `page_slug`, `tool_intent`, `tool_mode`
- [x] Distinguishes real tool usage (`browser-compression`) from stub-only SEO visits

### 12.3 — Search Console
- [x] Sitemap is auto-generated at `/sitemap.xml` (Phase 5.2) — submit URL: `https://imgloo.com/sitemap.xml`
- [x] Steps: Google Search Console → Add property → URL prefix `https://imgloo.com` → Submit sitemap → Monitor Index Coverage and Crawl Stats
- [x] Set alerts for coverage drops in GSC email settings

---

## Phase 13 — Content Pipeline (for 50+ pages) ✅

### 13.1 — Evaluate content format ✅
- [x] **Decision: keep SEO content in TypeScript configs** (not MDX, not CMS)
- [x] Rationale:
  - TypeScript configs give **compile-time type safety** — the `validatePageConfigs` pipeline (Phase 9) catches broken links, duplicate H1s, and meta-length violations at build time
  - All page defaults (`IMAGE_COMPRESS_TOOL_DEFAULTS`, `RESULTS_DEFAULTS`, etc.) are shared via spreads, so boilerplate is minimal
  - The scaffolder (13.2) reduces per-page effort from 100+ lines to a CLI one-liner
  - MDX would add toolchain weight (`@next/mdx`, `mdx-bundler`, or `contentlayer`) for marginal benefit at current scale (<50 pages)
  - If non-developer editing becomes a priority later, MDX or a headless CMS can be introduced **per-section** without rewriting the existing pages
- [x] Re-evaluate threshold: when team grows past 1 developer or page count exceeds 100

### 13.2 — Content generation tooling ✅
- [x] Created `scripts/new-page.mjs` — CLI scaffolder that generates a complete PageConfig TS export
- [x] Usage: `node scripts/new-page.mjs --slug compress-avif --intent format-avif --label "Compress AVIF" --h1 "Compress AVIF Images Online"`
- [x] Supports flags: `--slug`, `--intent`, `--section`, `--label`, `--h1`, `--mode`, `--defaults`
- [x] Generates correct variable name, imports, meta tags, tool config spread, SEO blocks, and FAQ with TODO placeholders
- [x] Workflow: run scaffolder → paste output into cluster file → replace TODOs → add to `pages` array → `npx tsc --noEmit`

### 13.3 — i18n preparation ✅
- [x] Added optional `locale?: string` field to `PageConfig` (defaults to `"en"` when omitted)
- [x] Hreflang architecture plan (implement when needed):
  - **Routing**: `app/[locale]/(seo)/[slug]/page.tsx` — locale prefix extracted from URL
  - **Config**: duplicate `PageConfig` objects per locale, or add `locale` + translated content fields
  - **Metadata**: extend `buildToolPageMetadata` to emit `alternates.languages` map (`{ "es": "/es/compress-image", "de": "/de/compress-image" }`)
  - **Sitemap**: extend `sitemap.ts` to emit one entry per locale×slug with `hreflang` alternates
  - **next.config**: add `i18n` block with `locales` and `defaultLocale` (or use middleware-based approach for App Router)
  - **Redirects**: keep existing English redirects, add locale-prefixed synonym redirects per language
- [x] The `locale` field slot is now in place — no retrofit needed when i18n work begins
