export interface PublicKey {
  alg: string;
  e: string;
  kid: string;
  kty: 'RSA';
  n: string;
  use: string;
}
