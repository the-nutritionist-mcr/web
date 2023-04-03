import { HTTP } from '@tnmw/constants';
import { allowHeaders } from '../../allow-headers';

export const returnOkResponse = <T>(body: T) => {
  return {
    statusCode: HTTP.statusCodes.Ok,
    body: JSON.stringify(body),
    headers: {
      [HTTP.headerNames.AccessControlAllowOrigin]: '*',
      [HTTP.headerNames.AccessControlAllowHeaders]: allowHeaders.join(', '),
    },
  };
};
