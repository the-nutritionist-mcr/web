declare module '@aws-amplify/auth' {

  interface CognitoTokenPayload {
    auth_time: number,
    'cognito:groups': string[],
    event_id: string,
    exp: number,
    iat: number,
    iss: string,
    jti: string,
    origin_jti: string,
    sub: string,
  }

  interface CognitoAccessTokenPayload extends CognitoTokenPayload {
    client_id: string,
    scope: string,
    token_use: "access",
    username: string
  }

  type CustomAttribueKey = `custom:${string}`

  interface CognitoIdTokenPayload extends CognitoTokenPayload {
    aud: string
    "cognito:username": string
    [key: CustomAttribueKey]: string
    email:  string
    email_verified: string
    token_use: "id"
  }

  interface JwtToken {
    jwtToken: string
  }

  interface SignInUserSession {
    clockDrift: number
    idToken: {
      jwtToken: string
      payload: CognitoIdTokenPayload
    }

    accessToken: {
      jwtToken: string
      payload: CognitoAccessTokenPayload
    }

    refreshToken: {
      token: string
    }
  }

  interface SignInResponse {
    username: string;
    keyPrefix: string;
    signInUserSession: SignInUserSession
  }

  interface SignInInput {
    username: string
    password: string
  }

  interface ConfigureInput {
    Auth: {
      region: string
      userPoolId: string
      userPoolWebClientId: string
    }
  }

  class AuthClass {
    signIn(config: SignInInput): Promise<SignInResponse>;
    configure(config: ConfigureInput): void
  }

  export const Auth: AuthClass
}
