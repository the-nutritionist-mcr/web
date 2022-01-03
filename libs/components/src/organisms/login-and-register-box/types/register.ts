export interface RegisterResponse {
  userConfirmed: boolean;
}

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
