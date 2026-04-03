/**
 * Open a PDF with pdf.js in a way that survives static hosting quirks:
 * wrong MIME for .mjs workers, blocked module workers, strict CSP (no eval).
 */
import { configurePdfJsWorkerSync } from "@/lib/pdfjs-worker";

export type PdfjsModule = typeof import("pdfjs-dist");

export async function loadPdfDocument(
  pdfjs: PdfjsModule,
  data: ArrayBuffer,
): Promise<import("pdfjs-dist").PDFDocumentProxy> {
  configurePdfJsWorkerSync(pdfjs);

  const base = {
    data: new Uint8Array(data),
    /** Avoid font/code paths that can break under strict CSP or flaky workers. */
    useSystemFonts: false as const,
    isEvalSupported: false as const,
  };

  try {
    const task = pdfjs.getDocument(base);
    return await task.promise;
  } catch {
    // Worker failed to start (MIME/COOP/CORS) or other non-fatal setup issue.
    const task = pdfjs.getDocument({ ...base, disableWorker: true });
    return await task.promise;
  }
}
