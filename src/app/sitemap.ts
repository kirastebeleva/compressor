import type { MetadataRoute } from "next";
import { allPages } from "@/core/config/pages.config";
import type { PageConfig } from "@/core/types";

export const dynamic = "force-static";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://imgloo.com";

const BUILD_DATE = new Date().toISOString().split("T")[0];

// ---------------------------------------------------------------------------
// Hub slugs — highest priority, these are the main entry points
// ---------------------------------------------------------------------------

const HUB_SLUGS = new Set(["compress-image"]);

// ---------------------------------------------------------------------------
// Priority rules
//
//  1.0  home + hub pages
//  0.9  universal tool pages (one tool, many formats): /convert-image, /compress-image, /resize-image
//  0.8  format pair pages (/heic-to-jpg) and core image tools (/resize-image, /crop-image …)
//  0.6  long-tail SEO cluster pages (platform/size/format variants of compress)
// ---------------------------------------------------------------------------

function getPriority(page: PageConfig): number {
  if (HUB_SLUGS.has(page.slug)) return 1.0;

  // Universal converter / batch / generic tools
  if (page.intent === "convert" || page.intent === "batch") return 0.9;

  // Core standalone tools
  const coreIntents = new Set(["resize", "crop", "rotate", "flip", "watermark"]);
  if (coreIntents.has(page.intent)) return 0.8;

  // Specific conversion pair pages (e.g. "convert-heic-jpg")
  if (page.intent.startsWith("convert-")) return 0.8;

  // Batch and high-value compress variants
  if (page.intent === "size" || page.intent.startsWith("size-")) return 0.7;
  if (page.intent.startsWith("generic-") || page.intent.startsWith("batch-")) return 0.7;

  // Long-tail cluster: format / platform / device variants
  return 0.6;
}

function getChangeFrequency(
  page: PageConfig,
): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (HUB_SLUGS.has(page.slug)) return "weekly";
  if (page.section === "converter-tools") return "monthly";
  return "monthly";
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = allPages
    // Exclude noindex pages — stub pages have robots:{index:false} in metadata,
    // so including them in the sitemap would create a noindex/sitemap conflict.
    .filter((page) => page.tool.mode !== "stub")
    .map((page) => ({
      url: `${BASE_URL}/${page.slug}/`,
      lastModified: BUILD_DATE,
      changeFrequency: getChangeFrequency(page),
      priority: getPriority(page),
    }));

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: BUILD_DATE,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...pages,
  ];
}
