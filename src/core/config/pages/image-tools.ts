import type { PageConfig } from "@/core/types";
import {
  IMAGE_COMPRESS_TOOL_DEFAULTS,
  IMAGE_RESIZE_TOOL_DEFAULTS,
  IMAGE_CONVERT_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

// ---------------------------------------------------------------------------
// /compress-image-under-1mb
// ---------------------------------------------------------------------------

export const compressImageUnder1mbPage: PageConfig = {
  slug: "compress-image-under-1mb",
  intent: "size",
  section: "image-tools",
  navLabel: "Compress Under 1 MB",

  h1: "Compress Image Under 1 MB",

  meta: {
    title: "Compress Image Under 1 MB - Free Online Tool",
    description:
      "Reduce any image to under 1 MB for email attachments, form uploads, and web use. Free browser-based compression.",
  },

  hero: {
    subtitle:
      "Shrink images below 1 MB without losing visible quality.",
    trustBadges: ["Free", "Under 1 MB target", "Browser-based"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "browser-compression",
    targetBytes: 1024 * 1024,
    title: "Compress to Under 1 MB",
    subtitle:
      "Upload your image and we will reduce it below 1 MB.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "why-1mb",
        title: "Why compress images under 1 MB?",
        paragraphs: [
          "Many email providers and form fields have a 1 MB attachment limit.",
          "Keeping images below 1 MB ensures compatibility with most upload restrictions.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Will the image quality drop noticeably?",
        answer:
          "The tool uses optimized presets that minimize visible quality loss while reaching the target file size.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description:
          "General image compression with flexible presets.",
      },
      {
        href: "/compress-image-under-500kb",
        label: "Compress Under 500 KB",
        description:
          "Hit a strict 500 KB limit for uploads and forms.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /resize-image
// ---------------------------------------------------------------------------

export const resizeImagePage: PageConfig = {
  slug: "resize-image",
  intent: "resize",
  section: "image-tools",
  navLabel: "Resize Image",

  h1: "Resize Image Online",

  meta: {
    title: "Resize Image Online - Free Browser Tool",
    description:
      "Resize images to exact dimensions directly in your browser. No upload required.",
  },

  hero: {
    subtitle:
      "Change image dimensions for web, social media, or print.",
    trustBadges: ["Free", "No signup", "Browser-based"],
  },

  tool: {
    ...IMAGE_RESIZE_TOOL_DEFAULTS,
    title: "Image Resizer",
    subtitle:
      "Upload an image and set your target dimensions.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "how-resize-works",
        title: "How image resizing works",
        paragraphs: [
          "Select your target width and height, and the tool will scale your image proportionally.",
        ],
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description:
          "Reduce file size without changing dimensions.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /convert-to-webp
// ---------------------------------------------------------------------------

export const convertToWebpPage: PageConfig = {
  slug: "convert-to-webp",
  intent: "convert",
  section: "image-tools",
  navLabel: "Convert to WebP",

  h1: "Convert Images to WebP",

  meta: {
    title: "Convert to WebP - Free Online Converter",
    description:
      "Convert JPG and PNG images to WebP format for smaller file sizes and faster page loads.",
  },

  hero: {
    subtitle:
      "Get smaller file sizes with modern WebP format.",
    trustBadges: ["Free", "Browser-based", "No upload"],
  },

  tool: {
    ...IMAGE_CONVERT_TOOL_DEFAULTS,
    title: "WebP Converter",
    subtitle:
      "Upload a JPG or PNG image to convert it to WebP.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description:
          "Compress images without format conversion.",
      },
      {
        href: "/compress-webp",
        label: "Compress WebP",
        description:
          "Compress WebP images in your browser.",
      },
    ],
  },
};
