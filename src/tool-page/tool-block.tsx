"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  compress,
  DEFAULT_PRESET,
  LIMITS,
  type SupportedFormat,
  type CompressionPresetId,
} from "@/compression";
import type { ToolExecutionResult, PageConfig } from "@/tool-page/types";
import type { ToolKind } from "@/core/types";
import { formatBytes, buildOutputName } from "@/lib/format";
import {
  trackFileUploaded,
  trackProcessingStarted,
  trackProcessingCompleted,
  trackErrorShown,
  bytesToMb,
} from "@/lib/analytics";

type ViewState = "idle" | "compressing" | "ready";

type ToolBlockProps = {
  config: PageConfig["tool"];
  toolKind: ToolKind;
  byteLabels: Pick<
    PageConfig["results"]["labels"],
    "byteUnit" | "kilobyteUnit" | "megabyteUnit"
  >;
  onResult: (result: ToolExecutionResult | null) => void;
};

const PRESET_HELP: Record<CompressionPresetId, string> = {
  fast: "Smaller size, lower quality",
  balanced: "Recommended for most images",
  max: "Strongest compression",
};

const RECOMMENDED_PRESET: CompressionPresetId = "balanced";

export function ToolBlock({ config, toolKind, byteLabels, onResult }: ToolBlockProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<CompressionPresetId>(DEFAULT_PRESET);
  const [state, setState] = useState<ViewState>("idle");
  const [result, setResult] = useState<ToolExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const disableCompress = !file || state === "compressing";
  const accept = config.acceptedFormats.join(",");
  const presets = useMemo(() => config.presets, [config.presets]);
  const selectedPresetHelp = PRESET_HELP[preset];
  const formatBadges = useMemo(
    () => config.acceptedFormats.map(formatToDisplayLabel),
    [config.acceptedFormats]
  );

  useEffect(() => {
    return () => {
      if (result?.downloadUrl) {
        URL.revokeObjectURL(result.downloadUrl);
      }
    };
  }, [result]);

  useEffect(() => {
    onResult(result);
  }, [onResult, result]);

  const resetResult = () => {
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
    setResult(null);
    setState("idle");
    setError(null);
  };

  const onFileChange = (next: File | null) => {
    resetResult();

    if (!next) {
      setFile(null);
      return;
    }

    const evtBase = { tool: toolKind, file_type: next.type, file_size_mb: bytesToMb(next.size) };

    if (next.size > LIMITS.maxFileSizeBytes) {
      setError(config.messages.fileTooLarge);
      trackErrorShown({ ...evtBase, error_message: config.messages.fileTooLarge });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (next.size > LIMITS.maxTotalSizeBytes) {
      setError(config.messages.totalLimitExceeded);
      trackErrorShown({ ...evtBase, error_message: config.messages.totalLimitExceeded });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setError(null);
    setFile(next);
    trackFileUploaded(evtBase);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const clearSelectedFile = () => {
    resetResult();
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    const droppedFile = e.dataTransfer.files[0] ?? null;
    if (droppedFile) {
      onFileChange(droppedFile);
    }
  };

  const onCompress = async () => {
    if (!file) {
      setError(config.messages.noFileSelected);
      return;
    }

    const evtBase = { tool: toolKind, file_type: file.type, file_size_mb: bytesToMb(file.size) };

    setError(null);
    setState("compressing");
    trackProcessingStarted({ ...evtBase, preset });

    try {
      const isImageTool =
        config.kind === "image-compress" ||
        config.kind === "image-resize" ||
        config.kind === "image-convert";

      if (config.mode === "stub" && !isImageTool) {
        const ratio = config.stubResult?.ratio ?? 0.65;
        const elapsedMs = config.stubResult?.elapsedMs ?? 140;
        const outputBytes = Math.max(1, Math.round(file.size * ratio));
        const url = URL.createObjectURL(file);

        setResult({
          stats: { inputBytes: file.size, outputBytes, ratio, elapsedMs },
          downloadUrl: url,
          downloadName: buildOutputName(file.name, config.outputNameSuffix),
          preset: "stub",
        });
        setState("ready");
        trackProcessingCompleted({
          ...evtBase,
          preset: "stub",
          output_size_mb: bytesToMb(outputBytes),
          compression_ratio: Math.round(ratio * 100),
          elapsed_ms: elapsedMs,
        });
        return;
      }

      const compressionResult = await compress(file, {
        preset,
        targetBytes: config.targetBytes,
        keepFormat: true,
      });

      const nextUrl = URL.createObjectURL(compressionResult.outputBlob);
      setResult({
        stats: compressionResult.stats,
        downloadUrl: nextUrl,
        downloadName: buildOutputName(file.name, config.outputNameSuffix),
        preset,
      });
      setState("ready");
      trackProcessingCompleted({
        ...evtBase,
        preset,
        output_size_mb: bytesToMb(compressionResult.stats.outputBytes),
        compression_ratio: Math.round(compressionResult.stats.ratio * 100),
        elapsed_ms: compressionResult.stats.elapsedMs,
      });
    } catch (compressionError) {
      const msg =
        compressionError instanceof Error
          ? compressionError.message
          : config.messages.compressionFailed;
      setError(msg);
      trackErrorShown({ ...evtBase, error_message: msg });
      setState("idle");
    }
  };

  return (
    <section className="card tool-card">
      <h2 className="section-title">{config.title}</h2>
      <p className="body-text tool-subtitle">{config.subtitle}</p>

      <input
        accept={accept}
        className="visually-hidden-file-input"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        ref={fileInputRef}
        type="file"
      />

      {!file ? (
        <div
          className={`dropzone${dragOver ? " dropzone-active" : ""}`}
          onClick={openFilePicker}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openFilePicker();
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
          <span className="dropzone-label">Choose image</span>
          <span className="dropzone-hint">or drag and drop</span>
          <div className="dropzone-badges">
            {formatBadges.map((label) => (
              <span className="format-badge" key={label}>
                {label}
              </span>
            ))}
            <span className="format-badge format-badge-muted">
              Max 10 MB
            </span>
          </div>
        </div>
      ) : (
        <div className="tool-flow">
          <div className="file-info-card">
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
                <span className="file-info-name" title={file.name}>
                  {file.name}
                </span>
                <span className="file-info-size">
                  {formatBytes(file.size, byteLabels)}
                </span>
              </div>
            </div>
            <button
              aria-label="Remove selected file"
              className="file-remove-btn"
              onClick={clearSelectedFile}
              type="button"
            >
              &times;
            </button>
          </div>

          <div className="preset-row">
            <label className="preset-label" htmlFor="tool-preset-select">
              Preset
            </label>
            <select
              className="preset-select"
              id="tool-preset-select"
              onChange={(event) =>
                setPreset(event.target.value as CompressionPresetId)
              }
              value={preset}
            >
              {presets.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
            <p className="preset-description">
              {selectedPresetHelp}
              {preset === RECOMMENDED_PRESET && (
                <span className="preset-recommended-badge">Recommended</span>
              )}
            </p>
          </div>

          <button
            className="btn btn-compress"
            disabled={disableCompress}
            onClick={onCompress}
            type="button"
          >
            {state === "compressing" ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Compressing…
              </>
            ) : (
              "Compress image"
            )}
          </button>
        </div>
      )}

      <p className="tool-trust-note">
        Your images are processed locally in your browser. Nothing is uploaded.
      </p>

      {state === "compressing" && (
        <p aria-live="polite" className="processing-status" role="status">
          Processing locally in your browser…
        </p>
      )}

      {config.mode === "stub" && (
        <p className="muted stub-notice">{config.messages.stubModeNotice}</p>
      )}

      {error && <p className="error-message">{error}</p>}
    </section>
  );
}

function formatToDisplayLabel(format: SupportedFormat): string {
  if (format === "image/jpeg") return "JPG";
  if (format === "image/png") return "PNG";
  return "WebP";
}
