import {
  UserPool,
  CfnUserPoolGroup,
  VerificationEmailStyle,
  UserPoolEmail,
  StringAttribute,
} from 'aws-cdk-lib/aws-cognito';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { getResourceName } from './get-resource-name';
import { COGNITO } from '@tnmw/constants';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import path from 'node:path';
import { Construct } from 'constructs';

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
      environment: {
        ENVIRONMENT: environmentName,
      },
      memorySize: 2048,
      bundling: {
        sourceMap: true,
      },
    }
  );

  const preTokenGenerationTriggerHandler = new NodejsFunction(
    context,
    `pre-token-generation-trigger`,
    {
      functionName: getResourceName(
        `pre-token-generation-trigger`,
        environmentName
      ),
      entry: entryName('misc', 'suppress-cognito-claims.ts'),
      runtime: Runtime.NODEJS_14_X,
      environment: {
        ENVIRONMENT: environmentName,
      },
      memorySize: 2048,
      bundling: {
        sourceMap: true,
      },
    }
  );

  const email = UserPoolEmail.withSES({
    fromEmail: 'no-reply@thenutritionistmcr.com',
    fromName: 'The Nutritionist MCR',
    replyTo: 'support@thenutrionistmcr.com',
    /* @ts-ignore */
    sesVerifiedDomain: 'thenutritionistmcr.com',
  });

  const verificationString =
    'Hey {username}! Thanks for signing up to The Nutritionist Manchester. Your verification code is {####}';
  const invitationString =
    'Hey {username}! you have been invited to join The Nutritionist Manchester. Your temporary password is {####}';
  const userPool = new UserPool(context, 'user-pool', {
    removalPolicy,
    userPoolName: getResourceName('user-pool', environmentName),
    selfSignUpEnabled: true,

    email,

    userVerification: {
      emailBody: verificationString,
      emailSubject: 'TNM signup',
      emailStyle: VerificationEmailStyle.CODE,
    },

    lambdaTriggers: {
      customMessage: adminCreateUserEmailSender,
      preTokenGeneration: preTokenGenerationTriggerHandler,
    },

    userInvitation: {
      emailSubject: 'TNM invite',
      emailBody: invitationString,
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

  new CfnOutput(context, 'UserPoolArn', {
    value: userPool.userPoolArn,
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
