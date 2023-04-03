import { IRestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import {
  Table,
  AttributeType,
  BillingMode,
  StreamViewType,
} from 'aws-cdk-lib/aws-dynamodb';
import { ENV, HTTP } from '@tnmw/constants';
import { getResourceName } from './get-resource-name';
import { entryName } from './entry-name';
import { Construct } from 'constructs';
import { makeInstrumentedFunctionGenerator } from './instrumented-nodejs-function';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { StartingPosition } from 'aws-cdk-lib/aws-lambda';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export enum ReadWriteMode {
  ReadOnly = 'ReadOnly',
  ReadWrite = 'ReadWrite',
}

export const makeDataApi = (
  context: Construct,
  name: string,
  environment: string,
  gitHash: string | undefined,
  api: IRestApi,
  defaultEnvironmentVars: { [key: string]: string },
  readWrite: ReadWriteMode = ReadWriteMode.ReadWrite
) => {
  const apiResource = api.root.addResource(name);

  const dataTable = new Table(context, `${name}Table`, {
    tableName: getResourceName(`${name}-table`, environment),
    billingMode: BillingMode.PAY_PER_REQUEST,
    stream: StreamViewType.KEYS_ONLY,
    partitionKey: {
      name: 'id',
      type: AttributeType.STRING,
    },
  });

  const metaTable = new Table(context, `${name}MetaTable`, {
    tableName: getResourceName(`${name}-meta-table`, environment),
    billingMode: BillingMode.PAY_PER_REQUEST,
    stream: StreamViewType.KEYS_ONLY,
    partitionKey: {
      name: 'name',
      type: AttributeType.STRING,
    },
  });

  const makeFunction = makeInstrumentedFunctionGenerator(
    context,
    environment,
    gitHash
  );

  const source = new DynamoEventSource(dataTable, {
    batchSize: 1,
    startingPosition: StartingPosition.LATEST,
  });

  const getCountLambda = makeFunction(`${name}-getcount`, {
    entry: entryName('misc', 'get-count.ts'),
    environment: {
      ...defaultEnvironmentVars,
      [ENV.varNames.DynamoDBTable]: dataTable.tableName,
      [ENV.varNames.MetaTable]: metaTable.tableName,
    },
  });

  const countLambda = makeFunction(`${name}-count-lambda`, {
    entry: entryName('misc', 'pagination.ts'),
    environment: {
      ...defaultEnvironmentVars,
      [ENV.varNames.DynamoDBTable]: dataTable.tableName,
      [ENV.varNames.MetaTable]: metaTable.tableName,
    },
  });

  metaTable.grantReadWriteData(countLambda);
  dataTable.grantReadData(getCountLambda);

  countLambda.addEventSource(source);

  dataTable.grantReadWriteData(countLambda);

  const makeCrudFunction = (entry: string, opName: string, suffix?: string) => {
    const finalName = suffix ? `${opName}${name}${suffix}` : `${opName}${name}`;
    const crudFunction = makeFunction(finalName, {
      entry,
      environment: {
        ...defaultEnvironmentVars,
        [ENV.varNames.DynamoDBTable]: dataTable.tableName,
        [ENV.varNames.MetaTable]: metaTable.tableName,
      },
    });

    return crudFunction;
  };

  const getFunction = makeCrudFunction(entryName('data-api', 'get.ts'), `get`);

  const getFilterFunction = makeCrudFunction(
    entryName('data-api', 'get-filter.ts'),
    `get`,
    `filter`
  );

  apiResource.addMethod(HTTP.verbs.Get, new LambdaIntegration(getFunction));

  apiResource
    .addResource('search')
    .addMethod(HTTP.verbs.Get, new LambdaIntegration(getFilterFunction));
  dataTable.grantReadData(getFilterFunction);

  dataTable.grantReadData(getFunction);
  metaTable.grantReadData(getFunction);

  const getByIdFunction = makeCrudFunction(
    entryName('data-api', 'get-by-id.ts'),
    'get-by-id'
  );

  dataTable.grantReadData(getByIdFunction);

  const byIdResource = apiResource.addResource('get-by-id');

  byIdResource.addMethod(
    HTTP.verbs.Get,
    new LambdaIntegration(getByIdFunction)
  );

  const createFunction = makeCrudFunction(
    entryName('data-api', 'post.ts'),
    'create'
  );

  if (readWrite !== ReadWriteMode.ReadOnly) {
    apiResource.addMethod(
      HTTP.verbs.Post,
      new LambdaIntegration(createFunction)
    );
    dataTable.grantWriteData(createFunction);

    const updateFunction = makeCrudFunction(
      entryName('data-api', 'put.ts'),
      `update`
    );

    apiResource.addMethod(
      HTTP.verbs.Put,
      new LambdaIntegration(updateFunction)
    );
    dataTable.grantWriteData(updateFunction);
  }

  return { table: dataTable };
};
