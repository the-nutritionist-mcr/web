import { HTTP } from "../../../infrastructure/constants"
import { HttpError } from './http-error';

export const returnErrorResponse = (error: Error) => {
  const stack =
    process.env['ENVIRONMENT_NAME'] === 'prod' ? {} : { stack: error.stack };

  const statusCode =
    error instanceof HttpError ? error.statusCode : HTTP.statusCodes.InternalServerError

  return {
    body: JSON.stringify({ error: error.message, ...stack }),
    statusCode,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
    },
  };
};
