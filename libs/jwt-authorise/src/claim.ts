export interface Claim {
  tokenUse: string;
  authTime: number;
  iss?: string | undefined;
  exp?: number | undefined;
  'cognito:groups'?: string[];
  username: string;
  clientId: string;
}
