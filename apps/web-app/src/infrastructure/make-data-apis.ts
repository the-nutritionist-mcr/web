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
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';
import { IRestApi, LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import path from 'node:path';
import { getDomainName } from './get-domain-name';
import { IUserPool } from '@aws-cdk/aws-cognito';
import { IAM, ENV, HTTP, RESOURCES } from './constants';

const entryName = (folder: string, name: string) =>
  // eslint-disable-next-line unicorn/prefer-module
  path.resolve(__dirname, '..', 'backend', 'lambdas', folder, name);

const makeDataApi = (
  context: Construct,
  name: string,
  environment: string,
  api: IRestApi,
  defaultEnvironmentVars: { [key: string]: string }
) => {
  const apiResource = api.root.addResource(name);

  const dataTable = new Table(context, `${name}Table`, {
    tableName: getResourceName(`${name}-table`, environment),
    billingMode: BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: 'id',
      type: AttributeType.STRING
    }
  });

  const makeCrudFunction = (entry: string, opName: string) =>
    new NodejsFunction(context, `${opName}${name}`, {
      functionName: getResourceName(`${opName}-${name}-handler`, environment),
      entry: entryName('data-api', entry),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      environment: {
        ...defaultEnvironmentVars,
        [ENV.varNames.DynamoDBTable]: dataTable.tableName
      },
      bundling: {
        sourceMap: true
      }
    });

  const getFunction = makeCrudFunction('get.ts', `get`);

  apiResource.addMethod(HTTP.verbs.Get, new LambdaIntegration(getFunction));
  dataTable.grantReadData(getFunction);

  const createFunction = makeCrudFunction('post.ts', 'create');

  apiResource.addMethod(HTTP.verbs.Post, new LambdaIntegration(createFunction));
  dataTable.grantWriteData(createFunction);

  const updateFunction = makeCrudFunction('put.ts', `update`);

  apiResource.addMethod(HTTP.verbs.Put, new LambdaIntegration(updateFunction));
  dataTable.grantWriteData(updateFunction);
};

export const makeDataApis = (
  context: Construct,
  hostedZone: IHostedZone,
  envName: string,
  pool: IUserPool,
  chargebeeSite: string
) => {
  const domainName = getDomainName(envName, 'api');

  const chargebeeAccessToken = new Secret(context, 'ChargeeAccessToken', {
    secretName: getResourceName(`chargebee-access-token`, envName)
  });

  const chargeBeeWebhookUsername = new Secret(
    context,
    'ChargeBeeWebhookUsername',
    {
      secretName: getResourceName(`chargebee-webhook-username`, envName)
    }
  );

  const chargeWebhookPassword = new Secret(
    context,
    'ChargeBeeWebhookPassword',
    {
      secretName: getResourceName(`chargebee-webhook-password`, envName)
    }
  );

  const defaultEnvironmentVars = {
    [ENV.varNames.EnvironmentName]: envName,
    [ENV.varNames.ChargeBeeToken]: chargebeeAccessToken.secretValue.toString(),
    [ENV.varNames.CognitoPoolId]: pool.userPoolId,
    [ENV.varNames.ChargeBeeSite]: chargebeeSite,
    [ENV.varNames.ChargeBeeWebhookUsername]:
      chargeBeeWebhookUsername.secretValue.toString(),
    [ENV.varNames.ChargeBeeWebhookPasssword]:
      chargeWebhookPassword.secretValue.toString()
  };

  new CfnOutput(context, 'ApiDomainName', {
    value: domainName
  });

  const certificate = new DnsValidatedCertificate(context, 'apiCertificate', {
    domainName,
    hostedZone
  });

  const api = new RestApi(context, 'data-api', {
    restApiName: getResourceName('data-api', envName),
    defaultCorsPreflightOptions: {
      allowHeaders: [
        HTTP.headerNames.ContentType,
        HTTP.headerNames.XAmxDate,
        HTTP.headerNames.Authorization,
        HTTP.headerNames.XApiKey
      ],
      allowMethods: [HTTP.verbs.Get, HTTP.verbs.Options, HTTP.verbs.Put],
      allowCredentials: true,
      allowOrigins: ['*']
    }
  });

  const apiDomainName = api.addDomainName('data-api-domain-name', {
    domainName,
    certificate
  });

  new ARecord(context, 'ApiARecord', {
    zone: hostedZone,
    recordName: domainName,
    target: RecordTarget.fromAlias(new ApiGatewayDomain(apiDomainName))
  });

  makeDataApi(context, RESOURCES.Recipe, envName, api, defaultEnvironmentVars);

  makeDataApi(
    context,
    RESOURCES.Customisation,
    envName,
    api,
    defaultEnvironmentVars
  );

  makeDataApi(
    context,
    RESOURCES.CookPlan,
    envName,
    api,
    defaultEnvironmentVars
  );

  const customers = api.root.addResource('customers');

  const me = customers.addResource('me');

  const individualAcccessFunction = new NodejsFunction(
    context,
    `chargebe-me-function`,
    {
      functionName: getResourceName(`chargebee-me-handler`, envName),
      entry: entryName('chargebee-api', 'me.ts'),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      environment: defaultEnvironmentVars,
      bundling: {
        sourceMap: true
      }
    }
  );

  me.addMethod('GET', new LambdaIntegration(individualAcccessFunction));

  const receiveChargebeeWebhook = api.root.addResource(
    'receive-chargebee-webhook'
  );

  const chargeBeeWebhookFunction = new NodejsFunction(
    context,
    `chargebee-webhook-function`,
    {
      functionName: getResourceName(`chargebee-webhook-handler`, envName),
      entry: entryName('chargebee-api', 'webhook.ts'),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      environment: defaultEnvironmentVars,
      bundling: {
        sourceMap: true
      }
    }
  );

  receiveChargebeeWebhook.addMethod(
    'POST',
    new LambdaIntegration(chargeBeeWebhookFunction)
  );

  chargeBeeWebhookFunction.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        IAM.actions.cognito.adminGetUser,
        IAM.actions.cognito.adminCreateUser
      ],
      resources: [pool.userPoolArn]
    })
  );
};
