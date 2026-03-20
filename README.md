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

4. In CI (e.g. GitHub Actions), add a step **after** `npm run build` and deploy, store `INDEXNOW_KEY` in secrets, and run `npm run indexnow:submit`.

Implementation: `scripts/indexnow-submit.mjs` reads the sitemap, chunks URLs (max 10k per request per [IndexNow](https://www.indexnow.org/documentation)), and POSTs to `https://api.indexnow.org/IndexNow`.
