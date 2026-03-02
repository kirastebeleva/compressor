/**
 * Central source of truth for all image conversion directions.
 * Used by both the universal /convert-image page and individual SEO pair pages.
 * Do not duplicate this data elsewhere — add new directions here only.
 */

/** Normalises "jpeg" → "jpg" so the rest of the codebase deals with one key. */
export function normaliseFormat(fmt: string): string {
  return fmt.toLowerCase() === "jpeg" ? "jpg" : fmt.toLowerCase();
}

/**
 * Allowed conversion directions.
 * Key = input format, value = list of valid output formats.
 * Phase 1–2 supported pairs only — extend here when adding new targets.
 */
export const ALLOWED_CONVERSIONS: Record<string, readonly string[]> = {
  webp: ["jpg"],
  jpg: ["png", "webp"],
  png: ["jpg", "webp", "avif"],
  heic: ["jpg"],
};

/** All input formats that have at least one conversion target. */
export const SUPPORTED_INPUT_FORMATS: readonly string[] =
  Object.keys(ALLOWED_CONVERSIONS);

/** All output formats that appear in at least one conversion. */
export const SUPPORTED_OUTPUT_FORMATS: readonly string[] = [
  ...new Set(Object.values(ALLOWED_CONVERSIONS).flat()),
];

/** Maps MIME type → canonical format key ("jpeg" is normalised to "jpg"). */
export const MIME_TO_FORMAT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/heif": "heic",
};

/** Maps canonical format key → MIME type used when encoding output. */
export const FORMAT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  heic: "image/heic",
};

/**
 * Value for the `accept` attribute on the file input.
 * Includes both MIME types and explicit extensions because some browsers
 * (especially on Windows) do not recognise HEIC/HEIF by MIME type alone.
 */
export const ACCEPTED_INPUT_MIMES =
  "image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif,.heic,.heif";

/** Human-readable display label for a canonical format key (e.g. "jpg" → "JPG"). */
export function formatLabel(fmt: string): string {
  return fmt.toUpperCase();
}

/** Detect the canonical format from a File object: MIME type first, then extension. */
export function detectFormatFromFile(file: File): string | null {
  if (file.type && MIME_TO_FORMAT[file.type]) {
    return normaliseFormat(MIME_TO_FORMAT[file.type]);
  }
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  const EXT_MAP: Record<string, string> = {
    jpg: "jpg",
    jpeg: "jpg",
    png: "png",
    webp: "webp",
    avif: "avif",
    heic: "heic",
    heif: "heic",
  };
  return EXT_MAP[ext] ?? null;
}

/**
 * Build the output filename: replace the original extension with the new format.
 * E.g. "photo.png" + "webp" → "photo-converted.webp"
 */
export function buildConvertedName(
  originalName: string,
  toFormat: string,
): string {
  const dotIdx = originalName.lastIndexOf(".");
  const base = dotIdx >= 0 ? originalName.slice(0, dotIdx) : originalName;
  return `${base}-converted.${toFormat}`;
}
