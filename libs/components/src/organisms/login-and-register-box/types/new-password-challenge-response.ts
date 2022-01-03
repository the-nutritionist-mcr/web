interface LoginResponse {
  success: boolean;
  challengeName: string;
}
export type NewPasswordChallengeResponseFunc = (
  user: any,
  password: string
) => Promise<LoginResponse>;
