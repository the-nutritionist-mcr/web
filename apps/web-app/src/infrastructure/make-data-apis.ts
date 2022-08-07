import { CfnOutput } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGatewayDomain } from 'aws-cdk-lib/aws-route53-targets';
import { Datadog } from 'datadog-cdk-constructs-v2';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { getResourceName } from './get-resource-name';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, ManagedPolicy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { getDomainName } from '@tnmw/utils';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { IAM, ENV, HTTP, RESOURCES, NODE_OPTS } from '@tnmw/constants';
import { makeDataApi } from './make-data-api';
import { entryName } from './entry-name';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { instrumentFunctions } from './instrument-functions';

export const makeDataApis = (
  context: Construct,
  hostedZone: IHostedZone,
  envName: string,
  pool: IUserPool,
  sesIdentityArn: string,
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
    [ENV.varNames.ChargeBeeToken]: chargebeeAccessToken.secretName,
    [ENV.varNames.CognitoPoolId]: pool.userPoolId,
    [ENV.varNames.ChargeBeeSite]: chargebeeSite,
    [ENV.varNames.ChargeBeeWebhookUsername]:
      chargeBeeWebhookUsername.secretName,
    [ENV.varNames.ChargeBeeWebhookPasssword]: chargeWebhookPassword.secretName,
    FORCE_UPDATE_KEY: forceUpdateKey,
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

  makeDataApi(context, RESOURCES.Recipe, envName, api, defaultEnvironmentVars);

  makeDataApi(
    context,
    RESOURCES.Customisation,
    envName,
    api,
    defaultEnvironmentVars
  );

  const planDataTable = new Table(context, `plan-table`, {
    tableName: getResourceName(`plan-table-table`, envName),
    billingMode: BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: 'id',
      type: AttributeType.STRING,
    },
    sortKey: {
      name: 'sort',
      type: AttributeType.STRING,
    },
  });

  const planFunction = new NodejsFunction(context, `plan-function`, {
    functionName: getResourceName(`plan-function`, envName),
    entry: entryName('misc', 'submit-full-plan.ts'),
    runtime: Runtime.NODEJS_14_X,
    memorySize: 2048,
    environment: {
      ...defaultEnvironmentVars,
      [ENV.varNames.DynamoDBTable]: planDataTable.tableName,
    },
    bundling: {
      sourceMap: true,
    },
  });

  const planResource = api.root.addResource('plan');

  planResource.addMethod(HTTP.verbs.Post, new LambdaIntegration(planFunction));
  planDataTable.grantReadWriteData(planFunction);

  planFunction.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [IAM.actions.cognito.listUsers],
      resources: [pool.userPoolArn],
    })
  );

  const submitOrderFunction = new NodejsFunction(
    context,
    `submit-order-function`,
    {
      functionName: getResourceName(`order-function`, envName),
      entry: entryName('misc', 'customer-submit-order.ts'),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      environment: {
        ...defaultEnvironmentVars,
        [ENV.varNames.DynamoDBTable]: planDataTable.tableName,
      },
      bundling: {
        sourceMap: true,
      },
    }
  );

  submitOrderFunction.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [IAM.actions.ses.sendEmail],
      resources: [sesIdentityArn],
    })
  );

  const submitOrder = planResource.addResource('submit-order');
  submitOrder.addMethod(
    HTTP.verbs.Post,
    new LambdaIntegration(submitOrderFunction)
  );
  planDataTable.grantReadWriteData(submitOrderFunction);

  const getPlanFunction = new NodejsFunction(context, `get-plan-function`, {
    functionName: getResourceName(`get-plan-function`, envName),
    entry: entryName('misc', 'get-current-plan.ts'),
    runtime: Runtime.NODEJS_14_X,
    memorySize: 2048,
    environment: {
      ...defaultEnvironmentVars,
      [ENV.varNames.DynamoDBTable]: planDataTable.tableName,
    },
    bundling: {
      sourceMap: true,
    },
  });

  planResource.addMethod(
    HTTP.verbs.Get,
    new LambdaIntegration(getPlanFunction)
  );
  planDataTable.grantReadData(getPlanFunction);

  const changePlanFunction = new NodejsFunction(
    context,
    `change-plan-function`,
    {
      functionName: getResourceName(`change-plan-function`, envName),
      entry: entryName('misc', 'change-plan-recipe.ts'),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      environment: {
        ...defaultEnvironmentVars,
        [ENV.varNames.DynamoDBTable]: planDataTable.tableName,
      },
      bundling: {
        sourceMap: true,
      },
    }
  );

  planResource.addMethod(
    HTTP.verbs.Put,
    new LambdaIntegration(changePlanFunction)
  );
  planDataTable.grantReadWriteData(changePlanFunction);

  const publishPlanFunction = new NodejsFunction(
    context,
    `publish-plan-function`,
    {
      functionName: getResourceName(`publish-plan`, envName),
      entry: entryName('misc', 'publish-plan.ts'),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      environment: {
        ...defaultEnvironmentVars,
        [ENV.varNames.DynamoDBTable]: planDataTable.tableName,
      },
      bundling: {
        sourceMap: true,
      },
    }
  );

  const publishResource = planResource.addResource('publish');

  publishResource.addMethod(
    HTTP.verbs.Post,
    new LambdaIntegration(publishPlanFunction)
  );

  planDataTable.grantWriteData(publishPlanFunction);

  const customer = api.root.addResource('customer');

  const username = customer.addResource('{username}');

  const getCustomerFunction = new NodejsFunction(
    context,
    `get-customer-function`,
    {
      functionName: getResourceName(`get-customer-function`, envName),
      entry: entryName('misc', 'get-customer.ts'),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      environment: defaultEnvironmentVars,
      bundling: {
        sourceMap: true,
      },
    }
  );
  username.addMethod('GET', new LambdaIntegration(getCustomerFunction));

  getCustomerFunction.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [IAM.actions.cognito.adminGetUser],
      resources: [pool.userPoolArn],
    })
  );

  const updateCustomerFunction = new NodejsFunction(
    context,
    `update-customer-function`,
    {
      functionName: getResourceName(`update-customer`, envName),
      entry: entryName('misc', 'update-customer.ts'),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      environment: defaultEnvironmentVars,
      bundling: {
        sourceMap: true,
      },
    }
  );

  updateCustomerFunction.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [IAM.actions.cognito.adminUpdateUserAttributes],
      resources: [pool.userPoolArn],
    })
  );

  username.addMethod('POST', new LambdaIntegration(updateCustomerFunction));

  const customers = api.root.addResource('customers');

  const getAllCustomersFunction = new NodejsFunction(
    context,
    `get-all-customers-function`,
    {
      functionName: getResourceName(`get-all-customers-function`, envName),
      entry: entryName('misc', 'get-all-customers.ts'),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 2048,
      environment: defaultEnvironmentVars,
      bundling: {
        sourceMap: true,
      },
    }
  );

  customers.addMethod('GET', new LambdaIntegration(getAllCustomersFunction));

  getAllCustomersFunction.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [IAM.actions.cognito.listUsers],
      resources: [pool.userPoolArn],
    })
  );

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

  chargebeeAccessToken.grantRead(individualAcccessFunction);

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
      environment: { ...defaultEnvironmentVars, FORCE_DEPLOY: 'true' },
      bundling: {
        sourceMap: true,
      },
    }
  );

  chargeBeeWebhookUsername.grantRead(chargeBeeWebhookFunction);
  chargeWebhookPassword.grantRead(chargeBeeWebhookFunction);
  chargebeeAccessToken.grantRead(chargeBeeWebhookFunction);

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

  instrumentFunctions(
    context,
    envName,
    chargeBeeWebhookFunction,
    getAllCustomersFunction,
    updateCustomerFunction,
    individualAcccessFunction,
    getCustomerFunction,
    publishPlanFunction,
    changePlanFunction,
    getPlanFunction,
    submitOrderFunction,
    planFunction
  );
};
