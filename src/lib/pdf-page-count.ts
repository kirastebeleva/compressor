/**
 * Client-side PDF page count via pdf.js (same file buffer, no upload).
 */

import { configurePdfJsWorkerSync } from "@/lib/pdfjs-worker";

export async function getPdfPageCount(data: ArrayBuffer): Promise<number> {
  const pdfjs = await import("pdfjs-dist");
  configurePdfJsWorkerSync(pdfjs);
  const task = pdfjs.getDocument({
    data: data.slice(0),
    useSystemFonts: true,
  });
  const pdf = await task.promise;
  return pdf.numPages;
}
