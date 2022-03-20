import { IRestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';
import { Runtime } from '@aws-cdk/aws-lambda';
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';
import { ENV, HTTP, IAM } from '@tnmw/constants';
import { Construct } from '@aws-cdk/core';
import { getResourceName } from './get-resource-name';
import { entryName } from './entry-name';
import { IUserPool } from '@aws-cdk/aws-cognito';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export enum ReadWriteMode {
  ReadOnly = 'ReadOnly',
  ReadWrite = 'ReadWrite',
}

export const makeDataApi = (
  context: Construct,
  name: string,
  environment: string,
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
        sourceMap: true,
      },
    });

    return crudFunction;
  };

  const getFunction = makeCrudFunction(entryName('data-api', 'get.ts'), `get`);

  apiResource.addMethod(HTTP.verbs.Get, new LambdaIntegration(getFunction));
  dataTable.grantReadData(getFunction);

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
