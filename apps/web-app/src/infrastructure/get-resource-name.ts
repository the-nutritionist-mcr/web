export const getResourceName = (resource: string, env: string) =>
  `${env}-tnm-v5-${resource.toLocaleLowerCase()}`;
