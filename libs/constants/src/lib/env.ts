export const ENV = {
  varNames: {
    MailSlurpToken: 'MAILSLURP_TOKEN',
    NodeOptions: 'NODE_OPTIONS',
    CognitoPoolId: 'COGNITO_POOL_ID',
    DynamoDBTable: 'DYNAMODB_TABLE',
    MetaTable: 'DYNAMODB_TABLE_META',
    RecipesDynamoDBTable: 'RECIPES_TABLE',
    GoogleClientId: 'GOOGLE_CLIENT_ID',
    GoogleClientSecret: 'GOOGLE_CLIENT_SECRET',
    GoogleRefreshToken: 'GOOGLE_REFRESH_TOKEN',
    GoogleRedirectUrl: 'GOOGLE_REDIRECT_URL',
    EnvironmentName: 'ENVIRONMENT_NAME',
    ChargeBeeToken: 'CHARGEBEE_TOKEN',
    ChargeBeeSite: 'CHARGEBEE_SITE',
    ChargeBeeWebhookUsername: 'CHARGEBEE_WEBHOOK_USERNAME',
    ChargeBeeWebhookPasssword: 'CHARGEBEE_WEBHOOK_PASSWORD',
  },
} as const;
