"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  compress,
  DEFAULT_PRESET,
  LIMITS,
  type CompressionPresetId,
  type CompressResult,
} from "@/compression";
import type { PageConfig } from "@/core/types";
import { formatBytes, buildOutputName } from "@/lib/format";
import { trackEvent } from "@/lib/analytics";

const MAX_FILES = LIMITS.maxFiles;
const MAX_FILE_SIZE = LIMITS.maxFileSizeBytes;
const MAX_TOTAL_SIZE = LIMITS.maxTotalSizeBytes;
const ACCEPTED_FORMATS = "image/jpeg,image/png,image/webp";
const SUPPORTED_TYPES = new Set<string>(["image/jpeg", "image/png", "image/webp"]);

type UploadedFile = {
  file: File;
  id: string;
};

type FileResult = {
  original: UploadedFile;
  result: CompressResult;
  downloadUrl: string;
  downloadName: string;
};

type ViewState = "idle" | "ready" | "compressing" | "done";

const PRESET_HELP: Record<CompressionPresetId, string> = {
  fast: "Smaller size, lower quality",
  balanced: "Recommended for most images",
  max: "Strongest compression",
};

type BatchCompressToolProps = {
  config: PageConfig;
};

export function BatchCompressTool({ config }: BatchCompressToolProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [state, setState] = useState<ViewState>("idle");
  const [preset, setPreset] = useState<CompressionPresetId>(DEFAULT_PRESET);
  const [results, setResults] = useState<FileResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const zipBusyRef = useRef(false);

  const byteLabels = useMemo(() => config.results.labels, [config.results.labels]);
  const presetOptions = useMemo(
    () =>
      config.tool.presets.map((p) => ({
        id: p.id,
        label: p.label,
        help: PRESET_HELP[p.id],
      })),
    [config.tool.presets],
  );

  useEffect(() => {
    return () => {
      for (const r of results) URL.revokeObjectURL(r.downloadUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSize = useMemo(
    () => files.reduce((sum, f) => sum + f.file.size, 0),
    [files],
  );

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      setError(null);
      const arr = Array.from(incoming);
      const valid: File[] = [];

      for (const f of arr) {
        if (!SUPPORTED_TYPES.has(f.type)) {
          setError(`Unsupported format: ${f.name}. Use JPG, PNG, or WebP.`);
          continue;
        }
        if (f.size > MAX_FILE_SIZE) {
          setError(`File too large: ${f.name}. Maximum size is 10 MB per file.`);
          continue;
        }
        valid.push(f);
      }

      const remaining = MAX_FILES - files.length;
      const toAdd = valid.slice(0, remaining);
      if (valid.length > remaining) {
        setError(`Maximum ${MAX_FILES} files allowed. Some files were skipped.`);
      }

      if (toAdd.length === 0) return;

      const currentTotal = files.reduce((s, f) => s + f.file.size, 0);
      const filtered: File[] = [];
      let runningTotal = currentTotal;
      for (const f of toAdd) {
        if (runningTotal + f.size > MAX_TOTAL_SIZE) {
          setError("Total size limit (25 MB) exceeded. Some files were skipped.");
          break;
        }
        runningTotal += f.size;
        filtered.push(f);
      }

      if (filtered.length === 0) return;

      const loaded: UploadedFile[] = filtered.map((f) => ({
        file: f,
        id: crypto.randomUUID(),
      }));

      setFiles((prev) => {
        const next = [...prev, ...loaded];
        trackEvent("upload_image", { count: loaded.length, total: next.length });
        return next;
      });

      for (const r of results) URL.revokeObjectURL(r.downloadUrl);
      setResults([]);
      setState("ready");
    },
    [files, results],
  );

  const removeFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const next = prev.filter((f) => f.id !== id);
        if (next.length === 0) setState("idle");
        return next;
      });
      for (const r of results) URL.revokeObjectURL(r.downloadUrl);
      setResults([]);
      setError(null);
    },
    [results],
  );

  const clearAll = useCallback(() => {
    for (const r of results) URL.revokeObjectURL(r.downloadUrl);
    setFiles([]);
    setResults([]);
    setState("idle");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [results]);

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

  const onCompress = async () => {
    if (files.length === 0 || state === "compressing") return;

    trackEvent("click_batch_compress", { preset, file_count: files.length });
    setError(null);
    setState("compressing");
    setProgress(0);

    for (const r of results) URL.revokeObjectURL(r.downloadUrl);

    const newResults: FileResult[] = [];
    let hasErrors = false;

    for (let i = 0; i < files.length; i++) {
      const uf = files[i];
      try {
        const compressResult = await compress(uf.file, {
          preset,
          targetBytes: config.tool.targetBytes,
          keepFormat: true,
        });

        const downloadUrl = URL.createObjectURL(compressResult.outputBlob);
        newResults.push({
          original: uf,
          result: compressResult,
          downloadUrl,
          downloadName: buildOutputName(uf.file.name, config.tool.outputNameSuffix),
        });
      } catch (err) {
        hasErrors = true;
        setError(
          err instanceof Error ? err.message : `Failed to compress ${uf.file.name}.`,
        );
      }

      setProgress(i + 1);
    }

    setResults(newResults);
    setState("done");
    if (hasErrors && newResults.length === 0) {
      setState("ready");
    }
  };

  const downloadAllZip = async () => {
    if (zipBusyRef.current || results.length < 2) return;
    zipBusyRef.current = true;

    try {
      trackEvent("download_all_zip", { file_count: results.length });
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      for (const r of results) {
        zip.file(r.downloadName, r.result.outputBlob);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed-images.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      zipBusyRef.current = false;
    }
  };

  const isProcessing = state === "compressing";

  const totalInputBytes = results.reduce((s, r) => s + r.result.stats.inputBytes, 0);
  const totalOutputBytes = results.reduce((s, r) => s + r.result.stats.outputBytes, 0);
  const totalSavedBytes = Math.max(0, totalInputBytes - totalOutputBytes);
  const totalSavedPercent =
    totalInputBytes > 0 ? (totalSavedBytes / totalInputBytes) * 100 : 0;

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

        {files.length === 0 && (
          <div
            className={`dropzone${dragOver ? " dropzone-active" : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
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
                <circle cx="18" cy="20" fill="#3b82f6" opacity="0.4" r="3" />
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
              <span className="format-badge format-badge-muted">Max 10 MB each</span>
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="tool-flow">
            <div className="resize-file-list">
              {files.map((uf) => (
                <div className="file-info-card" key={uf.id}>
                  <div className="file-info-left">
                    <svg
                      className="file-info-icon"
                      fill="none"
                      height="20"
                      viewBox="0 0 20 20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        fill="#eff6ff"
                        height="16"
                        rx="3"
                        stroke="#3b82f6"
                        strokeWidth="1.5"
                        width="16"
                        x="2"
                        y="2"
                      />
                      <path
                        d="M6 14L9 10L11 12.5L13 9.5L15 14"
                        stroke="#3b82f6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <div className="file-info-text">
                      <span className="file-info-name" title={uf.file.name}>
                        {uf.file.name}
                      </span>
                      <span className="file-info-size">
                        {formatBytes(uf.file.size, byteLabels)}
                      </span>
                    </div>
                  </div>
                  <button
                    aria-label="Remove file"
                    className="file-remove-btn"
                    disabled={isProcessing}
                    onClick={() => removeFile(uf.id)}
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

            <p className="body-text" style={{ fontSize: "0.85rem", opacity: 0.7 }}>
              {files.length} file{files.length !== 1 ? "s" : ""} &middot;{" "}
              {formatBytes(totalSize, byteLabels)} total
            </p>

            <div className="preset-row">
              <label className="preset-label" htmlFor="batch-preset-select">
                Preset
              </label>
              <select
                className="preset-select"
                id="batch-preset-select"
                disabled={isProcessing}
                onChange={(e) => setPreset(e.target.value as CompressionPresetId)}
                value={preset}
              >
                {presetOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <p className="preset-description">
                {PRESET_HELP[preset]}
                {preset === "balanced" && (
                  <span className="preset-recommended-badge">Recommended</span>
                )}
              </p>
            </div>

            <button
              className="btn btn-compress"
              disabled={files.length === 0 || isProcessing}
              onClick={onCompress}
              type="button"
            >
              {isProcessing ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Compressing… ({progress}/{files.length})
                </>
              ) : (
                `Compress ${files.length} image${files.length !== 1 ? "s" : ""}`
              )}
            </button>
          </div>
        )}

        <p className="tool-trust-note">
          Your images are processed locally in your browser. Nothing is uploaded.
        </p>

        {error && <p className="error-message">{error}</p>}
      </section>

      {results.length > 0 ? (
        <section className="card results-card results-appear">
          <h2 className="section-title">Results</h2>

          {totalSavedBytes > 0 && (
            <>
              <div className="savings-banner">
                <span className="savings-percent">
                  {totalSavedPercent.toFixed(1)}%
                </span>
                <span className="savings-label">
                  smaller overall &mdash; saved{" "}
                  {formatBytes(totalSavedBytes, byteLabels)}
                </span>
              </div>

              <div
                aria-label={`Saved ${totalSavedPercent.toFixed(1)} percent`}
                className="savings-visual"
              >
                <div className="savings-track">
                  <span
                    className="savings-fill savings-fill-animate"
                    style={{
                      "--savings-width": `${Math.min(100, Math.max(0, totalSavedPercent))}%`,
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            </>
          )}

          <div className="resize-results-list">
            {results.map((r) => {
              const saved = Math.max(
                0,
                r.result.stats.inputBytes - r.result.stats.outputBytes,
              );
              const pct =
                r.result.stats.inputBytes > 0
                  ? (saved / r.result.stats.inputBytes) * 100
                  : 0;

              return (
                <div className="resize-result-item" key={r.original.id}>
                  <svg
                    className="file-info-icon"
                    fill="none"
                    height="20"
                    viewBox="0 0 20 20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      fill="#eff6ff"
                      height="16"
                      rx="3"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      width="16"
                      x="2"
                      y="2"
                    />
                    <path
                      d="M6 14L9 10L11 12.5L13 9.5L15 14"
                      stroke="#3b82f6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <div className="resize-result-info">
                    <span className="file-info-name" title={r.original.file.name}>
                      {r.original.file.name}
                    </span>
                    <div className="resize-result-sizes">
                      <span>
                        {formatBytes(r.result.stats.inputBytes, byteLabels)}
                      </span>
                      <span className="resize-arrow" aria-hidden="true">
                        →
                      </span>
                      <span>
                        {formatBytes(r.result.stats.outputBytes, byteLabels)}
                      </span>
                      {pct > 0 && (
                        <span className="resize-result-pct">
                          (-{pct.toFixed(1)}%)
                        </span>
                      )}
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
              );
            })}
          </div>

          {results.length >= 2 && (
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
            Compress more images
          </button>
        </section>
      ) : (
        state !== "compressing" && (
          <section className="card results-empty">
            <h2 className="section-title">Results</h2>
            <p className="body-text">{config.results.emptyState}</p>
          </section>
        )
      )}
    </>
  );
}
