/// <reference lib="webworker" />
export {};

type ResizeWorkerRequest = {
  id: string;
  file: Blob;
  fileType: string;
  targetWidth: number;
  targetHeight: number;
};

type ResizeWorkerSuccess = {
  id: string;
  ok: true;
  outputBlob: Blob;
  outputWidth: number;
  outputHeight: number;
};

type ResizeWorkerFailure = {
  id: string;
  ok: false;
  error: string;
};

const QUALITY: Record<string, number> = {
  "image/jpeg": 0.92,
  "image/webp": 0.92,
};

const workerGlobal = self as unknown as Worker;

workerGlobal.onmessage = async (event: MessageEvent<ResizeWorkerRequest>) => {
  const { id, file, fileType, targetWidth, targetHeight } = event.data;

  try {
    const bitmap = await createImageBitmap(file);

    try {
      const canvas = new OffscreenCanvas(targetWidth, targetHeight);
      const ctx = canvas.getContext("2d", { alpha: true });

      if (!ctx) {
        throw new Error("2D canvas context is unavailable");
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

      const quality = QUALITY[fileType];
      const outputBlob = quality
        ? await canvas.convertToBlob({ type: fileType, quality })
        : await canvas.convertToBlob({ type: fileType });

      const response: ResizeWorkerSuccess = {
        id,
        ok: true,
        outputBlob,
        outputWidth: targetWidth,
        outputHeight: targetHeight,
      };
      workerGlobal.postMessage(response);
    } finally {
      bitmap.close();
    }
  } catch (error) {
    const response: ResizeWorkerFailure = {
      id,
      ok: false,
      error: error instanceof Error ? error.message : "Resize failed",
    };
    workerGlobal.postMessage(response);
  }
};
