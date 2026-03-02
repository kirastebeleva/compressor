import { FORMAT_TO_MIME } from "@/core/config/conversions";
import type { ConvertOptions, ConvertResult } from "./types";

/** Convert using the Canvas 2D API — works for jpg / png / webp / avif. */
async function canvasConvert(
  file: File,
  toMime: string,
  quality: number,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to acquire 2D canvas context");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(
            new Error(
              "Conversion failed — this output format may not be supported by your browser",
            ),
          );
        }
      },
      toMime,
      quality,
    );
  });
}

/**
 * Convert HEIC / HEIF files using heic2any (loaded lazily so it is only
 * bundled when the user actually uploads a HEIC file).
 */
async function heicConvert(
  file: File,
  toMime: string,
  quality: number,
): Promise<Blob> {
  let heic2any: (typeof import("heic2any"))["default"];
  try {
    heic2any = (await import("heic2any")).default;
  } catch {
    throw new Error(
      "HEIC conversion could not be initialised. Please try again or use a different browser.",
    );
  }
  const result = await heic2any({ blob: file, toType: toMime, quality });
  return Array.isArray(result) ? result[0] : result;
}

/** Convert an image file to the given output format. Works in the browser only. */
export async function convertImage(
  file: File,
  options: ConvertOptions,
): Promise<ConvertResult> {
  const { toFormat, quality = 0.92 } = options;
  const toMime = FORMAT_TO_MIME[toFormat];
  if (!toMime) throw new Error(`Unknown output format: ${toFormat}`);

  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file.name);

  const start = performance.now();
  const outputBlob = isHeic
    ? await heicConvert(file, toMime, quality)
    : await canvasConvert(file, toMime, quality);
  const elapsedMs = Math.round(performance.now() - start);

  return {
    outputBlob,
    outputMime: toMime,
    inputBytes: file.size,
    outputBytes: outputBlob.size,
    elapsedMs,
  };
}
