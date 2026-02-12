export class CompressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CompressionError";
  }
}
