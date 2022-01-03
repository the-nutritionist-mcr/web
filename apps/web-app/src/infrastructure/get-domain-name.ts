export const BASE_DOMAIN_NAME = "thenutritionistmcr.com";

export const getDomainName = (environment: string) => {
  const domainPrefix = environment !== "prod" ? `${environment}.` : "";

  return `${domainPrefix}app.${BASE_DOMAIN_NAME}`;
};
