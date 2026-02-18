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
// Structured event helpers (tool lifecycle)
// ---------------------------------------------------------------------------

type ToolEventParams = {
  tool: string;
  file_type?: string;
  file_size_mb?: number;
};

function buildBaseParams(p: ToolEventParams): Record<string, unknown> {
  return {
    tool: p.tool,
    file_type: p.file_type ?? "(none)",
    file_size_mb: p.file_size_mb ?? 0,
    device: getDevice(),
  };
}

/** User opened a tool page */
export function trackToolOpen(tool: string) {
  trackEvent("tool_open", buildBaseParams({ tool }));
}

/** User selected / dropped a file */
export function trackFileUploaded(p: ToolEventParams) {
  trackEvent("file_uploaded", buildBaseParams(p));
}

/** Compression (or other processing) started */
export function trackProcessingStarted(p: ToolEventParams & { preset?: string }) {
  trackEvent("processing_started", {
    ...buildBaseParams(p),
    preset: p.preset ?? "(default)",
  });
}

/** Processing finished successfully */
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

/** User clicked the download link */
export function trackDownloadResult(p: ToolEventParams & { output_size_mb: number }) {
  trackEvent("download_result", {
    ...buildBaseParams(p),
    output_size_mb: p.output_size_mb,
  });
}

/** A user-facing error was shown */
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

// Re-export helper for use in components
export { bytesToMb };
