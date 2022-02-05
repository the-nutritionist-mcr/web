type SeedUserState = 'Complete' | 'ForceChangePassword';

export interface SeedUser {
  username: string;
  password?: string;
  groups?: string[];
  email: string;
  state: SeedUserState;
}
