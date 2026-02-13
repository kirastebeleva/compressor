import type { PageConfig } from "@/core/types";
import {
  IMAGE_COMPRESS_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

// ---------------------------------------------------------------------------
// /jpg-to-png
// ---------------------------------------------------------------------------

export const jpgToPngPage: PageConfig = {
  slug: "jpg-to-png",
  intent: "format",
  section: "converter-tools",
  navLabel: "JPG to PNG",

  h1: "Convert JPG to PNG",

  meta: {
    title: "JPG to PNG Converter - Free Online Tool",
    description:
      "Convert JPG images to PNG format with transparency support. Free and browser-based.",
  },

  hero: {
    subtitle: "Convert JPG images to lossless PNG format.",
    trustBadges: ["Free", "Browser-based", "No upload"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "stub",
    title: "JPG to PNG Converter",
    subtitle: "Upload a JPG image and get a PNG file.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/png-to-webp",
        label: "PNG to WebP",
        description: "Convert PNG images to WebP.",
      },
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "Reduce image file size.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /png-to-webp
// ---------------------------------------------------------------------------

export const pngToWebpPage: PageConfig = {
  slug: "png-to-webp",
  intent: "quality",
  section: "converter-tools",
  navLabel: "PNG to WebP",

  h1: "Convert PNG to WebP",

  meta: {
    title: "PNG to WebP Converter - Free Online Tool",
    description:
      "Convert PNG images to WebP for smaller file sizes without quality loss.",
  },

  hero: {
    subtitle:
      "Reduce PNG file sizes by converting to modern WebP format.",
    trustBadges: ["Free", "Browser-based", "Lossless option"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "stub",
    title: "PNG to WebP Converter",
    subtitle: "Upload a PNG image and convert it to WebP.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/jpg-to-png",
        label: "JPG to PNG",
        description: "Convert JPG images to PNG.",
      },
      {
        href: "/convert-to-webp",
        label: "Convert to WebP",
        description: "Convert any image to WebP.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /heic-to-jpg
// ---------------------------------------------------------------------------

export const heicToJpgPage: PageConfig = {
  slug: "heic-to-jpg",
  intent: "device",
  section: "converter-tools",
  navLabel: "HEIC to JPG",

  h1: "Convert HEIC to JPG",

  meta: {
    title: "HEIC to JPG Converter - Free Online Tool",
    description:
      "Convert iPhone HEIC photos to universally compatible JPG format. Free and browser-based.",
  },

  hero: {
    subtitle:
      "Open HEIC photos from iPhone on any device by converting to JPG.",
    trustBadges: ["Free", "iPhone compatible", "Browser-based"],
  },

  tool: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS,
    mode: "stub",
    title: "HEIC to JPG Converter",
    subtitle: "Upload a HEIC photo and get a JPG file.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "Compress the converted image further.",
      },
      {
        href: "/jpg-to-png",
        label: "JPG to PNG",
        description: "Convert your JPG to PNG.",
      },
    ],
  },
};
