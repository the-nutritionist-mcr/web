/*
 * Adapted from https://github.com/awslabs/aws-support-tools/blob/master/Cognito/decode-verify-jwt/decode-verify-jwt.ts
 */
import { getIssuer } from './get-issuer';
import { getPublicKeys } from './get-public-keys';
import { parseHeader } from './parse-header';
import { TokenHeader } from './token-header';
import { verify } from './verify';

export interface VerifyJwtResult {
  readonly userName: string;
  readonly firstName: string;
  readonly surname: string;
  readonly isValid: boolean;
  readonly error?: Error | undefined;
  readonly groups: string[];
}

const getPublicKey = async (header: TokenHeader) => {
  const keys = await getPublicKeys();
  const key = keys[header.kid];
  if (key === undefined) {
    throw new Error('claim made for unknown kid');
  }
  return key;
};

interface VerifyConfig {
  token: string;
  authorisedGroups?: string[];
  authorisedUser?: string[];
}

export const verifyJwtToken = async (
  config: VerifyConfig
): Promise<VerifyJwtResult> => {
  try {
    const { token } = config;
    const header = parseHeader(token);
    const key = await getPublicKey(header);
    const claim = await verify(token, key);
    const currentSeconds = Math.floor(new Date(Date.now()).valueOf() / 1000);
    if (currentSeconds > (claim.exp ?? 0)) {
      throw new Error('Token has expired');
    }
    if (claim.iss !== getIssuer()) {
      throw new Error('claim issuer is invalid');
    }
    if (claim.tokenUse !== 'access') {
      throw new Error('claim use is not access');
    }

    const { authorisedGroups } = config;

    const returnVal = {
      userName: claim.username,
      firstName: claim.given_name,
      surname: claim.family_name,
      groups: claim['cognito:groups'] ?? [],
    };

    if (authorisedGroups && authorisedGroups.length > 0) {
      const isValid = (claim['cognito:groups'] ?? []).some((group) =>
        authorisedGroups?.includes(group)
      );
      return isValid
        ? { ...returnVal, isValid: true }
        : {
            ...returnVal,
            isValid: false,
            error: new Error(`User is not part of an authorised group`),
          };
    }

    return {
      ...returnVal,
      isValid: true,
    };
  } catch (error) {
    return {
      userName: '',
      firstName: '',
      surname: '',
      error: error instanceof Error ? error : undefined,
      isValid: false,
      groups: [],
    };
  }
};
