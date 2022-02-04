import { HTTP } from '../../../infrastructure/constants';

type Codes = typeof HTTP['statusCodes'][keyof typeof HTTP['statusCodes']];

export class HttpError extends Error {
  public constructor(public readonly statusCode: Codes, message: string) {
    super(message);
  }
}
