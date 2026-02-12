import type { CompressionPresetId, CompressionStats, SupportedFormat } from "@/compression";

export type ToolMode = "browser-compression" | "stub";
export type ToolIntent =
  | "base"
  | "format"
  | "size"
  | "platform"
  | "device"
  | "quality"
  | "batch";

export type ToolPageConfig = {
  slug: string;
  intent: ToolIntent;
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
  header: {
    brandLabel: string;
    navAriaLabel: string;
    links: readonly {
      href: string;
      label: string;
    }[];
  };
  hero: {
    title: string;
    subtitle: string;
  };
  tool: {
    title: string;
    subtitle: string;
    mode: ToolMode;
    outputNameSuffix: string;
    acceptedFormats: readonly SupportedFormat[];
    presets: readonly {
      id: CompressionPresetId;
      label: string;
    }[];
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
  contentSections: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
  }[];
  faq: {
    title: string;
    items: readonly {
      question: string;
      answer: string;
    }[];
  };
  relatedTools: {
    title: string;
    links: readonly {
      href: string;
      label: string;
      description: string;
    }[];
  };
  footer: {
    text: string;
    linksAriaLabel: string;
    links: readonly {
      href: string;
      label: string;
    }[];
  };
};

export type ToolExecutionResult = {
  stats: CompressionStats;
  downloadUrl: string;
  downloadName: string;
};
