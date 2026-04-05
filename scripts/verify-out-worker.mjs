/**
 * Fail the build if pdf.js workers are missing from the static export.
 * Catches hosts / pipelines that drop or skip `public/*.mjs` assets.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");
const names = ["pdf.worker.min.js", "pdf.worker.min.mjs"];

if (!fs.existsSync(outDir)) {
  console.error("verify-out-worker: out/ missing — run next build first");
  process.exit(1);
}

for (const name of names) {
  const p = path.join(outDir, name);
  if (!fs.existsSync(p)) {
    console.error(`verify-out-worker: missing ${name} in out/`);
    process.exit(1);
  }
  const { size } = fs.statSync(p);
  if (size < 10_000) {
    console.error(`verify-out-worker: ${name} too small (${size} bytes)`);
    process.exit(1);
  }
}
console.log("verify-out-worker: OK");
