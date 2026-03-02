import type { PageConfig } from "@/core/types";
import {
  IMAGE_CONVERT_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

export const convertImagePage: PageConfig = {
  slug: "convert-image",
  intent: "convert",
  section: "converter-tools",
  navLabel: "Convert Image",

  h1: "Convert Image Online",

  meta: {
    title: "Convert Image Online — JPG, PNG, WebP, AVIF, HEIC",
    description:
      "Convert images between JPG, PNG, WebP, AVIF and HEIC formats. Free, browser-based, no upload required. Batch supported.",
  },

  hero: {
    subtitle:
      "Upload one or more images, choose the output format, and download the converted files instantly.",
    trustBadges: ["Free", "Browser-based", "No upload", "Batch supported"],
  },

  tool: {
    ...IMAGE_CONVERT_TOOL_DEFAULTS,
    title: "Image Converter",
    subtitle:
      "Select the format you want to convert to, then upload your images.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Which image formats can I convert?",
        answer:
          "You can convert JPG, PNG, WebP, and HEIC images to compatible output formats. Supported pairs: WebP → JPG, JPG → PNG or WebP, PNG → JPG, WebP, or AVIF, HEIC → JPG. The available targets update automatically when you select or upload an image.",
      },
      {
        question: "Is my data safe? Are files uploaded to a server?",
        answer:
          "No files ever leave your device. All conversion happens locally in your browser using the Canvas API (and heic2any for HEIC files). Nothing is sent to any server.",
      },
      {
        question: "Can I convert multiple images at once?",
        answer:
          "Yes. You can upload up to 20 images at a time (max 10 MB each, 25 MB total). After conversion, download files individually or as a single ZIP archive.",
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "Reduce image file size without visible quality loss.",
      },
      {
        href: "/resize-image",
        label: "Resize Image",
        description: "Change image dimensions to any target size.",
      },
    ],
  },
};
