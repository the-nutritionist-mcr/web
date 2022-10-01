import { authoriseJwt } from '../data-api/authorise';
import { returnOkResponse } from '../data-api/return-ok-response';
import { returnErrorResponse } from '../data-api/return-error-response';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminSetUserPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';

export interface ResetPassswordPayload {
  username: string;
  newPassword: string;
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await authoriseJwt(event, ['admin']);

    const body = JSON.parse(event.body ?? '{}');

    const client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });

    const command = new AdminSetUserPasswordCommand({
      UserPoolId: process.env.COGNITO_POOL_ID,
      Username: body.username,
      Password: body.newPassword,
      Permanent: true,
    });

    await client.send(command);

    return returnOkResponse({});
  } catch (error) {
    if (error instanceof Error) {
      return returnErrorResponse(error);
    }
    return returnErrorResponse();
  }
};
