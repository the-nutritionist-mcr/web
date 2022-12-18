import { ENV } from '@tnmw/constants';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { returnErrorResponse } from '../data-api/return-error-response';
import { returnOkResponse } from '../data-api/return-ok-response';
import { seedCognito } from './seed/cognito/cognito';
import { seedDynamodb } from './seed/dynamodb/dynamodb';
import { exclusions } from './seed/dynamodb/seed-exclusions';
import { recipes } from './seed/dynamodb/seed-recipes';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const env = process.env[ENV.varNames.EnvironmentName];

    if (env !== 'cypress') {
      throw new Error(
        'Can only execute the seeding lambda on the cypress environment'
      );
    }

    const cognitoPromise = seedCognito();

    const recipesPromise = seedDynamodb(
      process.env['RECIPES_TABLE'] ?? '',
      recipes
    );

    const customisationsPromise = seedDynamodb(
      process.env['CUSTOMISATIONS_TABLE'] ?? '',
      exclusions
    );

    await Promise.all([cognitoPromise, recipesPromise, customisationsPromise]);

    return returnOkResponse({ result: 'success' });
  } catch (error) {
    return returnErrorResponse(error);
  }
};
