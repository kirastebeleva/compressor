/**
 * Copies pdf.js worker into public/ for static export. The file is committed to git
 * so production always serves /pdf.worker.min.mjs even if a host skips prebuild hooks.
 * After upgrading `pdfjs-dist`, run this script and commit the updated file.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(
  root,
  "node_modules",
  "pdfjs-dist",
  "build",
  "pdf.worker.min.mjs",
);
const dest = path.join(root, "public", "pdf.worker.min.mjs");

if (!fs.existsSync(src)) {
  console.error("copy-pdf-worker: missing", src);
  process.exit(1);
}
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
console.log("copy-pdf-worker: copied to public/pdf.worker.min.mjs");
