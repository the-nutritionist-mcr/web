export const TNM_SITE =
  process.env['NX_APP_ENV'] === 'prod'
    ? 'https://www.thenutritionistmcr.com'
    : 'https://staging.thenutritionistmcr.com';
