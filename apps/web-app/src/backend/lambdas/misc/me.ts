import { authoriseJwt } from '../data-api/authorise';
import { returnOkResponse } from '../data-api/return-ok-response';
import { returnErrorResponse } from '../data-api/return-error-response';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { getUserFromAws } from '../../../utils/get-user-from-aws';
import { warmer } from './warmer';

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    const { username } = await authoriseJwt(event);
    const user = await getUserFromAws(username);

    return returnOkResponse(user);
  } catch (error) {
    return returnErrorResponse(error);
  }
});
