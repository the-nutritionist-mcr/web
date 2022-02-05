import { Construct } from '@aws-cdk/core';
import path from 'node:path';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Runtime } from '@aws-cdk/aws-lambda';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { IUserPool } from '@aws-cdk/aws-cognito';
import { Provider } from '@aws-cdk/custom-resources';
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';
import { IAM } from '@tnmw/constants';
import { USER_POOL_ID_ENV_KEY_STRING } from "./constants"

interface CognitoSeederProps {
  userpool: IUserPool;
}

export class CognitoSeeder extends Construct {
  constructor(context: Construct, id: string, props: CognitoSeederProps) {
    super(context, id);

    const seederFunction = new NodejsFunction(
      context,
      `cognito-seeder-handler`,
      {
        // eslint-disable-next-line unicorn/prefer-module
        entry: path.resolve(__dirname, 'handler.ts'),
        runtime: Runtime.NODEJS_14_X,
        bundling: {
          sourceMap: true
        },
        environment: {
          [USER_POOL_ID_ENV_KEY_STRING]: props.userpool.userPoolId
        }
      }
    );

    new Provider(context, 'cognito-seeder-provider', {
      onEventHandler: seederFunction,
      logRetention: RetentionDays.ONE_DAY
    });

    seederFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          IAM.actions.cognito.adminSetUserPassword,
          IAM.actions.cognito.adminGetUser,
          IAM.actions.cognito.adminCreateUser,
          IAM.actions.cognito.adminDeleteUser
        ],
        resources: [props.userpool.userPoolArn]
      })
    );
  }
}
