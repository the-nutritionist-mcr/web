import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';

type SeedUserState = 'Complete' | 'ForceChangePassword';

export interface SeedUser {
  username: string;
  password?: string;
  groups?: string[];
  email: string;
  state: SeedUserState;
  otherAttributes?: AttributeType[];
}
