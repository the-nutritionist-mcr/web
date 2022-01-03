import { logger } from "../utils/logger";

export const backendRedirect = (route: string, message: string) => {
  logger.info(`Redirecting to '/${route}' (${message})`);
  return {
    redirect: {
      destination: `/${route}`,
      permanent: false,
    },
  };
};
