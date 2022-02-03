import { verifyJwtToken } from '@tnmw/authorise-cognito-jwt';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { HttpError } from './http-error';

export const authorise = async (
  event: APIGatewayProxyEventV2,
  groups: string[]
) => {
  const authHeader =
    event.headers &&
    Object.entries(event.headers).find(
      pair => pair[0].toLowerCase() === 'authorization'
    )[1];

  if (!authHeader) {
    throw new HttpError(403, "Request didn't contain an authorization header");
  }

  const verifyResult = await verifyJwtToken({
    token: authHeader,
    authorisedGroups: groups
  });

  if (!verifyResult.isValid) {
    throw new HttpError(403, `Token validation failed: ${verifyResult.error?.message}`);
  }
};
