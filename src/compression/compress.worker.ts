/// <reference lib="webworker" />

type SupportedFormat = "image/jpeg" | "image/png" | "image/webp";
type CompressionPresetId = "fast" | "balanced" | "max";

type CompressionPreset = {
  maxDimension: number;
  initialQuality: number;
  minQuality: number;
  qualityStep: number;
  maxIterations: number;
  pngMaxColors: number;
  pngMinColors: number;
  pngColorStep: number;
};

type CompressWorkerRequest = {
  id: string;
  file: Blob;
  fileType: SupportedFormat;
  presetId?: CompressionPresetId;
  targetBytes?: number;
  keepFormat: true;
};

type CompressWorkerSuccess = {
  id: string;
  ok: true;
  outputBlob: Blob;
  outputBytes: number;
};

type CompressWorkerFailure = {
  id: string;
  ok: false;
  error: string;
};

const DEFAULT_PRESET: CompressionPresetId = "balanced";
const SOFT_PIXEL_LIMIT = 30_000_000;
const PRESETS: Record<CompressionPresetId, CompressionPreset> = {
  fast: {
    maxDimension: 2200,
    initialQuality: 0.82,
    minQuality: 0.72,
    qualityStep: 0.07,
    maxIterations: 2,
    pngMaxColors: 192,
    pngMinColors: 128,
    pngColorStep: 32,
  },
  balanced: {
    maxDimension: 2000,
    initialQuality: 0.74,
    minQuality: 0.55,
    qualityStep: 0.06,
    maxIterations: 5,
    pngMaxColors: 128,
    pngMinColors: 64,
    pngColorStep: 16,
  },
  max: {
    maxDimension: 1600,
    initialQuality: 0.6,
    minQuality: 0.35,
    qualityStep: 0.05,
    maxIterations: 8,
    pngMaxColors: 64,
    pngMinColors: 16,
    pngColorStep: 16,
  },
};

class CompressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CompressionError";
  }
}

const workerGlobal = self as unknown as Worker;

workerGlobal.onmessage = async (event: MessageEvent<CompressWorkerRequest>) => {
  const { id, file, fileType, presetId, targetBytes, keepFormat } = event.data;

  try {
    const outputBlob = await compressImageInWorker(
      file,
      fileType,
      presetId,
      targetBytes,
      keepFormat
    );

    const response: CompressWorkerSuccess = {
      id,
      ok: true,
      outputBlob,
      outputBytes: outputBlob.size,
    };
    workerGlobal.postMessage(response);
  } catch (error) {
    const response: CompressWorkerFailure = {
      id,
      ok: false,
      error: error instanceof Error ? error.message : "Compression failed",
    };
    workerGlobal.postMessage(response);
  }
};

async function compressImageInWorker(
  file: Blob,
  fileType: SupportedFormat,
  presetId: CompressionPresetId | undefined,
  targetBytes: number | undefined,
  keepFormat: true
): Promise<Blob> {
  if (!keepFormat) {
    throw new CompressionError("Only keepFormat=true is supported in MVP");
  }

  const preset = PRESETS[presetId ?? DEFAULT_PRESET];
  const bitmap = await createImageBitmap(file);

  try {
    const { width, height } = resolveTargetSize(bitmap.width, bitmap.height, preset);

    if (width * height > SOFT_PIXEL_LIMIT) {
      throw new CompressionError("Image exceeds soft pixel limit");
    }

    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      throw new CompressionError("2D canvas context is unavailable");
    }

    context.drawImage(bitmap, 0, 0, width, height);

    return await encodeWithPreset(canvas, fileType, preset, targetBytes);
  } finally {
    bitmap.close();
  }
}

function resolveTargetSize(
  width: number,
  height: number,
  preset: CompressionPreset
): { width: number; height: number } {
  const largestSide = Math.max(width, height);

  if (largestSide <= preset.maxDimension) {
    return { width, height };
  }

  const scale = preset.maxDimension / largestSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function encodeWithPreset(
  canvas: OffscreenCanvas,
  type: SupportedFormat,
  preset: CompressionPreset,
  targetBytes: number | undefined
): Promise<Blob> {
  if (type === "image/png") {
    return await encodePngWithPreset(canvas, preset, targetBytes);
  }

  let quality = preset.initialQuality;
  let best = await canvas.convertToBlob({ type, quality });
  let bestBytes = best.size;

  for (let i = 0; i < preset.maxIterations; i += 1) {
    if (targetBytes && bestBytes <= targetBytes) {
      break;
    }

    quality = Math.max(preset.minQuality, quality - preset.qualityStep);
    const candidate = await canvas.convertToBlob({ type, quality });

    if (candidate.size <= bestBytes) {
      best = candidate;
      bestBytes = candidate.size;
    }

    if (quality <= preset.minQuality) {
      break;
    }
  }

  return best;
}

async function encodePngWithPreset(
  canvas: OffscreenCanvas,
  preset: CompressionPreset,
  targetBytes: number | undefined
): Promise<Blob> {
  const context = canvas.getContext("2d", { alpha: true });

  if (!context) {
    throw new CompressionError("2D canvas context is unavailable for PNG encoding");
  }

  const width = canvas.width;
  const height = canvas.height;
  const sourceImageData = context.getImageData(0, 0, width, height);
  const sourcePixels = sourceImageData.data;

  let colorCount = preset.pngMaxColors;
  let best: Blob | null = null;

  while (colorCount >= preset.pngMinColors) {
    const level = toChannelLevels(colorCount);
    const quantizedPixels = new Uint8ClampedArray(sourcePixels);
    quantizeRgbInPlace(quantizedPixels, level);

    const tempCanvas = new OffscreenCanvas(width, height);
    const tempContext = tempCanvas.getContext("2d", { alpha: true });

    if (!tempContext) {
      throw new CompressionError("2D canvas context is unavailable for PNG quantization");
    }

    tempContext.putImageData(new ImageData(quantizedPixels, width, height), 0, 0);
    const encoded = await tempCanvas.convertToBlob({ type: "image/png" });

    if (!best || encoded.size < best.size) {
      best = encoded;
    }

    if (targetBytes && encoded.size <= targetBytes) {
      break;
    }

    if (colorCount === preset.pngMinColors) {
      break;
    }

    colorCount = Math.max(preset.pngMinColors, colorCount - preset.pngColorStep);
  }

  if (!best) {
    throw new CompressionError("PNG encoding failed");
  }

  return best;
}

function toChannelLevels(colorCount: number): number {
  return Math.max(2, Math.min(16, Math.round(Math.cbrt(colorCount))));
}

function quantizeRgbInPlace(pixels: Uint8ClampedArray, channelLevels: number): void {
  const step = 255 / (channelLevels - 1);

  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = quantizeChannelValue(pixels[i], step);
    pixels[i + 1] = quantizeChannelValue(pixels[i + 1], step);
    pixels[i + 2] = quantizeChannelValue(pixels[i + 2], step);
  }
}

function quantizeChannelValue(value: number, step: number): number {
  return Math.max(0, Math.min(255, Math.round(value / step) * step));
}
