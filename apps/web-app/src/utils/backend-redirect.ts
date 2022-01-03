import { logger } from '../utils/logger';

export const backendRedirect = (route: string, message: string) => {
  // eslint-disable-next-line fp/no-unused-expression
  logger.info(`Redirecting to '/${route}' (${message})`);
  return {
    redirect: {
      destination: `/${route}`,
      permanent: false,
    },
  };
};
