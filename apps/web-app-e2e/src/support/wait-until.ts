import { E2E, ENV } from '@tnmw/constants';
import { userExists } from './user-exists';

export const waitUntil = async (username: string) => {
  const exists = async () => {
    const pool = process.env[`NX_${ENV.varNames.CognitoPoolId}`];
    return !(await userExists(username, pool));
  };
  const result = await exists();

  if (!result) {
    await new Promise((accept) => setTimeout(accept, 2000));
    await waitUntil(username);
  }

  return null;
};
