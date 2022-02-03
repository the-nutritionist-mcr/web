import { HttpError } from './http-error';

export const returnErrorResponse = (error: Error) => {
  const stack =
    process.env['ENVIRONMENT_NAME'] === 'prod' ? {} : { stack: error.stack };
  const statusCode =
    error instanceof HttpError ? { statusCode: error.statusCode } : {};
  return {
    body: JSON.stringify({ error: error.message, ...stack }),
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*'
    },
    ...statusCode
  };
};
