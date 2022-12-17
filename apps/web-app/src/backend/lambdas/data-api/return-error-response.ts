import { HTTP } from '@tnmw/constants';
import { setErrorOnServiceEntrySpan } from '../misc/init-dd-trace';
import { HttpError } from './http-error';

export const returnErrorResponse = (error?: Error | unknown) => {
  const stack =
    !(error instanceof Error) ||
    process.env['ENVIRONMENT_NAME'] === 'prod' ||
    !error
      ? {}
      : { stack: error.stack };

  const statusCode =
    error instanceof HttpError
      ? error.statusCode
      : HTTP.statusCodes.InternalServerError;

  if (error instanceof Error) {
    setErrorOnServiceEntrySpan(error);
  }

  console.log(error);

  const errorObj =
    error && error instanceof Error ? { error: error.message } : {};

  return {
    body: JSON.stringify({ ...errorObj, ...stack }),
    statusCode,
    headers: {
      [HTTP.headerNames.AccessControlAllowOrigin]: '*',
      [HTTP.headerNames.AccessControlAllowHeaders]: '*',
    },
  };
};
