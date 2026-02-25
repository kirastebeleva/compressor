# Analytics Events Reference

All analytics events tracked across the site.
Events fire via Google Analytics (`gtag`) and Yandex.Metrika (`ym`).
Implementation: `src/lib/analytics.ts`.

---

## Structured Events (tool lifecycle)

These events use typed helper functions from `analytics.ts`.
Every event includes base params: `tool`, `file_type`, `file_size_mb`, `device`.

| Event name | Helper function | When it fires | Extra params | Used by |
|---|---|---|---|---|
| `tool_open` | `trackToolOpen` | Page component mounts | — | All tools (via `tool-runtime.tsx`) |
| `file_uploaded` | `trackFileUploaded` | User selects or drops a valid file | — | Compress, Crop |
| `processing_started` | `trackProcessingStarted` | User clicks the action button | `preset` | Compress, Crop |
| `processing_completed` | `trackProcessingCompleted` | Processing finishes successfully | `preset`, `output_size_mb`, `compression_ratio`, `elapsed_ms` | Compress, Crop |
| `download_result` | `trackDownloadResult` | User clicks the download button | `output_size_mb` | Compress (via `results-section.tsx`), Crop |
| `error_shown` | `trackErrorShown` | A user-facing error message is displayed | `error_message` | Compress, Crop |

### Base params schema

```
tool            string    ToolKind value (e.g. "image-compress", "image-crop")
file_type       string    MIME type (e.g. "image/jpeg") or "(none)"
file_size_mb    number    Input file size in MB, rounded to 2 decimals
device          string    "desktop" | "mobile" (based on viewport width)
```

---

## Ad-hoc Events (trackEvent)

Fired via the generic `trackEvent(name, params)` wrapper.
Used by tools that manage their own multi-file or mode-specific flows.

### Resize Tool (`image-resize`)

| Event name | When | Params |
|---|---|---|
| `upload_image` | Files added to the queue | `count`, `total` |
| `error_invalid_format` | Unsupported file type dropped | `file_type` |
| `error_file_too_large` | File exceeds 10 MB limit | `file_name`, `file_size` |
| `change_resize_mode` | User switches pixels/percentage tab | `mode` |
| `click_resize` | User clicks "Resize now" | `mode`, `file_count` |
| `download_single` | User downloads one resized file | `file_name` |
| `download_all` | User downloads ZIP of all results | `file_count` |

### Batch Compress Tool (`image-compress`, batch intent)

| Event name | When | Params |
|---|---|---|
| `upload_image` | Files added to the queue | `count`, `total` |
| `click_batch_compress` | User clicks "Compress all" | `preset`, `file_count` |
| `download_single` | User downloads one compressed file | `file_name` |
| `download_all_zip` | User downloads ZIP of all results | `file_count` |

### Crop Tool (`image-crop`)

| Event name | When | Params |
|---|---|---|
| `change_aspect_ratio` | User selects an aspect ratio preset | `tool`, `preset` |

---

## Legacy Events

Kept for backward compatibility with existing GA/YM dashboards.
Fired alongside or instead of structured events in older code paths.

| Event name | Helper function | When | Params | Destination |
|---|---|---|---|---|
| `page_meta` | `trackPageMeta` | Page component mounts | `page_slug`, `tool_intent`, `tool_mode` | gtag |
| `compression_completed` | `trackCompressionCompleted` | Compress tool finishes | `page_slug`, `tool_intent`, `tool_mode`, `preset`, `input_size_bucket`, `input_bytes`, `output_bytes`, `compression_ratio`, `elapsed_ms` | gtag + ym |
| `file_download` | `trackDownload` | Download button click (compress) | `page_slug`, `output_bytes` | gtag |

---

## Event Flow by Tool

### Compress Image (single file)

```
tool_open → page_meta
  → file_uploaded | error_shown (bad format / too large)
  → processing_started
  → processing_completed + compression_completed | error_shown
  → download_result + file_download
```

### Crop Image

```
tool_open → page_meta
  → file_uploaded | error_shown (bad format / too large)
  → change_aspect_ratio (optional, repeatable)
  → processing_started
  → processing_completed | error_shown
  → download_result
```

### Resize Image

```
tool_open → page_meta
  → upload_image | error_invalid_format | error_file_too_large
  → change_resize_mode (optional)
  → click_resize
  → download_single | download_all
```

### Batch Compress

```
tool_open → page_meta
  → upload_image
  → click_batch_compress
  → download_single | download_all_zip
```

---

## Implementation Notes

- All events are wrapped in try/catch — analytics never crashes the app.
- `trackEvent` is the universal low-level wrapper; structured helpers build on top of it.
- `bytesToMb` helper converts bytes → MB rounded to 2 decimals.
- `sizeBucket` helper maps bytes to human-readable ranges for legacy events.
- `getDevice` returns "desktop" or "mobile" based on `window.innerWidth < 768`.
- Yandex.Metrika (`ym`) is only used for `compression_completed` (legacy).
