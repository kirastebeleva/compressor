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
// Size bucket for grouping file sizes in analytics
// ---------------------------------------------------------------------------

function sizeBucket(bytes: number): string {
  if (bytes < 100 * 1024) return "<100KB";
  if (bytes < 500 * 1024) return "100-500KB";
  if (bytes < 1024 * 1024) return "500KB-1MB";
  if (bytes < 5 * 1024 * 1024) return "1-5MB";
  return ">5MB";
}

// ---------------------------------------------------------------------------
// Events
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
