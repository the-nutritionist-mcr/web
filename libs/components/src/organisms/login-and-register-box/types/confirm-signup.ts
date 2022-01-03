export type ConfirmSignupFunction = (
  username: string,
  code: string
) => Promise<string>;
