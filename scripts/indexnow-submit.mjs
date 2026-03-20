/**
 * Submits URLs from the static export sitemap to IndexNow (Bing, Yandex, etc.).
 * Run after `next build` so `out/sitemap.xml` exists, or point INDEXNOW_SITEMAP at a live sitemap URL.
 *
 * @see https://www.indexnow.org/documentation
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";
const MAX_URLS_PER_REQUEST = 10_000;

function parseHostFromUrl(url) {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

function extractLocsFromSitemapXml(xml) {
  const locs = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const u = m[1].trim();
    if (u) locs.push(u);
  }
  return locs;
}

async function loadSitemapInput() {
  const raw = process.env.INDEXNOW_SITEMAP;
  if (raw && /^https?:\/\//i.test(raw)) {
    const res = await fetch(raw, { redirect: "follow" });
    if (!res.ok) {
      throw new Error(`Failed to fetch sitemap: ${res.status} ${res.statusText}`);
    }
    return await res.text();
  }
  const filePath = path.join(
    ROOT,
    raw && !raw.includes("://") ? raw : "out/sitemap.xml",
  );
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Sitemap not found: ${filePath}. Run \`next build\` first or set INDEXNOW_SITEMAP to a URL or path.`,
    );
  }
  return fs.readFileSync(filePath, "utf8");
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

async function main() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    console.error(
      "INDEXNOW_KEY is not set. It must match the value in public/{KEY}.txt",
    );
    process.exit(1);
  }

  const xml = await loadSitemapInput();
  const urlList = extractLocsFromSitemapXml(xml);
  if (urlList.length === 0) {
    console.error("No <loc> entries found in sitemap.");
    process.exit(1);
  }

  const host =
    process.env.INDEXNOW_HOST?.trim() ||
    parseHostFromUrl(urlList[0]);
  if (!host) {
    console.error("Could not determine host; set INDEXNOW_HOST (e.g. imgloo.com).");
    process.exit(1);
  }

  const keyLocation =
    process.env.INDEXNOW_KEY_LOCATION?.trim() ||
    `https://${host}/${key}.txt`;

  const dryRun = process.env.INDEXNOW_DRY_RUN === "1";

  const batches = chunk(urlList, MAX_URLS_PER_REQUEST);
  for (let i = 0; i < batches.length; i++) {
    const body = {
      host,
      key,
      keyLocation,
      urlList: batches[i],
    };
    if (dryRun) {
      console.log(
        `[dry-run] batch ${i + 1}/${batches.length} (${batches[i].length} URLs)`,
      );
      continue;
    }
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `IndexNow HTTP ${res.status} for batch ${i + 1}: ${text || res.statusText}`,
      );
    }
    console.log(
      `IndexNow OK batch ${i + 1}/${batches.length} (${batches[i].length} URLs)`,
    );
  }

  if (dryRun) {
    console.log(`Would submit ${urlList.length} URL(s) to ${INDEXNOW_ENDPOINT}`);
  } else {
    console.log(`Submitted ${urlList.length} URL(s) to IndexNow.`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
