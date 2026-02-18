import { compressImagePage } from "@/core/config/pages/compress-image";
import {
  compressImageUnder1mbPage,
  convertToWebpPage,
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
  compressJpgPage,
  compressPngPage,
  compressWebpPage,
  compressJpegPage,
  compressImageUnder500kbPage,
  compressImageTo100kbPage,
  compressImageForEmailPage,
  compressImageForWebsitePage,
  compressImageForWebPage,
  compressImageForInstagramPage,
  compressImageForWhatsappPage,
  compressImageForShopifyPage,
  compressImageForDiscordPage,
  compressImageForLinkedinPage,
  freeImageCompressorPage,
  onlineImageCompressorPage,
  compressImageBatchPage,
} from "@/core/config/pages/image-compress-cluster";
import { validatePageConfigs } from "@/core/config/validate";
import type { PageConfig } from "@/core/types";

// ---------------------------------------------------------------------------
// All registered pages — single source of truth for routing, sitemap, and nav.
// ---------------------------------------------------------------------------

export const allPages: readonly PageConfig[] = [
  // Image tools — base & existing
  compressImagePage,
  compressImageUnder1mbPage,
  convertToWebpPage,

  // Image compression cluster — format
  compressJpgPage,
  compressPngPage,
  compressWebpPage,
  compressJpegPage,

  // Image compression cluster — size
  compressImageUnder500kbPage,
  compressImageTo100kbPage,

  // Image compression cluster — platform / use-case
  compressImageForEmailPage,
  compressImageForWebsitePage,
  compressImageForWebPage,
  compressImageForInstagramPage,
  compressImageForWhatsappPage,
  compressImageForShopifyPage,
  compressImageForDiscordPage,
  compressImageForLinkedinPage,

  // Image compression cluster — generic
  freeImageCompressorPage,
  onlineImageCompressorPage,

  // Image compression cluster — batch
  compressImageBatchPage,

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
validatePageConfigs(allPages);

/** Lookup a page config by slug. Returns undefined when slug is unknown. */
export function getPageBySlug(slug: string): PageConfig | undefined {
  return allPages.find((p) => p.slug === slug);
}
