/*
 * Adapted from https://github.com/awslabs/aws-support-tools/blob/master/Cognito/decode-verify-jwt/decode-verify-jwt.ts
 */
import { getIssuer } from "./get-issuer";
import { getPublicKeys } from "./get-public-keys";
import { parseHeader } from "./parse-header";
import { TokenHeader } from "./token-header";
import { verify } from "./verify";

export interface VerifyJwtResult {
  readonly userName: string;
  readonly isValid: boolean;
  readonly error?: Error | undefined;
  readonly groups: string[];
}

const getPublicKey = async (header: TokenHeader) => {
  const keys = await getPublicKeys();
  const key = keys[header.kid];
  if (key === undefined) {
    throw new Error("claim made for unknown kid");
  }
  return key;
};

export const verifyJwtToken = async (
  token: string
): Promise<VerifyJwtResult> => {
  try {
    const header = parseHeader(token);
    const key = await getPublicKey(header);
    const claim = await verify(token, key);
    const currentSeconds = Math.floor(new Date(Date.now()).valueOf() / 1000);
    if (currentSeconds > (claim.exp ?? 0) || currentSeconds < claim.authTime) {
      throw new Error("Token has expired");
    }
    if (claim.iss !== getIssuer()) {
      throw new Error("claim issuer is invalid");
    }
    if (claim.tokenUse !== "access") {
      throw new Error("claim use is not access");
    }
    return {
      userName: claim.username,
      isValid: true,
      groups: claim["cognito:groups"] ?? []
    };
  } catch (error) {
    return {
      userName: "",
      error: error instanceof Error ? error : undefined,
      isValid: false,
      groups: []
    };
  }
};
