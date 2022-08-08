import './init-dd-trace';
import {
  ListUsersCommand,
  CognitoIdentityProviderClient,
  ListUsersCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { ENV } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';
import { returnOkResponse } from '../data-api/return-ok-response';
import { returnErrorResponse } from '../data-api/return-error-response';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { parseCustomerList } from '../../../utils/parse-customer-list';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await authoriseJwt(event, ['admin']);
    const cognito = new CognitoIdentityProviderClient({});
    const poolId = process.env[ENV.varNames.CognitoPoolId];

    const input: ListUsersCommandInput = {
      UserPoolId: poolId,
    };
    const response = await cognito.send(new ListUsersCommand(input));

    const users = parseCustomerList(response);

    return returnOkResponse({
      users,
    });
  } catch (error) {
    return returnErrorResponse(error);
  }
};
