export const TNM_SITE =
  process.env['APP_VERSION'] === 'prod'
    ? 'https://www.thenutritionistmcr.com'
    : 'https://staging.thenutritionistmcr.com';
