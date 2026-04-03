"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import JSZip from "jszip";
import { LIMITS } from "@/compression";
import type { PageConfig } from "@/tool-page/types";
import { formatBytes, buildOutputName } from "@/lib/format";
import { getPdfPageCount } from "@/lib/pdf-page-count";
import {
  exportPdfInBrowser,
  isInBrowserPdfExportFormat,
  type PdfExportFormatId,
} from "@/lib/pdf-export";
import {
  trackFileUploaded,
  trackActionStarted,
  trackActionCompleted,
  trackError,
  trackDownloadResult,
  bytesToMb,
} from "@/lib/analytics";

type ViewState = "idle" | "converting" | "ready";

const PDF_ACCEPT = "application/pdf,.pdf";

/** Per product spec: up to 20 PDFs, 10 MB each, total cap 200 MB. */
const PDF_MAX_FILES = 20;
const PDF_MAX_FILE_BYTES = LIMITS.maxFileSizeBytes;
const PDF_MAX_TOTAL_BYTES = PDF_MAX_FILES * PDF_MAX_FILE_BYTES;

const EXPORT_FORMATS = [
  { id: "png", label: "PNG (pages as images)" },
  { id: "jpg", label: "JPG (pages as images)" },
  { id: "txt", label: "Plain text (.txt)" },
  { id: "html", label: "HTML (.html)" },
  { id: "docx", label: "Word (.docx) — coming soon" },
  { id: "xlsx", label: "Excel (.xlsx) — coming soon" },
  { id: "pptx", label: "PowerPoint (.pptx) — coming soon" },
] as const satisfies ReadonlyArray<{ id: PdfExportFormatId; label: string }>;

function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

function pdfStemName(fileName: string): string {
  return fileName.replace(/\.pdf$/i, "") || "document";
}

function formatLabel(id: PdfExportFormatId): string {
  return EXPORT_FORMATS.find((f) => f.id === id)?.label ?? id;
}

function pageRangeAnalytics(
  mode: "all" | "range",
  from: number,
  to: number,
): string {
  return mode === "all" ? "all" : `${from}-${to}`;
}

type PdfEntry = {
  id: string;
  file: File;
  numPages: number | null;
  loading: boolean;
};

function parseRangeDrafts(
  rangeFromDraft: string,
  rangeToDraft: string,
): { from: number; to: number } | null {
  const from = parseInt(rangeFromDraft.trim(), 10);
  const to = parseInt(rangeToDraft.trim(), 10);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return null;
  return { from, to };
}

function clampPageRangeForPdf(
  numPages: number,
  rawFrom: number,
  rawTo: number,
): { from: number; to: number } {
  const lo = Math.min(rawFrom, rawTo);
  const hi = Math.max(rawFrom, rawTo);
  const from = Math.max(1, lo);
  const to = Math.min(hi, numPages);
  return { from, to };
}

function validateRangeAgainstEntries(
  entries: PdfEntry[],
  pageMode: "all" | "range",
  parsed: { from: number; to: number } | null,
): string | null {
  if (pageMode === "all") return null;
  if (!parsed) {
    return "Enter valid page numbers in From and To.";
  }
  const lo = Math.min(parsed.from, parsed.to);
  const hi = Math.max(parsed.from, parsed.to);
  if (lo < 1) {
    return "Page numbers must be at least 1.";
  }
  if (hi < lo) {
    return '"From" must be less than or equal to "To".';
  }
  for (const e of entries) {
    if (e.numPages === null) continue;
    const { from, to } = clampPageRangeForPdf(e.numPages, lo, hi);
    if (from > to) {
      return `Page range does not fit "${e.file.name}" (${e.numPages} pages).`;
    }
  }
  return null;
}

type ConvertPdfToolProps = {
  config: PageConfig;
};

type DownloadPayload = {
  downloadUrl: string;
  downloadName: string;
  outputBytes: number;
  elapsedMs: number;
};

export function ConvertPdfTool({ config }: ConvertPdfToolProps) {
  const [pdfEntries, setPdfEntries] = useState<PdfEntry[]>([]);
  const [formatId, setFormatId] = useState<PdfExportFormatId>("png");
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);
  const [state, setState] = useState<ViewState>("idle");
  const [download, setDownload] = useState<DownloadPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pageMode, setPageMode] = useState<"all" | "range">("all");
  const [rangeFromDraft, setRangeFromDraft] = useState("1");
  const [rangeToDraft, setRangeToDraft] = useState("1");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formatMenuRef = useRef<HTMLDivElement | null>(null);

  const byteLabels = config.results.labels;
  const toolKind = config.tool.kind;
  const pageSlug = config.slug;

  const pageCountLoading = pdfEntries.some((e) => e.loading);
  const allPagesKnown =
    pdfEntries.length > 0 &&
    pdfEntries.every((e) => e.numPages !== null && !e.loading);
  const maxPagesAcross = useMemo(
    () =>
      Math.max(
        0,
        ...pdfEntries.map((e) => e.numPages ?? 0),
      ),
    [pdfEntries],
  );

  const totalInputBytes = pdfEntries.reduce((s, e) => s + e.file.size, 0);

  const disableConvert =
    pdfEntries.length === 0 ||
    state === "converting" ||
    pageCountLoading ||
    !allPagesKnown ||
    !isInBrowserPdfExportFormat(formatId);

  const analyticsBase = (overrides: {
    file_type?: string;
    file_size_mb?: number;
    file_count?: number;
  } = {}) => ({
    tool: toolKind,
    page_slug: pageSlug,
    file_type: overrides.file_type ?? "(none)",
    file_size_mb: overrides.file_size_mb ?? 0,
    ...(overrides.file_count !== undefined
      ? { file_count: overrides.file_count }
      : {}),
  });

  useEffect(() => {
    return () => {
      if (download?.downloadUrl) {
        URL.revokeObjectURL(download.downloadUrl);
      }
    };
  }, [download]);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const el = formatMenuRef.current;
      if (!el || !formatMenuOpen) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setFormatMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [formatMenuOpen]);

  function setResultStateIdle() {
    setState("idle");
    setError(null);
  }

  const prevMaxPagesRef = useRef(0);
  useEffect(() => {
    if (pdfEntries.length === 0) prevMaxPagesRef.current = 0;
  }, [pdfEntries.length]);

  useEffect(() => {
    if (maxPagesAcross === prevMaxPagesRef.current) return;
    prevMaxPagesRef.current = maxPagesAcross;
    if (pageMode !== "range" || maxPagesAcross < 1) return;
    setRangeToDraft((d) => {
      if (d.trim() === "") return d;
      const t = parseInt(d, 10);
      if (!Number.isFinite(t)) return String(maxPagesAcross);
      return String(Math.min(Math.max(t, 1), maxPagesAcross));
    });
    setRangeFromDraft((d) => {
      if (d.trim() === "") return d;
      const t = parseInt(d, 10);
      if (!Number.isFinite(t)) return "1";
      return String(Math.min(Math.max(t, 1), maxPagesAcross));
    });
  }, [maxPagesAcross, pageMode]);

  const loadPagesForEntry = async (entryId: string, pdfFile: File) => {
    try {
      const buf = await pdfFile.arrayBuffer();
      const n = await getPdfPageCount(buf);
      setPdfEntries((prev) =>
        prev.map((e) =>
          e.id === entryId ? { ...e, numPages: n, loading: false } : e,
        ),
      );
    } catch {
      setError(
        `Could not read "${pdfFile.name}". It may be corrupted or password-protected.`,
      );
      trackError({
        ...analyticsBase({
          file_type: pdfFile.type || "application/pdf",
          file_size_mb: bytesToMb(pdfFile.size),
          file_count: pdfEntries.length,
        }),
        error_message: "pdf_read_failed",
      });
      setPdfEntries((prev) => prev.filter((e) => e.id !== entryId));
    }
  };

  const addPdfFiles = (list: FileList | File[] | null) => {
    if (!list || list.length === 0) return;
    if (download?.downloadUrl) {
      URL.revokeObjectURL(download.downloadUrl);
    }
    setDownload(null);
    setResultStateIdle();

    const incoming = Array.from(list);
    const evtBase = analyticsBase({
      file_type: "application/pdf",
      file_size_mb: bytesToMb(incoming[0]?.size ?? 0),
      file_count: pdfEntries.length,
    });

    const accepted: File[] = [];
    for (const f of incoming) {
      if (!isPdfFile(f)) {
        setError("Only PDF files are supported.");
        trackError({ ...evtBase, error_message: "not_pdf" });
        continue;
      }
      if (f.size > PDF_MAX_FILE_BYTES) {
        setError(`"${f.name}" is too large. Maximum ${PDF_MAX_FILE_BYTES / (1024 * 1024)} MB per file.`);
        trackError({ ...evtBase, error_message: "file_too_large" });
        continue;
      }
      accepted.push(f);
    }

    const room = PDF_MAX_FILES - pdfEntries.length;
    const toStage = accepted.slice(0, Math.max(0, room));
    if (accepted.length > room) {
      setError(`Maximum ${PDF_MAX_FILES} files allowed. Extra files were skipped.`);
    }

    let running = pdfEntries.reduce((s, e) => s + e.file.size, 0);
    const added: File[] = [];
    for (const f of toStage) {
      if (running + f.size > PDF_MAX_TOTAL_BYTES) {
        setError(
          `Total size limit (${PDF_MAX_TOTAL_BYTES / (1024 * 1024)} MB) exceeded. Some files were skipped.`,
        );
        break;
      }
      running += f.size;
      added.push(f);
    }

    if (added.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setError(null);
    const newEntries: PdfEntry[] = added.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      numPages: null,
      loading: true,
    }));

    setPdfEntries((prev) => [...prev, ...newEntries]);
    trackFileUploaded({
      ...analyticsBase({
        file_type: "application/pdf",
        file_size_mb: bytesToMb(added[0].size),
        file_count: pdfEntries.length + added.length,
      }),
      from_format: "pdf",
    });

    for (const e of newEntries) {
      void loadPagesForEntry(e.id, e.file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const clearAllFiles = () => {
    if (download?.downloadUrl) {
      URL.revokeObjectURL(download.downloadUrl);
    }
    setDownload(null);
    setPdfEntries([]);
    setPageMode("all");
    setRangeFromDraft("1");
    setRangeToDraft("1");
    setResultStateIdle();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeEntry = (id: string) => {
    if (download?.downloadUrl) {
      URL.revokeObjectURL(download.downloadUrl);
      setDownload(null);
    }
    setResultStateIdle();
    setPdfEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      if (next.length === 0) {
        setPageMode("all");
        setRangeFromDraft("1");
        setRangeToDraft("1");
      }
      return next;
    });
  };

  const handleAnotherFile = () => {
    clearAllFiles();
    openFilePicker();
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
    addPdfFiles(e.dataTransfer.files);
  };

  const rangeForAnalytics = (): { from: number; to: number } => {
    if (pageMode === "all" && maxPagesAcross > 0) {
      return { from: 1, to: maxPagesAcross };
    }
    const parsed = parseRangeDrafts(rangeFromDraft, rangeToDraft);
    if (!parsed || maxPagesAcross < 1) return { from: 1, to: 1 };
    const lo = Math.min(parsed.from, parsed.to);
    const hi = Math.max(parsed.from, parsed.to);
    return { from: lo, to: hi };
  };

  const validateRange = (): boolean => {
    const parsed =
      pageMode === "range"
        ? parseRangeDrafts(rangeFromDraft, rangeToDraft)
        : null;
    const msg = validateRangeAgainstEntries(pdfEntries, pageMode, parsed);
    if (msg) {
      setError(msg);
      return false;
    }
    return true;
  };

  const onConvert = async () => {
    if (pdfEntries.length === 0 || !allPagesKnown) {
      setError(config.tool.messages.noFileSelected);
      trackError({
        ...analyticsBase(),
        error_message: "no_file_selected",
      });
      return;
    }

    if (!validateRange()) {
      trackError({
        ...analyticsBase({
          file_type: "application/pdf",
          file_size_mb: bytesToMb(totalInputBytes),
          file_count: pdfEntries.length,
        }),
        error_message: "invalid_page_range",
      });
      return;
    }

    const parsedRange = parseRangeDrafts(rangeFromDraft, rangeToDraft);
    const { from: aFrom, to: aTo } = rangeForAnalytics();
    const rangeStr =
      pageMode === "all"
        ? "all"
        : pageRangeAnalytics(
            "range",
            parsedRange ? Math.min(parsedRange.from, parsedRange.to) : aFrom,
            parsedRange ? Math.max(parsedRange.from, parsedRange.to) : aTo,
          );

    const evtBase = {
      ...analyticsBase({
        file_type: "application/pdf",
        file_size_mb: bytesToMb(totalInputBytes),
        file_count: pdfEntries.length,
      }),
      from_format: "pdf",
      to_format: formatId,
      page_range: rangeStr,
    };

    setError(null);
    setState("converting");
    trackActionStarted(evtBase);

    try {
      if (
        config.tool.mode === "browser-pdf-export" &&
        isInBrowserPdfExportFormat(formatId)
      ) {
        const t0 = performance.now();
        const outputs: { zipPath: string; blob: Blob }[] = [];
        let idx = 0;
        for (const entry of pdfEntries) {
          const n = entry.numPages!;
          let from = 1;
          let to = n;
          if (pageMode === "range" && parsedRange) {
            const c = clampPageRangeForPdf(
              n,
              parsedRange.from,
              parsedRange.to,
            );
            from = c.from;
            to = c.to;
          }
          const buf = await entry.file.arrayBuffer();
          const { blob, extension } = await exportPdfInBrowser(
            buf,
            formatId,
            from,
            to,
          );
          const rangeSuffix = pageMode === "all" ? "" : `-p${from}-${to}`;
          const innerName = `${pdfStemName(entry.file.name)}${config.tool.outputNameSuffix}${rangeSuffix}.${extension}`;
          idx += 1;
          const zipPath = `${String(idx).padStart(2, "0")}-${innerName}`;
          outputs.push({ zipPath, blob });
        }

        const elapsedMs = Math.round(performance.now() - t0);
        let downloadName: string;
        let outBlob: Blob;
        if (outputs.length === 1) {
          downloadName = outputs[0].zipPath.replace(/^\d{2}-/, "");
          outBlob = outputs[0].blob;
        } else {
          const zip = new JSZip();
          for (const o of outputs) {
            zip.file(o.zipPath, o.blob);
          }
          outBlob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
          });
          downloadName = "pdf-converted-batch.zip";
        }
        const url = URL.createObjectURL(outBlob);
        setDownload({
          downloadUrl: url,
          downloadName,
          outputBytes: outBlob.size,
          elapsedMs,
        });
        setState("ready");
        trackActionCompleted({
          ...evtBase,
          elapsed_ms: elapsedMs,
          output_size_mb: bytesToMb(outBlob.size),
          success_count: pdfEntries.length,
          fail_count: 0,
        });
        return;
      }

      if (config.tool.mode === "stub") {
        const file = pdfEntries[0].file;
        const n = pdfEntries[0].numPages!;
        const parsed = parseRangeDrafts(rangeFromDraft, rangeToDraft);
        let from = 1;
        let to = n;
        if (pageMode === "range" && parsed) {
          const c = clampPageRangeForPdf(n, parsed.from, parsed.to);
          from = c.from;
          to = c.to;
        }
        const ratio = config.tool.stubResult?.ratio ?? 1;
        const elapsedMs = config.tool.stubResult?.elapsedMs ?? 140;
        const outputBytes = Math.max(1, Math.round(file.size * ratio));
        const url = URL.createObjectURL(file);
        const rangeSuffix = pageMode === "all" ? "" : `-p${from}-${to}`;
        const downloadName = buildOutputName(
          file.name,
          `${config.tool.outputNameSuffix}${rangeSuffix}`,
        );
        setDownload({
          downloadUrl: url,
          downloadName,
          outputBytes,
          elapsedMs,
        });
        setState("ready");
        trackActionCompleted({
          ...evtBase,
          elapsed_ms: elapsedMs,
          output_size_mb: bytesToMb(outputBytes),
          success_count: 1,
          fail_count: 0,
        });
        return;
      }

      setError(config.tool.messages.compressionFailed);
      trackError({
        ...evtBase,
        error_message: "processing_not_available",
      });
      setState("idle");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : config.tool.messages.compressionFailed;
      setError(msg);
      trackError({ ...evtBase, error_message: "processing_failed" });
      setState("idle");
    }
  };

  const showForm = pdfEntries.length > 0 && state !== "ready";
  const showSuccess = pdfEntries.length > 0 && state === "ready" && download;
  const multiBatch = pdfEntries.length > 1;

  const clampDraftOnBlur = (raw: string, role: "from" | "to") => {
    const cap = Math.max(1, maxPagesAcross);
    const trimmed = raw.trim();
    if (trimmed === "") {
      return role === "from" ? "1" : String(cap);
    }
    const n = parseInt(trimmed, 10);
    if (!Number.isFinite(n)) {
      return role === "from" ? "1" : String(cap);
    }
    return String(Math.min(Math.max(n, 1), cap));
  };

  return (
    <section className="card tool-card convert-pdf-tool">
      <h2 className="section-title">{config.tool.title}</h2>
      <p className="body-text tool-subtitle">{config.tool.subtitle}</p>

      <input
        accept={PDF_ACCEPT}
        className="visually-hidden-file-input"
        multiple
        onChange={(event) => addPdfFiles(event.target.files)}
        ref={fileInputRef}
        type="file"
      />

      {pdfEntries.length === 0 ? (
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
                fill="#fef2f2"
                height="36"
                rx="4"
                stroke="#fca5a5"
                strokeWidth="2"
                width="28"
                x="10"
                y="8"
              />
              <path
                d="M16 16H32M16 22H28M16 28H32"
                stroke="#dc2626"
                strokeLinecap="round"
                strokeWidth="2"
              />
              <path
                d="M24 2V12M24 2L20 6M24 2L28 6"
                stroke="#b91c1c"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <span className="dropzone-label">Choose PDF files</span>
          <span className="dropzone-hint">or drag and drop (up to 20)</span>
          <div className="dropzone-badges">
            <span className="format-badge">PDF</span>
            <span className="format-badge format-badge-muted">
              Up to 20 files · 10 MB each
            </span>
          </div>
        </div>
      ) : showSuccess && download ? (
        <div className="pdf-convert-success">
          <p className="body-text pdf-convert-success-lead">
            {download.downloadName.toLowerCase().endsWith(".zip")
              ? multiBatch
                ? "Your ZIP archive with all converted files is ready to download."
                : "Your ZIP archive is ready to download."
              : "Your file is ready to download."}
          </p>
          <div className="pdf-convert-success-actions">
            <a
              className="btn btn-download"
              download={download.downloadName}
              href={download.downloadUrl}
              onClick={() =>
                trackDownloadResult({
                  tool: toolKind,
                  page_slug: pageSlug,
                  file_type: download.downloadName.split(".").pop() ?? "pdf",
                  file_size_mb: bytesToMb(totalInputBytes),
                  output_size_mb: bytesToMb(download.outputBytes),
                })
              }
            >
              {config.tool.labels.downloadButton}
            </a>
            <button
              className="btn btn-secondary"
              onClick={handleAnotherFile}
              type="button"
            >
              Convert other PDFs
            </button>
          </div>
        </div>
      ) : (
        showForm && (
          <div className="tool-flow">
            <div className="pdf-file-list">
              {pdfEntries.map((e) => (
                <div className="file-info-card" key={e.id}>
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
                        fill="#fef2f2"
                        height="16"
                        rx="3"
                        stroke="#dc2626"
                        strokeWidth="1.5"
                        width="12"
                        x="4"
                        y="2"
                      />
                      <path
                        d="M7 7H13M7 10H11M7 13H13"
                        stroke="#dc2626"
                        strokeLinecap="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <div className="file-info-text">
                      <span className="file-info-name" title={e.file.name}>
                        {e.file.name}
                      </span>
                      <span className="file-info-size">
                        {formatBytes(e.file.size, byteLabels)}
                        {e.loading
                          ? " · Reading…"
                          : e.numPages !== null
                            ? ` · ${e.numPages} ${e.numPages === 1 ? "page" : "pages"}`
                            : ""}
                      </span>
                    </div>
                  </div>
                  <button
                    aria-label={`Remove ${e.file.name}`}
                    className="file-remove-btn"
                    onClick={() => removeEntry(e.id)}
                    type="button"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {pdfEntries.length < PDF_MAX_FILES && (
              <div
                className={`pdf-add-more dropzone pdf-add-more-compact${dragOver ? " dropzone-active" : ""}`}
                onClick={openFilePicker}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") openFilePicker();
                }}
                role="button"
                tabIndex={0}
              >
                <span className="pdf-add-more-label">
                  Add more PDFs ({pdfEntries.length}/{PDF_MAX_FILES}) — click
                  or drop here
                </span>
              </div>
            )}

            <div className="preset-row pdf-format-field">
              <label className="preset-label" id="pdf-export-format-label">
                Export as
              </label>
              <div className="pdf-format-select" ref={formatMenuRef}>
                <button
                  aria-expanded={formatMenuOpen}
                  aria-haspopup="listbox"
                  aria-labelledby="pdf-export-format-label"
                  className="pdf-format-select-trigger"
                  onClick={() => setFormatMenuOpen((o) => !o)}
                  type="button"
                >
                  <span>{formatLabel(formatId)}</span>
                  <svg
                    aria-hidden
                    className="pdf-format-select-chevron"
                    fill="none"
                    height="20"
                    viewBox="0 0 20 20"
                    width="20"
                  >
                    <path
                      d="M5 7l5 5 5-5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
                {formatMenuOpen && (
                  <ul
                    className="pdf-format-select-list"
                    role="listbox"
                    tabIndex={-1}
                  >
                    {EXPORT_FORMATS.map((opt) => (
                      <li key={opt.id} role="none">
                        <button
                          className={
                            opt.id === formatId
                              ? "pdf-format-select-option pdf-format-select-option-active"
                              : "pdf-format-select-option"
                          }
                          onClick={() => {
                            setFormatId(opt.id);
                            setFormatMenuOpen(false);
                          }}
                          role="option"
                          type="button"
                          aria-selected={opt.id === formatId}
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <p className="preset-description">
                {isInBrowserPdfExportFormat(formatId)
                  ? "PNG and JPG render each selected page. Several pages become one ZIP. Text and HTML use embedded PDF text (scanned pages may be empty)."
                  : "Word, Excel, and PowerPoint are not available in the browser yet. Choose PNG, JPG, plain text, or HTML to export now."}
              </p>
            </div>

            <details className="pdf-convert-advanced">
              <summary className="pdf-convert-advanced-summary">
                Page range
              </summary>
              <div className="pdf-convert-advanced-body">
                <fieldset
                  aria-label="Which pages to include"
                  className="pdf-page-mode-fieldset"
                >
                  <label className="pdf-page-mode-option">
                    <input
                      checked={pageMode === "all"}
                      name="pdf-page-mode"
                      onChange={() => setPageMode("all")}
                      type="radio"
                      value="all"
                    />
                    All pages
                  </label>
                  <label className="pdf-page-mode-option">
                    <input
                      checked={pageMode === "range"}
                      name="pdf-page-mode"
                      onChange={() => {
                        setPageMode("range");
                        setRangeFromDraft("1");
                        setRangeToDraft(
                          String(Math.max(1, maxPagesAcross)),
                        );
                      }}
                      type="radio"
                      value="range"
                    />
                    Page range
                  </label>
                </fieldset>
                {pageMode === "range" && allPagesKnown && maxPagesAcross > 0 && (
                  <div className="pdf-page-range-inputs">
                    <label className="pdf-page-range-label">
                      From
                      <input
                        autoComplete="off"
                        className="pdf-page-range-input"
                        inputMode="numeric"
                        onBlur={() =>
                          setRangeFromDraft((d) =>
                            clampDraftOnBlur(d, "from"),
                          )
                        }
                        onChange={(ev) =>
                          setRangeFromDraft(ev.target.value)
                        }
                        pattern="[0-9]*"
                        type="text"
                        value={rangeFromDraft}
                      />
                    </label>
                    <span className="pdf-page-range-sep" aria-hidden>
                      –
                    </span>
                    <label className="pdf-page-range-label">
                      To
                      <input
                        autoComplete="off"
                        className="pdf-page-range-input"
                        inputMode="numeric"
                        onBlur={() =>
                          setRangeToDraft((d) =>
                            clampDraftOnBlur(d, "to"),
                          )
                        }
                        onChange={(ev) =>
                          setRangeToDraft(ev.target.value)
                        }
                        pattern="[0-9]*"
                        type="text"
                        value={rangeToDraft}
                      />
                    </label>
                    <p className="pdf-page-range-hint">
                      Pages are 1–{maxPagesAcross} per document; short files
                      are clipped to their length.
                    </p>
                  </div>
                )}
              </div>
            </details>

            <button
              className="btn btn-compress"
              disabled={disableConvert}
              onClick={onConvert}
              type="button"
            >
              {state === "converting" ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  {config.tool.labels.compressingButton}
                </>
              ) : (
                config.tool.labels.compressButton
              )}
            </button>
          </div>
        )
      )}

      <p className="tool-trust-note">
        Your PDFs are processed locally in your browser. Nothing is uploaded to
        our servers.
      </p>

      {error && <p className="error-message">{error}</p>}
    </section>
  );
}
