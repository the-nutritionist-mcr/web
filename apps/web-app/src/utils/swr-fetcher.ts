import { getOutputs } from '../aws/get-outputs';
import { currentUser } from '../aws/authenticate';

export const swrFetcher = async <T>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const { ApiDomainName: domainName } = await getOutputs();

  const user = await currentUser();
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

  const finalInit = init ? { ...init, ...withToken } : withToken;

  return fetch(`https://${domainName}/${path}`, finalInit).then((res) =>
    res.json()
  );
};
