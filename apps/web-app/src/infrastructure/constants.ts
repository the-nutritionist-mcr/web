export const IAM = {
  actions: {
    cognito: {
      adminDeleteUser: 'cognito-idp:AdminDeleteUser',
      adminGetUser: 'cognito-idp:AdminGetUser',
      adminCreateUser: 'cognito-idp:AdminCreateUser',
      adminUpdateUserAttributes: 'cognito-idp:AdminUpdateUserAttributes',
    },
  },
} as const;

export const TNM_WEB_LOCALSTORAGE_KEY = 'tnm-web-cache';
export const TNM_WEB_SIGNED_IN_USER_KEY = 'tnm-web-signed-in-user';

export const NODE_OPTS = {
  EnableSourceMaps: '--enable-source-maps',
} as const;

export const ENV = {
  varNames: {
    NodeOptions: 'NODE_OPTIONS',
    CognitoPoolId: 'COGNITO_POOL_ID',
    DynamoDBTable: 'DYNAMODB_TABLE',
    EnvironmentName: 'ENVIRONMENT_NAME',
    ChargeBeeToken: 'CHARGEBEE_TOKEN',
    ChargeBeeSite: 'CHARGEBEE_SITE',
    ChargeBeeWebhookUsername: 'CHARGEBEE_WEBHOOK_USERNAME',
    ChargeBeeWebhookPasssword: 'CHARGEBEE_WEBHOOK_PASSWORD',
  },
} as const;

export const CHARGEBEE_SITES = {
  test: 'thenutritionist-test',
  live: 'thenutritionist',
} as const;

export const RESOURCES = {
  Recipe: 'recipe',
  Customisation: 'customisation',
  CookPlan: 'cook-plan',
} as const;

export const HTTP = {
  statusCodes: {
    Forbidden: 403,
    Ok: 200,
    InternalServerError: 500,
  },
  headerNames: {
    ContentType: 'Content-Type',
    XAmxDate: 'X-Amz-Date',
    Authorization: 'Authorization',
    XApiKey: 'X-Api-Key',
    AccessControlAllowOrigin: 'access-control-allow-origin',
    AccessControlAllowHeaders: 'access-control-allow-headers',
  },
  verbs: {
    Post: 'POST',
    Get: 'GET',
    Put: 'PUT',
    Options: 'OPTIONS',
    Patch: 'PATCH',
    Delete: 'DELETE',
  },
} as const;

export const USER_ATTRIBUTES = {
  ChargebeeId: 'chargebeeId',
  UserCustomisations: 'userCustomisations',
} as const;
