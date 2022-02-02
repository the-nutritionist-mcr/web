import { Construct, CfnOutput } from '@aws-cdk/core';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import { ARecord, RecordTarget } from '@aws-cdk/aws-route53';
import { ApiGatewayDomain } from '@aws-cdk/aws-route53-targets';
import { Runtime } from '@aws-cdk/aws-lambda';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import { IHostedZone } from '@aws-cdk/aws-route53';
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';
import { getResourceName } from './get-resource-name';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { IRestApi, LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import path from 'node:path';
import { getDomainName } from './get-domain-name';
import { IUserPool } from '@aws-cdk/aws-cognito';

const entryName = (folder: string, name: string) =>
  // eslint-disable-next-line unicorn/prefer-module
  path.resolve(__dirname, '..', 'backend', 'lambdas', folder, name);

const makeDataApi = (
  context: Construct,
  name: string,
  environment: string,
  api: IRestApi,
  pool: IUserPool
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

  const makeCrudFunction = (entry: string, opName: string) =>
    new NodejsFunction(context, `${opName}${name}`, {
      functionName: getResourceName(`${opName}-${name}-handler`, environment),
      entry: entryName('data-api', entry),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      environment: {
        ENVIRONMENT_NAME: environment,
        DYNAMODB_TABLE: dataTable.tableName,
        COGNITO_POOL_ID: pool.userPoolId,
      },
      bundling: {
        sourceMap: true,
      },
    });

  const getFunction = makeCrudFunction('get.ts', `get`);

  apiResource.addMethod('GET', new LambdaIntegration(getFunction));
  dataTable.grantReadData(getFunction);

  const createFunction = makeCrudFunction('post.ts', 'create');

  apiResource.addMethod('POST', new LambdaIntegration(createFunction));
  dataTable.grantWriteData(createFunction);

  const updateFunction = makeCrudFunction('put.ts', `update`);

  apiResource.addMethod('PUT', new LambdaIntegration(updateFunction));
  dataTable.grantWriteData(updateFunction);
};

export const makeDataApis = (
  context: Construct,
  hostedZone: IHostedZone,
  envName: string,
  pool: IUserPool
) => {
  const domainName = getDomainName(envName, 'api');

  new CfnOutput(context, 'ApiDomainName', {
    value: domainName,
  });

  const certificate = new DnsValidatedCertificate(context, 'apiCertificate', {
    domainName,
    hostedZone,
  });

  const api = new RestApi(context, 'data-api', {
    restApiName: getResourceName('data-api', envName),
    defaultCorsPreflightOptions: {
      allowHeaders: [
        'Content-Type',
        'X-Amz-Date',
        'Authorization',
        'X-Api-Key',
      ],
      allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowCredentials: true,
      allowOrigins: ['*'],
    },
  });

  const apiDomainName = api.addDomainName('data-api-domain-name', {
    domainName,
    certificate,
  });

  new ARecord(context, 'ApiARecord', {
    zone: hostedZone,
    recordName: domainName,
    target: RecordTarget.fromAlias(new ApiGatewayDomain(apiDomainName)),
  });

  makeDataApi(context, 'recipe', envName, api, pool);
  makeDataApi(context, 'customisation', envName, api, pool);

  const chargebeeAccessToken = new Secret(this, 'ChargeeAccessToken', {
    secretName: getResourceName(`chargebee-access-token`, envName)
  })

  const customers = api.root.addResource('customers');

  const me = customers.addResource('me');

  const individualAcccessFunction = new NodejsFunction(context, `chargebe-me-function`, {
      functionName: getResourceName(`chargebee-me-handler`, envName),
      entry: entryName('chargebee-api', 'me.ts'),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      environment: {
        ENVIRONMENT_NAME: envName,
        CHARGEBEE_TOKEN: chargebeeAccessToken.secretValue.toString(),
        COGNITO_POOL_ID: pool.userPoolId
      },
      bundling: {
        sourceMap: true,
      },
    });

    me.addMethod("GET", new LambdaIntegration(individualAcccessFunction));
};
