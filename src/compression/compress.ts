import { DEFAULT_PRESET, LIMITS, SUPPORTED_FORMATS } from "@/compression/config";
import { CompressionError } from "@/compression/errors";
import type {
  CompressOptions,
  CompressResult,
  CompressionPresetId,
  SupportedFormat,
} from "@/compression/types";
import type {
  CompressWorkerRequest,
  CompressWorkerResponse,
} from "@/compression/protocol";

export async function compress(file: File, options: CompressOptions): Promise<CompressResult> {
  validateFile(file);
  validateOptions(options);

  const startedAt = performance.now();
  const preset = (options.preset ?? DEFAULT_PRESET) as CompressionPresetId;
  const requestId = crypto.randomUUID();

  const worker = new Worker(new URL("./compress.worker.ts", import.meta.url), {
    type: "module",
  });

  try {
    const workerResult = await runWorker(worker, {
      id: requestId,
      file,
      fileType: file.type as SupportedFormat,
      presetId: preset,
      targetBytes: options.targetBytes,
      keepFormat: options.keepFormat,
    });

    const outputBlob = workerResult.outputBlob;

    const elapsedMs = Math.round(performance.now() - startedAt);

    return {
      outputBlob,
      stats: {
        inputBytes: file.size,
        outputBytes: outputBlob.size,
        ratio: outputBlob.size / file.size,
        elapsedMs,
      },
    };
  } finally {
    worker.terminate();
  }
}

function validateFile(file: File): void {
  if (!SUPPORTED_FORMATS.includes(file.type as SupportedFormat)) {
    throw new CompressionError("Unsupported file format. Use JPG, PNG or WebP.");
  }

  if (file.size > LIMITS.maxFileSizeBytes) {
    throw new CompressionError("File is too large. Maximum size is 10MB.");
  }

  if (file.size > LIMITS.maxTotalSizeBytes) {
    throw new CompressionError("Total size limit exceeded.");
  }
}

function validateOptions(options: CompressOptions): void {
  if (!options.keepFormat) {
    throw new CompressionError("MVP requires keepFormat=true.");
  }

  if (options.targetBytes && options.targetBytes <= 0) {
    throw new CompressionError("targetBytes must be a positive number.");
  }
}

function runWorker(
  worker: Worker,
  payload: CompressWorkerRequest
): Promise<{ outputBlob: Blob; outputBytes: number }> {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(
        new CompressionError(
          "Compression worker timed out before responding."
        )
      );
    }, 20_000);

    const clearHandlers = () => {
      window.clearTimeout(timeoutId);
      worker.onerror = null;
      worker.onmessage = null;
      worker.onmessageerror = null;
    };

    worker.onerror = (event: ErrorEvent) => {
      const details = [event.message, event.filename, event.lineno, event.colno]
        .filter((value) => value !== undefined && value !== null && value !== "")
        .join(" | ");

      clearHandlers();
      reject(
        new CompressionError(
          details
            ? `Compression worker crashed: ${details}`
            : "Compression worker crashed."
        )
      );
    };

    worker.onmessageerror = () => {
      clearHandlers();
      reject(new CompressionError("Compression worker message deserialization failed."));
    };

    worker.onmessage = (event: MessageEvent<CompressWorkerResponse>) => {
      const message = event.data;

      if (message.id !== payload.id) {
        return;
      }

      if (!message.ok) {
        clearHandlers();
        reject(new CompressionError(message.error));
        return;
      }

      clearHandlers();
      resolve({
        outputBlob: message.outputBlob,
        outputBytes: message.outputBytes,
      });
    };

    worker.postMessage(payload);
  });
}
