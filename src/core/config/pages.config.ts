import { compressImagePage } from "@/core/config/pages/compress-image";
import {
  compressImageUnder1mbPage,
} from "@/core/config/pages/image-tools";
import {
  compressPdfPage,
  mergePdfPage,
  pdfToJpgPage,
} from "@/core/config/pages/pdf-tools";
import {
  jpgToPngPage,
  pngToWebpPage,
  heicToJpgPage,
} from "@/core/config/pages/converter-tools";
import {
  formatPages,
  sizePages,
  platformPages,
  genericPages,
  batchPages,
} from "@/core/config/pages/image-compress";
import { validatePageConfigs } from "@/core/config/validate";
import { hydrateRelatedLinks } from "@/core/config/related-links";
import type { PageConfig } from "@/core/types";

// ---------------------------------------------------------------------------
// All registered pages — single source of truth for routing, sitemap, and nav.
//
// Adding a new image-compress page?
//   1. Create or edit a file under pages/image-compress/
//   2. Export the config + add it to the file's `pages` array
//   3. That's it — the barrel re-exports it here automatically.
// ---------------------------------------------------------------------------

const rawPages: readonly PageConfig[] = [
  // Hub
  compressImagePage,

  // Standalone image tools
  compressImageUnder1mbPage,

  // Image compression cluster (auto-collected from barrel)
  ...formatPages,
  ...sizePages,
  ...platformPages,
  ...genericPages,
  ...batchPages,

  // PDF tools
  compressPdfPage,
  mergePdfPage,
  pdfToJpgPage,

  // Converter tools
  jpgToPngPage,
  pngToWebpPage,
  heicToJpgPage,
];

// Validate at module load — build fails immediately on config errors.
validatePageConfigs(rawPages);

// Fill in auto-generated related links for pages that don't define them.
export const allPages: readonly PageConfig[] = hydrateRelatedLinks(rawPages);

/** Lookup a page config by slug. Returns undefined when slug is unknown. */
export function getPageBySlug(slug: string): PageConfig | undefined {
  return allPages.find((p) => p.slug === slug);
}
