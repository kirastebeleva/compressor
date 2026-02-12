"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  compress,
  DEFAULT_PRESET,
  LIMITS,
  type SupportedFormat,
  type CompressionPresetId,
} from "@/compression";
import type { ToolExecutionResult, ToolPageConfig } from "@/tool-page/types";

type ViewState = "idle" | "compressing" | "ready";

type ToolBlockProps = {
  config: ToolPageConfig["tool"];
  byteLabels: Pick<
    ToolPageConfig["results"]["labels"],
    "byteUnit" | "kilobyteUnit" | "megabyteUnit"
  >;
  onResult: (result: ToolExecutionResult | null) => void;
};

const PRESET_HELP_TEXT: Record<CompressionPresetId, string> = {
  fast: "Fast: best for quick uploads and light compression.",
  balanced: "Balanced: recommended for most images with good quality-size tradeoff.",
  max: "Max: strongest size reduction, may reduce visual quality.",
};

export function ToolBlock({ config, byteLabels, onResult }: ToolBlockProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<CompressionPresetId>(DEFAULT_PRESET);
  const [state, setState] = useState<ViewState>("idle");
  const [result, setResult] = useState<ToolExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const disableCompress = !file || state === "compressing";
  const accept = config.acceptedFormats.join(",");
  const presets = useMemo(() => config.presets, [config.presets]);
  const selectedPresetLabel =
    presets.find((entry) => entry.id === preset)?.label ?? preset;
  const selectedPresetHelp = PRESET_HELP_TEXT[preset];
  const supportedFormatsLabel = config.acceptedFormats
    .map((format) => formatToDisplayLabel(format))
    .join(", ");
  const compressActionLabel = file ? "Compress image" : "Compress now";

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

    if (next.size > LIMITS.maxFileSizeBytes) {
      setError(config.messages.fileTooLarge);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (next.size > LIMITS.maxTotalSizeBytes) {
      setError(config.messages.totalLimitExceeded);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setError(null);
    setFile(next);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const clearSelectedFile = () => {
    resetResult();
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onCompress = async () => {
    if (!file) {
      setError(config.messages.noFileSelected);
      return;
    }

    setError(null);
    setState("compressing");

    try {
      if (config.mode === "stub") {
        const ratio = config.stubResult?.ratio ?? 0.65;
        const elapsedMs = config.stubResult?.elapsedMs ?? 140;
        const outputBytes = Math.max(1, Math.round(file.size * ratio));
        const resultStats = {
          inputBytes: file.size,
          outputBytes,
          ratio,
          elapsedMs,
        };
        const url = URL.createObjectURL(file);

        setResult({
          stats: resultStats,
          downloadUrl: url,
          downloadName: buildOutputName(file.name, config.outputNameSuffix),
        });
        setState("ready");
        return;
      }

      const result = await compress(file, {
        preset,
        keepFormat: true,
      });

      const nextUrl = URL.createObjectURL(result.outputBlob);
      setResult({
        stats: result.stats,
        downloadUrl: nextUrl,
        downloadName: buildOutputName(file.name, config.outputNameSuffix),
      });
      setState("ready");
    } catch (compressionError) {
      setError(
        compressionError instanceof Error
          ? compressionError.message
          : config.messages.compressionFailed
      );
      setState("idle");
    }
  };

  return (
    <>
      <section className="card">
        <h2 className="section-title">{config.title}</h2>
        <p className="muted">{config.subtitle}</p>

        <div className="tool-action-area">
          <label className="control action-control">
            <input
              accept={accept}
              className="visually-hidden-file-input"
              onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
              ref={fileInputRef}
              type="file"
            />
            {file ? (
              <div className="file-chip">
                <span className="file-chip-name" title={file.name}>
                  {file.name} ({formatBytes(file.size, byteLabels)})
                </span>
                <button
                  aria-label="Remove selected file"
                  className="file-chip-remove"
                  onClick={clearSelectedFile}
                  type="button"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                className="btn btn-file-picker"
                onClick={openFilePicker}
                type="button"
              >
                Choose image
              </button>
            )}
          </label>

          <label className="control action-control">
            <select
              className="input-control"
              onChange={(event) => setPreset(event.target.value as CompressionPresetId)}
              value={preset}
            >
              {presets.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
            <p className="muted preset-help">{selectedPresetHelp}</p>
          </label>

          <div className="control action-control action-control-button">
            <button
              className="btn btn-download action-button"
              disabled={disableCompress}
              onClick={onCompress}
              type="button"
            >
              {state === "compressing"
                ? config.labels.compressingButton
                : compressActionLabel}
            </button>
          </div>
        </div>

        {state === "compressing" ? (
          <p aria-live="polite" className="processing-status" role="status">
            Processing image locally in your browser…
          </p>
        ) : null}

        <p className="muted">{config.limitsText}</p>
        <p className="muted supported-formats-text">
          Supported formats: <strong>{supportedFormatsLabel}</strong>
        </p>

        {file ? (
          <>
            <p className="muted">
              {config.labels.selectedPresetPrefix}: {selectedPresetLabel}
            </p>
          </>
        ) : null}

        {config.mode === "stub" ? (
          <p className="muted">{config.messages.stubModeNotice}</p>
        ) : null}

        {error ? <p className="error">{error}</p> : null}
      </section>
    </>
  );
}

function formatBytes(
  bytes: number,
  labels: Pick<
    ToolPageConfig["results"]["labels"],
    "byteUnit" | "kilobyteUnit" | "megabyteUnit"
  >
): string {
  if (bytes < 1024) {
    return `${bytes} ${labels.byteUnit}`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} ${labels.kilobyteUnit}`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} ${labels.megabyteUnit}`;
}

function buildOutputName(originalName: string, suffix: string): string {
  const dotIndex = originalName.lastIndexOf(".");
  if (dotIndex === -1) {
    return `${originalName}${suffix}`;
  }

  const baseName = originalName.slice(0, dotIndex);
  const extension = originalName.slice(dotIndex);
  return `${baseName}${suffix}${extension}`;
}

function formatToDisplayLabel(format: SupportedFormat): string {
  if (format === "image/jpeg") {
    return "JPG";
  }

  if (format === "image/png") {
    return "PNG";
  }

  return "WebP";
}
