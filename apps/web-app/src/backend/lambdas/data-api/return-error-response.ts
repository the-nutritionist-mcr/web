import { HTTP } from '@tnmw/constants';
import { HttpError } from './http-error';

export const returnErrorResponse = (error?: Error) => {
  const stack =
    process.env['ENVIRONMENT_NAME'] === 'prod' || !error
      ? {}
      : { stack: error.stack };

  const statusCode =
    error instanceof HttpError
      ? error.statusCode
      : HTTP.statusCodes.InternalServerError;

  console.log(error);

  const errorObj = error ? { error: error.message } : {};

  return {
    body: JSON.stringify({ ...errorObj, ...stack }),
    statusCode,
    headers: {
      [HTTP.headerNames.AccessControlAllowOrigin]: '*',
      [HTTP.headerNames.AccessControlAllowHeaders]: '*',
    },
  };
};
