import { HTTP } from '@tnmw/constants';
import { allowHeaders } from '../../allow-headers';

const allowedOrigins = [
  `https://api.quickbudget.co.uk`,
  `http://localhost:4200`,
  `http://192.168.1.102:4200`,
];

export const returnOkResponse = <T>(body: T) => {
  return {
    statusCode: HTTP.statusCodes.Ok,
    body: JSON.stringify(body),
    headers: {
      [HTTP.headerNames.AccessControlAllowOrigin]: allowedOrigins.join(', '),
      [HTTP.headerNames.AccessControlAllowHeaders]: allowHeaders.join(', '),
    },
  };
};
