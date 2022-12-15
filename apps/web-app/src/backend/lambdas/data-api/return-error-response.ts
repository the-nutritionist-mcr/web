import { HTTP } from '@tnmw/constants';
import { setTag } from '../misc/init-dd-trace';
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
    setTag('error.message', error.message);
    setTag('error.stack', error.stack);
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
