import { PRESETS, SUPPORTED_FORMATS } from "@/compression";
import type { ToolPageConfig } from "@/tool-page/types";

export const compressImagePageConfig: ToolPageConfig = {
  slug: "/compress-image",
  intent: "base",
  seo: {
    title: "Compress Image Online - Free Browser Tool",
    description:
      "Compress JPG, PNG, and WebP images directly in your browser. No upload to server, quick download, and predictable quality presets.",
    canonical: "/compress-image",
  },
  header: {
    brandLabel: "Compressor",
    navAriaLabel: "Main navigation",
    links: [
      { href: "/", label: "Home" },
      { href: "/compress-image", label: "Compress Image" },
    ],
  },
  hero: {
    title: "Compress Image Online",
    subtitle:
      "Reduce image size in seconds with browser-based processing and keep your files private.",
  },
  tool: {
    title: "Image Compressor Tool",
    subtitle:
      "Upload a file, choose a preset, run compression, and download the optimized image.",
    mode: "browser-compression",
    outputNameSuffix: "-compressed",
    acceptedFormats: SUPPORTED_FORMATS,
    presets: [
      { id: PRESETS.fast.id, label: PRESETS.fast.label },
      { id: PRESETS.balanced.id, label: PRESETS.balanced.label },
      { id: PRESETS.max.id, label: PRESETS.max.label },
    ],
    limitsText: "Single file mode. Max file size 10MB. Max total size 25MB.",
    labels: {
      fileInput: "Upload image",
      presetSelect: "Compression preset",
      compressButton: "Compress",
      compressingButton: "Compressing...",
      downloadButton: "Download compressed image",
      selectedFilePrefix: "Selected file",
      selectedPresetPrefix: "Selected preset",
    },
    messages: {
      fileTooLarge: "File is too large. Maximum size is 10MB.",
      totalLimitExceeded: "Total size limit exceeded.",
      compressionFailed: "Compression failed.",
      noFileSelected: "Select a file to continue.",
      stubModeNotice:
        "Compression engine is not connected yet. Preview uses placeholder result values.",
    },
    stubResult: {
      ratio: 0.64,
      elapsedMs: 120,
    },
  },
  results: {
    title: "Results",
    emptyState: "Upload an image and run compression to see before and after sizes.",
    labels: {
      input: "Before",
      output: "After",
      ratio: "Output ratio",
      elapsed: "Processing time",
      elapsedUnit: "ms",
      byteUnit: "B",
      kilobyteUnit: "KB",
      megabyteUnit: "MB",
    },
  },
  adSlot: {
    title: "Sponsored",
    placeholder: "Ad slot placeholder",
  },
  contentSections: [
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
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Do I need to create an account?",
        answer: "No account is required to compress an image on this page.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "This page uses browser-side processing for the current tool mode, so files are handled locally on your device.",
      },
      {
        question: "Which formats are supported?",
        answer: "Supported formats are JPG, PNG, and WebP.",
      },
    ],
  },
  relatedTools: {
    title: "Related Tools",
    links: [
      {
        href: "/compress-image-under-1mb",
        label: "Compress Image Under 1MB",
        description: "Target a strict file size threshold for uploads and forms.",
      },
      {
        href: "/compress-image",
        label: "Compress Image",
        description: "General image compression with fast preset switching.",
      },
    ],
  },
  footer: {
    text: "Compressor tools for practical image optimization workflows.",
    linksAriaLabel: "Footer links",
    links: [
      { href: "/", label: "Home" },
      { href: "/compress-image", label: "Compress Image" },
    ],
  },
};
