# Architectural Decisions

This file records key technical and architectural decisions.

## Pending
- Build & deploy strategy
- Build & deploy strategy

## Fixed
- SEO-first architecture
- One universal page template
- Browser-only compression for free tier
- No server-side file storage in free tier

## 2026-02-11 — Frontend Architecture

**Decision:** Use Next.js (App Router), SSG-first architecture.

**Why:**
- SEO-first static generation for hundreds/thousands of pages
- Config-driven routing via generateStaticParams
- Single React stack for SEO pages and interactive tool
- Clean path to future server-side compression without UI rewrite

**Key principles:**
- One universal page template
- Pages generated from config (single source of truth)
- Browser-only compression for free tier
- Compression logic behind adapter boundary

**Deferred (not MVP):**
- Server-side compression adapter
- Google Drive / Dropbox upload adapters
- CI validation for SEO/config rules

## 2026-02-11 — Compression MVP approach

**Decision:** Use native browser APIs (WebWorker + OffscreenCanvas + createImageBitmap + convertToBlob), no third-party compression library in MVP.

**Why:**
- Fully browser-only and zero server-side file handling
- Stable and predictable control over presets and quality loop
- Keeps adapter boundary clean for future `serverCompress`

**MVP behavior:**
- Single-file mode
- Max file size: 10MB
- Max total size: 25MB
- Supported formats: JPG/JPEG, PNG, WebP
- Keep original format on output