import * as jsonwebtoken from 'jsonwebtoken';
import { Claim } from './claim';
import { PublicKeyMeta } from './public-key-meta';

export const verify = async (
  token: string,
  key: PublicKeyMeta
): Promise<Claim> => {
  return new Promise<Claim>((resolve, reject) => {
    jsonwebtoken.verify(token, key.pem, (error, data) => {
      if (error) {
        console.log(token);
        reject(error);
      } else {
        if (!data) {
          reject(new Error('claim returned no data'));
          return;
        }

        const claim = {
          tokenUse: data.token_use,
          authTime: data.auth_time,
          clientId: data.client_id,
          username: data.username,
          ...data,
        };
        resolve(claim);
      }
    });
  });
};
