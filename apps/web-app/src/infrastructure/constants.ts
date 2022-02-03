export const IAM = {
  actions: {
    cognito: {
      adminGetUser: 'cognito-idp:AdminGetUser',
      adminCreateUser: 'cognito-idp:AdminCreateUser'
    }
  }
} as const;

export const ENV = {
  varNames: {
    CognitoPoolId: 'COGNITO_POOL_ID',
    DynamoDBTable: 'DYNAMODB_TABLE',
    EnvironmentName: 'ENVIRONMENT_NAME',
    ChargeBeeToken: 'CHARGEBEE_TOKEN'
  }
} as const;

export const RESOURCES = {
  Recipe: 'recipe',
  Customisation: 'customisation',
  CookPlan: 'cook-plan'
} as const;

export const HTTP = {
  headerNames: {
    ContentType: 'Content-Type',
    XAmxDate: 'X-Amz-Date',
    Authorization: 'Authorization',
    XApiKey: 'X-Api-Key'
  },
  verbs: {
    Post: 'POST',
    Get: 'GET',
    Put: 'PUT',
    Options: 'OPTIONS',
    Patch: 'PATCH',
    Delete: 'DELETE'
  }
} as const;
