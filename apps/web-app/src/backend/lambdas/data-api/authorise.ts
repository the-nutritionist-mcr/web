import { verifyJwtToken } from '@tnmw/authorise-cognito-jwt';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { HttpError } from './http-error';

export const authorise = async (
  event: APIGatewayProxyEventV2,
  groups: string[]
) => {
  const tokenPair = Object.entries(event.cookies).find(([key]) =>
    key.endsWith('.accessToken')
  );

  if (!tokenPair || tokenPair.length !== 2) {
    throw new HttpError(403, 'No .accessToken found');
  }

  const verifyResult = await verifyJwtToken({
    token: tokenPair[1],
    authorisedGroups: groups,
  });

  if (!verifyResult.isValid) {
    throw new HttpError(403, 'No .accessToken found');
  }
};
