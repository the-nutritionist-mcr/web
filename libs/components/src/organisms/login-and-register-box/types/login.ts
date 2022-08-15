export interface LoginResponse {
  success: boolean;
  challengeName?: string;
}
export type LoginFunc = (
  login: string,
  password: string
) => Promise<LoginResponse>;
