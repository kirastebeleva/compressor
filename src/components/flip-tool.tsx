"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PageConfig } from "@/core/types";
import { formatBytes } from "@/lib/format";
import {
  trackEvent,
  trackFileUploaded,
  trackProcessingStarted,
  trackProcessingCompleted,
  trackDownloadResult,
  trackErrorShown,
  bytesToMb,
} from "@/lib/analytics";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOOL_KIND = "image-flip";
const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 10;
const ACCEPTED_FORMATS = "image/jpeg,image/png,image/webp";

type ViewState = "idle" | "uploading" | "ready" | "processing" | "done";

type FlipState = { h: boolean; v: boolean };

const FLIP_NONE: FlipState = { h: false, v: false };

type UploadedFile = {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
};

type FlipFileResult = {
  original: UploadedFile;
  blob: Blob;
  previewUrl: string;
  downloadUrl: string;
  downloadName: string;
  wasChanged: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let _uid = 0;
function uid(): string {
  return `ff-${++_uid}-${Date.now()}`;
}

function isFlipped(f: FlipState): boolean {
  return f.h || f.v;
}

function toggleH(f: FlipState): FlipState {
  return { h: !f.h, v: f.v };
}

function toggleV(f: FlipState): FlipState {
  return { h: f.h, v: !f.v };
}

function flipLabel(f: FlipState): string {
  if (f.h && f.v) return "Flipped H+V";
  if (f.h) return "Flipped H";
  if (f.v) return "Flipped V";
  return "";
}

function buildFlippedName(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot === -1) return `${name}-flipped`;
  return `${name.slice(0, dot)}-flipped${name.slice(dot)}`;
}

function cssTransform(f: FlipState): string | undefined {
  if (!f.h && !f.v) return undefined;
  const sx = f.h ? -1 : 1;
  const sy = f.v ? -1 : 1;
  return `scale(${sx}, ${sy})`;
}

async function performFlip(
  file: File,
  flip: FlipState,
): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await createImageBitmap(file);
  const w = img.width;
  const h = img.height;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const sx = flip.h ? -1 : 1;
  const sy = flip.v ? -1 : 1;
  ctx.translate(flip.h ? w : 0, flip.v ? h : 0);
  ctx.scale(sx, sy);
  ctx.drawImage(img, 0, 0);
  img.close();

  const mime =
    file.type === "image/png"
      ? "image/png"
      : file.type === "image/webp"
        ? "image/webp"
        : "image/jpeg";
  const quality = mime === "image/png" ? undefined : 0.92;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))),
      mime,
      quality,
    );
  });

  return { blob, width: w, height: h };
}

function pctChange(before: number, after: number): string {
  if (before === 0) return "0";
  const d = ((after - before) / before) * 100;
  return d > 0 ? `+${d.toFixed(1)}` : d.toFixed(1);
}

// ---------------------------------------------------------------------------
// SVG icon helpers
// ---------------------------------------------------------------------------

function IconFlipH({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
      <path d="M7 7L3 12l4 5V7z" fill="currentColor" opacity="0.35" />
      <path d="M17 7l4 5-4 5V7z" fill="currentColor" />
    </svg>
  );
}

function IconFlipV({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
      <path d="M7 7L12 3l5 4H7z" fill="currentColor" opacity="0.35" />
      <path d="M7 17l5 4 5-4H7z" fill="currentColor" />
    </svg>
  );
}

function IconReset({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 12a9 9 0 1 0 9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M3 3v6h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type FlipToolProps = { config: PageConfig };

export function FlipTool({ config }: FlipToolProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [globalFlip, setGlobalFlip] = useState<FlipState>(FLIP_NONE);
  const [perImageFlips, setPerImageFlips] = useState<Map<string, FlipState>>(
    new Map(),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [downloadOnlyChanged, setDownloadOnlyChanged] = useState(false);
  const [state, setState] = useState<ViewState>("idle");
  const [results, setResults] = useState<FlipFileResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const zipBusyRef = useRef(false);

  const byteLabels = useMemo(
    () => config.results.labels,
    [config.results.labels],
  );

  // ---- Computed ----

  const getEffectiveFlip = useCallback(
    (fileId: string): FlipState =>
      perImageFlips.has(fileId)
        ? perImageFlips.get(fileId)!
        : globalFlip,
    [globalFlip, perImageFlips],
  );

  const flippedCount = useMemo(
    () => files.filter((f) => isFlipped(getEffectiveFlip(f.id))).length,
    [files, getEffectiveFlip],
  );

  // ---- Cleanup ----

  useEffect(() => {
    return () => {
      for (const f of files) URL.revokeObjectURL(f.previewUrl);
      for (const r of results) {
        URL.revokeObjectURL(r.previewUrl);
        URL.revokeObjectURL(r.downloadUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- File handling ----

  const addFiles = useCallback(
    async (incoming: FileList | File[]) => {
      setError(null);
      const arr = Array.from(incoming);
      const valid: File[] = [];

      for (const f of arr) {
        if (!SUPPORTED_TYPES.has(f.type)) {
          const msg = `Unsupported format: ${f.name}. Use JPG, PNG, or WebP.`;
          trackErrorShown({ tool: TOOL_KIND, file_type: f.type, error_message: msg });
          setError(msg);
          continue;
        }
        if (f.size > MAX_FILE_SIZE) {
          const msg = `File too large: ${f.name}. Maximum size is 10 MB.`;
          trackErrorShown({ tool: TOOL_KIND, file_type: f.type, file_size_mb: bytesToMb(f.size), error_message: msg });
          setError(msg);
          continue;
        }
        valid.push(f);
      }

      const remaining = MAX_FILES - files.length;
      const toAdd = valid.slice(0, remaining);
      if (valid.length > remaining)
        setError(
          `Maximum ${MAX_FILES} files allowed. Some files were skipped.`,
        );

      if (toAdd.length === 0) return;

      setState("uploading");
      const loaded: UploadedFile[] = [];

      for (const f of toAdd) {
        const bmp = await createImageBitmap(f);
        loaded.push({
          id: uid(),
          file: f,
          previewUrl: URL.createObjectURL(f),
          width: bmp.width,
          height: bmp.height,
        });
        bmp.close();
        trackFileUploaded({ tool: TOOL_KIND, file_type: f.type, file_size_mb: bytesToMb(f.size) });
      }

      setFiles((prev) => [...prev, ...loaded]);
      setState("ready");
    },
    [files.length],
  );

  const removeFile = useCallback(
    (fileId: string) => {
      setFiles((prev) => {
        const idx = prev.findIndex((f) => f.id === fileId);
        if (idx === -1) return prev;
        const copy = [...prev];
        const [removed] = copy.splice(idx, 1);
        URL.revokeObjectURL(removed.previewUrl);
        if (copy.length === 0) setState("idle");
        return copy;
      });
      setPerImageFlips((prev) => {
        const next = new Map(prev);
        next.delete(fileId);
        return next;
      });
      if (selectedId === fileId) setSelectedId(null);
      for (const r of results) {
        URL.revokeObjectURL(r.previewUrl);
        URL.revokeObjectURL(r.downloadUrl);
      }
      setResults([]);
      setError(null);
    },
    [results, selectedId],
  );

  const clearAll = useCallback(() => {
    for (const f of files) URL.revokeObjectURL(f.previewUrl);
    for (const r of results) {
      URL.revokeObjectURL(r.previewUrl);
      URL.revokeObjectURL(r.downloadUrl);
    }
    setFiles([]);
    setGlobalFlip(FLIP_NONE);
    setPerImageFlips(new Map());
    setSelectedId(null);
    setDownloadOnlyChanged(false);
    setResults([]);
    setState("idle");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [files, results]);

  // ---- Drag & drop ----

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  };

  // ---- Flip actions ----

  const flipImageH = useCallback(
    (fileId: string) => {
      setPerImageFlips((prev) => {
        const next = new Map(prev);
        const current = next.has(fileId) ? next.get(fileId)! : globalFlip;
        next.set(fileId, toggleH(current));
        return next;
      });
      trackEvent("per_image_flip", { tool: TOOL_KIND, direction: "horizontal" });
    },
    [globalFlip],
  );

  const flipImageV = useCallback(
    (fileId: string) => {
      setPerImageFlips((prev) => {
        const next = new Map(prev);
        const current = next.has(fileId) ? next.get(fileId)! : globalFlip;
        next.set(fileId, toggleV(current));
        return next;
      });
      trackEvent("per_image_flip", { tool: TOOL_KIND, direction: "vertical" });
    },
    [globalFlip],
  );

  const resetImage = useCallback((fileId: string) => {
    setPerImageFlips((prev) => {
      const next = new Map(prev);
      next.delete(fileId);
      return next;
    });
    trackEvent("per_image_reset", { tool: TOOL_KIND });
  }, []);

  const flipAllH = useCallback(() => {
    setGlobalFlip((prev) => toggleH(prev));
    trackEvent("flip_all", { tool: TOOL_KIND, direction: "horizontal" });
  }, []);

  const flipAllV = useCallback(() => {
    setGlobalFlip((prev) => toggleV(prev));
    trackEvent("flip_all", { tool: TOOL_KIND, direction: "vertical" });
  }, []);

  const resetAll = useCallback(() => {
    setGlobalFlip(FLIP_NONE);
    setPerImageFlips(new Map());
    trackEvent("reset_all", { tool: TOOL_KIND });
  }, []);

  // ---- Keyboard shortcuts ----

  const flipImageHRef = useRef(flipImageH);
  flipImageHRef.current = flipImageH;
  const flipImageVRef = useRef(flipImageV);
  flipImageVRef.current = flipImageV;
  const removeFileRef = useRef(removeFile);
  removeFileRef.current = removeFile;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedId) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case "h":
        case "H":
          e.preventDefault();
          flipImageHRef.current(selectedId);
          break;
        case "v":
        case "V":
          e.preventDefault();
          flipImageVRef.current(selectedId);
          break;
        case "Delete":
        case "Backspace":
          e.preventDefault();
          removeFileRef.current(selectedId);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  // ---- Export ----

  const onExport = async () => {
    if (files.length === 0 || state === "processing") return;

    const batch = downloadOnlyChanged
      ? files.filter((f) => isFlipped(getEffectiveFlip(f.id)))
      : files;

    if (batch.length === 0) {
      setError(
        "No changed images to export. Uncheck the filter or flip some images.",
      );
      return;
    }

    trackProcessingStarted({ tool: TOOL_KIND });
    setError(null);
    setState("processing");
    setProgress(0);

    const t0 = performance.now();

    for (const r of results) {
      URL.revokeObjectURL(r.previewUrl);
      URL.revokeObjectURL(r.downloadUrl);
    }

    const newResults: FlipFileResult[] = [];
    let hasErrors = false;

    for (let i = 0; i < batch.length; i++) {
      const uf = batch[i];
      const flip = getEffectiveFlip(uf.id);
      const needsCanvas = isFlipped(flip);

      try {
        let blob: Blob;

        if (needsCanvas) {
          const res = await performFlip(uf.file, flip);
          blob = res.blob;
        } else {
          blob = uf.file;
        }

        newResults.push({
          original: uf,
          blob,
          previewUrl: URL.createObjectURL(needsCanvas ? blob : uf.file),
          downloadUrl: URL.createObjectURL(needsCanvas ? blob : uf.file),
          downloadName: needsCanvas
            ? buildFlippedName(uf.file.name)
            : uf.file.name,
          wasChanged: needsCanvas,
        });
      } catch {
        hasErrors = true;
        const msg = `Failed to process ${uf.file.name}.`;
        trackErrorShown({ tool: TOOL_KIND, file_type: uf.file.type, error_message: msg });
        setError(msg);
      }
      setProgress(i + 1);
    }

    setResults(newResults);
    setState("done");
    if (hasErrors && newResults.length === 0) setState("ready");

    const totalOutputBytes = newResults.reduce((s, r) => s + r.blob.size, 0);
    const totalInputBytes = newResults.reduce((s, r) => s + r.original.file.size, 0);

    trackProcessingCompleted({
      tool: TOOL_KIND,
      preset: "flip",
      output_size_mb: bytesToMb(totalOutputBytes),
      compression_ratio: totalInputBytes > 0 ? totalOutputBytes / totalInputBytes : 1,
      elapsed_ms: Math.round(performance.now() - t0),
    });
  };

  // ---- ZIP download ----

  const downloadAllZip = async () => {
    if (zipBusyRef.current) return;
    zipBusyRef.current = true;
    try {
      const totalBytes = results.reduce((s, r) => s + r.blob.size, 0);
      trackDownloadResult({
        tool: TOOL_KIND,
        output_size_mb: bytesToMb(totalBytes),
      });
      trackEvent("download_all_zip", {
        tool: TOOL_KIND,
        file_count: results.length,
      });
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const r of results) zip.file(r.downloadName, r.blob);
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "flipped-images.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      zipBusyRef.current = false;
    }
  };

  // ---- Render ----

  const isProcessing = state === "processing";
  const globalLabel = flipLabel(globalFlip);

  return (
    <>
      <section className="card tool-card">
        <h2 className="section-title">{config.tool.title}</h2>
        <p className="body-text tool-subtitle">{config.tool.subtitle}</p>

        <input
          accept={ACCEPTED_FORMATS}
          className="visually-hidden-file-input"
          multiple
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
          }}
          ref={inputRef}
          type="file"
        />

        {/* Dropzone */}
        {files.length === 0 && (
          <div
            className={`dropzone${dragOver ? " dropzone-active" : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                inputRef.current?.click();
            }}
            role="button"
            tabIndex={0}
          >
            <div className="dropzone-icon">
              <svg fill="none" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg">
                <rect fill="#eff6ff" height="32" rx="4" stroke="#93c5fd" strokeWidth="2" width="40" x="4" y="10" />
                <path d="M16 34L22 26L26 31L30 25L34 34" stroke="#3b82f6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <circle cx="18" cy="20" fill="#3b82f6" opacity="0.4" r="3" />
                <path d="M24 2V12M24 2L20 6M24 2L28 6" stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <span className="dropzone-label">Choose images</span>
            <span className="dropzone-hint">or drag and drop</span>
            <div className="dropzone-badges">
              <span className="format-badge">JPG</span>
              <span className="format-badge">PNG</span>
              <span className="format-badge">WebP</span>
              <span className="format-badge format-badge-muted">
                Up to {MAX_FILES} files
              </span>
              <span className="format-badge format-badge-muted">
                Max 10 MB
              </span>
            </div>
          </div>
        )}

        {/* Main tool area */}
        {files.length > 0 && (
          <div className="tool-flow">
            {/* ── Global flip controls ── */}
            <div className="rotate-quick-bar">
              <button
                className="rotate-quick-btn"
                disabled={isProcessing}
                onClick={flipAllH}
                title="Flip all horizontally — mirror left ↔ right"
                type="button"
              >
                <IconFlipH />
                <span>Flip Horizontal</span>
              </button>
              <button
                className="rotate-quick-btn"
                disabled={isProcessing}
                onClick={flipAllV}
                title="Flip all vertically — mirror top ↕ bottom"
                type="button"
              >
                <IconFlipV />
                <span>Flip Vertical</span>
              </button>
              <button
                className="rotate-quick-btn"
                disabled={isProcessing}
                onClick={resetAll}
                title="Reset all flips"
                type="button"
              >
                <IconReset size={20} />
                <span>Reset all</span>
              </button>
            </div>

            {/* ── Status badges ── */}
            {(globalLabel || flippedCount > 0) && (
              <div className="rotate-angle-row">
                {globalLabel && (
                  <span className="rotate-angle-badge">
                    Global: {globalLabel}
                  </span>
                )}
                {flippedCount > 0 && (
                  <span className="rotate-angle-badge">
                    {flippedCount} of {files.length} flipped
                  </span>
                )}
              </div>
            )}

            {/* ── Image grid ── */}
            <div className="rotate-grid">
              {files.map((uf) => {
                const flip = getEffectiveFlip(uf.id);
                const hasOverride = perImageFlips.has(uf.id);
                const changed = isFlipped(flip);
                const isSel = selectedId === uf.id;

                return (
                  <div
                    className={`rotate-grid-item${isSel ? " rotate-grid-item-selected" : ""}${changed ? " rotate-grid-item-changed" : ""}`}
                    key={uf.id}
                    onClick={() =>
                      setSelectedId(isSel ? null : uf.id)
                    }
                  >
                    <div className="rotate-grid-thumb-wrap">
                      <img
                        alt=""
                        className="rotate-grid-thumb"
                        loading="lazy"
                        src={uf.previewUrl}
                        style={
                          cssTransform(flip)
                            ? { transform: cssTransform(flip) }
                            : undefined
                        }
                      />
                      <button
                        aria-label="Remove"
                        className="rotate-grid-remove"
                        disabled={isProcessing}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(uf.id);
                        }}
                        type="button"
                      >
                        &times;
                      </button>
                      {changed && (
                        <span className="rotate-grid-badge">
                          {flipLabel(flip)}
                        </span>
                      )}
                    </div>

                    {/* Per-image controls */}
                    <div className="rotate-grid-controls">
                      <button
                        className="rotate-grid-ctrl-btn"
                        disabled={isProcessing}
                        onClick={(e) => {
                          e.stopPropagation();
                          flipImageH(uf.id);
                        }}
                        title="Flip horizontal (H)"
                        type="button"
                      >
                        <IconFlipH size={14} />
                      </button>
                      <button
                        className="rotate-grid-ctrl-btn"
                        disabled={isProcessing}
                        onClick={(e) => {
                          e.stopPropagation();
                          flipImageV(uf.id);
                        }}
                        title="Flip vertical (V)"
                        type="button"
                      >
                        <IconFlipV size={14} />
                      </button>
                      {hasOverride && (
                        <button
                          className="rotate-grid-ctrl-btn"
                          disabled={isProcessing}
                          onClick={(e) => {
                            e.stopPropagation();
                            resetImage(uf.id);
                          }}
                          title="Reset to global"
                          type="button"
                        >
                          <IconReset />
                        </button>
                      )}
                    </div>

                    <span
                      className="rotate-grid-name"
                      title={uf.file.name}
                    >
                      {uf.file.name}
                    </span>
                  </div>
                );
              })}

              {files.length < MAX_FILES && (
                <div
                  className="rotate-grid-add"
                  onClick={() => inputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      inputRef.current?.click();
                  }}
                  role="button"
                  tabIndex={0}
                >
                  + Add more
                </div>
              )}
            </div>

            {/* ── Download options ── */}
            <div className="rotate-download-options">
              <label className="rotate-download-toggle">
                <input
                  checked={downloadOnlyChanged}
                  disabled={isProcessing}
                  onChange={(e) =>
                    setDownloadOnlyChanged(e.target.checked)
                  }
                  type="checkbox"
                />
                Download only changed images
                {downloadOnlyChanged && flippedCount > 0
                  ? ` (${flippedCount})`
                  : ""}
              </label>
            </div>

            {/* ── Export button ── */}
            <button
              className="btn btn-compress"
              disabled={isProcessing || files.length === 0}
              onClick={onExport}
              type="button"
            >
              {isProcessing ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Flipping… ({progress}/
                  {downloadOnlyChanged ? flippedCount : files.length})
                </>
              ) : files.length > 1 ? (
                `Flip ${downloadOnlyChanged ? flippedCount : files.length} files`
              ) : (
                "Flip"
              )}
            </button>

            {selectedId && (
              <p className="rotate-keyboard-hint">
                H to flip horizontal · V to flip vertical · Delete to
                remove
              </p>
            )}
          </div>
        )}

        <p className="tool-trust-note">
          Your images are processed locally in your browser. Nothing is
          uploaded.
        </p>

        {error && <p className="error-message">{error}</p>}
      </section>

      {/* ── Results ── */}
      {results.length > 0 ? (
        <section className="card results-card results-appear">
          <h2 className="section-title">Results</h2>

          <div className="resize-results-list">
            {results.map((r, idx) => (
              <div className="resize-result-item" key={idx}>
                <img
                  alt=""
                  className="rotate-result-thumb"
                  src={r.previewUrl}
                />
                <div className="resize-result-info">
                  <span
                    className="file-info-name"
                    title={r.original.file.name}
                  >
                    {r.original.file.name}
                    {r.wasChanged && (
                      <span className="rotate-result-changed-dot" />
                    )}
                  </span>
                  <div className="resize-result-dims">
                    <span>
                      {r.original.width} × {r.original.height}
                    </span>
                  </div>
                  <div className="resize-result-sizes">
                    <span>
                      {formatBytes(r.original.file.size, byteLabels)}
                    </span>
                    <span className="resize-arrow" aria-hidden="true">
                      →
                    </span>
                    <span>{formatBytes(r.blob.size, byteLabels)}</span>
                    <span className="resize-result-pct">
                      ({pctChange(r.original.file.size, r.blob.size)}%)
                    </span>
                  </div>
                </div>
                <a
                  className="btn btn-download resize-dl-btn"
                  download={r.downloadName}
                  href={r.downloadUrl}
                  onClick={() =>
                    trackDownloadResult({
                      tool: TOOL_KIND,
                      file_type: r.original.file.type,
                      file_size_mb: bytesToMb(r.original.file.size),
                      output_size_mb: bytesToMb(r.blob.size),
                    })
                  }
                >
                  Download
                </a>
              </div>
            ))}
          </div>

          {results.length > 1 && (
            <button
              className="btn btn-download resize-dl-all"
              onClick={downloadAllZip}
              type="button"
            >
              Download All as ZIP
            </button>
          )}

          <button
            className="btn btn-secondary"
            onClick={clearAll}
            type="button"
          >
            Flip more images (free)
          </button>
        </section>
      ) : (
        state !== "processing" &&
        state !== "ready" &&
        state !== "uploading" && (
          <section className="card results-empty">
            <h2 className="section-title">Results</h2>
            <p className="body-text">
              Upload images and choose a flip direction to see your results here.
            </p>
          </section>
        )
      )}
    </>
  );
}
