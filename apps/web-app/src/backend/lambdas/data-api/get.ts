import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { verifyJwtToken } from "@tnmw/authorise-cognito-jwt"

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {

  const verificationResponse = await verifyJwtToken({
    token: event.headers['authorization'],
    authorisedGroups: ['admin']
  })

  if(!verificationResponse.isValid) {
    return {
      statusCode: 403,
      body: JSON.stringify({ 'error': 'unauthorised' })
    }
  }

  const dynamodb = new DynamoDBClient({});
  const client = DynamoDBDocumentClient.from(dynamodb);

  const command = new ScanCommand({ TableName: process.env['DYNAMODB_TABLE'] });

  const { Items: items } = await client.send(command);

  const body = JSON.stringify({
    items: items.filter((item) => !item.deleted),
  });

  return {
    statusCode: 200,
    body,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
    },
  };
};
