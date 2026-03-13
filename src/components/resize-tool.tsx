"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  resizeImage,
  SUPPORTED_TYPES,
  MAX_FILE_SIZE,
  MAX_DIMENSION,
  MAX_FILES,
} from "@/resize";
import type { ResizeMode, ResizeResult, ResizeFitMode } from "@/resize";
import type { PageConfig } from "@/core/types";
import { formatBytes } from "@/lib/format";
import {
  trackEvent,
  trackFileUploaded,
  trackActionStarted,
  trackActionCompleted,
  trackError,
  bytesToMb,
} from "@/lib/analytics";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type UploadedFile = {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
};

type FileResult = {
  original: UploadedFile;
  result: ResizeResult;
  downloadUrl: string;
  downloadName: string;
};

type ViewState = "idle" | "uploading" | "ready" | "processing" | "done";

const DEFAULT_SIZE_PRESETS = [
  { label: "1080 × 1080", w: 1080, h: 1080, title: "Instagram Post", mode: "fill" as const },
  { label: "1920 × 1080", w: 1920, h: 1080, title: "Full HD", mode: "fill" as const },
  { label: "1280 × 720", w: 1280, h: 720, title: "YouTube Thumbnail", mode: "fill" as const },
  { label: "800 × 800", w: 800, h: 800, title: "Square Image", mode: "fill" as const },
  { label: "300 × 300", w: 300, h: 300, title: "Avatar / Thumbnail", mode: "fit" as const },
] as const;

const PERCENT_PRESETS = [25, 50, 75] as const;

const ACCEPTED_FORMATS = "image/jpeg,image/png,image/webp";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildResizedName(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot === -1) return `${name}-resized`;
  return `${name.slice(0, dot)}-resized${name.slice(dot)}`;
}

async function readDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  const bmp = await createImageBitmap(file);
  const { width, height } = bmp;
  bmp.close();
  return { width, height };
}

function clampDim(v: number): number {
  return Math.max(1, Math.min(MAX_DIMENSION, Math.round(v)));
}

function pctChange(before: number, after: number): string {
  if (before === 0) return "0";
  const delta = ((after - before) / before) * 100;
  return delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type ResizeToolProps = {
  config: PageConfig;
};

function getDefaultPresetIndex(
  presets: readonly { isDefault?: boolean }[],
): number {
  const idx = presets.findIndex((p) => p.isDefault);
  return idx >= 0 ? idx : 0;
}

export function ResizeTool({ config }: ResizeToolProps) {
  const platformPresets = config.tool.resizePlatformPresets;
  const sizePresets = platformPresets ?? DEFAULT_SIZE_PRESETS;
  const defaultFitMode = (config.tool.defaultResizeMode ?? "fill") as ResizeFitMode;
  const isPlatformPage = !!platformPresets;
  const defaultPresetIdx = isPlatformPage
    ? getDefaultPresetIndex(platformPresets)
    : 0;
  const defaultPreset = isPlatformPage ? platformPresets[defaultPresetIdx] : null;

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [state, setState] = useState<ViewState>("idle");
  const [mode, setMode] = useState<ResizeMode>("pixels");
  const [width, setWidth] = useState(
    defaultPreset ? String(defaultPreset.w) : "",
  );
  const [height, setHeight] = useState(
    defaultPreset ? String(defaultPreset.h) : "",
  );
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(
    isPlatformPage ? defaultPresetIdx : null,
  );
  const [fitMode, setFitMode] = useState<ResizeFitMode>(
    defaultPreset?.mode ?? defaultFitMode,
  );
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [dontEnlarge, setDontEnlarge] = useState(true);
  const [percentage, setPercentage] = useState(50);
  const [customPct, setCustomPct] = useState("");
  const [results, setResults] = useState<FileResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const zipBusyRef = useRef(false);

  const firstFile = files[0] ?? null;
  const aspectRatio = firstFile ? firstFile.width / firstFile.height : 1;

  const evtBase = useMemo(
    () => ({
      tool: config.tool.kind,
      page_slug: config.slug,
    }),
    [config.tool.kind, config.slug],
  );

  const byteLabels = useMemo(
    () => config.results.labels,
    [config.results.labels],
  );

  const targetW = mode === "pixels" ? Number(width) || 0 : 0;
  const targetH = mode === "pixels" ? Number(height) || 0 : 0;
  const showSmallImageWarning =
    firstFile &&
    targetW > 0 &&
    targetH > 0 &&
    (firstFile.width < targetW || firstFile.height < targetH);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      for (const f of files) URL.revokeObjectURL(f.previewUrl);
      for (const r of results) URL.revokeObjectURL(r.downloadUrl);
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
          trackError({
            ...evtBase,
            file_type: f.type,
            error_message: `Unsupported format: ${f.name}. Use JPG, PNG, or WebP.`,
          });
          setError(`Unsupported format: ${f.name}. Use JPG, PNG, or WebP.`);
          continue;
        }
        if (f.size > MAX_FILE_SIZE) {
          trackError({
            ...evtBase,
            file_type: f.type,
            file_size_mb: bytesToMb(f.size),
            error_message: `File too large: ${f.name}. Maximum size is 10 MB.`,
          });
          setError(`File too large: ${f.name}. Maximum size is 10 MB.`);
          continue;
        }
        valid.push(f);
      }

      const remaining = MAX_FILES - files.length;
      const toAdd = valid.slice(0, remaining);
      if (valid.length > remaining) {
        trackError({
          ...evtBase,
          file_count: valid.length,
          error_message: `Maximum ${MAX_FILES} files allowed. Some files were skipped.`,
        });
        setError(`Maximum ${MAX_FILES} files allowed. Some files were skipped.`);
      }

      if (toAdd.length === 0) return;

      setState("uploading");
      const loaded: UploadedFile[] = [];

      for (const f of toAdd) {
        const dims = await readDimensions(f);
        loaded.push({
          file: f,
          previewUrl: URL.createObjectURL(f),
          width: dims.width,
          height: dims.height,
        });
      }

      setFiles((prev) => {
        const next = [...prev, ...loaded];
        const primary = loaded[0];
        trackFileUploaded({
          ...evtBase,
          file_type: primary?.file.type,
          file_size_mb: primary ? bytesToMb(primary.file.size) : 0,
          file_count: next.length,
        });
        return next;
      });
      setState("ready");
    },
    [files.length, evtBase],
  );

  const removeFile = useCallback(
    (index: number) => {
      setFiles((prev) => {
        const copy = [...prev];
        const [removed] = copy.splice(index, 1);
        URL.revokeObjectURL(removed.previewUrl);
        if (copy.length === 0) setState("idle");
        return copy;
      });
      // Clear results when files change
      for (const r of results) URL.revokeObjectURL(r.downloadUrl);
      setResults([]);
      setError(null);
    },
    [results],
  );

  const clearAll = useCallback(() => {
    for (const f of files) URL.revokeObjectURL(f.previewUrl);
    for (const r of results) URL.revokeObjectURL(r.downloadUrl);
    setFiles([]);
    setResults([]);
    setState("idle");
    setError(null);
    if (isPlatformPage && defaultPreset) {
      setWidth(String(defaultPreset.w));
      setHeight(String(defaultPreset.h));
      setFitMode(defaultPreset.mode);
      setSelectedPresetIndex(defaultPresetIdx);
    } else {
      setWidth("");
      setHeight("");
      setSelectedPresetIndex(null);
    }
    setCustomPct("");
    if (inputRef.current) inputRef.current.value = "";
  }, [files, results, isPlatformPage, defaultPreset, defaultPresetIdx]);

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

  // ---- Aspect-ratio-linked inputs ----

  const onWidthChange = (val: string) => {
    if (isPlatformPage) setSelectedPresetIndex(null);
    setWidth(val);
    if (maintainAspect && firstFile && val) {
      const w = Number(val);
      if (w > 0) setHeight(String(clampDim(w / aspectRatio)));
    }
  };

  const onHeightChange = (val: string) => {
    if (isPlatformPage) setSelectedPresetIndex(null);
    setHeight(val);
    if (maintainAspect && firstFile && val) {
      const h = Number(val);
      if (h > 0) setWidth(String(clampDim(h * aspectRatio)));
    }
  };

  const applyPreset = (
    w: number,
    h: number,
    presetMode?: ResizeFitMode,
    presetIndex?: number,
  ) => {
    setMode("pixels");
    setWidth(String(w));
    setHeight(String(h));
    setMaintainAspect(false);
    if (presetMode) setFitMode(presetMode);
    if (isPlatformPage && presetIndex !== undefined) {
      setSelectedPresetIndex(presetIndex);
    } else if (isPlatformPage && presetIndex === undefined) {
      setSelectedPresetIndex(null);
    }
  };

  const applyPctPreset = (pct: number) => {
    setPercentage(pct);
    setCustomPct("");
  };

  const onCustomPctChange = (val: string) => {
    setCustomPct(val);
    const n = Number(val);
    if (n > 0 && n <= 1000) setPercentage(n);
  };

  const onModeSwitch = (next: ResizeMode) => {
    setMode(next);
    trackEvent("change_resize_mode", { mode: next });
  };

  // ---- Resize ----

  const computeTargetDims = useCallback(
    (
      f: UploadedFile,
    ): { targetWidth: number; targetHeight: number } | null => {
      if (mode === "percentage") {
        const scale = percentage / 100;
        let tw = clampDim(f.width * scale);
        let th = clampDim(f.height * scale);
        if (dontEnlarge) {
          tw = Math.min(tw, f.width);
          th = Math.min(th, f.height);
        }
        return { targetWidth: tw, targetHeight: th };
      }

      // Pixels mode
      const w = Number(width);
      const h = Number(height);
      if (!w && !h) return null;

      // When preset selected on platform page: use exact dimensions (no dontEnlarge)
      const useExactFromPreset =
        isPlatformPage && selectedPresetIndex !== null;
      if (useExactFromPreset && w > 0 && h > 0) {
        return {
          targetWidth: clampDim(w),
          targetHeight: clampDim(h),
        };
      }

      let tw: number;
      let th: number;

      if (w && !h) {
        tw = clampDim(w);
        th = clampDim(tw / (f.width / f.height));
      } else if (!w && h) {
        th = clampDim(h);
        tw = clampDim(th * (f.width / f.height));
      } else if (maintainAspect) {
        tw = clampDim(w);
        th = clampDim(tw / (f.width / f.height));
      } else {
        tw = clampDim(w);
        th = clampDim(h);
      }

      if (dontEnlarge) {
        tw = Math.min(tw, f.width);
        th = Math.min(th, f.height);
        if (maintainAspect && tw < clampDim(w)) {
          th = clampDim(tw / (f.width / f.height));
        }
      }

      return { targetWidth: tw, targetHeight: th };
    },
    [
      mode,
      percentage,
      width,
      height,
      maintainAspect,
      dontEnlarge,
      isPlatformPage,
      selectedPresetIndex,
    ],
  );

  const canResize = useMemo(() => {
    if (files.length === 0) return false;
    if (mode === "pixels") {
      const w = Number(width);
      const h = Number(height);
      return w > 0 || h > 0;
    }
    return percentage > 0;
  }, [files.length, mode, width, height, percentage]);

  const onResize = async () => {
    if (!canResize || isProcessing) return;

    trackActionStarted({
      ...evtBase,
      file_type: firstFile?.file.type,
      file_size_mb: firstFile ? bytesToMb(firstFile.file.size) : 0,
      file_count: files.length,
    });
    setError(null);
    setState("processing");
    setProgress(0);

    const startedAt = performance.now();

    // Cleanup previous results
    for (const r of results) URL.revokeObjectURL(r.downloadUrl);

    const newResults: FileResult[] = [];
    let failCount = 0;
    let totalOutputBytes = 0;

    for (let i = 0; i < files.length; i++) {
      const uf = files[i];
      const dims = computeTargetDims(uf);

      if (!dims) {
        failCount++;
        continue;
      }

      try {
        const res = await resizeImage(uf.file, {
          targetWidth: dims.targetWidth,
          targetHeight: dims.targetHeight,
          fitMode,
        });

        newResults.push({
          original: uf,
          result: res,
          downloadUrl: URL.createObjectURL(res.outputBlob),
          downloadName: buildResizedName(uf.file.name),
        });
        totalOutputBytes += res.outputBlob.size;
      } catch (err) {
        failCount++;
        const msg = err instanceof Error ? err.message : "Failed to resize an image.";
        setError(msg);
        trackError({
          ...evtBase,
          file_type: uf.file.type,
          file_size_mb: bytesToMb(uf.file.size),
          error_message: msg,
        });
      }

      setProgress(i + 1);
    }

    const elapsedMs = Math.round(performance.now() - startedAt);

    trackActionCompleted({
      ...evtBase,
      file_type: firstFile?.file.type,
      file_size_mb: firstFile ? bytesToMb(firstFile.file.size) : 0,
      file_count: files.length,
      success_count: newResults.length,
      fail_count: failCount,
      elapsed_ms: elapsedMs,
      output_size_mb: bytesToMb(totalOutputBytes),
    });

    setResults(newResults);
    setState("done");
    if (failCount > 0 && newResults.length === 0) {
      setState("ready");
    }
  };

  // ---- Download all as ZIP ----

  const downloadAllZip = async () => {
    if (zipBusyRef.current) return;
    zipBusyRef.current = true;

    try {
      trackEvent("download_all", { file_count: results.length });
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      for (const r of results) {
        zip.file(r.downloadName, r.result.outputBlob);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resized-images.zip";
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

        {/* Dropzone (when no files) */}
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
              <svg
                fill="none"
                height="48"
                viewBox="0 0 48 48"
                width="48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  fill="#eff6ff"
                  height="32"
                  rx="4"
                  stroke="#93c5fd"
                  strokeWidth="2"
                  width="40"
                  x="4"
                  y="10"
                />
                <path
                  d="M16 34L22 26L26 31L30 25L34 34"
                  stroke="#3b82f6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <circle
                  cx="18"
                  cy="20"
                  fill="#3b82f6"
                  opacity="0.4"
                  r="3"
                />
                <path
                  d="M24 2V12M24 2L20 6M24 2L28 6"
                  stroke="#2563eb"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
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
              <span className="format-badge format-badge-muted">Max 10 MB</span>
            </div>
          </div>
        )}

        {/* File list + controls */}
        {files.length > 0 && (
          <div className="tool-flow">
            {/* Uploaded files */}
            <div className="resize-file-list">
              {files.map((uf, i) => (
                <div className="file-info-card" key={uf.previewUrl}>
                  <div className="file-info-left">
                    <img
                      alt=""
                      className="resize-preview"
                      src={uf.previewUrl}
                    />
                    <div className="file-info-text">
                      <span className="file-info-name" title={uf.file.name}>
                        {uf.file.name}
                      </span>
                      <span className="file-info-size">
                        {uf.width} × {uf.height} px &middot;{" "}
                        {formatBytes(uf.file.size, byteLabels)}
                      </span>
                    </div>
                  </div>
                  <button
                    aria-label="Remove file"
                    className="file-remove-btn"
                    disabled={isProcessing}
                    onClick={() => removeFile(i)}
                    type="button"
                  >
                    &times;
                  </button>
                </div>
              ))}

              {files.length < MAX_FILES && (
                <button
                  className="resize-add-more"
                  disabled={isProcessing}
                  onClick={() => inputRef.current?.click()}
                  type="button"
                >
                  + Add more images
                </button>
              )}
            </div>

            {/* Mode tabs */}
            <div className="resize-tabs">
              <button
                className={`resize-tab${mode === "pixels" ? " resize-tab-active" : ""}`}
                disabled={isProcessing}
                onClick={() => onModeSwitch("pixels")}
                type="button"
              >
                Resize by Pixels
              </button>
              <button
                className={`resize-tab${mode === "percentage" ? " resize-tab-active" : ""}`}
                disabled={isProcessing}
                onClick={() => onModeSwitch("percentage")}
                type="button"
              >
                Resize by Percentage
              </button>
            </div>

            {/* Pixels mode */}
            {mode === "pixels" && (
              <div className="resize-controls">
                {isPlatformPage ? (
                  <>
                    {/* Platform: presets first */}
                    <div className="resize-presets">
                      <span className="resize-presets-label">
                        Choose preset:
                      </span>
                      <div className="resize-presets-row">
                        {sizePresets.map((p, idx) => (
                          <button
                            className={`resize-preset-btn${selectedPresetIndex === idx ? " resize-preset-btn-active" : ""}`}
                            disabled={isProcessing}
                            key={p.label}
                            onClick={() =>
                              applyPreset(
                                p.w,
                                p.h,
                                "mode" in p ? p.mode : undefined,
                                idx,
                              )
                            }
                            title={"title" in p ? p.title : undefined}
                            type="button"
                          >
                            {p.label}
                          </button>
                        ))}
                        <button
                          className={`resize-preset-btn resize-preset-custom${selectedPresetIndex === null ? " resize-preset-btn-active" : ""}`}
                          disabled={isProcessing}
                          onClick={() => setSelectedPresetIndex(null)}
                          title="Enter custom width and height"
                          type="button"
                        >
                          Custom
                        </button>
                      </div>
                    </div>

                    {/* Custom size inputs */}
                    <div className="resize-custom-section">
                      <span className="resize-presets-label">
                        Or enter custom size:
                      </span>
                      <div className="resize-input-row">
                        <div className="resize-input-group">
                          <label className="resize-label" htmlFor="resize-w">
                            Width (px)
                          </label>
                          <input
                            className="resize-input"
                            disabled={isProcessing}
                            id="resize-w"
                            inputMode="numeric"
                            max={MAX_DIMENSION}
                            min={1}
                            onChange={(e) =>
                              onWidthChange(e.target.value)
                            }
                            placeholder={firstFile ? String(firstFile.width) : ""}
                            type="number"
                            value={width}
                          />
                        </div>
                        <span className="resize-x" aria-hidden="true">
                          ×
                        </span>
                        <div className="resize-input-group">
                          <label className="resize-label" htmlFor="resize-h">
                            Height (px)
                          </label>
                          <input
                            className="resize-input"
                            disabled={isProcessing}
                            id="resize-h"
                            inputMode="numeric"
                            max={MAX_DIMENSION}
                            min={1}
                            onChange={(e) =>
                              onHeightChange(e.target.value)
                            }
                            placeholder={
                              firstFile ? String(firstFile.height) : ""
                            }
                            type="number"
                            value={height}
                          />
                        </div>
                      </div>

                      {/* Checkboxes only when custom (no preset selected) */}
                      {selectedPresetIndex === null && (
                        <div className="resize-checkbox-group">
                          <label className="resize-checkbox-label">
                            <input
                              checked={maintainAspect}
                              disabled={isProcessing}
                              onChange={(e) =>
                                setMaintainAspect(e.target.checked)
                              }
                              type="checkbox"
                            />
                            Maintain aspect ratio
                          </label>
                          <label className="resize-checkbox-label">
                            <input
                              checked={dontEnlarge}
                              disabled={isProcessing}
                              onChange={(e) =>
                                setDontEnlarge(e.target.checked)
                              }
                              type="checkbox"
                            />
                            Do not enlarge if smaller
                          </label>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Non-platform: original layout */}
                    <div className="resize-input-row">
                      <div className="resize-input-group">
                        <label className="resize-label" htmlFor="resize-w">
                          Width (px)
                        </label>
                        <input
                          className="resize-input"
                          disabled={isProcessing}
                          id="resize-w"
                          inputMode="numeric"
                          max={MAX_DIMENSION}
                          min={1}
                          onChange={(e) => onWidthChange(e.target.value)}
                          placeholder={firstFile ? String(firstFile.width) : ""}
                          type="number"
                          value={width}
                        />
                      </div>
                      <span className="resize-x" aria-hidden="true">
                        ×
                      </span>
                      <div className="resize-input-group">
                        <label className="resize-label" htmlFor="resize-h">
                          Height (px)
                        </label>
                        <input
                          className="resize-input"
                          disabled={isProcessing}
                          id="resize-h"
                          inputMode="numeric"
                          max={MAX_DIMENSION}
                          min={1}
                          onChange={(e) => onHeightChange(e.target.value)}
                          placeholder={
                            firstFile ? String(firstFile.height) : ""
                          }
                          type="number"
                          value={height}
                        />
                      </div>
                    </div>

                    <div className="resize-checkbox-group">
                      <label className="resize-checkbox-label">
                        <input
                          checked={maintainAspect}
                          disabled={isProcessing}
                          onChange={(e) =>
                            setMaintainAspect(e.target.checked)
                          }
                          type="checkbox"
                        />
                        Maintain aspect ratio
                      </label>
                      <label className="resize-checkbox-label">
                        <input
                          checked={dontEnlarge}
                          disabled={isProcessing}
                          onChange={(e) =>
                            setDontEnlarge(e.target.checked)
                          }
                          type="checkbox"
                        />
                        Do not enlarge if smaller
                      </label>
                    </div>

                    <div className="resize-presets">
                      <span className="resize-presets-label">
                        Common sizes:
                      </span>
                      <div className="resize-presets-row">
                        {sizePresets.map((p) => (
                          <button
                            className="resize-preset-btn"
                            disabled={isProcessing}
                            key={p.label}
                            onClick={() =>
                              applyPreset(
                                p.w,
                                p.h,
                                "mode" in p ? p.mode : undefined,
                              )
                            }
                            title={"title" in p ? p.title : undefined}
                            type="button"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {showSmallImageWarning && (
                  <p className="resize-warning" role="alert">
                    Your image is smaller than the target size. Upscaling may
                    reduce quality. Consider using a higher-resolution source
                    image.
                  </p>
                )}
              </div>
            )}

            {/* Percentage mode */}
            {mode === "percentage" && (
              <div className="resize-controls">
                <div className="resize-pct-row">
                  {PERCENT_PRESETS.map((p) => (
                    <button
                      className={`resize-pct-btn${percentage === p && !customPct ? " resize-pct-btn-active" : ""}`}
                      disabled={isProcessing}
                      key={p}
                      onClick={() => applyPctPreset(p)}
                      type="button"
                    >
                      {p}%
                    </button>
                  ))}
                  <div className="resize-pct-custom">
                    <input
                      className="resize-input resize-input-sm"
                      disabled={isProcessing}
                      inputMode="numeric"
                      max={1000}
                      min={1}
                      onChange={(e) => onCustomPctChange(e.target.value)}
                      placeholder="Custom %"
                      type="number"
                      value={customPct}
                    />
                  </div>
                </div>
                <p className="resize-pct-hint">
                  {firstFile &&
                    `Preview: ${clampDim(firstFile.width * percentage / 100)} × ${clampDim(firstFile.height * percentage / 100)} px`}
                </p>
                {files.length > 1 && (
                  <p className="resize-pct-hint">
                    Preview is based on the first image
                  </p>
                )}

                <div className="resize-checkbox-group">
                  <label className="resize-checkbox-label">
                    <input
                      checked={dontEnlarge}
                      disabled={isProcessing}
                      onChange={(e) => setDontEnlarge(e.target.checked)}
                      type="checkbox"
                    />
                    Do not enlarge if smaller
                  </label>
                </div>
              </div>
            )}

            {/* Resize button */}
            <button
              className="btn btn-compress"
              disabled={!canResize || isProcessing}
              onClick={onResize}
              type="button"
            >
              {isProcessing ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Resizing… ({progress}/{files.length})
                </>
              ) : (
                "Resize now"
              )}
            </button>
            {!isProcessing && (
              <p className="resize-btn-hint">
                Resize images instantly — download results below
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

      {/* Results */}
      {results.length > 0 ? (
        <section className="card results-card results-appear">
          <h2 className="section-title">Results</h2>

          <div className="resize-results-list">
            {results.map((r) => (
              <div className="resize-result-item" key={r.downloadUrl}>
                <img
                  alt=""
                  className="resize-preview"
                  src={r.original.previewUrl}
                />
                <div className="resize-result-info">
                  <span className="file-info-name" title={r.original.file.name}>
                    {r.original.file.name}
                  </span>
                  <div className="resize-result-dims">
                    <span>
                      {r.result.inputWidth} × {r.result.inputHeight}
                    </span>
                    <span className="resize-arrow" aria-hidden="true">
                      →
                    </span>
                    <span className="resize-result-new-dims">
                      {r.result.outputWidth} × {r.result.outputHeight}
                    </span>
                  </div>
                  <div className="resize-result-sizes">
                    <span>{formatBytes(r.result.inputBytes, byteLabels)}</span>
                    <span className="resize-arrow" aria-hidden="true">
                      →
                    </span>
                    <span>{formatBytes(r.result.outputBytes, byteLabels)}</span>
                    <span className="resize-result-pct">
                      ({pctChange(r.result.inputBytes, r.result.outputBytes)}%)
                    </span>
                  </div>
                </div>
                <a
                  className="btn btn-download resize-dl-btn"
                  download={r.downloadName}
                  href={r.downloadUrl}
                  onClick={() =>
                    trackEvent("download_single", {
                      file_name: r.downloadName,
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
            Resize more images (free)
          </button>
        </section>
      ) : (
        state !== "processing" && (
          <section className="card results-empty">
            <h2 className="section-title">Results</h2>
            <p className="body-text">
              Upload images and set dimensions to see your resized files here.
            </p>
          </section>
        )
      )}
    </>
  );
}
