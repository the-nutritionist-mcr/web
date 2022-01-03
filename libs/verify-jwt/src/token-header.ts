export interface TokenHeader {
  kid: string;
  alg: string;
}

export const isTokenHeader = (thing: unknown): thing is TokenHeader =>
  Object.hasOwnProperty.call(thing, 'kid') &&
  Object.hasOwnProperty.call(thing, 'alg');
