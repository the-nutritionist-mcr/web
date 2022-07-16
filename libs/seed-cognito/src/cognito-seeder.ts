import { CustomResource, CfnParameter } from 'aws-cdk-lib';
import path from 'node:path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IAM } from '@tnmw/constants';
import { Construct } from 'constructs';
import {
  USER_POOL_ID_ENV_KEY_STRING,
  SEED_USERS_ENV_KEY_STRING,
} from './constants';
import { SeedUser } from './types';

interface CognitoSeederProps {
  userpool: IUserPool;
  users: SeedUser[];
}

const now = Date.now();

export class CognitoSeeder extends Construct {
  constructor(context: Construct, id: string, props: CognitoSeederProps) {
    super(context, `${id}-${now}`);

    const newId = `${id}-${now}`;

    const deployTime = new CfnParameter(this, `${newId}-deploy-time`, {
      default: now,
    });

    const seederFunction = new NodejsFunction(context, `${id}-seeder-handler`, {
      // eslint-disable-next-line unicorn/prefer-module
      entry: path.resolve(__dirname, 'handler.ts'),
      runtime: Runtime.NODEJS_14_X,
      bundling: {
        sourceMap: true,
      },
      environment: {
        [USER_POOL_ID_ENV_KEY_STRING]: props.userpool.userPoolId,
        [SEED_USERS_ENV_KEY_STRING]: JSON.stringify(props.users),
      },
    });

    const provider = new Provider(this, `${newId}-provider`, {
      onEventHandler: seederFunction,
      logRetention: RetentionDays.ONE_DAY,
    });

    const seederResource = new CustomResource(this, `${newId}-resource`, {
      serviceToken: provider.serviceToken,
      properties: {
        deployTime: deployTime.valueAsString,
      },
    });

    seederResource.node.addDependency(props.userpool);

    seederFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          IAM.actions.cognito.adminSetUserPassword,
          IAM.actions.cognito.adminGetUser,
          IAM.actions.cognito.adminCreateUser,
          IAM.actions.cognito.adminDeleteUser,
          IAM.actions.cognito.adminAddUserToGroup,
        ],
        resources: [props.userpool.userPoolArn],
      })
    );
  }
}
