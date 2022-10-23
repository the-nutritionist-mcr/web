import { CustomResource, CfnParameter, Duration } from 'aws-cdk-lib';
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
  SEED_DATA_BUCKET_KEY_STRING,
  SEED_DATA_FILE_NAME,
} from './constants';
import { SeedUser } from './types';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

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

    const bucket = new Bucket(context, `${id}-users-bucket`);

    const dataDeployment = new BucketDeployment(
      this,
      `${id}-cognito-seeder-data-deployment`,
      {
        sources: [Source.jsonData(SEED_DATA_FILE_NAME, props.users)],
        destinationBucket: bucket,
      }
    );

    const seederFunction = new NodejsFunction(
      context,
      `${id}-cognito-seeder-handler`,
      {
        // eslint-disable-next-line unicorn/prefer-module
        entry: path.resolve(__dirname, 'handler.ts'),
        runtime: Runtime.NODEJS_16_X,
        timeout: Duration.minutes(15),
        bundling: {
          sourceMap: true,
        },
        environment: {
          [USER_POOL_ID_ENV_KEY_STRING]: props.userpool.userPoolId,
          [SEED_DATA_BUCKET_KEY_STRING]: bucket.bucketName,
        },
      }
    );

    bucket.grantRead(seederFunction);

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
    seederResource.node.addDependency(bucket);
    seederResource.node.addDependency(dataDeployment);

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
