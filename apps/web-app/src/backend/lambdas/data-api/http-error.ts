export class HttpError extends Error {
  public constructor(public readonly statusCode: number, message: string) {
    super(message);
  }
}
