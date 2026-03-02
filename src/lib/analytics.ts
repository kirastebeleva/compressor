/**
 * Type-safe wrappers for Google Analytics (gtag) and Yandex.Metrika (ym).
 * All calls are no-ops when the trackers haven't loaded yet.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

const YM_ID = 106822296;

function gtag(...args: unknown[]) {
  window.gtag?.(...args);
}

function ym(method: string, ...args: unknown[]) {
  window.ym?.(YM_ID, method, ...args);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sizeBucket(bytes: number): string {
  if (bytes < 100 * 1024) return "<100KB";
  if (bytes < 500 * 1024) return "100-500KB";
  if (bytes < 1024 * 1024) return "500KB-1MB";
  if (bytes < 5 * 1024 * 1024) return "1-5MB";
  return ">5MB";
}

function getDevice(): "desktop" | "mobile" {
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

function bytesToMb(bytes: number): number {
  return Math.round((bytes / (1024 * 1024)) * 100) / 100;
}

// ---------------------------------------------------------------------------
// Universal trackEvent — safe wrapper for gtag("event", …)
// ---------------------------------------------------------------------------

export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
) {
  try {
    gtag("event", name, params);
  } catch {
    /* analytics must never break the app */
  }
}

// ---------------------------------------------------------------------------
// Shared base params for all tool lifecycle events
// ---------------------------------------------------------------------------

/**
 * Base parameters shared across all tool events.
 * Optional fields are included in the event payload only when defined,
 * so adding new optional fields here is non-breaking for existing tools.
 */
export type ToolEventParams = {
  /** ToolKind identifier, e.g. "image-compress", "image-convert". */
  tool: string;
  /** Primary input MIME type, e.g. "image/jpeg". */
  file_type?: string;
  /** Primary input file size in MB. */
  file_size_mb?: number;
  /** Number of files being processed (batch tools). */
  file_count?: number;
  /** Source format key for conversion tools, e.g. "jpg". */
  from_format?: string;
  /** Target format key for conversion tools, e.g. "png". */
  to_format?: string;
};

function buildBaseParams(p: ToolEventParams): Record<string, unknown> {
  const params: Record<string, unknown> = {
    tool: p.tool,
    file_type: p.file_type ?? "(none)",
    file_size_mb: p.file_size_mb ?? 0,
    device: getDevice(),
  };
  if (p.file_count !== undefined) params.file_count = p.file_count;
  if (p.from_format) params.from_format = p.from_format;
  if (p.to_format) params.to_format = p.to_format;
  return params;
}

// ---------------------------------------------------------------------------
// Tool lifecycle events (reusable across all tools)
// ---------------------------------------------------------------------------

/** User opened a tool page. Fired once on mount. */
export function trackToolOpen(tool: string) {
  trackEvent("tool_open", buildBaseParams({ tool }));
}

/**
 * User selected or dropped one or more files.
 * Supports single-file and batch tools via optional file_count.
 */
export function trackFileUploaded(p: ToolEventParams) {
  trackEvent("file_uploaded", buildBaseParams(p));
}

/**
 * An action (conversion, compression, resize, …) was started.
 * Replaces the compress-specific `trackProcessingStarted` for new tools.
 */
export function trackActionStarted(p: ToolEventParams) {
  trackEvent("action_started", buildBaseParams(p));
}

/**
 * An action finished (successfully or partially).
 * Use success_count / fail_count to distinguish full vs partial success.
 */
export function trackActionCompleted(
  p: ToolEventParams & {
    success_count?: number;
    fail_count?: number;
    elapsed_ms?: number;
    output_size_mb?: number;
  },
) {
  trackEvent("action_completed", {
    ...buildBaseParams(p),
    success_count: p.success_count ?? 1,
    fail_count: p.fail_count ?? 0,
    elapsed_ms: p.elapsed_ms ?? 0,
    output_size_mb: p.output_size_mb ?? 0,
  });
}

/**
 * A processing error was shown to the user.
 * Generic replacement for `trackErrorShown` for new tools.
 */
export function trackError(
  p: ToolEventParams & { error_message?: string },
) {
  trackEvent("error", {
    ...buildBaseParams(p),
    error_message: p.error_message ?? "(unknown)",
  });
}

// ---------------------------------------------------------------------------
// Compression-specific lifecycle (kept for existing tools — do not rename)
// ---------------------------------------------------------------------------

/** Compression started — kept for compress/resize/crop tools. */
export function trackProcessingStarted(p: ToolEventParams & { preset?: string }) {
  trackEvent("processing_started", {
    ...buildBaseParams(p),
    preset: p.preset ?? "(default)",
  });
}

/** Compression finished — kept for compress/resize/crop tools. */
export function trackProcessingCompleted(
  p: ToolEventParams & {
    preset: string;
    output_size_mb: number;
    compression_ratio: number;
    elapsed_ms: number;
  },
) {
  trackEvent("processing_completed", {
    ...buildBaseParams(p),
    preset: p.preset,
    output_size_mb: p.output_size_mb,
    compression_ratio: p.compression_ratio,
    elapsed_ms: p.elapsed_ms,
  });
}

/** User clicked the download link. */
export function trackDownloadResult(p: ToolEventParams & { output_size_mb: number }) {
  trackEvent("download_result", {
    ...buildBaseParams(p),
    output_size_mb: p.output_size_mb,
  });
}

/** A user-facing error was shown — kept for existing compression tools. */
export function trackErrorShown(p: ToolEventParams & { error_message: string }) {
  trackEvent("error_shown", {
    ...buildBaseParams(p),
    error_message: p.error_message,
  });
}

// ---------------------------------------------------------------------------
// Legacy events (kept for backward compatibility with existing dashboards)
// ---------------------------------------------------------------------------

export function trackPageMeta(params: {
  pageSlug: string;
  intent: string;
  toolMode: string;
}) {
  gtag("event", "page_meta", {
    page_slug: params.pageSlug,
    tool_intent: params.intent,
    tool_mode: params.toolMode,
  });
}

export function trackCompressionCompleted(params: {
  pageSlug: string;
  intent: string;
  toolMode: string;
  preset: string;
  inputBytes: number;
  outputBytes: number;
  ratio: number;
  elapsedMs: number;
}) {
  const eventParams = {
    page_slug: params.pageSlug,
    tool_intent: params.intent,
    tool_mode: params.toolMode,
    preset: params.preset,
    input_size_bucket: sizeBucket(params.inputBytes),
    input_bytes: params.inputBytes,
    output_bytes: params.outputBytes,
    compression_ratio: Math.round(params.ratio * 100),
    elapsed_ms: params.elapsedMs,
  };

  gtag("event", "compression_completed", eventParams);
  ym("reachGoal", "compression_completed", eventParams);
}

export function trackDownload(params: {
  pageSlug: string;
  outputBytes: number;
}) {
  gtag("event", "file_download", {
    page_slug: params.pageSlug,
    output_bytes: params.outputBytes,
  });
}

// ---------------------------------------------------------------------------
// Converter-specific supplementary event
// (format selection is a UX pattern unique to the converter tool)
// ---------------------------------------------------------------------------

/**
 * User changed the "To" format selector on the universal convert-image page.
 * This is a supplementary event on top of the standard action_started/completed
 * lifecycle — it helps track format preference before conversion begins.
 */
export function trackConvertImageToSelected(p: {
  from_format: string;
  to_format: string;
}) {
  trackEvent("convert_image_to_selected", {
    from_format: p.from_format,
    to_format: p.to_format,
    device: getDevice(),
  });
}

// Re-export helper for use in components
export { bytesToMb };
