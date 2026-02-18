import type { PageConfig } from "@/core/types";
import {
  IMAGE_COMPRESS_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

export const compressImageUnder500kbPage: PageConfig = {
  slug: "compress-image-under-500kb",
  intent: "size-500kb",
  section: "image-tools",
  navLabel: "Compress Under 500 KB",
  h1: "Compress Image Under 500 KB",
  meta: {
    title: "Compress Image Under 500 KB - Free Tool",
    description: "Get images below 500 KB for uploads, forms, and social platforms. Free browser-based compression.",
  },
  hero: {
    subtitle: "Hit a strict 500 KB target for platform uploads and form requirements.",
    trustBadges: ["Free", "500 KB target", "Browser-based", "Private"],
  },
  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    targetBytes: 500 * 1024,
    title: "Compress to Under 500 KB",
    subtitle: "Upload your image and reduce it below 500 KB using quality presets.",
  },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: {
    blocks: [
      {
        id: "common-500kb-uses",
        title: "Common 500 KB use cases",
        paragraphs: [
          "Job application portals, forum avatars, and product listing images often cap uploads at 500 KB.",
          "This tool helps you meet that requirement without opening a desktop editor.",
        ],
      },
      {
        id: "how-500kb-target-works",
        title: "How the 500 KB target works",
        paragraphs: [
          "Select your image and choose a compression preset. The tool processes your file locally and shows the result size.",
          "Adjust the preset if the first pass does not reach your target — Max gives the strongest reduction.",
        ],
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { question: "Why do some platforms require images under 500 KB?", answer: "Many web forms, social platforms, and CMS systems enforce upload limits around 500 KB to keep pages loading fast." },
      { question: "What if my image is already under 500 KB?", answer: "The tool will still compress it further if possible. If it is already small, the savings may be minimal." },
      { question: "Which image formats can I compress to under 500 KB?", answer: "JPG, PNG, and WebP files are all supported. JPG typically yields the best results for photographs." },
    ],
  },
};

export const compressImageTo100kbPage: PageConfig = {
  slug: "compress-image-to-100kb",
  intent: "size-100kb",
  section: "image-tools",
  navLabel: "Compress to 100 KB",
  h1: "Compress Image to 100 KB",
  meta: {
    title: "Compress Image to 100 KB - Free Online",
    description: "Compress any image down to around 100 KB for strict upload limits. Processed locally in your browser.",
  },
  hero: {
    subtitle: "Target an aggressive 100 KB size for the tightest upload restrictions.",
    trustBadges: ["Free", "100 KB target", "Local processing", "Secure"],
  },
  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    targetBytes: 100 * 1024,
    title: "Compress to 100 KB",
    subtitle: "Upload your image and aim for a 100 KB result using the Max preset.",
  },
  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,
  seoContent: {
    blocks: [
      {
        id: "when-100kb",
        title: "When you need images at 100 KB",
        paragraphs: [
          "Passport photo uploads, government forms, and some messaging apps set strict limits as low as 100 KB.",
          "Meeting these limits often requires more aggressive compression than the default preset.",
        ],
      },
      {
        id: "best-result-100kb",
        title: "Getting the best result at 100 KB",
        paragraphs: [
          "For the smallest files start with a JPG input — JPG compresses more efficiently than PNG for photographs.",
          "If your image has solid colors or transparency, PNG may be preferable despite larger size.",
        ],
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { question: "Can every image be compressed to 100 KB?", answer: "Very large or highly detailed images may not reach exactly 100 KB without visible quality loss. The tool will compress as far as the preset allows." },
      { question: "Which preset should I use for 100 KB?", answer: "Start with Max for the strongest compression. If quality is too low, try Balanced and check if the result meets your limit." },
      { question: "Is this tool really free?", answer: "Yes. There are no charges, no hidden fees, and no account required." },
    ],
  },
};

export const pages: PageConfig[] = [
  compressImageUnder500kbPage,
  compressImageTo100kbPage,
];
