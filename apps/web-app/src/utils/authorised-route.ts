import { GetServerSideProps } from 'next';
import { COGNITO } from '@tnmw/constants';
import { verifyJwtToken } from '@tnmw/authorise-cognito-jwt';
import { backendRedirect } from './backend-redirect';
import {
  AdminGetUserCommand,
  AdminGetUserCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

interface StandardPlan {
  name: string;
  daysPerWeek: number;
  itemsPerDay: number;
  isExtra: false;
  totalMeals: number;
}

export interface User {
  username: string;
  country: string;
  deliveryDay1: string;
  deliveryDay2: string;
  deliveryDay3: string;
  customerUpdateTime: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  addressLine3: string;
  subscriptionUpdateTime: string;
  firstName: string;
  surname: string;
  salutation: string;
  email: string;
  city: string;
  postcode: string;
  plans: StandardPlan[];
}

const parseCognitoResponse = (output: AdminGetUserCommandOutput): User => ({
  username: output.Username,
  salutation: getAttributeValue(
    output.UserAttributes,
    `custom:${COGNITO.customAttributes.Salutation}`
  ),
  country: getAttributeValue(
    output.UserAttributes,
    `custom:${COGNITO.customAttributes.Country}`
  ),
  deliveryDay1: getAttributeValue(
    output.UserAttributes,
    `custom:${COGNITO.customAttributes.DeliveryDay1}`
  ),
  deliveryDay2: getAttributeValue(
    output.UserAttributes,
    `custom:${COGNITO.customAttributes.DeliveryDay2}`
  ),
  deliveryDay3: getAttributeValue(
    output.UserAttributes,
    `custom:${COGNITO.customAttributes.DeliveryDay3}`
  ),
  subscriptionUpdateTime: getAttributeValue(
    output.UserAttributes,
    `custom:${COGNITO.customAttributes.SubscriptionUpdateTimestamp}`
  ),
  firstName: getAttributeValue(
    output.UserAttributes,
    COGNITO.standardAttributes.firstName
  ),
  city: getAttributeValue(
    output.UserAttributes,
    `custom:${COGNITO.customAttributes.City}`
  ),
  postcode: getAttributeValue(
    output.UserAttributes,
    `custom:${COGNITO.customAttributes.Postcode}`
  ),
  plans: JSON.parse(
    getAttributeValue(
      output.UserAttributes,
      `custom:${COGNITO.customAttributes.Plans}`
    ) ?? '[]'
  ),
  customerUpdateTime: getAttributeValue(
    output.UserAttributes,
    `custom:${COGNITO.customAttributes.CustomerUpdateTimestamp}`
  ),
  addressLine1: getAttributeValue(
    output.UserAttributes,
    `custom:${COGNITO.customAttributes.AddressLine1}`
  ),
  addressLine2: getAttributeValue(
    output.UserAttributes,
    `custom:${COGNITO.customAttributes.AddressLine2}`
  ),
  surname: getAttributeValue(
    output.UserAttributes,
    COGNITO.standardAttributes.surname
  ),
  email: getAttributeValue(
    output.UserAttributes,
    COGNITO.standardAttributes.email
  ),
  addressLine3: getAttributeValue(
    output.UserAttributes,
    `custom:${COGNITO.customAttributes.AddressLine3}`
  ),
  phoneNumber: getAttributeValue(
    output.UserAttributes,
    COGNITO.standardAttributes.phone
  ),
});

export interface AuthorizedRouteProps {
  user: User;
}

interface AuthorizedRouteWrapper {
  (args?: {
    groups?: string[];
    getServerSideProps?: GetServerSideProps<AuthorizedRouteProps>;
  }): GetServerSideProps<AuthorizedRouteProps>;
}

const getAttributeValue = (
  attributes: AdminGetUserCommandOutput['UserAttributes'],
  key: string
) => attributes.find((attribute) => attribute.Name === key)?.Value ?? '';

export const authorizedRoute: AuthorizedRouteWrapper = ({
  groups,
  getServerSideProps,
} = {}): GetServerSideProps<AuthorizedRouteProps> => {
  return async (context) => {
    const tokenPair = Object.entries(context.req.cookies).find(([key]) =>
      key.endsWith('.accessToken')
    );

    if (!tokenPair || tokenPair.length !== 2) {
      return backendRedirect('login', 'No .accessToken found');
    }

    const verifyResult = await verifyJwtToken({ token: tokenPair[1] });
    const cognito = new CognitoIdentityProviderClient({});

    const userResult = cognito.send(
      new AdminGetUserCommand({
        UserPoolId: process.env.COGNITO_POOL_ID,
        Username: verifyResult.userName,
      })
    );

    if (!verifyResult.isValid) {
      return backendRedirect(
        'login',
        `Token verification failed: ${verifyResult.error?.message}`
      );
    }

    if (groups?.some((group) => !verifyResult.groups.includes(group))) {
      return backendRedirect(
        'login',
        'Verification was successful, but user is not authorised to access this route'
      );
    }

    return (
      (await getServerSideProps?.(context)) ?? {
        props: { user: parseCognitoResponse(await userResult) },
      }
    );
  };
};
