import type { PageConfig } from "@/core/types";
import {
  PDF_COMPRESS_TOOL_DEFAULTS,
  PDF_MERGE_TOOL_DEFAULTS,
  PDF_TO_IMAGE_TOOL_DEFAULTS,
  RESULTS_DEFAULTS,
  AD_SLOT_DEFAULTS,
} from "@/core/config/defaults";

// ---------------------------------------------------------------------------
// /compress-pdf
// ---------------------------------------------------------------------------

export const compressPdfPage: PageConfig = {
  slug: "compress-pdf",
  intent: "pdf-compress",
  section: "pdf-tools",
  navLabel: "Compress PDF",

  h1: "Compress PDF Online",

  meta: {
    title: "Compress PDF Online - Free Browser Tool",
    description:
      "Reduce PDF file size directly in your browser. No upload to server required.",
  },

  hero: {
    subtitle: "Make PDF files smaller for email and sharing.",
    trustBadges: ["Free", "No signup", "Browser-based"],
  },

  tool: {
    ...PDF_COMPRESS_TOOL_DEFAULTS,
    title: "PDF Compressor",
    subtitle:
      "Upload a PDF file and reduce its size instantly.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  seoContent: {
    blocks: [
      {
        id: "why-compress-pdf",
        title: "Why compress PDF files?",
        paragraphs: [
          "Large PDFs are hard to share via email and slow to download.",
          "Compressing them reduces file size while keeping text and images readable.",
        ],
      },
    ],
  },

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/merge-pdf",
        label: "Merge PDF",
        description: "Combine multiple PDF files into one.",
      },
      {
        href: "/pdf-to-jpg",
        label: "PDF to JPG",
        description: "Convert PDF pages to JPG images.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /merge-pdf
// ---------------------------------------------------------------------------

export const mergePdfPage: PageConfig = {
  slug: "merge-pdf",
  intent: "merge",
  section: "pdf-tools",
  navLabel: "Merge PDF",

  h1: "Merge PDF Files Online",

  meta: {
    title: "Merge PDF Files - Free Online Tool",
    description:
      "Combine multiple PDF documents into a single file. Free browser-based tool.",
  },

  hero: {
    subtitle:
      "Join multiple PDF files into one document in seconds.",
    trustBadges: ["Free", "No signup", "Browser-based"],
  },

  tool: {
    ...PDF_MERGE_TOOL_DEFAULTS,
    title: "PDF Merger",
    subtitle:
      "Upload PDF files and merge them into one document.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-pdf",
        label: "Compress PDF",
        description: "Reduce PDF file size for sharing.",
      },
      {
        href: "/pdf-to-jpg",
        label: "PDF to JPG",
        description: "Convert PDF pages to JPG images.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// /pdf-to-jpg
// ---------------------------------------------------------------------------

export const pdfToJpgPage: PageConfig = {
  slug: "pdf-to-jpg",
  intent: "pdf-to-image",
  section: "pdf-tools",
  navLabel: "PDF to JPG",

  h1: "Convert PDF to JPG",

  meta: {
    title: "PDF to JPG Converter - Free Online Tool",
    description:
      "Convert PDF pages to high-quality JPG images. Free and browser-based.",
  },

  hero: {
    subtitle: "Extract pages from PDF as JPG images.",
    trustBadges: ["Free", "No upload", "Browser-based"],
  },

  tool: {
    ...PDF_TO_IMAGE_TOOL_DEFAULTS,
    title: "PDF to JPG Converter",
    subtitle:
      "Upload a PDF and get JPG images of each page.",
  },

  results: RESULTS_DEFAULTS,
  adSlot: AD_SLOT_DEFAULTS,

  related: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-pdf",
        label: "Compress PDF",
        description: "Reduce PDF file size.",
      },
      {
        href: "/jpg-to-png",
        label: "JPG to PNG",
        description: "Convert JPG images to PNG format.",
      },
    ],
  },
};
