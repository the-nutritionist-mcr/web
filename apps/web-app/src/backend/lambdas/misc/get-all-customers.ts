import {
  ListUsersCommand,
  CognitoIdentityProviderClient,
  ListUsersCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { ENV } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';
import { returnOkResponse } from '../data-api/return-ok-response';
import { returnErrorResponse } from '../data-api/return-error-response';
import { parseCognitoResponse } from '../../../utils/parse-cognito-response';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await authoriseJwt(event, ['admin']);
    const cognito = new CognitoIdentityProviderClient({});
    const poolId = process.env[ENV.varNames.CognitoPoolId];

    const input: ListUsersCommandInput = {
      UserPoolId: poolId,
    };
    const response = await cognito.send(new ListUsersCommand(input));

    const users = response.Users?.map((user) => parseCognitoResponse(user));

    return returnOkResponse({
      users,
    });
  } catch (error) {
    return returnErrorResponse(error);
  }
};
