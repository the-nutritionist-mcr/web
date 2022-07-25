import * as Axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import { getIssuer } from './get-issuer';
import { PublicKeyMeta } from './public-key-meta';

interface PublicKey {
  alg: string;
  e: string;
  kid: string;
  kty: 'RSA';
  n: string;
  use: string;
}

interface PublicKeys {
  keys: PublicKey[];
}

interface MapOfKidToPublicKey {
  [key: string]: PublicKeyMeta;
}

// eslint-disable-next-line fp/no-let
let cacheKeys: MapOfKidToPublicKey | undefined;
export const getPublicKeys = async (): Promise<MapOfKidToPublicKey> => {
  if (!cacheKeys) {
    const issuer = getIssuer();
    const url = `${issuer}/.well-known/jwks.json`;
    const publicKeys = await Axios.default.get<PublicKeys>(url);
    console.log(`Getting public keys from ${url}`);
    // eslint-disable-next-line fp/no-mutation
    cacheKeys = publicKeys.data.keys.reduce<MapOfKidToPublicKey>(
      (agg: MapOfKidToPublicKey, current: PublicKey) => {
        const pem = jwkToPem(current);
        // eslint-disable-next-line fp/no-mutation
        agg[current.kid] = { instance: current, pem };
        return agg;
      },
      {}
    );
    return cacheKeys;
  } else {
    return cacheKeys;
  }
};
