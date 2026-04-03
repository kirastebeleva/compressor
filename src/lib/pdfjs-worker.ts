/**
 * Use the pdf.js worker from /public (copied from pdfjs-dist by predev/prebuild)
 * so page count and export work without a third-party CDN.
 */

let configured = false;

export function configurePdfJsWorkerSync(pdfjs: {
  GlobalWorkerOptions: { workerSrc: string };
}): void {
  if (typeof window === "undefined" || configured) {
    return;
  }
  pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;
  configured = true;
}
