import { CustomResource, CfnParameter, Duration } from 'aws-cdk-lib';
import path from 'node:path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import {
  SEED_DATA_BUCKET_KEY_STRING,
  SEED_DATA_FILE_NAME,
  TABLE_KEY_STRING,
} from './constants';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

interface DynamoSeederProps {
  table: ITable;
  data: Record<string, unknown>[];
}

const now = Date.now();

export class DynamoSeeder extends Construct {
  constructor(context: Construct, id: string, props: DynamoSeederProps) {
    super(context, `${id}-${now}`);

    const newId = `${id}-${now}`;

    const deployTime = new CfnParameter(this, `${newId}-ddb-deploy-time`, {
      default: now,
    });

    const bucket = new Bucket(context, `${id}-users-bucket`);

    const dataDeployment = new BucketDeployment(
      this,
      `${id}-dynamodb-seeder-data-deployment`,
      {
        sources: [Source.jsonData(SEED_DATA_FILE_NAME, props.data)],
        destinationBucket: bucket,
      }
    );

    const seederFunction = new NodejsFunction(
      context,
      `${id}-dynamodb-seeder-handler`,
      {
        // eslint-disable-next-line unicorn/prefer-module
        entry: path.resolve(__dirname, 'handler.ts'),
        runtime: Runtime.NODEJS_16_X,
        timeout: Duration.minutes(15),
        bundling: {
          sourceMap: true,
        },
        environment: {
          [TABLE_KEY_STRING]: props.table.tableName,
          [SEED_DATA_BUCKET_KEY_STRING]: bucket.bucketName,
        },
      }
    );

    bucket.grantRead(seederFunction);

    const provider = new Provider(this, `${newId}-ddb-provider`, {
      onEventHandler: seederFunction,
      logRetention: RetentionDays.ONE_DAY,
    });

    const seederResource = new CustomResource(this, `${newId}-ddb-resource`, {
      serviceToken: provider.serviceToken,
      properties: {
        deployTime: deployTime.valueAsString,
      },
    });

    seederResource.node.addDependency(props.table);
    seederResource.node.addDependency(bucket);
    seederResource.node.addDependency(dataDeployment);

    props.table.grantReadWriteData(seederFunction);
  }
}
