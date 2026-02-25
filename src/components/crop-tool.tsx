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

const TOOL_KIND = "image-crop";
const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_FORMATS = "image/jpeg,image/png,image/webp";
const MIN_CROP_PX = 10;
const HANDLE_SIZE = 10;
const HANDLE_HIT = 20;

type CropRect = { x: number; y: number; w: number; h: number };
type ViewState = "idle" | "ready" | "processing" | "done";

type AspectPreset = { label: string; ratio: number | null };
const ASPECT_PRESETS: readonly AspectPreset[] = [
  { label: "Free", ratio: null },
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "16:9", ratio: 16 / 9 },
  { label: "3:2", ratio: 3 / 2 },
];

type HandleId = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
type DragKind = { type: "move" } | { type: "handle"; handle: HandleId };
type DragState = {
  kind: DragKind;
  startX: number;
  startY: number;
  startCrop: CropRect;
};

type CropResult = {
  blob: Blob;
  width: number;
  height: number;
  inputBytes: number;
  outputBytes: number;
  downloadUrl: string;
  downloadName: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildCroppedName(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot === -1) return `${name}-cropped`;
  return `${name.slice(0, dot)}-cropped${name.slice(dot)}`;
}

async function readDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  const bmp = await createImageBitmap(file);
  const { width, height } = bmp;
  bmp.close();
  return { width, height };
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function initCrop(
  imgW: number,
  imgH: number,
  ratio: number | null,
): CropRect {
  if (ratio != null) {
    let w: number;
    let h: number;
    if (imgW / imgH > ratio) {
      h = imgH * 0.9;
      w = h * ratio;
    } else {
      w = imgW * 0.9;
      h = w / ratio;
    }
    w = Math.round(Math.min(w, imgW));
    h = Math.round(Math.min(h, imgH));
    return {
      x: Math.round((imgW - w) / 2),
      y: Math.round((imgH - h) / 2),
      w,
      h,
    };
  }
  const w = Math.round(imgW * 0.9);
  const h = Math.round(imgH * 0.9);
  return {
    x: Math.round((imgW - w) / 2),
    y: Math.round((imgH - h) / 2),
    w,
    h,
  };
}

function constrainCrop(
  rect: CropRect,
  imgW: number,
  imgH: number,
  ratio: number | null,
): CropRect {
  let { x, y, w, h } = rect;

  w = Math.max(MIN_CROP_PX, Math.round(w));
  h = Math.max(MIN_CROP_PX, Math.round(h));

  if (ratio != null) {
    if (w / h > ratio) {
      w = Math.round(h * ratio);
    } else {
      h = Math.round(w / ratio);
    }
    w = Math.max(MIN_CROP_PX, w);
    h = Math.max(MIN_CROP_PX, h);
  }

  w = Math.min(w, imgW);
  h = Math.min(h, imgH);

  x = clamp(Math.round(x), 0, imgW - w);
  y = clamp(Math.round(y), 0, imgH - h);

  return { x, y, w, h };
}

async function performCrop(
  file: File,
  crop: CropRect,
): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = crop.w;
  canvas.height = crop.h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
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

  return { blob, width: crop.w, height: crop.h };
}

const HANDLE_CURSORS: Record<HandleId, string> = {
  nw: "nwse-resize",
  n: "ns-resize",
  ne: "nesw-resize",
  e: "ew-resize",
  se: "nwse-resize",
  s: "ns-resize",
  sw: "nesw-resize",
  w: "ew-resize",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type CropToolProps = { config: PageConfig };

export function CropTool({ config }: CropToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, w: 0, h: 0 });
  const [aspectIdx, setAspectIdx] = useState(0);
  const [state, setState] = useState<ViewState>("idle");
  const [result, setResult] = useState<CropResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [widthInput, setWidthInput] = useState("");
  const [heightInput, setHeightInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const aspectRatio = ASPECT_PRESETS[aspectIdx].ratio;

  const scale = useMemo(
    () => (naturalSize.w > 0 && displaySize.w > 0 ? displaySize.w / naturalSize.w : 1),
    [naturalSize.w, displaySize.w],
  );

  const byteLabels = useMemo(
    () => config.results.labels,
    [config.results.labels],
  );

  // Sync dimension inputs from crop rect
  useEffect(() => {
    if (state === "ready") {
      setWidthInput(String(crop.w));
      setHeightInput(String(crop.h));
    }
  }, [crop.w, crop.h, state]);

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (result?.downloadUrl) URL.revokeObjectURL(result.downloadUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Observe image display size changes
  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDisplaySize({ w: width, h: height });
        }
      }
    });
    ro.observe(img);
    return () => ro.disconnect();
  }, [imageUrl]);

  // ---- File handling ----

  const loadFile = useCallback(
    async (f: File) => {
      setError(null);
      const evtBase = { tool: TOOL_KIND, file_type: f.type, file_size_mb: bytesToMb(f.size) };

      if (!SUPPORTED_TYPES.has(f.type)) {
        const msg = `Unsupported format: ${f.name}. Use JPG, PNG, or WebP.`;
        setError(msg);
        trackErrorShown({ ...evtBase, error_message: msg });
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        const msg = `File too large: ${f.name}. Maximum size is 10 MB.`;
        setError(msg);
        trackErrorShown({ ...evtBase, error_message: msg });
        return;
      }

      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (result?.downloadUrl) URL.revokeObjectURL(result.downloadUrl);
      setResult(null);

      const dims = await readDimensions(f);
      const url = URL.createObjectURL(f);

      setFile(f);
      setImageUrl(url);
      setNaturalSize({ w: dims.width, h: dims.height });
      setCrop(initCrop(dims.width, dims.height, aspectRatio));
      setState("ready");
      trackFileUploaded(evtBase);
    },
    [aspectRatio, imageUrl, result?.downloadUrl],
  );

  const clearAll = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (result?.downloadUrl) URL.revokeObjectURL(result.downloadUrl);
    setFile(null);
    setImageUrl(null);
    setNaturalSize({ w: 0, h: 0 });
    setDisplaySize({ w: 0, h: 0 });
    setCrop({ x: 0, y: 0, w: 0, h: 0 });
    setResult(null);
    setState("idle");
    setError(null);
    setAspectIdx(0);
    if (inputRef.current) inputRef.current.value = "";
  }, [imageUrl, result?.downloadUrl]);

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
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  };

  // ---- Aspect ratio change ----

  const onAspectChange = useCallback(
    (idx: number) => {
      setAspectIdx(idx);
      trackEvent("change_aspect_ratio", {
        tool: TOOL_KIND,
        preset: ASPECT_PRESETS[idx].label,
      });
      if (naturalSize.w > 0) {
        const ratio = ASPECT_PRESETS[idx].ratio;
        setCrop((prev) => {
          const cx = prev.x + prev.w / 2;
          const cy = prev.y + prev.h / 2;
          let newW = prev.w;
          let newH = prev.h;
          if (ratio != null) {
            if (newW / newH > ratio) {
              newW = newH * ratio;
            } else {
              newH = newW / ratio;
            }
          }
          const x = cx - newW / 2;
          const y = cy - newH / 2;
          return constrainCrop(
            { x, y, w: newW, h: newH },
            naturalSize.w,
            naturalSize.h,
            ratio,
          );
        });
      }
    },
    [naturalSize.w, naturalSize.h],
  );

  // ---- Dimension inputs ----

  const onWidthInputChange = useCallback(
    (val: string) => {
      setWidthInput(val);
      const w = Number(val);
      if (w > 0 && naturalSize.w > 0) {
        setCrop((prev) => {
          const h = aspectRatio != null ? w / aspectRatio : prev.h;
          return constrainCrop(
            { x: prev.x, y: prev.y, w, h },
            naturalSize.w,
            naturalSize.h,
            aspectRatio,
          );
        });
      }
    },
    [aspectRatio, naturalSize.w, naturalSize.h],
  );

  const onHeightInputChange = useCallback(
    (val: string) => {
      setHeightInput(val);
      const h = Number(val);
      if (h > 0 && naturalSize.w > 0) {
        setCrop((prev) => {
          const w = aspectRatio != null ? h * aspectRatio : prev.w;
          return constrainCrop(
            { x: prev.x, y: prev.y, w, h },
            naturalSize.w,
            naturalSize.h,
            aspectRatio,
          );
        });
      }
    },
    [aspectRatio, naturalSize.w, naturalSize.h],
  );

  // ---- Pointer interaction for crop selection ----

  const hitTestHandle = useCallback(
    (clientX: number, clientY: number): HandleId | null => {
      const img = imageRef.current;
      if (!img) return null;
      const rect = img.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;

      const cx = crop.x * scale;
      const cy = crop.y * scale;
      const cw = crop.w * scale;
      const ch = crop.h * scale;

      const hitR = HANDLE_HIT / 2;

      const left = Math.abs(mx - cx) < hitR;
      const right = Math.abs(mx - (cx + cw)) < hitR;
      const top = Math.abs(my - cy) < hitR;
      const bottom = Math.abs(my - (cy + ch)) < hitR;
      const hCenter = mx > cx + hitR && mx < cx + cw - hitR;
      const vCenter = my > cy + hitR && my < cy + ch - hitR;

      if (top && left) return "nw";
      if (top && right) return "ne";
      if (bottom && left) return "sw";
      if (bottom && right) return "se";
      if (top && hCenter) return "n";
      if (bottom && hCenter) return "s";
      if (left && vCenter) return "w";
      if (right && vCenter) return "e";
      return null;
    },
    [crop, scale],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (state !== "ready") return;
      e.preventDefault();

      const handle = hitTestHandle(e.clientX, e.clientY);

      if (handle) {
        dragRef.current = {
          kind: { type: "handle", handle },
          startX: e.clientX,
          startY: e.clientY,
          startCrop: { ...crop },
        };
      } else {
        const img = imageRef.current;
        if (!img) return;
        const rect = img.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const cx = crop.x * scale;
        const cy = crop.y * scale;
        const cw = crop.w * scale;
        const ch = crop.h * scale;
        if (mx >= cx && mx <= cx + cw && my >= cy && my <= cy + ch) {
          dragRef.current = {
            kind: { type: "move" },
            startX: e.clientX,
            startY: e.clientY,
            startCrop: { ...crop },
          };
        }
      }

      if (dragRef.current) {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      }
    },
    [crop, scale, state, hitTestHandle],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const ds = dragRef.current;
      if (!ds) {
        const handle = hitTestHandle(e.clientX, e.clientY);
        const container = containerRef.current;
        if (container) {
          container.style.cursor = handle
            ? HANDLE_CURSORS[handle]
            : "default";
        }
        return;
      }

      e.preventDefault();
      const dx = (e.clientX - ds.startX) / scale;
      const dy = (e.clientY - ds.startY) / scale;
      const sc = ds.startCrop;

      if (ds.kind.type === "move") {
        setCrop(
          constrainCrop(
            { x: sc.x + dx, y: sc.y + dy, w: sc.w, h: sc.h },
            naturalSize.w,
            naturalSize.h,
            aspectRatio,
          ),
        );
        return;
      }

      const h = ds.kind.handle;
      let nx = sc.x;
      let ny = sc.y;
      let nw = sc.w;
      let nh = sc.h;

      const movesLeft = h === "nw" || h === "w" || h === "sw";
      const movesRight = h === "ne" || h === "e" || h === "se";
      const movesTop = h === "nw" || h === "n" || h === "ne";
      const movesBottom = h === "sw" || h === "s" || h === "se";

      if (movesRight) nw = sc.w + dx;
      if (movesLeft) {
        nx = sc.x + dx;
        nw = sc.w - dx;
      }
      if (movesBottom) nh = sc.h + dy;
      if (movesTop) {
        ny = sc.y + dy;
        nh = sc.h - dy;
      }

      if (nw < MIN_CROP_PX) {
        if (movesLeft) nx = sc.x + sc.w - MIN_CROP_PX;
        nw = MIN_CROP_PX;
      }
      if (nh < MIN_CROP_PX) {
        if (movesTop) ny = sc.y + sc.h - MIN_CROP_PX;
        nh = MIN_CROP_PX;
      }

      if (aspectRatio != null) {
        const isCorner = movesLeft !== movesRight || movesTop !== movesBottom;
        if (isCorner || movesLeft || movesRight) {
          nh = nw / aspectRatio;
          if (movesTop) ny = sc.y + sc.h - nh;
        } else {
          nw = nh * aspectRatio;
          if (movesLeft) nx = sc.x + sc.w - nw;
        }
      }

      setCrop(
        constrainCrop(
          { x: nx, y: ny, w: nw, h: nh },
          naturalSize.w,
          naturalSize.h,
          aspectRatio,
        ),
      );
    },
    [scale, naturalSize.w, naturalSize.h, aspectRatio, hitTestHandle],
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  // ---- Crop action ----

  const onCrop = async () => {
    if (!file || state !== "ready") return;
    const evtBase = { tool: TOOL_KIND, file_type: file.type, file_size_mb: bytesToMb(file.size) };
    const aspectLabel = ASPECT_PRESETS[aspectIdx].label;

    setError(null);
    setState("processing");
    trackProcessingStarted({ ...evtBase, preset: aspectLabel });

    const t0 = performance.now();

    try {
      const res = await performCrop(file, crop);
      const elapsedMs = Math.round(performance.now() - t0);
      const downloadUrl = URL.createObjectURL(res.blob);

      if (result?.downloadUrl) URL.revokeObjectURL(result.downloadUrl);

      setResult({
        blob: res.blob,
        width: res.width,
        height: res.height,
        inputBytes: file.size,
        outputBytes: res.blob.size,
        downloadUrl,
        downloadName: buildCroppedName(file.name),
      });
      setState("done");
      trackProcessingCompleted({
        ...evtBase,
        preset: aspectLabel,
        output_size_mb: bytesToMb(res.blob.size),
        compression_ratio: Math.round((res.blob.size / file.size) * 100),
        elapsed_ms: elapsedMs,
      });
    } catch {
      const msg = "Failed to crop the image. Please try another file.";
      setError(msg);
      trackErrorShown({ ...evtBase, error_message: msg });
      setState("ready");
    }
  };

  const onReset = useCallback(() => {
    if (result?.downloadUrl) URL.revokeObjectURL(result.downloadUrl);
    setResult(null);
    setState("idle");
    setFile(null);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setNaturalSize({ w: 0, h: 0 });
    setDisplaySize({ w: 0, h: 0 });
    setCrop({ x: 0, y: 0, w: 0, h: 0 });
    setAspectIdx(0);
    if (inputRef.current) inputRef.current.value = "";
  }, [result?.downloadUrl, imageUrl]);

  // ---- Render helpers ----

  const isProcessing = state === "processing";
  const displayCrop = useMemo(
    () => ({
      left: crop.x * scale,
      top: crop.y * scale,
      width: crop.w * scale,
      height: crop.h * scale,
    }),
    [crop, scale],
  );

  const handles: { id: HandleId; style: React.CSSProperties }[] = useMemo(() => {
    const hs = HANDLE_SIZE;
    const off = -hs / 2;
    const cx = displayCrop.width / 2 + off;
    const cy = displayCrop.height / 2 + off;
    const r = displayCrop.width + off;
    const b = displayCrop.height + off;
    return [
      { id: "nw" as HandleId, style: { left: off, top: off, cursor: "nwse-resize" } },
      { id: "n" as HandleId, style: { left: cx, top: off, cursor: "ns-resize" } },
      { id: "ne" as HandleId, style: { left: r, top: off, cursor: "nesw-resize" } },
      { id: "e" as HandleId, style: { left: r, top: cy, cursor: "ew-resize" } },
      { id: "se" as HandleId, style: { left: r, top: b, cursor: "nwse-resize" } },
      { id: "s" as HandleId, style: { left: cx, top: b, cursor: "ns-resize" } },
      { id: "sw" as HandleId, style: { left: off, top: b, cursor: "nesw-resize" } },
      { id: "w" as HandleId, style: { left: off, top: cy, cursor: "ew-resize" } },
    ];
  }, [displayCrop]);

  return (
    <>
      <section className="card tool-card">
        <h2 className="section-title">{config.tool.title}</h2>
        <p className="body-text tool-subtitle">{config.tool.subtitle}</p>

        <input
          accept={ACCEPTED_FORMATS}
          className="visually-hidden-file-input"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) loadFile(f);
          }}
          ref={inputRef}
          type="file"
        />

        {/* Dropzone */}
        {state === "idle" && (
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
            <span className="dropzone-label">Choose image</span>
            <span className="dropzone-hint">or drag and drop</span>
            <div className="dropzone-badges">
              <span className="format-badge">JPG</span>
              <span className="format-badge">PNG</span>
              <span className="format-badge">WebP</span>
              <span className="format-badge format-badge-muted">Max 10 MB</span>
            </div>
          </div>
        )}

        {/* Crop workspace */}
        {(state === "ready" || state === "processing") && imageUrl && (
          <div className="tool-flow">
            {/* File info */}
            <div className="file-info-card">
              <div className="file-info-left">
                <div className="file-info-text">
                  <span className="file-info-name" title={file?.name}>
                    {file?.name}
                  </span>
                  <span className="file-info-size">
                    {naturalSize.w} × {naturalSize.h} px &middot;{" "}
                    {file ? formatBytes(file.size, byteLabels) : ""}
                  </span>
                </div>
              </div>
              <button
                aria-label="Remove file"
                className="file-remove-btn"
                disabled={isProcessing}
                onClick={clearAll}
                type="button"
              >
                &times;
              </button>
            </div>

            {/* Aspect ratio presets */}
            <div className="crop-aspect-bar">
              {ASPECT_PRESETS.map((preset, idx) => (
                <button
                  className={`crop-aspect-btn${aspectIdx === idx ? " crop-aspect-btn-active" : ""}`}
                  disabled={isProcessing}
                  key={preset.label}
                  onClick={() => onAspectChange(idx)}
                  type="button"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Canvas with crop overlay */}
            <div
              className="crop-canvas-wrap"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              ref={containerRef}
              style={{ touchAction: "none" }}
            >
              <img
                alt="Preview"
                className="crop-image"
                draggable={false}
                ref={imageRef}
                src={imageUrl}
              />

              {displaySize.w > 0 && (
                <>
                  {/* Dim overlay — four rects around crop area */}
                  <div
                    className="crop-overlay-top"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: displayCrop.top,
                      background: "rgba(0,0,0,0.5)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    className="crop-overlay-bottom"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: displayCrop.top + displayCrop.height,
                      width: "100%",
                      height: displaySize.h - displayCrop.top - displayCrop.height,
                      background: "rgba(0,0,0,0.5)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    className="crop-overlay-left"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: displayCrop.top,
                      width: displayCrop.left,
                      height: displayCrop.height,
                      background: "rgba(0,0,0,0.5)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    className="crop-overlay-right"
                    style={{
                      position: "absolute",
                      left: displayCrop.left + displayCrop.width,
                      top: displayCrop.top,
                      width: displaySize.w - displayCrop.left - displayCrop.width,
                      height: displayCrop.height,
                      background: "rgba(0,0,0,0.5)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Selection frame */}
                  <div
                    className="crop-selection"
                    style={{
                      left: displayCrop.left,
                      top: displayCrop.top,
                      width: displayCrop.width,
                      height: displayCrop.height,
                    }}
                  >
                    {/* Rule-of-thirds grid lines */}
                    <div className="crop-grid" />

                    {/* Resize handles */}
                    {handles.map((h) => (
                      <div
                        className="crop-handle"
                        key={h.id}
                        style={h.style}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Dimension inputs + live preview */}
            <div className="crop-dims-section">
              <div className="resize-input-row">
                <div className="resize-input-group">
                  <label className="resize-label" htmlFor="crop-w">
                    Width (px)
                  </label>
                  <input
                    className="resize-input"
                    disabled={isProcessing}
                    id="crop-w"
                    inputMode="numeric"
                    min={1}
                    max={naturalSize.w}
                    onChange={(e) => onWidthInputChange(e.target.value)}
                    type="number"
                    value={widthInput}
                  />
                </div>
                <span className="resize-x" aria-hidden="true">
                  ×
                </span>
                <div className="resize-input-group">
                  <label className="resize-label" htmlFor="crop-h">
                    Height (px)
                  </label>
                  <input
                    className="resize-input"
                    disabled={isProcessing}
                    id="crop-h"
                    inputMode="numeric"
                    min={1}
                    max={naturalSize.h}
                    onChange={(e) => onHeightInputChange(e.target.value)}
                    type="number"
                    value={heightInput}
                  />
                </div>
              </div>
              <p className="crop-dims-hint">
                Result: {crop.w} × {crop.h} px
              </p>
            </div>

            {/* Crop button */}
            <button
              className="btn btn-compress"
              disabled={isProcessing || crop.w < MIN_CROP_PX}
              onClick={onCrop}
              type="button"
            >
              {isProcessing ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Cropping…
                </>
              ) : (
                "Crop now"
              )}
            </button>
          </div>
        )}

        <p className="tool-trust-note">
          Your image is processed locally in your browser. Nothing is uploaded.
        </p>

        {error && <p className="error-message">{error}</p>}
      </section>

      {/* Results */}
      {result && state === "done" ? (
        <section className="card results-card results-appear">
          <h2 className="section-title">Result</h2>

          <div className="crop-result-previews">
            <div className="crop-result-preview-box">
              <span className="crop-result-preview-label">Original</span>
              <img
                alt="Original"
                className="crop-result-img"
                src={imageUrl!}
              />
              <span className="crop-result-preview-meta">
                {naturalSize.w} × {naturalSize.h} px
              </span>
            </div>
            <span className="resize-arrow" aria-hidden="true">→</span>
            <div className="crop-result-preview-box">
              <span className="crop-result-preview-label">Cropped</span>
              <img
                alt="Cropped"
                className="crop-result-img"
                src={result.downloadUrl}
              />
              <span className="crop-result-preview-meta">
                {result.width} × {result.height} px
              </span>
            </div>
          </div>

          <div className="results-grid">
            <div className="result-item">
              <span className="result-item-label">
                {byteLabels.input ?? "Before"}
              </span>
              <span className="result-item-value">
                {formatBytes(result.inputBytes, byteLabels)}
              </span>
            </div>
            <div className="result-item result-item-after">
              <span className="result-item-label">
                {byteLabels.output ?? "After"}
              </span>
              <span className="result-item-value">
                {formatBytes(result.outputBytes, byteLabels)}
              </span>
            </div>
          </div>

          <div className="results-actions">
            <a
              className="btn btn-download"
              download={result.downloadName}
              href={result.downloadUrl}
              onClick={() =>
                trackDownloadResult({
                  tool: TOOL_KIND,
                  file_type: file?.type,
                  file_size_mb: bytesToMb(result.outputBytes),
                  output_size_mb: bytesToMb(result.outputBytes),
                })
              }
            >
              Download cropped image
            </a>
            <button
              className="btn btn-secondary"
              onClick={onReset}
              type="button"
            >
              Crop another image (free)
            </button>
          </div>
        </section>
      ) : (
        state !== "processing" &&
        state !== "ready" && (
          <section className="card results-empty">
            <h2 className="section-title">Result</h2>
            <p className="body-text">
              Upload an image and adjust the crop area to see your result here.
            </p>
          </section>
        )
      )}
    </>
  );
}
