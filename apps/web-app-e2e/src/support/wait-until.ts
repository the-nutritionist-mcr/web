import { ENV } from '@tnmw/constants';
import { userExists } from './user-exists';

export const waitUntil = async (username: string) => {
  const exists = async () => {
    const pool = process.env[`NX_${ENV.varNames.CognitoPoolId}`];
    return await userExists(username, pool);
  };
  const result = await exists();

  if (result) {
    console.log('User was found');
    await new Promise((accept) => setTimeout(accept, 2000));
    await waitUntil(username);
  } else {
    console.log('User not found');
  }

  return null;
};
