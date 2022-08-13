import { IRestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { ENV, HTTP, IAM } from '@tnmw/constants';
import { getResourceName } from './get-resource-name';
import { entryName } from './entry-name';
import { Construct } from 'constructs';
import { instrumentFunctions } from './instrument-functions';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export enum ReadWriteMode {
  ReadOnly = 'ReadOnly',
  ReadWrite = 'ReadWrite',
}

export const makeDataApi = (
  context: Construct,
  name: string,
  environment: string,
  gitHash: string,
  api: IRestApi,
  defaultEnvironmentVars: { [key: string]: string },
  readWrite: ReadWriteMode = ReadWriteMode.ReadWrite
) => {
  const apiResource = api.root.addResource(name);

  const dataTable = new Table(context, `${name}Table`, {
    tableName: getResourceName(`${name}-table`, environment),
    billingMode: BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: 'id',
      type: AttributeType.STRING,
    },
  });

  const makeCrudFunction = (entry: string, opName: string) => {
    const crudFunction = new NodejsFunction(context, `${opName}${name}`, {
      functionName: getResourceName(`${opName}-${name}-handler`, environment),
      entry,
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      environment: {
        ...defaultEnvironmentVars,
        [ENV.varNames.DynamoDBTable]: dataTable.tableName,
      },
      bundling: {
        externalModules: ['dd-trace', 'datadog-lambda-js'],
        sourceMap: true,
      },
    });

    instrumentFunctions(context, environment, gitHash, crudFunction);

    return crudFunction;
  };

  const getFunction = makeCrudFunction(entryName('data-api', 'get.ts'), `get`);

  apiResource.addMethod(HTTP.verbs.Get, new LambdaIntegration(getFunction));
  dataTable.grantReadData(getFunction);

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
