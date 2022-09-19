export interface Claim {
  tokenUse: string;
  authTime: number;
  given_name: string;
  family_name: string;
  iss?: string | undefined;
  exp?: number | undefined;
  'cognito:groups'?: string[];
  username: string;
  clientId: string;
}
