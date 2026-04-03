import { allPages } from "@/core/config/pages.config";
import type { PageConfig } from "@/core/types";

/**
 * Core tools shown on the home hub — excludes long-tail / “mass SEO” landing pages
 * (platform presets, synonym slugs, size targets, etc.).
 */
export const HOME_HUB_SLUGS = new Set([
  "compress-image",
  "resize-image",
  "crop-image",
  "rotate-image",
  "flip-image",
  "watermark-image",
  "compress-image-batch",
  "convert-image",
  "convert-pdf",
  "heic-to-jpg",
  "webp-to-jpg",
  "jpg-to-png",
  "png-to-jpg",
  "jpg-to-webp",
  "png-to-webp",
  "png-to-avif",
]);

/** Stub tools allowed on the home hub (single exception for the PDF entry point). */
const HOME_HUB_STUB_ALLOWLIST = new Set(["convert-pdf"]);

/** One-line card copy for the home hub (no pricing / runtime claims). */
export const HOME_HUB_CARD_BLURBS: Record<string, string> = {
  "compress-image":
    "Shrink JPG, PNG, and WebP files using quality presets.",
  "resize-image": "Set width and height in pixels or by percentage.",
  "crop-image": "Crop to a region or a fixed aspect ratio.",
  "rotate-image": "Rotate by 90° or 180° and fix EXIF orientation.",
  "flip-image": "Mirror images horizontally or vertically.",
  "watermark-image": "Overlay text or a logo with adjustable placement.",
  "compress-image-batch": "Run compression on many files at once.",
  "convert-image":
    "Convert between JPG, PNG, WebP, AVIF, and HEIC in bulk.",
  "convert-pdf":
    "Export PDF pages to images, text, or HTML in your browser — optional page range.",
  "heic-to-jpg": "Turn HEIC photos into JPG files.",
  "webp-to-jpg": "Convert WebP images to JPG for broader compatibility.",
  "jpg-to-png": "Convert JPG to lossless PNG when you need transparency.",
  "png-to-jpg": "Convert PNG to JPG; transparency becomes white.",
  "jpg-to-webp": "Convert JPG to WebP for smaller assets.",
  "png-to-webp": "Convert PNG to WebP while keeping transparency.",
  "png-to-avif": "Convert PNG to AVIF for stronger compression.",
};

const CONVERT_SLUGS = new Set([
  "convert-image",
  "heic-to-jpg",
  "webp-to-jpg",
  "jpg-to-png",
  "png-to-jpg",
  "jpg-to-webp",
  "png-to-webp",
  "png-to-avif",
]);

export type HomeHubCategory = "optimize" | "convert" | "pdf";

function hubCategoryOrder(c: HomeHubCategory): number {
  if (c === "optimize") return 0;
  if (c === "pdf") return 1;
  return 2;
}

/** Hub card color / tab — PDF tools use section `pdf-tools` (present + future pages). */
export function getHomeHubCategory(page: PageConfig): HomeHubCategory {
  if (page.section === "pdf-tools") return "pdf";
  if (CONVERT_SLUGS.has(page.slug)) return "convert";
  return "optimize";
}

const CORE_TOOL_INTENTS = new Set([
  "resize",
  "crop",
  "rotate",
  "flip",
  "watermark",
]);

function hubSortScore(page: PageConfig): number {
  let s = 0;
  if (page.intent === "base") s += 10;
  if (CORE_TOOL_INTENTS.has(page.intent)) s += 8;
  if (
    page.tool.mode === "browser-compression" ||
    page.tool.mode === "browser-pdf-export"
  ) {
    s += 5;
  }
  if (page.intent.startsWith("format")) s += 3;
  if (page.slug === "convert-pdf") s += 4;
  return s;
}

export function getHomeHubTools(): PageConfig[] {
  return allPages
    .filter(
      (p) =>
        HOME_HUB_SLUGS.has(p.slug) &&
        (p.tool.mode !== "stub" || HOME_HUB_STUB_ALLOWLIST.has(p.slug)),
    )
    .sort((a, b) => {
      const catA = getHomeHubCategory(a);
      const catB = getHomeHubCategory(b);
      const byCat = hubCategoryOrder(catA) - hubCategoryOrder(catB);
      if (byCat !== 0) return byCat;
      return (
        hubSortScore(b) - hubSortScore(a) ||
        a.navLabel.localeCompare(b.navLabel, "en")
      );
    });
}

export type HomeHubToolCard = {
  slug: string;
  navLabel: string;
  description: string;
  category: HomeHubCategory;
};

export function toHomeHubToolCards(pages: PageConfig[]): HomeHubToolCard[] {
  return pages.map((p) => ({
    slug: p.slug,
    navLabel: p.navLabel,
    description: HOME_HUB_CARD_BLURBS[p.slug] ?? p.navLabel,
    category: getHomeHubCategory(p),
  }));
}
