interface LoginResponse {
  success: boolean;
  challengeName: string;
}
export type NewPasswordChallengeResponseFunc = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any,
  password: string
) => Promise<LoginResponse>;
