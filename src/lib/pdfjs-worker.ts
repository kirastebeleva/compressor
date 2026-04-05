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
  const origin = window.location.origin;
  const fromEnv = process.env.NEXT_PUBLIC_PDFJS_WORKER_SRC?.trim();
  // Prefer `.js` in production: some CDNs / static hosts mishandle `.mjs` or omit it from deploy.
  pdfjs.GlobalWorkerOptions.workerSrc =
    fromEnv || `${origin}/pdf.worker.min.js`;
  configured = true;
}
