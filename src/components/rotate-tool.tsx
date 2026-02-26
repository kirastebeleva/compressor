"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PageConfig } from "@/core/types";
import { formatBytes } from "@/lib/format";
import {
  trackEvent,
  trackFileUploaded,
  trackProcessingStarted,
  trackProcessingCompleted,
  trackErrorShown,
  bytesToMb,
} from "@/lib/analytics";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOOL_KIND = "image-rotate";
const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 10;
const ACCEPTED_FORMATS = "image/jpeg,image/png,image/webp";

type ViewState = "idle" | "uploading" | "ready" | "processing" | "done";

type UploadedFile = {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  exifOrientation: number;
};

type RotateFileResult = {
  original: UploadedFile;
  blob: Blob;
  outputWidth: number;
  outputHeight: number;
  previewUrl: string;
  downloadUrl: string;
  downloadName: string;
  wasChanged: boolean;
};

// ---------------------------------------------------------------------------
// EXIF orientation reader (JPEG only, no dependencies)
// ---------------------------------------------------------------------------

async function readExifOrientation(file: File): Promise<number> {
  if (file.type !== "image/jpeg") return 1;
  try {
    const buf = await file.slice(0, 65536).arrayBuffer();
    const v = new DataView(buf);
    if (v.getUint16(0) !== 0xffd8) return 1;
    let off = 2;
    while (off < v.byteLength - 4) {
      const m = v.getUint16(off);
      if (m === 0xffe1) {
        if (
          v.getUint32(off + 4) === 0x45786966 &&
          v.getUint16(off + 8) === 0
        ) {
          const t = off + 10;
          const le = v.getUint16(t) === 0x4949;
          const ifd = v.getUint32(t + 4, le);
          const n = v.getUint16(t + ifd, le);
          for (let i = 0; i < n; i++) {
            const e = t + ifd + 2 + i * 12;
            if (e + 12 > v.byteLength) break;
            if (v.getUint16(e, le) === 0x0112)
              return v.getUint16(e + 8, le);
          }
        }
        off += 2 + v.getUint16(off + 2);
      } else if ((m & 0xff00) === 0xff00) {
        if (m === 0xffda) break;
        off += 2 + v.getUint16(off + 2);
      } else break;
    }
  } catch {
    /* ignore read errors */
  }
  return 1;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let _uid = 0;
function uid(): string {
  return `rf-${++_uid}-${Date.now()}`;
}

function normalizeAngle(deg: number): number {
  let a = ((deg % 360) + 360) % 360;
  if (a > 180) a -= 360;
  return a;
}

function buildRotatedName(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot === -1) return `${name}-rotated`;
  return `${name.slice(0, dot)}-rotated${name.slice(dot)}`;
}

async function performRotate(
  file: File,
  angleDeg: number,
): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await createImageBitmap(file);
  const abs = ((Math.abs(angleDeg) % 360) + 360) % 360;
  const swapped = abs === 90 || abs === 270;
  const outW = swapped ? img.height : img.width;
  const outH = swapped ? img.width : img.height;

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d")!;

  if (angleDeg === 0) {
    ctx.drawImage(img, 0, 0);
  } else {
    ctx.translate(outW / 2, outH / 2);
    ctx.rotate((angleDeg * Math.PI) / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
  }
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

  return { blob, width: outW, height: outH };
}

function pctChange(before: number, after: number): string {
  if (before === 0) return "0";
  const d = ((after - before) / before) * 100;
  return d > 0 ? `+${d.toFixed(1)}` : d.toFixed(1);
}

// ---------------------------------------------------------------------------
// SVG icon helpers (inline, tiny)
// ---------------------------------------------------------------------------

function IconRotateLeft({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 2v6h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 13a7.5 7.5 0 1 0 1.8-5L4 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconRotateRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 2v6h-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 13a7.5 7.5 0 1 1-1.8-5L20 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconRotate180({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M2.5 4.5v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.5 19.5v-5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.36 8.5A8 8 0 0 0 5.64 6L2.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.64 15.5a8 8 0 0 0 13.72 2.5l3.14-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

type RotateToolProps = { config: PageConfig };

export function RotateTool({ config }: RotateToolProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [globalAngle, setGlobalAngle] = useState(0);
  const [perImageAngles, setPerImageAngles] = useState<Map<string, number>>(
    new Map(),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [downloadOnlyChanged, setDownloadOnlyChanged] = useState(false);
  const [state, setState] = useState<ViewState>("idle");
  const [results, setResults] = useState<RotateFileResult[]>([]);
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

  const getEffectiveAngle = useCallback(
    (fileId: string): number =>
      perImageAngles.has(fileId)
        ? perImageAngles.get(fileId)!
        : globalAngle,
    [globalAngle, perImageAngles],
  );

  const rotatedCount = useMemo(
    () => files.filter((f) => getEffectiveAngle(f.id) !== 0).length,
    [files, getEffectiveAngle],
  );

  const changedCount = useMemo(
    () =>
      files.filter(
        (f) => getEffectiveAngle(f.id) !== 0 || f.exifOrientation !== 1,
      ).length,
    [files, getEffectiveAngle],
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
        const exif = await readExifOrientation(f);
        loaded.push({
          id: uid(),
          file: f,
          previewUrl: URL.createObjectURL(f),
          width: bmp.width,
          height: bmp.height,
          exifOrientation: exif,
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
      setPerImageAngles((prev) => {
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
    setGlobalAngle(0);
    setPerImageAngles(new Map());
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

  // ---- Rotation ----

  const rotateImage = useCallback(
    (fileId: string, delta: number) => {
      setPerImageAngles((prev) => {
        const next = new Map(prev);
        const current = next.has(fileId) ? next.get(fileId)! : globalAngle;
        next.set(fileId, normalizeAngle(current + delta));
        return next;
      });
      trackEvent("per_image_rotate", { tool: TOOL_KIND, delta });
    },
    [globalAngle],
  );

  const resetImage = useCallback((fileId: string) => {
    setPerImageAngles((prev) => {
      const next = new Map(prev);
      next.delete(fileId);
      return next;
    });
    trackEvent("per_image_reset", { tool: TOOL_KIND });
  }, []);

  const rotateAll = useCallback((delta: number) => {
    setGlobalAngle((prev) => normalizeAngle(prev + delta));
    trackEvent("rotate_all", { tool: TOOL_KIND, delta });
  }, []);

  const resetAll = useCallback(() => {
    setGlobalAngle(0);
    setPerImageAngles(new Map());
    trackEvent("reset_all", { tool: TOOL_KIND });
  }, []);

  // ---- Keyboard shortcuts ----

  const rotateImageRef = useRef(rotateImage);
  rotateImageRef.current = rotateImage;
  const removeFileRef = useRef(removeFile);
  removeFileRef.current = removeFile;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedId) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case "ArrowRight":
        case "r":
        case "R":
          e.preventDefault();
          rotateImageRef.current(selectedId, 90);
          break;
        case "ArrowLeft":
        case "l":
        case "L":
          e.preventDefault();
          rotateImageRef.current(selectedId, -90);
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
      ? files.filter(
          (f) =>
            getEffectiveAngle(f.id) !== 0 || f.exifOrientation !== 1,
        )
      : files;

    if (batch.length === 0) {
      setError(
        "No changed images to export. Uncheck the filter or rotate some images.",
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

    const newResults: RotateFileResult[] = [];
    let hasErrors = false;

    for (let i = 0; i < batch.length; i++) {
      const uf = batch[i];
      const angle = getEffectiveAngle(uf.id);
      const needsCanvas = angle !== 0 || uf.exifOrientation !== 1;

      try {
        let blob: Blob;
        let outW: number;
        let outH: number;

        if (needsCanvas) {
          const res = await performRotate(uf.file, angle);
          blob = res.blob;
          outW = res.width;
          outH = res.height;
        } else {
          blob = uf.file;
          outW = uf.width;
          outH = uf.height;
        }

        newResults.push({
          original: uf,
          blob,
          outputWidth: outW,
          outputHeight: outH,
          previewUrl: URL.createObjectURL(needsCanvas ? blob : uf.file),
          downloadUrl: URL.createObjectURL(needsCanvas ? blob : uf.file),
          downloadName: needsCanvas
            ? buildRotatedName(uf.file.name)
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
      preset: "rotate",
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
      trackEvent("download_all", {
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
      a.download = "rotated-images.zip";
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
  const displayGlobal = normalizeAngle(globalAngle);

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
            {/* ── Global rotation controls ── */}
            <div className="rotate-quick-bar">
              <button
                className="rotate-quick-btn"
                disabled={isProcessing}
                onClick={() => rotateAll(-90)}
                title="Rotate all 90° left"
                type="button"
              >
                <IconRotateLeft size={20} />
                <span>90° Left</span>
              </button>
              <button
                className="rotate-quick-btn"
                disabled={isProcessing}
                onClick={() => rotateAll(90)}
                title="Rotate all 90° right"
                type="button"
              >
                <IconRotateRight size={20} />
                <span>90° Right</span>
              </button>
              <button
                className="rotate-quick-btn"
                disabled={isProcessing}
                onClick={() => rotateAll(180)}
                title="Rotate all 180°"
                type="button"
              >
                <IconRotate180 size={20} />
                <span>180°</span>
              </button>
              <button
                className="rotate-quick-btn"
                disabled={isProcessing}
                onClick={resetAll}
                title="Reset all rotations"
                type="button"
              >
                <IconReset size={20} />
                <span>Reset all</span>
              </button>
            </div>

            {/* ── Status badges ── */}
            {(displayGlobal !== 0 || rotatedCount > 0) && (
              <div className="rotate-angle-row">
                {displayGlobal !== 0 && (
                  <span className="rotate-angle-badge">
                    Global: {displayGlobal}°
                  </span>
                )}
                {rotatedCount > 0 && (
                  <span className="rotate-angle-badge">
                    {rotatedCount} of {files.length} rotated
                  </span>
                )}
              </div>
            )}

            {/* ── Image grid ── */}
            <div className="rotate-grid">
              {files.map((uf) => {
                const angle = getEffectiveAngle(uf.id);
                const hasOverride = perImageAngles.has(uf.id);
                const isRotated = angle !== 0;
                const isSel = selectedId === uf.id;

                return (
                  <div
                    className={`rotate-grid-item${isSel ? " rotate-grid-item-selected" : ""}${isRotated ? " rotate-grid-item-changed" : ""}`}
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
                          angle !== 0
                            ? { transform: `rotate(${angle}deg)` }
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
                      {isRotated && (
                        <span className="rotate-grid-badge">
                          Rotated
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
                          rotateImage(uf.id, -90);
                        }}
                        title="Rotate left (L)"
                        type="button"
                      >
                        <IconRotateLeft />
                      </button>
                      <button
                        className="rotate-grid-ctrl-btn"
                        disabled={isProcessing}
                        onClick={(e) => {
                          e.stopPropagation();
                          rotateImage(uf.id, 90);
                        }}
                        title="Rotate right (R)"
                        type="button"
                      >
                        <IconRotateRight />
                      </button>
                      <button
                        className="rotate-grid-ctrl-btn"
                        disabled={isProcessing}
                        onClick={(e) => {
                          e.stopPropagation();
                          rotateImage(uf.id, 180);
                        }}
                        title="Rotate 180°"
                        type="button"
                      >
                        180
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
                {downloadOnlyChanged && changedCount > 0
                  ? ` (${changedCount})`
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
                  Rotating… ({progress}/
                  {downloadOnlyChanged ? changedCount : files.length})
                </>
              ) : files.length > 1 ? (
                `Rotate ${downloadOnlyChanged ? changedCount : files.length} files`
              ) : (
                "Rotate"
              )}
            </button>

            {selectedId && (
              <p className="rotate-keyboard-hint">
                ← → or R / L to rotate selected image · Delete to
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
                    <span className="resize-arrow" aria-hidden="true">
                      →
                    </span>
                    <span className="resize-result-new-dims">
                      {r.outputWidth} × {r.outputHeight}
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
                    trackEvent("download_single", {
                      tool: TOOL_KIND,
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
            Rotate more images (free)
          </button>
        </section>
      ) : (
        state !== "processing" &&
        state !== "ready" &&
        state !== "uploading" && (
          <section className="card results-empty">
            <h2 className="section-title">Results</h2>
            <p className="body-text">
              Upload images and set rotation to see your results here.
            </p>
          </section>
        )
      )}
    </>
  );
}
