"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ALLOWED_CONVERSIONS,
  ACCEPTED_INPUT_MIMES,
  FORMAT_TO_MIME,
  detectFormatFromFile,
  formatLabel,
  buildConvertedName,
} from "@/core/config/conversions";
import { convertImage } from "@/conversion";
import { LIMITS } from "@/compression";
import { formatBytes } from "@/lib/format";
import {
  trackConvertImageFileUploaded,
  trackConvertImageToSelected,
  trackConvertImageStarted,
  trackConvertImageCompleted,
  trackEvent,
} from "@/lib/analytics";
import type { PageConfig } from "@/core/types";

const MAX_FILES = LIMITS.maxFiles;
const MAX_FILE_SIZE = LIMITS.maxFileSizeBytes;
const MAX_TOTAL_SIZE = LIMITS.maxTotalSizeBytes;

/** Sentinel value meaning "not yet determined". */
const AUTO = "auto";

type UploadedFile = { file: File; id: string };

type FileResult = {
  original: UploadedFile;
  outputBlob: Blob;
  downloadUrl: string;
  downloadName: string;
  inputBytes: number;
  outputBytes: number;
};

type ViewState = "idle" | "ready" | "converting" | "done";

type ConvertImageToolProps = {
  config: PageConfig;
};

/** Returns the `accept` attribute value for a single fixed input format. */
function getAcceptForFormat(fmt: string): string {
  if (fmt === "heic") return "image/heic,image/heif,.heic,.heif";
  return FORMAT_TO_MIME[fmt] ?? "image/*";
}

export function ConvertImageTool({ config }: ConvertImageToolProps) {
  const conversionPair = config.tool.conversionPair;
  const isPairMode = !!conversionPair;

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [fromFormat, setFromFormat] = useState<string>(
    conversionPair ? conversionPair.from : AUTO,
  );
  const [toFormat, setToFormat] = useState<string>(
    conversionPair ? conversionPair.to : "",
  );
  const [state, setState] = useState<ViewState>("idle");
  const [results, setResults] = useState<FileResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const zipBusyRef = useRef(false);
  const byteLabels = config.results.labels;

  // In pair mode, restrict the file input to the expected input format only
  const fileAccept = isPairMode
    ? getAcceptForFormat(conversionPair!.from)
    : ACCEPTED_INPUT_MIMES;

  const toOptions: readonly string[] = useMemo(
    () =>
      fromFormat !== AUTO && ALLOWED_CONVERSIONS[fromFormat]
        ? ALLOWED_CONVERSIONS[fromFormat]
        : [],
    [fromFormat],
  );

  // Reset toFormat when the fromFormat changes and current selection is no longer valid
  useEffect(() => {
    if (toFormat && toOptions.length > 0 && !toOptions.includes(toFormat)) {
      setToFormat(toOptions[0]);
    }
  }, [toOptions, toFormat]);

  // Revoke all blob URLs on unmount
  useEffect(() => {
    return () => {
      for (const r of results) URL.revokeObjectURL(r.downloadUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSize = files.reduce((s, f) => s + f.file.size, 0);
  const isConverting = state === "converting";
  const canConvert =
    files.length > 0 &&
    fromFormat !== AUTO &&
    !!toFormat &&
    !!ALLOWED_CONVERSIONS[fromFormat]?.includes(toFormat) &&
    !isConverting;

  const clearResults = useCallback(() => {
    for (const r of results) URL.revokeObjectURL(r.downloadUrl);
    setResults([]);
  }, [results]);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      setError(null);
      const arr = Array.from(incoming);
      const valid: File[] = [];

      for (const f of arr) {
        if (f.size > MAX_FILE_SIZE) {
          setError(`File too large: ${f.name}. Maximum 10 MB per file.`);
          continue;
        }
        valid.push(f);
      }

      const remaining = MAX_FILES - files.length;
      const toAdd = valid.slice(0, remaining);
      if (valid.length > remaining) {
        setError(`Maximum ${MAX_FILES} files allowed. Some files were skipped.`);
      }

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

      // Auto-detect fromFormat from the first uploaded file if still "auto"
      let detectedFrom = fromFormat;
      if (fromFormat === AUTO) {
        const detected = detectFormatFromFile(filtered[0]);
        if (detected) {
          detectedFrom = detected;
          setFromFormat(detected);
          const opts = ALLOWED_CONVERSIONS[detected] ?? [];
          if (opts.length > 0) {
            setToFormat((prev) => (opts.includes(prev) ? prev : opts[0]));
          }
        }
      }

      setFiles((prev) => {
        const next = [...prev, ...loaded];
        trackConvertImageFileUploaded({
          from_format: detectedFrom === AUTO ? "unknown" : detectedFrom,
          file_count: next.length,
        });
        return next;
      });

      clearResults();
      setState("ready");
    },
    [files, fromFormat, clearResults],
  );

  const removeFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const next = prev.filter((f) => f.id !== id);
        if (next.length === 0) {
          setState("idle");
          if (!isPairMode) {
            setFromFormat(AUTO);
            setToFormat("");
          }
        }
        return next;
      });
      clearResults();
      setError(null);
    },
    [clearResults, isPairMode],
  );

  const clearAll = useCallback(() => {
    clearResults();
    setFiles([]);
    setState("idle");
    if (!isPairMode) {
      setFromFormat(AUTO);
      setToFormat("");
    }
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [clearResults, isPairMode]);

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFromFormat(val);
    if (val !== AUTO) {
      const opts = ALLOWED_CONVERSIONS[val] ?? [];
      setToFormat((prev) => (opts.includes(prev) ? prev : (opts[0] ?? "")));
    } else {
      setToFormat("");
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setToFormat(val);
    if (fromFormat !== AUTO && val) {
      trackConvertImageToSelected({ from_format: fromFormat, to_format: val });
    }
  };

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

  const onConvert = async () => {
    if (!canConvert) return;

    trackConvertImageStarted({
      from_format: fromFormat,
      to_format: toFormat,
      file_count: files.length,
    });

    setError(null);
    setState("converting");
    setProgress(0);
    clearResults();

    const newResults: FileResult[] = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const uf = files[i];
      try {
        const cr = await convertImage(uf.file, { toFormat });
        const downloadUrl = URL.createObjectURL(cr.outputBlob);
        newResults.push({
          original: uf,
          outputBlob: cr.outputBlob,
          downloadUrl,
          downloadName: buildConvertedName(uf.file.name, toFormat),
          inputBytes: cr.inputBytes,
          outputBytes: cr.outputBytes,
        });
        successCount++;
      } catch (err) {
        failCount++;
        setError(
          err instanceof Error
            ? err.message
            : `Failed to convert ${uf.file.name}.`,
        );
      }
      setProgress(i + 1);
    }

    setResults(newResults);
    setState(newResults.length > 0 ? "done" : "ready");

    trackConvertImageCompleted({
      from_format: fromFormat,
      to_format: toFormat,
      file_count: files.length,
      success_count: successCount,
      fail_count: failCount,
    });
  };

  const downloadAllZip = async () => {
    if (zipBusyRef.current || results.length < 2) return;
    zipBusyRef.current = true;
    try {
      trackEvent("convert_image_download_all_zip", { file_count: results.length });
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const r of results) {
        zip.file(r.downloadName, r.outputBlob);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted-to-${toFormat}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      zipBusyRef.current = false;
    }
  };

  return (
    <>
      <section className="card tool-card">
        <h2 className="section-title">{config.tool.title}</h2>
        <p className="body-text tool-subtitle">{config.tool.subtitle}</p>

        {/* Format selectors — hidden in pair mode (formats are fixed) */}
        {!isPairMode && (
          <div className="convert-format-row">
            <div className="convert-format-group">
              <label className="preset-label" htmlFor="from-format-select">
                From
              </label>
              <select
                className="preset-select"
                disabled={isConverting}
                id="from-format-select"
                onChange={handleFromChange}
                value={fromFormat}
              >
                <option value={AUTO}>Auto-detect</option>
                {Object.keys(ALLOWED_CONVERSIONS).map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {formatLabel(fmt)}
                  </option>
                ))}
              </select>
            </div>

            <span aria-hidden="true" className="convert-arrow">
              →
            </span>

            <div className="convert-format-group">
              <label className="preset-label" htmlFor="to-format-select">
                To
              </label>
              <select
                className="preset-select"
                disabled={isConverting || toOptions.length === 0}
                id="to-format-select"
                onChange={handleToChange}
                value={toFormat}
              >
                {toOptions.length === 0 ? (
                  <option value="">Select input format or upload a file</option>
                ) : (
                  toOptions.map((fmt) => (
                    <option key={fmt} value={fmt}>
                      {formatLabel(fmt)}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        )}

        <input
          accept={fileAccept}
          className="visually-hidden-file-input"
          multiple
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
          }}
          ref={inputRef}
          type="file"
        />

        {files.length === 0 ? (
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
            <span className="dropzone-label">
              {isPairMode
                ? `Choose ${formatLabel(conversionPair!.from)} images`
                : "Choose images"}
            </span>
            <span className="dropzone-hint">or drag and drop</span>
            <div className="dropzone-badges">
              {isPairMode ? (
                <span className="format-badge">
                  {formatLabel(conversionPair!.from)}
                </span>
              ) : (
                <>
                  <span className="format-badge">JPG</span>
                  <span className="format-badge">PNG</span>
                  <span className="format-badge">WebP</span>
                  <span className="format-badge">AVIF</span>
                  <span className="format-badge">HEIC</span>
                </>
              )}
              <span className="format-badge format-badge-muted">
                Up to {MAX_FILES} files
              </span>
              <span className="format-badge format-badge-muted">
                Max 10 MB each
              </span>
            </div>
          </div>
        ) : (
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
                    disabled={isConverting}
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
                  disabled={isConverting}
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

            <button
              className="btn btn-compress"
              disabled={!canConvert}
              onClick={onConvert}
              type="button"
            >
              {isConverting ? (
                <>
                  <span aria-hidden="true" className="spinner" />
                  Converting… ({progress}/{files.length})
                </>
              ) : (
                `Convert ${files.length} image${files.length !== 1 ? "s" : ""}`
              )}
            </button>
          </div>
        )}

        <p className="tool-trust-note">
          Your images are processed locally in your browser. Nothing is
          uploaded.
        </p>

        {isConverting && (
          <p aria-live="polite" className="processing-status" role="status">
            Processing locally in your browser…
          </p>
        )}

        {error && <p className="error-message">{error}</p>}
      </section>

      {results.length > 0 && (
        <section className="card results-card results-appear">
          <h2 className="section-title">Results</h2>

          <div className="resize-results-list">
            {results.map((r) => (
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
                  <span
                    className="file-info-name"
                    title={r.original.file.name}
                  >
                    {r.original.file.name}
                  </span>
                  <div className="resize-result-sizes">
                    <span>{formatBytes(r.inputBytes, byteLabels)}</span>
                    <span aria-hidden="true" className="resize-arrow">
                      →
                    </span>
                    <span>{formatBytes(r.outputBytes, byteLabels)}</span>
                    <span className="format-badge">
                      {formatLabel(toFormat)}
                    </span>
                  </div>
                </div>
                <a
                  className="btn btn-download resize-dl-btn"
                  download={r.downloadName}
                  href={r.downloadUrl}
                  onClick={() =>
                    trackEvent("convert_image_download_single", {
                      to_format: toFormat,
                    })
                  }
                >
                  Download
                </a>
              </div>
            ))}
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
            Convert more images
          </button>
        </section>
      )}
    </>
  );
}
