export const E2E = {
  testEmail: 'ben+e2etesting@thenutritionistmcr.com',
  testPassword: 'the-cypress-test-password',
};

export const CHARGEBEE = {
  itemTypes: {
    plan: 'plan',
  },
  customFields: {
    customer: {
      customerProfileNotes: 'cf_customer_profile_notes',
      deliveryDay1: 'cf_cook_1_delivery_day',
      deliveryDay2: 'cf_cook_2_delivery_day',
      deliveryDay3: 'cf_cook_3_delivery_day',
    },
    plan: {
      itemsPerDay: 'cf_items_per_day',
      daysPerWeek: 'cf_days_per_week',
    },
    itemFamily: {
      isExtra: 'cf_extra',
    },
  },
};

export const IAM = {
  actions: {
    cognito: {
      adminGetUser: 'cognito-idp:AdminGetUser',
      adminCreateUser: 'cognito-idp:AdminCreateUser',
      adminDeleteUser: 'cognito-idp:AdminDeleteUser',
      adminSetUserPassword: 'cognito-idp:AdminSetUserPassword',
    },
  },
} as const;

export const TNM_WEB_LOCALSTORAGE_KEY = 'tnm-web-cache';

export const NODE_OPTS = {
  EnableSourceMaps: '--enable-source-maps',
} as const;

export const MAILSLURP_INBOX =
  '435b553b-88bc-4f3e-b3be-1d73253d54f3@mailslurp.com';

export const ENV = {
  varNames: {
    MailSlurpToken: 'MAILSLURP_TOKEN',
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
