import { PRESETS, SUPPORTED_FORMATS } from "@/compression";
import type { PageConfig } from "@/core/types";

// ---------------------------------------------------------------------------
// Shared tool defaults for image-compress pages
// ---------------------------------------------------------------------------

export const IMAGE_COMPRESS_TOOL_DEFAULTS: PageConfig["tool"] = {
  kind: "image-compress",
  mode: "browser-compression",
  title: "Image Compressor Tool",
  subtitle:
    "Choose your image, pick the best preset, and get a smaller file in seconds.",
  outputNameSuffix: "-compressed",
  acceptedFormats: SUPPORTED_FORMATS,
  presets: [
    { id: PRESETS.fast.id, label: PRESETS.fast.label },
    { id: PRESETS.balanced.id, label: PRESETS.balanced.label },
    { id: PRESETS.max.id, label: PRESETS.max.label },
  ],
  limitsText: "Single file mode. Maximum file size: 10 MB.",
  labels: {
    fileInput: "Image file",
    presetSelect: "Compression preset",
    compressButton: "Compress now",
    compressingButton: "Compressing your image...",
    downloadButton: "Download optimized image",
    selectedFilePrefix: "Selected file",
    selectedPresetPrefix: "Preset",
  },
  messages: {
    fileTooLarge:
      "This image is too large. Please choose a file up to 10 MB.",
    totalLimitExceeded:
      "The selected file exceeds the allowed size limit.",
    compressionFailed:
      "We could not compress this image. Please try another file.",
    noFileSelected: "Choose an image first to start compression.",
    stubModeNotice:
      "Preview mode is active. Current results use placeholder values.",
  },
  stubResult: {
    ratio: 0.64,
    elapsedMs: 120,
  },
};

// ---------------------------------------------------------------------------
// Shared results section
// ---------------------------------------------------------------------------

export const RESULTS_DEFAULTS: PageConfig["results"] = {
  title: "Results",
  emptyState:
    "Choose an image and click Compress now to view your size savings.",
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
};

// ---------------------------------------------------------------------------
// Image resize defaults
// ---------------------------------------------------------------------------

export const IMAGE_RESIZE_TOOL_DEFAULTS: PageConfig["tool"] = {
  ...IMAGE_COMPRESS_TOOL_DEFAULTS,
  kind: "image-resize",
  mode: "stub",
  title: "Image Resizer",
  subtitle: "Upload an image and set your target dimensions.",
  outputNameSuffix: "-resized",
  labels: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS.labels,
    compressButton: "Resize now",
    compressingButton: "Resizing your image...",
    downloadButton: "Download resized image",
  },
  messages: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS.messages,
    noFileSelected: "Choose an image first to start resizing.",
    stubModeNotice: "Preview mode is active. Resizing is coming soon.",
  },
};

// ---------------------------------------------------------------------------
// Image convert defaults
// ---------------------------------------------------------------------------

export const IMAGE_CONVERT_TOOL_DEFAULTS: PageConfig["tool"] = {
  ...IMAGE_COMPRESS_TOOL_DEFAULTS,
  kind: "image-convert",
  mode: "stub",
  title: "Image Converter",
  subtitle: "Upload an image and convert it to another format.",
  outputNameSuffix: "-converted",
  labels: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS.labels,
    compressButton: "Convert now",
    compressingButton: "Converting your image...",
    downloadButton: "Download converted image",
  },
  messages: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS.messages,
    noFileSelected: "Choose an image first to start conversion.",
    stubModeNotice: "Preview mode is active. Conversion is coming soon.",
  },
};

// ---------------------------------------------------------------------------
// PDF compress defaults
// ---------------------------------------------------------------------------

export const PDF_COMPRESS_TOOL_DEFAULTS: PageConfig["tool"] = {
  ...IMAGE_COMPRESS_TOOL_DEFAULTS,
  kind: "pdf-compress",
  mode: "stub",
  title: "PDF Compressor",
  subtitle: "Upload a PDF file and reduce its size.",
  outputNameSuffix: "-compressed",
  acceptedFormats: ["image/jpeg"] as unknown as typeof SUPPORTED_FORMATS,
  labels: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS.labels,
    fileInput: "PDF file",
    compressButton: "Compress PDF",
    compressingButton: "Compressing your PDF...",
    downloadButton: "Download compressed PDF",
  },
  messages: {
    ...IMAGE_COMPRESS_TOOL_DEFAULTS.messages,
    noFileSelected: "Choose a PDF file first.",
    stubModeNotice: "Preview mode is active. PDF compression is coming soon.",
  },
};

// ---------------------------------------------------------------------------
// PDF merge defaults
// ---------------------------------------------------------------------------

export const PDF_MERGE_TOOL_DEFAULTS: PageConfig["tool"] = {
  ...PDF_COMPRESS_TOOL_DEFAULTS,
  kind: "pdf-merge",
  title: "PDF Merger",
  subtitle: "Upload PDF files and merge them into one document.",
  outputNameSuffix: "-merged",
  labels: {
    ...PDF_COMPRESS_TOOL_DEFAULTS.labels,
    compressButton: "Merge PDFs",
    compressingButton: "Merging your PDFs...",
    downloadButton: "Download merged PDF",
  },
  messages: {
    ...PDF_COMPRESS_TOOL_DEFAULTS.messages,
    noFileSelected: "Choose PDF files first.",
    stubModeNotice: "Preview mode is active. PDF merging is coming soon.",
  },
};

// ---------------------------------------------------------------------------
// PDF to image defaults
// ---------------------------------------------------------------------------

export const PDF_TO_IMAGE_TOOL_DEFAULTS: PageConfig["tool"] = {
  ...PDF_COMPRESS_TOOL_DEFAULTS,
  kind: "pdf-to-image",
  title: "PDF to Image Converter",
  subtitle: "Upload a PDF and get images of each page.",
  outputNameSuffix: "-page",
  labels: {
    ...PDF_COMPRESS_TOOL_DEFAULTS.labels,
    compressButton: "Convert to images",
    compressingButton: "Converting pages...",
    downloadButton: "Download images",
  },
  messages: {
    ...PDF_COMPRESS_TOOL_DEFAULTS.messages,
    noFileSelected: "Choose a PDF file first.",
    stubModeNotice: "Preview mode is active. PDF conversion is coming soon.",
  },
};

// ---------------------------------------------------------------------------
// Shared ad slot
// ---------------------------------------------------------------------------

export const AD_SLOT_DEFAULTS: PageConfig["adSlot"] = {
  title: "Sponsored",
  placeholder: "Ad slot placeholder",
};

// ---------------------------------------------------------------------------
// Shared footer
// ---------------------------------------------------------------------------

export const FOOTER_DEFAULTS = {
  text: "Compressor tools for practical image optimization workflows.",
  linksAriaLabel: "Footer links",
  links: [
    { href: "/", label: "Home" },
    { href: "/compress-image", label: "Compress Image" },
  ] as const,
};
