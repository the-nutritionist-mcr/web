import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ChargeBee } from "chargebee-typescript"

import { returnErrorResponse } from '../data-api/return-error-response';

const chargebee = new ChargeBee()

export const handler: APIGatewayProxyHandlerV2 = async event => {
  try {
    const chargebeeEvent = chargebee.event.deserialize(event.body)

    console.log()

  } catch (error) {
    return returnErrorResponse(error);
  }
};
