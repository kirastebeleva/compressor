import type {
  ResizeResult,
  ResizeOptions,
  ResizeWorkerRequest,
  ResizeWorkerResponse,
} from "./types";

export const SUPPORTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_DIMENSION = 8000;
export const MAX_FILES = 10;

const WORKER_TIMEOUT = 30_000;

export async function resizeImage(
  file: File,
  options: ResizeOptions,
): Promise<ResizeResult> {
  if (!SUPPORTED_TYPES.has(file.type)) {
    throw new Error("Unsupported format. Use JPG, PNG, or WebP.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large. Maximum size is 10 MB.");
  }

  if (
    options.targetWidth <= 0 ||
    options.targetHeight <= 0 ||
    options.targetWidth > MAX_DIMENSION ||
    options.targetHeight > MAX_DIMENSION
  ) {
    throw new Error(
      `Dimensions must be between 1 and ${MAX_DIMENSION} pixels.`,
    );
  }

  const startedAt = performance.now();
  const requestId = crypto.randomUUID();

  const bitmap = await createImageBitmap(file);
  const inputWidth = bitmap.width;
  const inputHeight = bitmap.height;
  bitmap.close();

  const worker = new Worker(
    new URL("./resize.worker.ts", import.meta.url),
    { type: "module" },
  );

  try {
    const result = await runWorker(worker, {
      id: requestId,
      file,
      fileType: file.type,
      targetWidth: Math.round(options.targetWidth),
      targetHeight: Math.round(options.targetHeight),
    });

    const elapsedMs = Math.round(performance.now() - startedAt);

    return {
      outputBlob: result.outputBlob,
      outputWidth: result.outputWidth,
      outputHeight: result.outputHeight,
      inputWidth,
      inputHeight,
      inputBytes: file.size,
      outputBytes: result.outputBlob.size,
      elapsedMs,
    };
  } finally {
    worker.terminate();
  }
}

function runWorker(
  worker: Worker,
  payload: ResizeWorkerRequest,
): Promise<{ outputBlob: Blob; outputWidth: number; outputHeight: number }> {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error("Resize worker timed out."));
    }, WORKER_TIMEOUT);

    const clearHandlers = () => {
      window.clearTimeout(timeoutId);
      worker.onerror = null;
      worker.onmessage = null;
      worker.onmessageerror = null;
    };

    worker.onerror = (event: ErrorEvent) => {
      clearHandlers();
      reject(new Error(event.message || "Resize worker crashed."));
    };

    worker.onmessageerror = () => {
      clearHandlers();
      reject(new Error("Resize worker message deserialization failed."));
    };

    worker.onmessage = (event: MessageEvent<ResizeWorkerResponse>) => {
      const message = event.data;
      if (message.id !== payload.id) return;

      if (!message.ok) {
        clearHandlers();
        reject(new Error(message.error));
        return;
      }

      clearHandlers();
      resolve({
        outputBlob: message.outputBlob,
        outputWidth: message.outputWidth,
        outputHeight: message.outputHeight,
      });
    };

    worker.postMessage(payload);
  });
}
