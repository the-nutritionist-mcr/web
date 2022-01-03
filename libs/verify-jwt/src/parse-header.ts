import { isTokenHeader, TokenHeader } from './token-header';

const TOKEN_IS_INVALID_STRING = 'Token is invalid';

export const parseHeader = (token: string): TokenHeader => {
  const tokenSections = (token || '').split('.');
  if (!tokenSections[0] || tokenSections.length < 2) {
    throw new Error(TOKEN_IS_INVALID_STRING);
  }
  const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
  try {
    const header = JSON.parse(headerJSON);
    if (isTokenHeader(header)) {
      return header;
    }
  } catch {
    throw new Error(TOKEN_IS_INVALID_STRING);
  }
  throw new Error(TOKEN_IS_INVALID_STRING);
};
