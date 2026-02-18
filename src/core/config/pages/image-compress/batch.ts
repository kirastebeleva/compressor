import type { PageConfig } from "@/core/types";
import {
  IMAGE_COMPRESS_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

export const compressImageBatchPage: PageConfig = {
  slug: "compress-image-batch",
  intent: "batch-image",
  section: "image-tools",
  navLabel: "Batch Compress",
  h1: "Batch Compress Images",
  meta: { title: "Batch Compress Images - Free Online Tool", description: "Compress multiple images at once. Free browser-based tool — up to 5 files per batch." },
  hero: { subtitle: "Save time by compressing several images in a single session.", trustBadges: ["Free", "Multi-file", "Browser-based", "Private"] },
  tool: { ...IMAGE_COMPRESS_TOOL_DEFAULTS, mode: "stub", title: "Batch Image Compressor", subtitle: "Upload up to 5 images and compress them all with one click." },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: { blocks: [
    { id: "when-batch", title: "When to use batch compression", paragraphs: ["Batch compression saves time when preparing multiple images for a blog post, product catalog, or social media campaign.", "Instead of processing files one by one, upload several at once and download them all compressed."] },
    { id: "batch-limits", title: "Limits and supported formats", paragraphs: ["Each batch can include up to 5 files totaling 25 MB. Supported formats are JPG, PNG, and WebP.", "Every file is compressed independently using the selected preset."] },
  ] },
  faq: { title: "Frequently Asked Questions", items: [
    { question: "How many images can I compress at once?", answer: "The batch tool supports up to 5 images at a time, with a total limit of 25 MB across all files." },
    { question: "Do all images use the same preset?", answer: "Yes. The selected compression preset applies to every image in the batch." },
    { question: "Can I download all results at once?", answer: "Compressed images are available for individual download after processing. Bundled downloads are planned for a future update." },
  ] },
};

export const pages: PageConfig[] = [
  compressImageBatchPage,
];
