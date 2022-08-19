import { currentUser } from '../aws/authenticate';
import { getAppConfig } from '@tnmw/utils';
import { Codes, HttpError } from '../backend/lambdas/data-api/http-error';

const getFetchInit = async (init?: RequestInit) => {
  const user = await currentUser();
  if (!user) {
    return {};
  }
  const {
    signInUserSession: {
      accessToken: { jwtToken },
    },
  } = user;

  const withToken = {
    headers: {
      authorization: jwtToken,
    },
  };

  return init ? { ...init, ...withToken } : withToken;
};

export const swrFetcher = async <T>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  console.log(`path`, path);
  const { ApiDomainName: domainName } = await getAppConfig();

  const finalInit = await getFetchInit(init);
  const fullPath = `https://${domainName}/${path}`;
  const response = await fetch(fullPath, finalInit);

  const data = await response.json();
  console.log(fullPath);

  if (!response.ok) {
    const error = new HttpError(
      response.status as Codes,
      `Tried to make a request to ${fullPath} but the server returned a ${response.status} status code with the message "${data.error}"`
    );
    throw error;
  }
  return data;
};
