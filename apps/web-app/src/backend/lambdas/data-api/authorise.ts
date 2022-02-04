import { verifyJwtToken } from '@tnmw/authorise-cognito-jwt';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { HTTP } from '../../../infrastructure/constants';
import { HttpError } from './http-error';

export const authorise = async (
  event: APIGatewayProxyEventV2,
  groups: string[]
) => {
  const authHeader =
    event.headers &&
    Object.entries(event.headers).find(
      (pair) => pair[0].toLowerCase() === 'authorization'
    )?.[1];

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

  return { username: verifyResult.userName };
};
