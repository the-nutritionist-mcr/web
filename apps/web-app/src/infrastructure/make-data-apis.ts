import { Construct, CfnOutput } from '@aws-cdk/core';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import { ARecord, RecordTarget } from '@aws-cdk/aws-route53';
import { ApiGatewayDomain } from '@aws-cdk/aws-route53-targets';
import { Runtime } from '@aws-cdk/aws-lambda';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import { IHostedZone } from '@aws-cdk/aws-route53';
import { getResourceName } from './get-resource-name';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { getDomainName } from './get-domain-name';
import { IUserPool } from '@aws-cdk/aws-cognito';
import { IAM, ENV, HTTP, RESOURCES, NODE_OPTS } from '@tnmw/constants';
import { makeDataApi } from './make-data-api';
import { entryName } from './entry-name';

export const makeDataApis = (
  context: Construct,
  hostedZone: IHostedZone,
  envName: string,
  pool: IUserPool,
  chargebeeSite: string,
  forceUpdateKey: string
) => {
  const domainName = getDomainName(envName, 'api');

  const chargebeeAccessToken = new Secret(context, 'ChargeeAccessToken', {
    secretName: getResourceName(`chargebee-access-token`, envName),
  });

  const chargeBeeWebhookUsername = new Secret(
    context,
    'ChargeBeeWebhookUsername',
    {
      secretName: getResourceName(`chargebee-webhook-username`, envName),
    }
  );

  const chargeWebhookPassword = new Secret(
    context,
    'ChargeBeeWebhookPassword',
    {
      secretName: getResourceName(`chargebee-webhook-password`, envName),
    }
  );

  const defaultEnvironmentVars = {
    [ENV.varNames.NodeOptions]: NODE_OPTS.EnableSourceMaps,
    [ENV.varNames.EnvironmentName]: envName,
    [ENV.varNames.ChargeBeeToken]: chargebeeAccessToken.secretValue.toString(),
    [ENV.varNames.CognitoPoolId]: pool.userPoolId,
    [ENV.varNames.ChargeBeeSite]: chargebeeSite,
    [ENV.varNames.ChargeBeeWebhookUsername]:
      chargeBeeWebhookUsername.secretValue.toString(),
    [ENV.varNames.ChargeBeeWebhookPasssword]:
      chargeWebhookPassword.secretValue.toString(),
  };

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
        HTTP.headerNames.ContentType,
        HTTP.headerNames.XAmxDate,
        HTTP.headerNames.Authorization,
        HTTP.headerNames.XApiKey,
      ],
      allowMethods: [
        HTTP.verbs.Get,
        HTTP.verbs.Put,
        HTTP.verbs.Post,
        HTTP.verbs.Options,
      ],
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

  makeDataApi(
    context,
    RESOURCES.Recipe,
    envName,
    api,
    defaultEnvironmentVars,
    forceUpdateKey
  );

  makeDataApi(
    context,
    RESOURCES.Customisation,
    envName,
    api,
    defaultEnvironmentVars,
    forceUpdateKey
  );

  makeDataApi(
    context,
    RESOURCES.CookPlan,
    envName,
    api,
    defaultEnvironmentVars,
    forceUpdateKey,
    {
      post: 'submit-full-plan.ts',
    }
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
        sourceMap: true,
      },
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
      functionName: getResourceName(`chargebee-event-handler`, envName),
      entry: entryName('chargebee-api', 'webhook.ts'),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      environment: defaultEnvironmentVars,
      bundling: {
        sourceMap: true,
      },
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
        IAM.actions.cognito.adminCreateUser,
        IAM.actions.cognito.adminUpdateUserAttributes,
      ],
      resources: [pool.userPoolArn],
    })
  );
};
