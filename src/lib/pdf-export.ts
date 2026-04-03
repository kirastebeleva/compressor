import JSZip from "jszip";
import { configurePdfJsWorkerSync } from "@/lib/pdfjs-worker";

export type PdfExportFormatId =
  | "docx"
  | "xlsx"
  | "pptx"
  | "png"
  | "jpg"
  | "txt"
  | "html";

export function isInBrowserPdfExportFormat(
  id: PdfExportFormatId,
): id is "png" | "jpg" | "txt" | "html" {
  return id === "png" || id === "jpg" || id === "txt" || id === "html";
}

export type PdfExportResult = {
  blob: Blob;
  extension: string;
};

const RENDER_SCALE = 2;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cssEscapeFontFamily(name: string): string {
  return `'${name.trim().replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

const UTF8_BOM = new Uint8Array([0xef, 0xbb, 0xbf]);

/** Explicit UTF-8 bytes so viewers (esp. Windows) don’t mis-detect encoding. */
function stringToUtf8Blob(
  text: string,
  mime: string,
  options?: { bom?: boolean },
): Blob {
  const enc = new TextEncoder();
  const body = enc.encode(text);
  if (options?.bom) {
    const out = new Uint8Array(UTF8_BOM.length + body.length);
    out.set(UTF8_BOM, 0);
    out.set(body, UTF8_BOM.length);
    return new Blob([out], { type: mime });
  }
  return new Blob([body], { type: mime });
}

async function pageToImageBlob(
  page: import("pdfjs-dist").PDFPageProxy,
  format: "png" | "jpg",
): Promise<Blob> {
  const viewport = page.getViewport({ scale: RENDER_SCALE });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create canvas context.");
  }
  await page.render({ canvasContext: ctx, viewport }).promise;

  if (format === "jpg") {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("JPEG export failed."))),
        "image/jpeg",
        0.92,
      );
    });
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("PNG export failed."))),
      "image/png",
    );
  });
}

type TextRun = {
  str: string;
  x: number;
  y: number;
  h: number;
  w: number;
  hasEOL: boolean;
  fontName: string;
};

function collectTextRuns(textContent: {
  items: unknown[];
}): TextRun[] {
  const runs: TextRun[] = [];
  for (const item of textContent.items) {
    if (!item || typeof item !== "object" || !("str" in item)) continue;
    const ti = item as {
      str?: string;
      transform?: number[];
      width?: number;
      height?: number;
      hasEOL?: boolean;
      fontName?: string;
    };
    if (typeof ti.str !== "string" || ti.str.length === 0) continue;
    const t = ti.transform;
    const x = Array.isArray(t) && t.length >= 6 ? Number(t[4]) : 0;
    const y = Array.isArray(t) && t.length >= 6 ? Number(t[5]) : 0;
    const h =
      typeof ti.height === "number" && ti.height > 0 ? ti.height : 12;
    const w =
      typeof ti.width === "number" && ti.width > 0
        ? ti.width
        : Math.max(ti.str.length * h * 0.45, h * 0.2);
    runs.push({
      str: ti.str,
      x,
      y,
      h,
      w,
      hasEOL: !!ti.hasEOL,
      fontName: typeof ti.fontName === "string" ? ti.fontName : "",
    });
  }
  return runs;
}

/**
 * Rebuild lines using glyph positions (PDF stores text as positioned runs, not
 * paragraphs). Top-to-first scan then split when Y jumps beyond tolerance.
 */
function runsToLines(runs: TextRun[]): TextRun[][] {
  if (runs.length === 0) return [];

  const avgH =
    runs.reduce((s, r) => s + r.h, 0) / Math.max(1, runs.length);
  const yTol = Math.max(avgH * 0.35, 2);

  const sorted = [...runs].sort((a, b) => b.y - a.y || a.x - b.x);
  const lines: TextRun[][] = [];
  let cur: TextRun[] = [];

  for (const run of sorted) {
    if (!cur.length) {
      cur.push(run);
      continue;
    }
    const y0 = cur[0].y;
    if (Math.abs(run.y - y0) <= yTol) {
      cur.push(run);
    } else {
      cur.sort((a, b) => a.x - b.x);
      lines.push(cur);
      cur = [run];
    }
  }

  if (cur.length) {
    cur.sort((a, b) => a.x - b.x);
    lines.push(cur);
  }

  return lines;
}

function lineToPlainString(line: TextRun[]): string {
  let out = "";
  let prevEndX = line[0]?.x ?? 0;

  for (let i = 0; i < line.length; i++) {
    const run = line[i];
    if (i > 0) {
      const gap = run.x - prevEndX;
      if (gap > run.h * 0.15 && !out.endsWith(" ") && !run.str.startsWith(" ")) {
        out += gap > run.h * 0.8 ? "\t" : " ";
      }
    }
    out += run.str;
    prevEndX = run.x + run.w;
    if (run.hasEOL) out += "\n";
  }

  return out.replace(/[ \t]+\n/g, "\n").trimEnd();
}

async function extractPagePlainText(
  page: import("pdfjs-dist").PDFPageProxy,
): Promise<string> {
  const textContent = await page.getTextContent();
  const runs = collectTextRuns(textContent);
  if (runs.length === 0) return "";

  const lines = runsToLines(runs);
  return lines
    .map((line) => lineToPlainString(line))
    .filter((s) => s.length > 0)
    .join("\n");
}

async function extractPageHtmlLines(
  page: import("pdfjs-dist").PDFPageProxy,
): Promise<string[]> {
  const textContent = await page.getTextContent();
  const styles = textContent.styles;
  const runs = collectTextRuns(textContent);
  if (runs.length === 0) return ["&#160;"];

  const lines = runsToLines(runs);
  const out: string[] = [];

  for (const line of lines) {
    const parts: string[] = [];

    for (const run of line) {
      const st = run.fontName ? styles[run.fontName] : undefined;
      const rawFf = st?.fontFamily?.trim() ?? "";
      const ff =
        rawFf && !/^sans-serif$/i.test(rawFf) ? rawFf : "";
      const safe = escapeHtml(run.str);

      if (ff) {
        parts.push(
          `<span style="font-family:${cssEscapeFontFamily(ff)}">${safe}</span>`,
        );
      } else {
        parts.push(safe);
      }
    }

    const joined = parts.join("").trim();
    out.push(joined.length ? joined : "&#160;");
  }

  return out.length ? out : ["&#160;"];
}

export async function exportPdfInBrowser(
  data: ArrayBuffer,
  format: "png" | "jpg" | "txt" | "html",
  pageFrom: number,
  pageTo: number,
): Promise<PdfExportResult> {
  const pdfjs = await import("pdfjs-dist");
  configurePdfJsWorkerSync(pdfjs);

  const pdf = await pdfjs
    .getDocument({ data: data.slice(0), useSystemFonts: true })
    .promise;
  const from = Math.max(1, pageFrom);
  const to = Math.min(pdf.numPages, pageTo);

  if (from > to || from < 1) {
    throw new Error("Invalid page range.");
  }

  if (format === "png" || format === "jpg") {
    const ext = format === "jpg" ? "jpg" : "png";
    const blobs: { name: string; blob: Blob }[] = [];
    for (let i = from; i <= to; i++) {
      const page = await pdf.getPage(i);
      const blob = await pageToImageBlob(page, format);
      blobs.push({
        name: `page-${String(i).padStart(3, "0")}.${ext}`,
        blob,
      });
    }

    if (blobs.length === 1) {
      return { blob: blobs[0].blob, extension: ext };
    }

    const zip = new JSZip();
    for (const { name, blob } of blobs) {
      zip.file(name, blob);
    }
    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
    });
    return { blob, extension: "zip" };
  }

  if (format === "txt") {
    const chunks: string[] = [];
    for (let i = from; i <= to; i++) {
      const page = await pdf.getPage(i);
      const text = await extractPagePlainText(page);
      chunks.push(text.trim() || "");
    }
    const body = chunks.filter(Boolean).join("\n\n");
    return {
      blob: stringToUtf8Blob(body, "text/plain;charset=utf-8", { bom: true }),
      extension: "txt",
    };
  }

  if (format === "html") {
    const sections: string[] = [];
    for (let i = from; i <= to; i++) {
      const page = await pdf.getPage(i);
      const lineHtmls = await extractPageHtmlLines(page);
      const inner = lineHtmls
        .map((line) => `<div class="pdf-text-line">${line}</div>`)
        .join("\n");
      sections.push(`<section class="pdf-page" data-page="${i}">${inner}</section>`);
    }
    const html = `<!DOCTYPE html>\n<html lang="und">\n<head>\n<meta charset="utf-8"/>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>\n<meta name="viewport" content="width=device-width, initial-scale=1"/>\n<title>PDF export</title>\n<style>
body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#111;line-height:1.5;margin:16px}
.pdf-page{margin-bottom:1.75rem}
.pdf-text-line{white-space:pre-wrap;margin:0.12em 0;font-size:15px;line-height:1.45}
</style>\n</head>\n<body>\n${sections.join("\n")}\n</body>\n</html>`;
    return {
      blob: stringToUtf8Blob(html, "text/html;charset=utf-8", { bom: true }),
      extension: "html",
    };
  }

  throw new Error("Unsupported export format.");
}
