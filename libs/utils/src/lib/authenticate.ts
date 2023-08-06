import { Auth } from '@aws-amplify/auth';
import { datadogRum } from '@datadog/browser-rum';
import { getAppConfig } from './get-app-config';

type ExtractPromiseType<T> = T extends Promise<infer RT> ? RT : never;

const getConfigurer = () => {
  // eslint-disable-next-line fp/no-let
  let config: undefined | ExtractPromiseType<ReturnType<typeof getAppConfig>>;
  return async () => {
    if (!config) {
      // eslint-disable-next-line fp/no-mutation
      config = await getAppConfig();

      const domain = process.env['NEXT_PUBLIC_IS_LOCAL_DEV']
        ? 'localhost'
        : config.DomainName;
      const secure = !process.env['NEXT_PUBLIC_IS_LOCAL_DEV'];

      const authConfig = {
        Auth: {
          region: config.AwsRegion,
          userPoolId: config.UserPoolId,
          userPoolWebClientId: config.ClientId,
          cookieStorage: {
            domain,
            secure,
            path: '/',
            expires: 365,
            region: config.AwsRegion,
          },
        },
      };

      Auth.configure(authConfig);
    }
    return config;
  };
};

const configureAuth = getConfigurer();

export interface CognitoUser {
  isAdmin: boolean;
  signInUserSession: {
    idToken: {
      jwtToken: string;
      payload: {
        given_name: string;
        family_name: string;
        email: string;
        'cognito:username': string;
      };
    };
    accessToken: {
      jwtToken: string;
      payload: {
        'cognito:groups': string[];
      };
    };
  };
}

interface LoginResponse {
  challengeName?: string;
  success: boolean;
}

const datadogAppId = process.env['NX_DATADOG_APP_ID'];

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  await signOut();
  await configureAuth();

  const response = await Auth.signIn(username, password);

  const success = Boolean(response.signInUserSession?.accessToken);

  const user: CognitoUser = response;

  if (success && datadogAppId) {
    const {
      signInUserSession: {
        idToken: {
          payload: { given_name, family_name, email },
        },
      },
    } = user;

    datadogRum.setUser({
      id: username,
      email: email,
      name: `${given_name} ${family_name}`,
    });
  }

  /**
   * Hack so that the cognito user can be passed out and then back into
   * amplify without consumers of this method knowing what it actually is
   *
   * Congito.completeNewPassword throws an error if it is not an actual
   * CognitoUser passed in
   */
  // eslint-disable-next-line fp/no-mutating-assign
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
      phone_number: telephone,
    },
  });
};

export const signOut = async () => {
  await configureAuth();
  const result = await Auth.signOut();

  if (datadogAppId) {
    datadogRum.removeUser();
  }
  return result;
};

export const confirmSignup = async (username: string, code: string) => {
  await configureAuth();
  return Auth.confirmSignUp(username, code);
};

export const currentUser = async (): Promise<CognitoUser | undefined> => {
  await configureAuth();
  try {
    return await Auth.currentAuthenticatedUser();
  } catch {
    return undefined;
  }
};

export const forgotPassword = async (
  username: string,
  password: string,
  newPassword: string
): Promise<void> => {
  await configureAuth();
  await Auth.forgotPasswordSubmit(username, password, newPassword);
};

export const newPasswordChallengeResponse = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    success: Boolean(signInUserSession?.accessToken),
  };
};
