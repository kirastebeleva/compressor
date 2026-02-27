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

const TOOL_KIND = "image-watermark";
const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const LOGO_TYPES = new Set(["image/png", "image/svg+xml"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_LOGO_SIZE = 2 * 1024 * 1024;
const MAX_FILES = 10;
const ACCEPTED_FORMATS = "image/jpeg,image/png,image/webp";
const ACCEPTED_LOGO = "image/png,image/svg+xml";

type ViewState = "idle" | "uploading" | "ready" | "processing" | "done";

type WatermarkType = "text" | "image";

type Position =
  | "tl" | "tc" | "tr"
  | "ml" | "mc" | "mr"
  | "bl" | "bc" | "br";

type SizePreset = "small" | "medium" | "large";

const SIZE_RATIOS: Record<SizePreset, number> = {
  small: 0.10,
  medium: 0.20,
  large: 0.35,
};

type WatermarkConfig = {
  type: WatermarkType;
  text: string;
  position: Position;
  opacity: number;
  size: SizePreset;
  fontFamily: string;
  fontWeight: string;
  color: string;
  shadow: boolean;
  rotation: number;
  tile: boolean;
  tileSpacing: "sparse" | "normal" | "dense";
};

const DEFAULT_CONFIG: WatermarkConfig = {
  type: "text",
  text: "",
  position: "br",
  opacity: 50,
  size: "medium",
  fontFamily: "sans-serif",
  fontWeight: "bold",
  color: "#ffffff",
  shadow: true,
  rotation: 0,
  tile: false,
  tileSpacing: "normal",
};

type UploadedFile = {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
};

type WatermarkResult = {
  original: UploadedFile;
  blob: Blob;
  previewUrl: string;
  downloadUrl: string;
  downloadName: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let _uid = 0;
function uid(): string {
  return `wm-${++_uid}-${Date.now()}`;
}

function buildWatermarkedName(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot === -1) return `${name}-watermarked`;
  return `${name.slice(0, dot)}-watermarked${name.slice(dot)}`;
}

function pctChange(before: number, after: number): string {
  if (before === 0) return "0";
  const d = ((after - before) / before) * 100;
  return d > 0 ? `+${d.toFixed(1)}` : d.toFixed(1);
}

function resolveFont(family: string, weight: string): string {
  const w = weight === "bold" ? "bold" : "normal";
  const f =
    family === "serif"
      ? "Georgia, 'Times New Roman', serif"
      : family === "monospace"
        ? "'Courier New', Courier, monospace"
        : family === "script"
          ? "'Brush Script MT', 'Segoe Script', cursive"
          : "-apple-system, 'Segoe UI', Roboto, sans-serif";
  return `${w} %SIZE%px ${f}`;
}

const TILE_SPACING_MULT: Record<string, number> = {
  sparse: 2.5,
  normal: 1.6,
  dense: 1.0,
};

function getPosition(
  pos: Position,
  canvasW: number,
  canvasH: number,
  wmW: number,
  wmH: number,
  margin: number,
): { x: number; y: number } {
  const m = margin;
  const positions: Record<Position, { x: number; y: number }> = {
    tl: { x: m, y: m },
    tc: { x: (canvasW - wmW) / 2, y: m },
    tr: { x: canvasW - wmW - m, y: m },
    ml: { x: m, y: (canvasH - wmH) / 2 },
    mc: { x: (canvasW - wmW) / 2, y: (canvasH - wmH) / 2 },
    mr: { x: canvasW - wmW - m, y: (canvasH - wmH) / 2 },
    bl: { x: m, y: canvasH - wmH - m },
    bc: { x: (canvasW - wmW) / 2, y: canvasH - wmH - m },
    br: { x: canvasW - wmW - m, y: canvasH - wmH - m },
  };
  return positions[pos];
}

async function applyWatermark(
  file: File,
  cfg: WatermarkConfig,
  logoBitmap: ImageBitmap | null,
): Promise<Blob> {
  const img = await createImageBitmap(file);
  const w = img.width;
  const h = img.height;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  img.close();

  const ratio = SIZE_RATIOS[cfg.size];
  const margin = Math.round(w * 0.05);
  ctx.globalAlpha = cfg.opacity / 100;

  if (cfg.tile) {
    drawTiled(ctx, w, h, cfg, logoBitmap, ratio);
  } else {
    drawSingle(ctx, w, h, cfg, logoBitmap, ratio, margin);
  }

  ctx.globalAlpha = 1;

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

  return blob;
}

function drawSingle(
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  cfg: WatermarkConfig,
  logoBitmap: ImageBitmap | null,
  ratio: number,
  margin: number,
) {
  if (cfg.type === "text" && cfg.text) {
    const fontSize = Math.max(12, Math.round(cw * ratio * 0.35));
    const font = resolveFont(cfg.fontFamily, cfg.fontWeight).replace(
      "%SIZE%",
      String(fontSize),
    );
    ctx.font = font;
    const metrics = ctx.measureText(cfg.text);
    const textW = metrics.width;
    const textH = fontSize;

    const pos = getPosition(cfg.position, cw, ch, textW, textH, margin);

    ctx.save();
    if (cfg.rotation !== 0) {
      ctx.translate(pos.x + textW / 2, pos.y + textH / 2);
      ctx.rotate((cfg.rotation * Math.PI) / 180);
      ctx.translate(-(pos.x + textW / 2), -(pos.y + textH / 2));
    }
    if (cfg.shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = Math.max(2, fontSize * 0.06);
      ctx.shadowOffsetX = Math.max(1, fontSize * 0.03);
      ctx.shadowOffsetY = Math.max(1, fontSize * 0.03);
    }
    ctx.fillStyle = cfg.color;
    ctx.textBaseline = "top";
    ctx.fillText(cfg.text, pos.x, pos.y);
    ctx.restore();
  } else if (cfg.type === "image" && logoBitmap) {
    const targetW = Math.round(cw * ratio);
    const scale = targetW / logoBitmap.width;
    const logoW = targetW;
    const logoH = Math.round(logoBitmap.height * scale);

    const pos = getPosition(cfg.position, cw, ch, logoW, logoH, margin);

    ctx.save();
    if (cfg.rotation !== 0) {
      ctx.translate(pos.x + logoW / 2, pos.y + logoH / 2);
      ctx.rotate((cfg.rotation * Math.PI) / 180);
      ctx.translate(-(pos.x + logoW / 2), -(pos.y + logoH / 2));
    }
    if (cfg.shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }
    ctx.drawImage(logoBitmap, pos.x, pos.y, logoW, logoH);
    ctx.restore();
  }
}

function drawTiled(
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  cfg: WatermarkConfig,
  logoBitmap: ImageBitmap | null,
  ratio: number,
) {
  const spacingMult = TILE_SPACING_MULT[cfg.tileSpacing] ?? 1.6;
  const rot = (cfg.rotation * Math.PI) / 180;

  if (cfg.type === "text" && cfg.text) {
    const fontSize = Math.max(12, Math.round(cw * ratio * 0.25));
    const font = resolveFont(cfg.fontFamily, cfg.fontWeight).replace(
      "%SIZE%",
      String(fontSize),
    );
    ctx.font = font;
    const metrics = ctx.measureText(cfg.text);
    const textW = metrics.width;
    const stepX = textW * spacingMult;
    const stepY = fontSize * spacingMult * 2;

    if (cfg.shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = Math.max(2, fontSize * 0.04);
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
    }
    ctx.fillStyle = cfg.color;
    ctx.textBaseline = "top";

    const diagonal = Math.sqrt(cw * cw + ch * ch);
    for (let y = -diagonal; y < diagonal; y += stepY) {
      for (let x = -diagonal; x < diagonal; x += stepX) {
        ctx.save();
        ctx.translate(x + textW / 2, y + fontSize / 2);
        ctx.rotate(rot);
        ctx.fillText(cfg.text, -textW / 2, -fontSize / 2);
        ctx.restore();
      }
    }
  } else if (cfg.type === "image" && logoBitmap) {
    const targetW = Math.round(cw * ratio * 0.6);
    const scale = targetW / logoBitmap.width;
    const logoW = targetW;
    const logoH = Math.round(logoBitmap.height * scale);
    const stepX = logoW * spacingMult;
    const stepY = logoH * spacingMult;

    if (cfg.shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
    }

    const diagonal = Math.sqrt(cw * cw + ch * ch);
    for (let y = -diagonal; y < diagonal; y += stepY) {
      for (let x = -diagonal; x < diagonal; x += stepX) {
        ctx.save();
        ctx.translate(x + logoW / 2, y + logoH / 2);
        ctx.rotate(rot);
        ctx.drawImage(logoBitmap, -logoW / 2, -logoH / 2, logoW, logoH);
        ctx.restore();
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Preview rendering (uses downscaled image)
// ---------------------------------------------------------------------------

function drawPreview(
  canvas: HTMLCanvasElement,
  imgEl: HTMLImageElement,
  cfg: WatermarkConfig,
  logoBitmap: ImageBitmap | null,
) {
  const maxDim = 600;
  let dw = imgEl.naturalWidth;
  let dh = imgEl.naturalHeight;
  if (dw === 0 || dh === 0) return;

  const scale = Math.min(1, maxDim / Math.max(dw, dh));
  dw = Math.round(dw * scale);
  dh = Math.round(dh * scale);

  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, dw, dh);
  ctx.drawImage(imgEl, 0, 0, dw, dh);

  const ratio = SIZE_RATIOS[cfg.size];
  const margin = Math.round(dw * 0.05);
  ctx.globalAlpha = cfg.opacity / 100;

  if (cfg.tile) {
    drawTiled(ctx, dw, dh, cfg, logoBitmap, ratio);
  } else {
    drawSingle(ctx, dw, dh, cfg, logoBitmap, ratio, margin);
  }

  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------------------
// SVG icons
// ---------------------------------------------------------------------------

function IconReset({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 12a9 9 0 1 0 9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M3 3v6h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Position Grid
// ---------------------------------------------------------------------------

const POSITION_LABELS: Record<Position, string> = {
  tl: "Top Left",
  tc: "Top Center",
  tr: "Top Right",
  ml: "Middle Left",
  mc: "Center",
  mr: "Middle Right",
  bl: "Bottom Left",
  bc: "Bottom Center",
  br: "Bottom Right",
};

const GRID_ORDER: Position[] = [
  "tl", "tc", "tr",
  "ml", "mc", "mr",
  "bl", "bc", "br",
];

function PositionGrid({
  value,
  onChange,
  disabled,
}: {
  value: Position;
  onChange: (p: Position) => void;
  disabled?: boolean;
}) {
  return (
    <div className="wm-position-grid" role="radiogroup" aria-label="Watermark position">
      {GRID_ORDER.map((pos) => (
        <button
          key={pos}
          type="button"
          className={`wm-position-dot${pos === value ? " wm-position-dot-active" : ""}`}
          title={POSITION_LABELS[pos]}
          aria-label={POSITION_LABELS[pos]}
          aria-checked={pos === value}
          role="radio"
          disabled={disabled}
          onClick={() => onChange(pos)}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Color presets
// ---------------------------------------------------------------------------

const COLOR_PRESETS = [
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#ef4444" },
  { label: "Blue", value: "#3b82f6" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type WatermarkToolProps = { config: PageConfig };

export function WatermarkTool({ config }: WatermarkToolProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [wm, setWm] = useState<WatermarkConfig>(DEFAULT_CONFIG);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoBitmap, setLogoBitmap] = useState<ImageBitmap | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  const [state, setState] = useState<ViewState>("idle");
  const [results, setResults] = useState<WatermarkResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewImgRef = useRef<HTMLImageElement | null>(null);
  const zipBusyRef = useRef(false);

  const byteLabels = useMemo(
    () => config.results.labels,
    [config.results.labels],
  );

  const activeFile = files[previewIdx] ?? null;

  // ---- Cleanup ----

  useEffect(() => {
    return () => {
      for (const f of files) URL.revokeObjectURL(f.previewUrl);
      for (const r of results) {
        URL.revokeObjectURL(r.previewUrl);
        URL.revokeObjectURL(r.downloadUrl);
      }
      if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Preview rendering ----

  useEffect(() => {
    if (!activeFile || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      previewImgRef.current = img;
      if (canvasRef.current) {
        drawPreview(canvasRef.current, img, wm, logoBitmap);
      }
    };
    img.src = activeFile.previewUrl;
  }, [activeFile, wm, logoBitmap]);

  // ---- Logo handling ----

  const handleLogoUpload = useCallback(async (file: File) => {
    if (!LOGO_TYPES.has(file.type)) {
      setError("Logo must be a PNG or SVG file.");
      return;
    }
    if (file.size > MAX_LOGO_SIZE) {
      setError("Logo file is too large. Maximum size is 2 MB.");
      return;
    }
    setError(null);
    setLogoFile(file);
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    setLogoPreviewUrl(URL.createObjectURL(file));
    try {
      const bmp = await createImageBitmap(file);
      setLogoBitmap(bmp);
    } catch {
      setError("Could not load logo image.");
    }
  }, [logoPreviewUrl]);

  const removeLogo = useCallback(() => {
    setLogoFile(null);
    if (logoBitmap) logoBitmap.close();
    setLogoBitmap(null);
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    setLogoPreviewUrl(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  }, [logoBitmap, logoPreviewUrl]);

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
        setError(`Maximum ${MAX_FILES} files allowed. Some files were skipped.`);

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
        if (copy.length === 0) {
          setState("idle");
          setPreviewIdx(0);
        } else if (previewIdx >= copy.length) {
          setPreviewIdx(copy.length - 1);
        }
        return copy;
      });
      for (const r of results) {
        URL.revokeObjectURL(r.previewUrl);
        URL.revokeObjectURL(r.downloadUrl);
      }
      setResults([]);
      setError(null);
    },
    [results, previewIdx],
  );

  const clearAll = useCallback(() => {
    for (const f of files) URL.revokeObjectURL(f.previewUrl);
    for (const r of results) {
      URL.revokeObjectURL(r.previewUrl);
      URL.revokeObjectURL(r.downloadUrl);
    }
    setFiles([]);
    setPreviewIdx(0);
    setWm(DEFAULT_CONFIG);
    removeLogo();
    setResults([]);
    setState("idle");
    setError(null);
    setShowAdvanced(false);
    if (inputRef.current) inputRef.current.value = "";
  }, [files, results, removeLogo]);

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

  // ---- Config updaters ----

  const updateWm = useCallback(
    <K extends keyof WatermarkConfig>(key: K, value: WatermarkConfig[K]) => {
      setWm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // ---- Export ----

  const canApply =
    files.length > 0 &&
    ((wm.type === "text" && wm.text.trim().length > 0) ||
      (wm.type === "image" && logoBitmap !== null));

  const onExport = async () => {
    if (!canApply || state === "processing") return;

    trackProcessingStarted({ tool: TOOL_KIND });
    trackEvent("watermark_apply", {
      tool: TOOL_KIND,
      type: wm.type,
      position: wm.position,
      opacity: wm.opacity,
      size: wm.size,
      tile: wm.tile,
    });
    setError(null);
    setState("processing");
    setProgress(0);

    const t0 = performance.now();

    for (const r of results) {
      URL.revokeObjectURL(r.previewUrl);
      URL.revokeObjectURL(r.downloadUrl);
    }

    const newResults: WatermarkResult[] = [];
    let hasErrors = false;

    for (let i = 0; i < files.length; i++) {
      const uf = files[i];
      try {
        const blob = await applyWatermark(uf.file, wm, logoBitmap);
        newResults.push({
          original: uf,
          blob,
          previewUrl: URL.createObjectURL(blob),
          downloadUrl: URL.createObjectURL(blob),
          downloadName: buildWatermarkedName(uf.file.name),
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
      preset: "watermark",
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
      trackDownloadResult({ tool: TOOL_KIND, output_size_mb: bytesToMb(totalBytes) });
      trackEvent("download_all_zip", { tool: TOOL_KIND, file_count: results.length });
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const r of results) zip.file(r.downloadName, r.blob);
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "watermarked-images.zip";
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

        <input
          accept={ACCEPTED_LOGO}
          className="visually-hidden-file-input"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleLogoUpload(f);
          }}
          ref={logoInputRef}
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

        {/* Tool area */}
        {files.length > 0 && (
          <div className="tool-flow">
            {/* ── Preview ── */}
            <div className="wm-preview-section">
              <canvas
                ref={canvasRef}
                className="wm-preview-canvas"
              />
              {files.length > 1 && (
                <div className="wm-thumb-strip">
                  {files.map((uf, idx) => (
                    <div key={uf.id} className="wm-thumb-wrap">
                      <button
                        type="button"
                        className={`wm-thumb-btn${idx === previewIdx ? " wm-thumb-btn-active" : ""}`}
                        onClick={() => setPreviewIdx(idx)}
                      >
                        <img
                          alt=""
                          src={uf.previewUrl}
                          className="wm-thumb-img"
                          loading="lazy"
                        />
                      </button>
                      <button
                        type="button"
                        className="wm-thumb-remove"
                        aria-label="Remove"
                        disabled={isProcessing}
                        onClick={() => removeFile(uf.id)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  {files.length < MAX_FILES && (
                    <button
                      type="button"
                      className="wm-thumb-add"
                      onClick={() => inputRef.current?.click()}
                      title="Add more images"
                    >
                      +
                    </button>
                  )}
                </div>
              )}
              {files.length === 1 && files.length < MAX_FILES && (
                <button
                  type="button"
                  className="resize-add-more"
                  onClick={() => inputRef.current?.click()}
                  disabled={isProcessing}
                >
                  + Add more images
                </button>
              )}
            </div>

            {/* ── Watermark type tabs ── */}
            <div className="resize-tabs">
              <button
                type="button"
                className={`resize-tab${wm.type === "text" ? " resize-tab-active" : ""}`}
                disabled={isProcessing}
                onClick={() => updateWm("type", "text")}
              >
                Text
              </button>
              <button
                type="button"
                className={`resize-tab${wm.type === "image" ? " resize-tab-active" : ""}`}
                disabled={isProcessing}
                onClick={() => updateWm("type", "image")}
              >
                Image
              </button>
            </div>

            {/* ── Text input ── */}
            {wm.type === "text" && (
              <div className="resize-input-group">
                <label className="resize-label">Watermark text</label>
                <input
                  type="text"
                  className="resize-input"
                  placeholder="© Your Name"
                  maxLength={100}
                  value={wm.text}
                  disabled={isProcessing}
                  onChange={(e) => updateWm("text", e.target.value)}
                />
                <p className="wm-input-hint">Tip: use © for copyright, ™ for trademark</p>
              </div>
            )}

            {/* ── Logo upload ── */}
            {wm.type === "image" && (
              <div className="wm-logo-section">
                {logoFile ? (
                  <div className="wm-logo-preview">
                    <div className="wm-logo-thumb-wrap">
                      <img
                        alt="Logo"
                        src={logoPreviewUrl!}
                        className="wm-logo-thumb"
                      />
                    </div>
                    <div className="wm-logo-info">
                      <span className="file-info-name" title={logoFile.name}>
                        {logoFile.name}
                      </span>
                      <span className="file-info-size">
                        {formatBytes(logoFile.size, byteLabels)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="file-remove-btn"
                      onClick={removeLogo}
                      disabled={isProcessing}
                      title="Remove logo"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="wm-logo-upload-btn"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isProcessing}
                  >
                    Upload logo (PNG, SVG)
                  </button>
                )}
                <p className="wm-input-hint">For best results, use a PNG with transparent background</p>
              </div>
            )}

            {/* ── Position ── */}
            {!wm.tile && (
              <div className="wm-control-row">
                <label className="resize-label">Position</label>
                <PositionGrid
                  value={wm.position}
                  onChange={(p) => updateWm("position", p)}
                  disabled={isProcessing}
                />
              </div>
            )}

            {/* ── Opacity slider ── */}
            <div className="wm-control-row">
              <label className="resize-label">
                Opacity <span className="wm-slider-value">{wm.opacity}%</span>
              </label>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={wm.opacity}
                disabled={isProcessing}
                className="wm-slider"
                onChange={(e) => updateWm("opacity", Number(e.target.value))}
              />
            </div>

            {/* ── Size ── */}
            <div className="wm-control-row">
              <label className="resize-label">Size</label>
              <div className="wm-size-bar">
                {(["small", "medium", "large"] as SizePreset[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`crop-aspect-btn${wm.size === s ? " crop-aspect-btn-active" : ""}`}
                    disabled={isProcessing}
                    onClick={() => updateWm("size", s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Advanced toggle ── */}
            <button
              type="button"
              className="wm-advanced-toggle"
              onClick={() => setShowAdvanced((v) => !v)}
            >
              {showAdvanced ? "Hide options" : "More options"}
              <span className={`wm-chevron${showAdvanced ? " wm-chevron-open" : ""}`}>
                ▾
              </span>
            </button>

            {/* ── Advanced panel ── */}
            {showAdvanced && (
              <div className="wm-advanced-panel">
                {wm.type === "text" && (
                  <>
                    {/* Font family */}
                    <div className="wm-control-row">
                      <label className="resize-label">Font</label>
                      <div className="wm-size-bar">
                        {[
                          { id: "sans-serif", label: "Sans-serif" },
                          { id: "serif", label: "Serif" },
                          { id: "monospace", label: "Monospace" },
                          { id: "script", label: "Script" },
                        ].map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            className={`crop-aspect-btn${wm.fontFamily === f.id ? " crop-aspect-btn-active" : ""}`}
                            disabled={isProcessing}
                            onClick={() => updateWm("fontFamily", f.id)}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font weight */}
                    <div className="wm-control-row">
                      <label className="resize-label">Weight</label>
                      <div className="resize-tabs" style={{ maxWidth: 220 }}>
                        <button
                          type="button"
                          className={`resize-tab${wm.fontWeight === "normal" ? " resize-tab-active" : ""}`}
                          disabled={isProcessing}
                          onClick={() => updateWm("fontWeight", "normal")}
                        >
                          Regular
                        </button>
                        <button
                          type="button"
                          className={`resize-tab${wm.fontWeight === "bold" ? " resize-tab-active" : ""}`}
                          disabled={isProcessing}
                          onClick={() => updateWm("fontWeight", "bold")}
                        >
                          Bold
                        </button>
                      </div>
                    </div>

                    {/* Color */}
                    <div className="wm-control-row">
                      <label className="resize-label">Color</label>
                      <div className="wm-color-row">
                        {COLOR_PRESETS.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            className={`wm-color-swatch${wm.color === c.value ? " wm-color-swatch-active" : ""}`}
                            style={{ background: c.value }}
                            title={c.label}
                            disabled={isProcessing}
                            onClick={() => updateWm("color", c.value)}
                          />
                        ))}
                        <input
                          type="color"
                          className="wm-color-picker"
                          value={wm.color}
                          disabled={isProcessing}
                          onChange={(e) => updateWm("color", e.target.value)}
                          title="Custom color"
                        />
                      </div>
                    </div>

                    {/* Shadow */}
                    <label className="resize-checkbox-label">
                      <input
                        type="checkbox"
                        checked={wm.shadow}
                        disabled={isProcessing}
                        onChange={(e) => updateWm("shadow", e.target.checked)}
                      />
                      Text shadow (improves readability)
                    </label>
                  </>
                )}

                {/* Rotation */}
                <div className="wm-control-row">
                  <label className="resize-label">
                    Rotation <span className="wm-slider-value">{wm.rotation}°</span>
                  </label>
                  <input
                    type="range"
                    min={-45}
                    max={45}
                    step={5}
                    value={wm.rotation}
                    disabled={isProcessing}
                    className="wm-slider"
                    onChange={(e) => updateWm("rotation", Number(e.target.value))}
                  />
                  {wm.rotation !== 0 && (
                    <button
                      type="button"
                      className="wm-inline-reset"
                      onClick={() => updateWm("rotation", 0)}
                    >
                      <IconReset /> Reset
                    </button>
                  )}
                </div>

                {/* Tile */}
                <label className="resize-checkbox-label">
                  <input
                    type="checkbox"
                    checked={wm.tile}
                    disabled={isProcessing}
                    onChange={(e) => updateWm("tile", e.target.checked)}
                  />
                  Tile pattern (repeat across image)
                </label>

                {wm.tile && (
                  <div className="wm-control-row">
                    <label className="resize-label">Tile density</label>
                    <div className="wm-size-bar">
                      {(["sparse", "normal", "dense"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`crop-aspect-btn${wm.tileSpacing === s ? " crop-aspect-btn-active" : ""}`}
                          disabled={isProcessing}
                          onClick={() => updateWm("tileSpacing", s)}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Apply button ── */}
            <button
              className="btn btn-compress"
              disabled={!canApply || isProcessing}
              onClick={onExport}
              type="button"
            >
              {isProcessing ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Applying… ({progress}/{files.length})
                </>
              ) : files.length > 1 ? (
                `Apply to ${files.length} images`
              ) : (
                "Apply watermark"
              )}
            </button>

            {!canApply && files.length > 0 && !isProcessing && (
              <p className="resize-btn-hint">
                {wm.type === "text"
                  ? "Enter watermark text to continue"
                  : "Upload a logo to continue"}
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
            Watermark more images (free)
          </button>
        </section>
      ) : (
        state !== "processing" &&
        state !== "ready" &&
        state !== "uploading" && (
          <section className="card results-empty">
            <h2 className="section-title">Results</h2>
            <p className="body-text">
              Upload images and configure your watermark to see results here.
            </p>
          </section>
        )
      )}
    </>
  );
}
