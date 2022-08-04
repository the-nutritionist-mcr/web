const BASE_DOMAIN_NAME = 'thenutritionistmcr.com';

const PROD_NAME = 'portal';

export const getDomainName = (environment: string, prefix?: string) => {
  const otherPrefix = prefix ? `${prefix}.` : ``;
  const finalPrefix =
    environment !== 'prod'
      ? `${otherPrefix}${environment}.app`
      : `${otherPrefix}${PROD_NAME}`;

  return `${finalPrefix}.${BASE_DOMAIN_NAME}`;
};
