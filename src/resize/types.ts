export type ResizeMode = "pixels" | "percentage";

/** fit = contain (scale to fit, add padding); fill = cover (scale to cover, crop) */
export type ResizeFitMode = "fit" | "fill";

export type ResizeOptions = {
  targetWidth: number;
  targetHeight: number;
  /** Default "fill" — stretch/cover. Use "fit" for avatars to preserve aspect without crop. */
  fitMode?: ResizeFitMode;
};

export type ResizeResult = {
  outputBlob: Blob;
  outputWidth: number;
  outputHeight: number;
  inputWidth: number;
  inputHeight: number;
  inputBytes: number;
  outputBytes: number;
  elapsedMs: number;
};

export type ResizeWorkerRequest = {
  id: string;
  file: Blob;
  fileType: string;
  targetWidth: number;
  targetHeight: number;
  fitMode?: ResizeFitMode;
};

export type ResizeWorkerSuccess = {
  id: string;
  ok: true;
  outputBlob: Blob;
  outputWidth: number;
  outputHeight: number;
};

export type ResizeWorkerFailure = {
  id: string;
  ok: false;
  error: string;
};

export type ResizeWorkerResponse = ResizeWorkerSuccess | ResizeWorkerFailure;
