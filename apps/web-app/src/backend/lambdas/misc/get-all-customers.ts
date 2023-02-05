import './init-dd-trace';
import { ENV } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';
import { returnOkResponse } from '../data-api/return-ok-response';
import { returnErrorResponse } from '../data-api/return-error-response';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { getAllUsers } from '../dynamodb/get-all-users';
import { warmer } from './warmer';

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    await authoriseJwt(event, ['admin']);
    const poolId = process.env[ENV.varNames.CognitoPoolId];

    const users = await getAllUsers(poolId ?? '');

    return returnOkResponse({
      users,
    });
  } catch (error) {
    return error instanceof Error
      ? returnErrorResponse(error)
      : returnErrorResponse();
  }
});
