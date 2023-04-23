import { verifyJwtToken } from '@tnmw/authorise-cognito-jwt';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { HTTP } from '../../../infrastructure/constants';
import { HttpError } from './http-error';

interface AuthoriseResponse {
  username: string;
  groups: ReadonlyArray<string>;
  firstName: string;
  surname: string;
  authenticated: boolean;
}

export const authoriseJwt = async (
  event: APIGatewayProxyEventV2,
  groups?: string[],
  options?: { allowUnauthenticated: boolean }
): Promise<AuthoriseResponse> => {
  const authHeader =
    event.headers &&
    Object.entries(event.headers).find(
      (pair) => pair[0].toLowerCase() === 'authorization'
    )?.[1];

  if (!authHeader && options?.allowUnauthenticated) {
    return {
      authenticated: false,
      username: '',
      groups: [],
      firstName: '',
      surname: '',
    };
  }

  if (!authHeader) {
    throw new HttpError(
      HTTP.statusCodes.Forbidden,
      "Request didn't contain an authorization header"
    );
  }

  const verifyResult = await verifyJwtToken({
    token: authHeader,
    authorisedGroups: groups,
  });

  if (!verifyResult.isValid) {
    throw new HttpError(
      HTTP.statusCodes.Forbidden,
      `Token validation failed: ${verifyResult.error?.message}`
    );
  }

  return {
    authenticated: true,
    username: verifyResult.userName,
    groups: verifyResult.groups,
    firstName: verifyResult.firstName,
    surname: verifyResult.surname,
  };
};

const decodeBasicAuth = (authHeaderValue: string) => {
  const base64Encoded = authHeaderValue.split(' ')[1];
  const parts = Buffer.from(base64Encoded, 'base64')
    .toString('utf8')
    .split(':');

  const username = parts[0];
  const [, ...passwordParts] = parts;

  return {
    username,
    password: passwordParts.join(''),
  };
};

export const authoriseBasic = (
  event: APIGatewayProxyEventV2,
  username: string,
  password: string
) => {
  const credentials = decodeBasicAuth(
    event.headers[HTTP.headerNames.Authorization] ?? ''
  );

  if (credentials.username !== username || credentials.password !== password) {
    throw new HttpError(
      HTTP.statusCodes.Forbidden,
      `Basic authentication failed`
    );
  }
};
