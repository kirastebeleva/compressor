import type { PageConfig } from "@/core/types";
import {
  IMAGE_COMPRESS_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

export const compressImagePage: PageConfig = {
  slug: "compress-image",
  intent: "base",
  section: "image-tools",
  navLabel: "Compress Image",

  h1: "Compress Image Online",

  meta: {
    title: "Compress Image Online - Free Browser Tool",
    description:
      "Compress JPG, PNG, and WebP images directly in your browser. No upload to server, quick download, and predictable quality presets.",
  },

  hero: {
    subtitle:
      "Reduce image size in seconds with browser-based processing and keep your files private.",
    trustBadges: [
      "Free",
      "No signup required",
      "100% browser-based",
      "Secure",
    ],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "how-it-works",
        title: "How this compressor works",
        paragraphs: [
          "The tool processes images in the browser using preset-based compression settings.",
          "Your file stays on your device during processing and is available for direct download after optimization.",
        ],
      },
      {
        id: "best-practices",
        title: "Best practices for better output quality",
        paragraphs: [
          "Use the Fast preset for quick reduction, Balanced for everyday use, and Max for stronger size cuts.",
          "Start with Balanced and switch presets depending on visual quality requirements for your target platform.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Do I need to create an account?",
        answer:
          "No account is required to compress an image on this page.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. Your image files are not uploaded to our server. Compression runs locally in your browser on your device.",
      },
      {
        question: "Which formats are supported?",
        answer:
          "Supported formats are JPG, PNG, and WebP, all processed locally in your browser without server upload.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image-under-1mb",
        label: "Compress Image Under 1 MB",
        description:
          "Target a strict file size threshold for uploads and forms.",
      },
      {
        href: "/resize-image",
        label: "Resize Image",
        description:
          "Change image dimensions while preserving quality.",
      },
    ],
  },
};
