import { Auth } from "@aws-amplify/auth";
import { getPoolConfig, AuthDetails } from "./get-pool-config";

const REGION = "eu-west-2";

const getConfigurer = () => {
  // eslint-disable-next-line fp/no-let
  let outputs: undefined | AuthDetails;
  return async () => {
    if (!outputs) {
      outputs = await getPoolConfig();
      Auth.configure({
        Auth: {
          region: REGION,
          userPoolId: outputs.UserPoolId,
          userPoolWebClientId: outputs.ClientId,
          cookieStorage: {
            domain: process.env.NEXT_PUBLIC_IS_LOCAL_DEV
              ? "localhost"
              : outputs.DomainName,
            secure: !Boolean(process.env.NEXT_PUBLIC_IS_LOCAL_DEV),
            path: "/",
            expires: 365,
            region: REGION
          }
        }
      });
    }
    return outputs;
  };
};

const configureAuth = getConfigurer();

interface LoginResponse {
  challengeName: string;
  success: boolean;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  await configureAuth();

  const response = await Auth.signIn(username, password);

  const success = Boolean(response.signInUserSession?.accessToken);

  /**
   * Hack so that the cognito user can be passed out and then back into
   * amplify without consumers of this method knowing what it actually is
   *
   * Congito.completeNewPassword throws an error if it is not an actual
   * CognitoUser passed in
   */
  return Object.assign(response, { success });
};

export const register = async (
  username: string,
  password: string,
  _salutation: string,
  email: string,
  firstname: string,
  surname: string,
  address: string,
  telephone: string
) => {
  await configureAuth();
  return Auth.signUp({
    username,
    password,
    attributes: {
      email: email,
      given_name: firstname,
      family_name: surname,
      address: address,
      phone_number: telephone
    }
  });
};

export const signOut = async () => {
  await configureAuth();
  return Auth.signOut();
};

export const confirmSignup = async (username: string, code: string) => {
  await configureAuth();
  return Auth.confirmSignUp(username, code);
};

export const currentUser = async () => {
  await configureAuth();
  try {
    return await Auth.currentAuthenticatedUser();
  } catch {
    return undefined;
  }
};

export const newPasswordChallengeResponse = async (
  user: any,
  password: string
) => {
  await configureAuth();

  const { challengeName, signInUserSession } = await Auth.completeNewPassword(
    user,
    password
  );

  return {
    challengeName,
    success: Boolean(signInUserSession?.accessToken)
  };
};
