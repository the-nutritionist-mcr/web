export { CHARGEBEE } from "./lib/chargebee"
export { IAM } from "./lib/iam"
export { ENV } from "./lib/env"
export { HTTP } from "./lib/http"
export { COGNITO } from "./lib/cognito"

export const E2E = {
  testEmail: 'ben+e2etesting@thenutritionistmcr.com',
  testPassword: 'the-cypress-test-password',
};

export const TNM_WEB_LOCALSTORAGE_KEY = 'tnm-web-cache';

export const NODE_OPTS = {
  EnableSourceMaps: '--enable-source-maps',
} as const;

export const MAILSLURP_INBOX =
  '435b553b-88bc-4f3e-b3be-1d73253d54f3@mailslurp.com';


export const CHARGEBEE_SITES = {
  test: 'thenutritionist-test',
} as const;

export const RESOURCES = {
  Recipe: 'recipe',
  Customisation: 'customisation',
  CookPlan: 'cook-plan',
} as const;
