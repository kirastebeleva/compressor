/**
 * Client-side PDF page count via pdf.js (same file buffer, no upload).
 */

import { loadPdfDocument } from "@/lib/pdf-open";

export async function getPdfPageCount(data: ArrayBuffer): Promise<number> {
  const pdfjs = await import("pdfjs-dist");
  const pdf = await loadPdfDocument(pdfjs, data);
  const n = pdf.numPages;
  await pdf.destroy().catch(() => {});
  return n;
}
