export const getResourceName = (resource: string, env: string) =>
  `${env}-tnmweb-${resource.toLocaleLowerCase()}`;
