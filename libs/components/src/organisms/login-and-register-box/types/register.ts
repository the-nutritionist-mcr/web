export interface RegisterResponse {
  userConfirmed: boolean;
}

export type ForgotPasswordFunc = (
  username: string,
  password: string,
  newPasword: string
) => Promise<void>;

export type RegisterFunc = (
  username: string,
  password: string,
  salutation: string,
  email: string,
  firstname: string,
  surname: string,
  address: string,
  telephone: string
) => Promise<RegisterResponse>;
