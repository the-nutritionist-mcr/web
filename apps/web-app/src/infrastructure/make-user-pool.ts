import {
  UserPool,
  CfnUserPoolGroup,
  VerificationEmailStyle,
  StringAttribute,
} from '@aws-cdk/aws-cognito';
import { Runtime } from '@aws-cdk/aws-lambda';
import { CfnOutput, RemovalPolicy, Construct } from '@aws-cdk/core';
import { getResourceName } from './get-resource-name';
import { COGNITO } from '@tnmw/constants';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import path from 'node:path';

const entryName = (folder: string, name: string) =>
  // eslint-disable-next-line unicorn/prefer-module
  path.resolve(__dirname, '..', 'backend', 'lambdas', folder, name);

export const makeUserPool = (
  context: Construct,
  transient: boolean,
  environmentName: string
) => {
  const removalPolicy = transient
    ? RemovalPolicy.DESTROY
    : RemovalPolicy.RETAIN;

  const adminCreateUserEmailSender = new NodejsFunction(
    context,
    `admin-create-user-email-sender`,
    {
      functionName: getResourceName(
        `admin-create-user-email-sender`,
        environmentName
      ),
      entry: entryName('chargebee-api', 'joining-email-sender.ts'),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      bundling: {
        sourceMap: true,
      },
    }
  );

  const verificationString =
    'Hey {username}! Thanks for signing up to The Nutritionist Manchester. Your verification code is {####}';
  const invitationString =
    'Hey {username}! you have been invited to join The Nutritionist Manchester. Your temporary password is {####}';
  const userPool = new UserPool(context, 'user-pool', {
    removalPolicy,
    userPoolName: getResourceName('user-pool', environmentName),
    selfSignUpEnabled: true,

    userVerification: {
      emailBody: verificationString,
      emailSubject: 'TNM signup',
      emailStyle: VerificationEmailStyle.CODE,
      smsMessage: verificationString,
    },

    lambdaTriggers: {
      customMessage: adminCreateUserEmailSender,
    },

    userInvitation: {
      emailSubject: 'TNM invite',
      emailBody: invitationString,
      smsMessage: invitationString,
    },

    customAttributes: {
      [COGNITO.customAttributes.ChargebeeId]: new StringAttribute({
        mutable: false,
      }),
      [COGNITO.customAttributes.Salutation]: new StringAttribute({
        mutable: true,
      }),
      [COGNITO.customAttributes.UserCustomisations]: new StringAttribute({
        mutable: true,
      }),

      [COGNITO.customAttributes.DeliveryDay1]: new StringAttribute({
        mutable: true,
      }),

      [COGNITO.customAttributes.DeliveryDay2]: new StringAttribute({
        mutable: true,
      }),

      [COGNITO.customAttributes.DeliveryDay3]: new StringAttribute({
        mutable: true,
      }),

      [COGNITO.customAttributes.ProfileNotes]: new StringAttribute({
        mutable: true,
      }),

      [COGNITO.customAttributes.Plans]: new StringAttribute({
        mutable: true,
      }),

      [COGNITO.customAttributes.CustomPlan]: new StringAttribute({
        mutable: true,
      }),

      [COGNITO.customAttributes.AddressLine1]: new StringAttribute({
        mutable: true,
      }),

      [COGNITO.customAttributes.AddressLine2]: new StringAttribute({
        mutable: true,
      }),

      [COGNITO.customAttributes.AddressLine3]: new StringAttribute({
        mutable: true,
      }),

      [COGNITO.customAttributes.City]: new StringAttribute({
        mutable: true,
      }),

      [COGNITO.customAttributes.Country]: new StringAttribute({
        mutable: true,
      }),

      [COGNITO.customAttributes.Postcode]: new StringAttribute({
        mutable: true,
      }),

      [COGNITO.customAttributes.CustomerUpdateTimestamp]: new StringAttribute({
        mutable: true,
      }),

      [COGNITO.customAttributes.SubscriptionUpdateTimestamp]:
        new StringAttribute({
          mutable: true,
        }),
    },

    passwordPolicy: {
      minLength: 8,
      requireDigits: false,
      requireLowercase: false,
      requireSymbols: false,
      requireUppercase: false,
    },

    autoVerify: {
      email: true,
      phone: false,
    },

    signInAliases: {
      username: true,
      email: true,
      phone: true,
    },
  });

  new CfnOutput(context, 'UserPoolId', {
    value: userPool.userPoolId,
  });

  const client = userPool.addClient('Client', {
    disableOAuth: true,
  });

  new CfnOutput(context, 'ClientId', {
    value: client.userPoolClientId,
  });

  new CfnUserPoolGroup(context, 'AdminGroup', {
    userPoolId: userPool.userPoolId,
    description: 'TNM Administrators',
    groupName: 'admin',
    precedence: 0,
  });

  return { userPool, client };
};
