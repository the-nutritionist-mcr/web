import './init-dd-trace';
import {
  AdminGetUserCommandInput,
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { BackendCustomer } from '@tnmw/types';
import { ENV, HTTP } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';
import { returnOkResponse } from '../data-api/return-ok-response';
import { returnErrorResponse } from '../data-api/return-error-response';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { HttpError } from '../data-api/http-error';
import { parseCognitoResponse } from '../../../utils/parse-cognito-response';
import { warmer } from './warmer';

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    await authoriseJwt(event, ['admin']);
    const cognito = new CognitoIdentityProviderClient({});
    const poolId = process.env[ENV.varNames.CognitoPoolId];

    const username = event.pathParameters?.username;

    if (!username) {
      throw new HttpError(HTTP.statusCodes.BadRequest, 'Request was invalid');
    }

    const input: AdminGetUserCommandInput = {
      UserPoolId: poolId,
      Username: username,
    };
    const response = await cognito.send(new AdminGetUserCommand(input));

    const user: Omit<BackendCustomer, 'groups'> & { id: string } = {
      id: response.Username ?? '',
      username: response.Username ?? '',
      ...parseCognitoResponse(response?.UserAttributes ?? []),
    };

    return returnOkResponse(user);
  } catch (error) {
    return returnErrorResponse(error);
  }
});
