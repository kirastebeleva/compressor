import { compressImagePage } from "@/core/config/pages/compress-image";
import {
  compressImageUnder1mbPage,
  resizeImagePage,
  cropImagePage,
  rotateImagePage,
  flipImagePage,
  watermarkImagePage,
} from "@/core/config/pages/image-tools";
import { resizePlatformPages } from "@/core/config/pages/resize-platform-pages";
import {
  formatPages,
  sizePages,
  platformPages,
  genericPages,
  batchPages,
} from "@/core/config/pages/image-compress";
import { convertImagePage } from "@/core/config/pages/convert-image-page";
import {
  convertPdfPage,
  pdfToPngPage,
  pdfToJpgPage,
  pdfToTxtPage,
  pdfToHtmlPage,
} from "@/core/config/pages/pdf-tools";
import {
  heicToJpgPage,
  webpToJpgPage,
  jpgToPngPage,
  pngToJpgPage,
  jpgToWebpPage,
  pngToWebpPage,
  pngToAvifPage,
} from "@/core/config/pages/converter-tools";
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
//
// PDF configs not registered below (see pdf-tools.ts): compressPdfPage, mergePdfPage — add to rawPages when tools ship.
// ---------------------------------------------------------------------------

const rawPages: readonly PageConfig[] = [
  // Hub
  compressImagePage,

  // Universal converter
  convertImagePage,

  convertPdfPage,
  pdfToPngPage,
  pdfToJpgPage,
  pdfToTxtPage,
  pdfToHtmlPage,

  // Converter pair pages (ranked by predicted usage frequency)
  heicToJpgPage,
  webpToJpgPage,
  jpgToPngPage,
  pngToJpgPage,
  jpgToWebpPage,
  pngToWebpPage,
  pngToAvifPage,

  // Standalone image tools
  compressImageUnder1mbPage,
  resizeImagePage,
  ...resizePlatformPages,
  cropImagePage,
  rotateImagePage,
  flipImagePage,
  watermarkImagePage,

  // Image compression cluster (auto-collected from barrel)
  ...formatPages,
  ...sizePages,
  ...platformPages,
  ...genericPages,
  ...batchPages,
];

// Validate at module load — build fails immediately on config errors.
validatePageConfigs(rawPages);

// Fill in auto-generated related links for pages that don't define them.
export const allPages: readonly PageConfig[] = hydrateRelatedLinks(rawPages);

/** Lookup a page config by slug. Returns undefined when slug is unknown. */
export function getPageBySlug(slug: string): PageConfig | undefined {
  return allPages.find((p) => p.slug === slug);
}
