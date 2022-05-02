import {
  AdminGetUserCommandInput,
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { ENV, HTTP } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';
import { returnOkResponse } from '../data-api/return-ok-response';
import { returnErrorResponse } from '../data-api/return-error-response';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { parseUserType } from '../../../utils/parse-customer-list';
import { HttpError } from '../data-api/http-error';

interface GetUserBody {
  username: string;
}

const isGetUserBody = (thing: unknown): thing is GetUserBody => {
  const thingAs = thing as GetUserBody;

  if (typeof thingAs !== 'object') {
    return false;
  }

  return typeof thingAs.username === 'string';
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await authoriseJwt(event, ['admin']);
    const cognito = new CognitoIdentityProviderClient({});
    const poolId = process.env[ENV.varNames.CognitoPoolId];

    const getUserBody = JSON.parse(event.body);

    if (!isGetUserBody(getUserBody)) {
      throw new HttpError(HTTP.statusCodes.BadRequest, 'Request was invalid');
    }

    const input: AdminGetUserCommandInput = {
      UserPoolId: poolId,
      Username: getUserBody.username,
    };
    const response = await cognito.send(new AdminGetUserCommand(input));

    const user = parseUserType(response);

    return returnOkResponse(user);
  } catch (error) {
    return returnErrorResponse(error);
  }
};
