/**
 * Optional IndexNow ping after `next build` (static export → out/sitemap.xml).
 * Enable in CI with INDEXNOW_AUTO_SUBMIT=1 and INDEXNOW_KEY (see README).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.env.INDEXNOW_AUTO_SUBMIT !== "1") {
  process.exit(0);
}

if (!process.env.INDEXNOW_KEY?.trim()) {
  console.error(
    "INDEXNOW_AUTO_SUBMIT=1 requires INDEXNOW_KEY (must match public/{KEY}.txt).",
  );
  process.exit(1);
}

const submit = path.join(__dirname, "indexnow-submit.mjs");
const result = spawnSync(process.execPath, [submit], {
  stdio: "inherit",
  env: process.env,
  shell: false,
});

process.exit(result.status === null ? 1 : result.status);
