export class AppError extends Error {
  public constructor(
    message: string,
    public readonly statusCode: number,
    stack?: string,
  ) {
    super(message);
    this.name = this.constructor.name;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
