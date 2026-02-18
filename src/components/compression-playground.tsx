"use client";

import { useEffect, useMemo, useState } from "react";
import {
  compress,
  DEFAULT_PRESET,
  LIMITS,
  PRESETS,
  type CompressionPresetId,
  type CompressionStats,
} from "@/compression";
import { formatBytes, buildOutputName } from "@/lib/format";

type ViewState = "idle" | "compressing" | "ready";

export function CompressionPlayground() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<CompressionPresetId>(DEFAULT_PRESET);
  const [state, setState] = useState<ViewState>("idle");
  const [stats, setStats] = useState<CompressionStats | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const disableCompress = !file || state === "compressing";
  const presets = useMemo(() => Object.values(PRESETS), []);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const onFileChange = (next: File | null) => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }

    setDownloadUrl(null);
    setStats(null);
    setState("idle");
    setError(null);

    if (!next) {
      setFile(null);
      return;
    }

    if (next.size > LIMITS.maxFileSizeBytes) {
      setError("File is too large. Maximum size is 10MB.");
      setFile(null);
      return;
    }

    if (next.size > LIMITS.maxTotalSizeBytes) {
      setError("Total size limit exceeded.");
      setFile(null);
      return;
    }

    setFile(next);
  };

  const onCompress = async () => {
    if (!file) {
      return;
    }

    setError(null);
    setState("compressing");

    try {
      const result = await compress(file, {
        preset,
        keepFormat: true,
      });

      const nextUrl = URL.createObjectURL(result.outputBlob);
      setDownloadUrl(nextUrl);
      setStats(result.stats);
      setState("ready");
    } catch (compressionError) {
      setError(
        compressionError instanceof Error
          ? compressionError.message
          : "Failed to compress image."
      );
      setState("idle");
    }
  };

  return (
    <main>
      <section className="card">
        <h1>Compress image</h1>
        <p className="muted">
          Browser-only compression. Formats: JPG/JPEG, PNG, WebP. File format is
          preserved.
        </p>
      </section>

      <section className="card">
        <div className="row">
          <input
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            type="file"
          />
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
          <button disabled={disableCompress} onClick={onCompress} type="button">
            {state === "compressing" ? "Compressing..." : "Compress"}
          </button>
        </div>

        <p className="muted">
          Limits: single file mode, max file size 10MB, max total size 25MB.
        </p>

        {file ? (
          <p className="muted">
            Selected: {file.name} ({formatBytes(file.size)})
          </p>
        ) : null}

        {error ? <p className="error">{error}</p> : null}
      </section>

      {stats ? (
        <section className="card">
          <h2>Results</h2>
          <p className="muted">Input: {formatBytes(stats.inputBytes)}</p>
          <p className="muted">Output: {formatBytes(stats.outputBytes)}</p>
          <p className="muted">Ratio: {(stats.ratio * 100).toFixed(1)}%</p>
          <p className="muted">Elapsed: {stats.elapsedMs} ms</p>
          {downloadUrl && file ? (
            <a download={buildOutputName(file.name)} href={downloadUrl}>
              Download compressed file
            </a>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}

