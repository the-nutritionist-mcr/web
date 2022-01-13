export const BASE_DOMAIN_NAME = 'thenutritionistmcr.com';

export const getDomainName = (environment: string, prefix?: string) => {
  const otherPrefix = prefix ? `${prefix}.` : ``
  const finalPrefix = environment !== 'prod' ? `${otherPrefix}${environment}.` : otherPrefix;

  return `${finalPrefix}app.${BASE_DOMAIN_NAME}`;
};
