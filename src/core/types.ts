import type { CompressionPresetId, CompressionStats, SupportedFormat } from "@/compression";

// ---------------------------------------------------------------------------
// Intent & classification
// ---------------------------------------------------------------------------

export type ToolIntent =
  | "base"
  | "format"
  | `format-${string}`
  | "size"
  | `size-${string}`
  | "platform"
  | `platform-${string}`
  | "device"
  | `device-${string}`
  | "quality"
  | `quality-${string}`
  | "batch"
  | `batch-${string}`
  | "resize"
  | "convert"
  | `convert-${string}`
  | "merge"
  | "split"
  | "pdf-compress"
  | "pdf-to-image"
  | `generic-${string}`;

export type ToolKind =
  | "image-compress"
  | "image-resize"
  | "image-convert"
  | "pdf-compress"
  | "pdf-merge"
  | "pdf-to-image";

export type ToolMode = "browser-compression" | "stub";

export type NavSectionId = "image-tools" | "pdf-tools" | "converter-tools";

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export type NavSection = {
  id: NavSectionId;
  label: string;
  items: readonly { href: string; label: string }[];
};

// ---------------------------------------------------------------------------
// Page config — single source of truth for every SEO landing page
// ---------------------------------------------------------------------------

export type PageConfig = {
  /** URL slug without leading slash, e.g. "compress-image" */
  slug: string;
  intent: ToolIntent;
  section: NavSectionId;
  /** Short label shown in navigation dropdowns */
  navLabel: string;
  /** BCP-47 locale code. Defaults to "en" when omitted. */
  locale?: string;

  h1: string;

  meta: {
    title: string;
    description: string;
    /** Defaults to `/${slug}` when omitted */
    canonical?: string;
  };

  hero: {
    subtitle: string;
    trustBadges?: readonly string[];
  };

  tool: {
    kind: ToolKind;
    mode: ToolMode;
    title: string;
    subtitle: string;
    outputNameSuffix: string;
    acceptedFormats: readonly SupportedFormat[];
    presets: readonly { id: CompressionPresetId; label: string }[];
    limitsText: string;
    labels: {
      fileInput: string;
      presetSelect: string;
      compressButton: string;
      compressingButton: string;
      downloadButton: string;
      selectedFilePrefix: string;
      selectedPresetPrefix: string;
    };
    messages: {
      fileTooLarge: string;
      totalLimitExceeded: string;
      compressionFailed: string;
      noFileSelected: string;
      stubModeNotice: string;
    };
    stubResult?: {
      ratio: number;
      elapsedMs: number;
    };
  };

  results: {
    title: string;
    emptyState: string;
    labels: {
      input: string;
      output: string;
      ratio: string;
      elapsed: string;
      elapsedUnit: string;
      byteUnit: string;
      kilobyteUnit: string;
      megabyteUnit: string;
    };
  };

  adSlot: {
    title: string;
    placeholder: string;
  };

  seoContent?: {
    blocks: readonly {
      id: string;
      title: string;
      paragraphs: readonly string[];
    }[];
  };

  faq?: {
    title: string;
    items: readonly { question: string; answer: string }[];
  };

  related?: {
    title: string;
    links: readonly { href: string; label: string; description: string }[];
  };
};

// ---------------------------------------------------------------------------
// Tool execution result (used by client-side tool components)
// ---------------------------------------------------------------------------

export type ToolExecutionResult = {
  stats: CompressionStats;
  downloadUrl: string;
  downloadName: string;
  preset: string;
};
