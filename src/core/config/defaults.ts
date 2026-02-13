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
