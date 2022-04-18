import { HTTP } from '@tnmw/constants';

export const returnOkResponse = <T>(body: T) => {
  return {
    statusCode: HTTP.statusCodes.Ok,
    body: JSON.stringify(body),
    headers: {
      [HTTP.headerNames.AccessControlAllowOrigin]: '*',
      [HTTP.headerNames.AccessControlAllowHeaders]: '*',
    },
  };
};
