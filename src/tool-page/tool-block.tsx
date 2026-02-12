"use client";

import { useEffect, useMemo, useState } from "react";
import {
  compress,
  DEFAULT_PRESET,
  LIMITS,
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

export function ToolBlock({ config, byteLabels, onResult }: ToolBlockProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<CompressionPresetId>(DEFAULT_PRESET);
  const [state, setState] = useState<ViewState>("idle");
  const [result, setResult] = useState<ToolExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const disableCompress = !file || state === "compressing";
  const accept = config.acceptedFormats.join(",");
  const presets = useMemo(() => config.presets, [config.presets]);
  const selectedPresetLabel =
    presets.find((entry) => entry.id === preset)?.label ?? preset;

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
      return;
    }

    if (next.size > LIMITS.maxTotalSizeBytes) {
      setError(config.messages.totalLimitExceeded);
      setFile(null);
      return;
    }

    setFile(next);
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
        <h2>{config.title}</h2>
        <p className="muted">{config.subtitle}</p>

        <div className="row">
          <label className="control">
            <span className="muted">{config.labels.fileInput}</span>
            <input
              accept={accept}
              onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
              type="file"
            />
          </label>

          <label className="control">
            <span className="muted">{config.labels.presetSelect}</span>
            <select
              onChange={(event) => setPreset(event.target.value as CompressionPresetId)}
              value={preset}
            >
              {presets.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>

          <button disabled={disableCompress} onClick={onCompress} type="button">
            {state === "compressing"
              ? config.labels.compressingButton
              : config.labels.compressButton}
          </button>
        </div>

        <p className="muted">{config.limitsText}</p>

        {file ? (
          <>
            <p className="muted">
              {config.labels.selectedFilePrefix}: {file.name} (
              {formatBytes(file.size, byteLabels)})
            </p>
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
