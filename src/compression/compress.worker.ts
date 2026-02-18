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
    maxDimension: 4096,
    initialQuality: 0.9,
    minQuality: 0.82,
    qualityStep: 0.04,
    maxIterations: 2,
    pngMaxColors: 256,
    pngMinColors: 224,
    pngColorStep: 32,
  },
  balanced: {
    maxDimension: 3200,
    initialQuality: 0.86,
    minQuality: 0.72,
    qualityStep: 0.04,
    maxIterations: 5,
    pngMaxColors: 256,
    pngMinColors: 160,
    pngColorStep: 16,
  },
  max: {
    maxDimension: 2400,
    initialQuality: 0.78,
    minQuality: 0.6,
    qualityStep: 0.05,
    maxIterations: 8,
    pngMaxColors: 192,
    pngMinColors: 96,
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
  const initial = await canvas.convertToBlob({ type, quality });

  // No strict target: preserve quality and avoid over-compressing.
  if (!targetBytes) {
    return initial;
  }

  if (initial.size <= targetBytes) {
    return initial;
  }

  let best = initial;
  let bestBytes = initial.size;

  for (let i = 0; i < preset.maxIterations; i += 1) {
    quality = Math.max(preset.minQuality, quality - preset.qualityStep);
    const candidate = await canvas.convertToBlob({ type, quality });

    // First candidate under target is the highest quality that satisfies it.
    if (candidate.size <= targetBytes) {
      return candidate;
    }

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
  const width = canvas.width;
  const height = canvas.height;

  // Baseline: keep PNG lossless whenever possible.
  const initial = await canvas.convertToBlob({ type: "image/png" });
  if (!targetBytes || initial.size <= targetBytes) {
    return initial;
  }

  let bestBlob: Blob = initial;
  let bestCanvas: OffscreenCanvas = canvas;

  // Prefer downscaling before quantization: fewer color artifacts.
  const scaleSteps =
    targetBytes <= 150 * 1024
      ? [0.92, 0.84, 0.76, 0.68, 0.6, 0.52, 0.45]
      : [0.94, 0.88, 0.82, 0.76, 0.7, 0.64];

  for (const scale of scaleSteps) {
    const nextWidth = Math.max(1, Math.round(width * scale));
    const nextHeight = Math.max(1, Math.round(height * scale));
    const resized = resizeCanvas(bestCanvas, nextWidth, nextHeight);
    const encoded = await resized.convertToBlob({ type: "image/png" });

    if (encoded.size < bestBlob.size) {
      bestBlob = encoded;
      bestCanvas = resized;
    }

    if (encoded.size <= targetBytes) {
      return encoded;
    }
  }

  // Last resort: mild color quantization at the best scaled size.
  const context = bestCanvas.getContext("2d", { alpha: true });
  if (!context) {
    throw new CompressionError("2D canvas context is unavailable for PNG encoding");
  }

  const sourceImageData = context.getImageData(0, 0, bestCanvas.width, bestCanvas.height);
  const sourcePixels = sourceImageData.data;
  const quantizationLevels = targetBytes <= 150 * 1024 ? [16, 14, 12, 10] : [16, 14, 12];

  for (const channelLevels of quantizationLevels) {
    const quantizedPixels = new Uint8ClampedArray(sourcePixels);
    quantizeRgbInPlace(quantizedPixels, channelLevels);

    const tempCanvas = new OffscreenCanvas(bestCanvas.width, bestCanvas.height);
    const tempContext = tempCanvas.getContext("2d", { alpha: true });
    if (!tempContext) {
      throw new CompressionError("2D canvas context is unavailable for PNG quantization");
    }

    tempContext.putImageData(
      new ImageData(quantizedPixels, bestCanvas.width, bestCanvas.height),
      0,
      0
    );

    const encoded = await tempCanvas.convertToBlob({ type: "image/png" });
    if (encoded.size < bestBlob.size) {
      bestBlob = encoded;
    }
    if (encoded.size <= targetBytes) {
      return encoded;
    }
  }

  return bestBlob;
}

function resizeCanvas(
  source: OffscreenCanvas,
  width: number,
  height: number
): OffscreenCanvas {
  const output = new OffscreenCanvas(width, height);
  const context = output.getContext("2d", { alpha: true });

  if (!context) {
    throw new CompressionError("2D canvas context is unavailable for resizing");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(source, 0, 0, width, height);
  return output;
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
