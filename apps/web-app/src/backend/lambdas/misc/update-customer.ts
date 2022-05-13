import {
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Delivery, Exclusion } from '@tnmw/types';
import { ENV, HTTP, COGNITO } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';
import { returnOkResponse } from '../data-api/return-ok-response';
import { returnErrorResponse } from '../data-api/return-error-response';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { HttpError } from '../data-api/http-error';

interface UpdateCustomerBody {
  customPlan: Delivery[]
  customisations: Exclusion[]
}

const isUpdateCustomerBody = (thing: unknown): thing is UpdateCustomerBody => {
  const thingAs = thing as UpdateCustomerBody

  return Array.isArray(thingAs.customPlan) && Array.isArray(thingAs.customisations)
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await authoriseJwt(event, ['admin']);
    const cognito = new CognitoIdentityProviderClient({});
    const poolId = process.env[ENV.varNames.CognitoPoolId];

    const username = event.pathParameters.username;

    const body = JSON.parse(event.body)

    if (!username || !isUpdateCustomerBody(body)) {
      throw new HttpError(HTTP.statusCodes.BadRequest, 'Request was invalid');
    }

    const input: AdminUpdateUserAttributesCommandInput= {
      UserPoolId: poolId,
      Username: username,
      UserAttributes: [
        {
          Name: `custom:${COGNITO.customAttributes.CustomPlan}`,
          Value: JSON.stringify(body.customPlan)
        },
        {
          Name: `custom:${COGNITO.customAttributes.UserCustomisations}`,
          Value: JSON.stringify(body.customisations)
        }
      ]
    };
    await cognito.send(new AdminUpdateUserAttributesCommand(input));

    return returnOkResponse({});
  } catch (error) {
    return returnErrorResponse(error);
  }
};
