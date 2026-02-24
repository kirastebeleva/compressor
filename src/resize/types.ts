export type ResizeMode = "pixels" | "percentage";

export type ResizeOptions = {
  targetWidth: number;
  targetHeight: number;
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
