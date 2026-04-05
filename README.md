# imgloo.com (Next.js)

## IndexNow verification

The file `public/89db74dd95fc4018a6e75fd66d9c7292.txt` is required for [IndexNow](https://www.indexnow.org/) ownership verification: after deploy it must be reachable at `https://imgloo.com/89db74dd95fc4018a6e75fd66d9c7292.txt`, with the response body exactly equal to the key (no leading/trailing whitespace). Do not remove or rename it unless you rotate the key with search engines.

### Submitting URLs on changes

This app is a static export: there is no CMS webhook. The practical pattern is **notify IndexNow after each production build or deploy** (only URLs that actually changed is ideal; notifying the full sitemap on every deploy is a common simplification).

1. Build so `out/sitemap.xml` exists: `npm run build` (uses `NEXT_PUBLIC_BASE_URL` / defaults from `src/app/sitemap.ts`).
2. Ensure the key file is already live at `https://imgloo.com/{KEY}.txt` before the first real submit (or submit only after deploy).
3. Run:

   ```bash
   INDEXNOW_KEY=your_key_here npm run indexnow:submit
   ```

   Optional environment variables:

   | Variable | Purpose |
   |----------|---------|
   | `INDEXNOW_KEY` | Required. Must match `public/{KEY}.txt`. |
   | `INDEXNOW_SITEMAP` | Path under repo root (e.g. `out/sitemap.xml`) or full URL to a sitemap (e.g. `https://imgloo.com/sitemap.xml`) if you prefer to read the live file after deploy. |
   | `INDEXNOW_HOST` | Hostname for the API (default: parsed from the first `<loc>`). |
   | `INDEXNOW_KEY_LOCATION` | Full URL of the key file (default: `https://{host}/{key}.txt`). |
   | `INDEXNOW_DRY_RUN=1` | Log batches only; no HTTP POST. |
   | `INDEXNOW_AUTO_SUBMIT=1` | After `npm run build`, `postbuild` runs `indexnow:submit` automatically (requires `INDEXNOW_KEY`). Off by default so local builds do not ping the API. |

4. In CI, pick one:
   - **GitHub Actions (recommended for static hosts):** add repository secret **`INDEXNOW_KEY`** (same value as `public/{KEY}.txt`). After each production deploy, run workflow **IndexNow** manually (*Actions → IndexNow → Run workflow*). It reads `https://imgloo.com/sitemap.xml` and POSTs all `<loc>` URLs — no build required.
   - **Build-time ping:** set **`INDEXNOW_AUTO_SUBMIT=1`** and **`INDEXNOW_KEY`** on the job that runs `npm run build`, so **`postbuild`** submits from `out/sitemap.xml` (works when CI builds the site itself).

Implementation: `scripts/indexnow-submit.mjs` reads the sitemap, chunks URLs (max 10k per request per [IndexNow](https://www.indexnow.org/documentation)), and POSTs to `https://api.indexnow.org/IndexNow`.

### PDF.js worker (Convert PDF)

The UI loads **`/pdf.worker.min.js`** from your domain (same file is also deployed as `pdf.worker.min.mjs`). After `next build`, both must exist under `out/` — `postbuild` runs `scripts/verify-out-worker.mjs` to fail the build if they are missing.

If your static host still returns **404** for those URLs, publish the **entire** `out/` output, or set an env override:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_PDFJS_WORKER_SRC` | Full URL to the worker script (e.g. `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs` — keep the version in sync with `dependencies.pdfjs-dist` in `package.json`). |
