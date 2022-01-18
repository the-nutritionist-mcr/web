export const getResourceName = (resource: string, env: string) =>
  `tnm-web-${resource.toLocaleLowerCase()}-${env}`;
