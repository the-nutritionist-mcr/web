import * as apiGateway from '@aws-cdk/aws-apigateway';
import * as appsync from '@aws-cdk/aws-appsync';
import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import addProjectTags from './addProjectTags';
import path from 'path';
import { RemovalPolicy } from '@aws-cdk/core';

interface BackendStackProps {
  envName: string;
  appName: string;
  friendlyName: string;
  url: string;
  transient: boolean;
}

export default class BackendStack extends cdk.Stack {
  public constructor(
    scope: cdk.Construct,
    id: string,
    props: cdk.StackProps & BackendStackProps
  ) {
    super(scope, id, props);

    const name = `${props.envName}-${props.appName}`.toLowerCase();

    const verificationString = `Hey {username}! Thanks for signing up to ${props.friendlyName}. Your verification code is {####}`;
    const invitationString = `Hey {username}! you have been invited to join ${props.friendlyName}. Your temporary password is {####}`;
    const removalPolicy = props.transient
      ? RemovalPolicy.DESTROY
      : RemovalPolicy.RETAIN;

    const pool = new cognito.UserPool(this, 'Users', {
      removalPolicy,
      userPoolName: `${name}-users`,
      selfSignUpEnabled: true,

      userVerification: {
        emailBody: verificationString,
        emailSubject: `${props.friendlyName} signup`,
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage: verificationString,
      },

      userInvitation: {
        emailSubject: `${props.friendlyName} invite`,
        emailBody: invitationString,
        smsMessage: invitationString,
      },

      customAttributes: {
        chargebeeId: new cognito.StringAttribute({ mutable: false }),
      },

      signInAliases: {
        username: true,
        email: true,
        phone: true,
      },
    });
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: pool.userPoolId,
    });

    const client = pool.addClient('Client', {
      oAuth: {
        callbackUrls: [props.url],
      },
    });

    new cdk.CfnOutput(this, 'ClientId', {
      value: client.userPoolClientId,
    });

    const domain = pool.addDomain('Domain', {
      cognitoDomain: {
        domainPrefix: `${name}-auth`,
      },
    });

    const signInUrl = domain.signInUrl(client, {
      redirectUri: props.url,
    });

    const url = domain.baseUrl();

    new cdk.CfnOutput(this, 'Auth Url', {
      value: url,
    });

    new cdk.CfnOutput(this, 'Redirect Url', {
      value: signInUrl,
    });

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: `${name}-api`,
      schema: appsync.Schema.fromAsset(
        path.resolve(__dirname, '..', 'schema', 'schema.graphql')
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: pool,
          },
        },
      },
    });

    new cdk.CfnOutput(this, 'GraphQlQpiUrl', {
      value: api.graphqlUrl,
    });

    const bundlePath = process.env.IS_LOCAL_DEPLOY
      ? path.resolve(__dirname, '..', '..', 'dist', 'bundles', 'backend')
      : path.resolve(__dirname, '..', '..', 'backend');

    const resolverLambda = new lambda.Function(this, 'AppResolverLambda', {
      functionName: `${name}-resolver-lambda`,
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(bundlePath),
      memorySize: 1024,
    });

    const lambdaDataSource = api.addLambdaDataSource(
      'lambdaDataSource',
      resolverLambda
    );

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getExclusionById',
    });

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'listExclusions',
    });

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getRecipeById',
    });

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'listRecipes',
    });

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getCustomerById',
    });

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'listCustomers',
    });

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateRecipe',
    });

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteRecipe',
    });

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createRecipe',
    });

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateCustomer',
    });

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createCustomer',
    });

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteCustomer',
    });

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateExclusion',
    });

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createExclusion',
    });

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteExclusion',
    });

    const customersTable = new ddb.Table(this, 'CustomersTable', {
      removalPolicy,
      tableName: `${name}-customers-table`,
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });

    const restApi = new apiGateway.RestApi(this, 'DataApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS,
      },
      restApiName: `${name}RestApi`,
    });

    const customersResource = restApi.root.addResource('customers');

    const getCustomersPolicy = new iam.Policy(this, 'ScanCustomersPolicy', {
      statements: [
        new iam.PolicyStatement({
          actions: ['dynamodb:Scan'],
          effect: iam.Effect.ALLOW,
          resources: [customersTable.tableArn],
        }),
      ],
    });

    const scanCustomersRole = new iam.Role(this, 'ScanCustomersRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });

    scanCustomersRole.attachInlinePolicy(getCustomersPolicy);

    const errorResponses: apiGateway.IntegrationResponse[] = [
      {
        selectionPattern: '400',
        statusCode: '400',
        responseTemplates: {
          'application/json': `{
            "error": "Bad input!"
          }`,
        },
      },
      {
        selectionPattern: '5\\d{2}',
        statusCode: '500',
        responseTemplates: {
          'application/json': `{
            "error": "Internal Service Error!"
          }`,
        },
      },
    ];

    const integrationResponses = [
      {
        statusCode: '200',
      },
      ...errorResponses,
    ];

    const scanCustomersIntegration = new apiGateway.AwsIntegration({
      action: 'Scan',
      service: 'dynamodb',
      options: {
        credentialsRole: scanCustomersRole,
        integrationResponses,
        requestTemplates: {
          'application/json': `{
            "TableName": "${customersTable.tableName}"
          }`,
        },
      },
    });

    const methodOptions: apiGateway.MethodOptions = {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '400' },
        { statusCode: '500' },
      ],
      apiKeyRequired: true,
    };

    customersResource.addMethod('GET', scanCustomersIntegration, methodOptions);

    const apiKey = restApi.addApiKey('RestApiKey', {
      apiKeyName: `${name}-rest-api-key`,
    });

    const plan = restApi.addUsagePlan('UsagePlan', {
      name: `${name}-website-usage`,
      apiKey,
    });

    plan.addApiStage({ stage: restApi.deploymentStage });

    customersTable.grantFullAccess(resolverLambda);
    resolverLambda.addEnvironment('CUSTOMERS_TABLE', customersTable.tableName);
    new cdk.CfnOutput(this, 'CustomersTableName', {
      value: customersTable.tableName,
    });

    const exclusionsTable = new ddb.Table(this, 'ExclusionsTable', {
      removalPolicy,
      tableName: `${name}-exclusions-table`,
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });

    exclusionsTable.grantFullAccess(resolverLambda);
    resolverLambda.addEnvironment(
      'EXCLUSIONS_TABLE',
      exclusionsTable.tableName
    );
    new cdk.CfnOutput(this, 'ExclusionsTableName', {
      value: exclusionsTable.tableName,
    });

    const recipesTable = new ddb.Table(this, 'RecipesTable', {
      removalPolicy,
      tableName: `${name}-recipes-table`,
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });

    recipesTable.grantFullAccess(resolverLambda);
    resolverLambda.addEnvironment('RECIPES_TABLE', recipesTable.tableName);
    new cdk.CfnOutput(this, 'RecipesTableName', {
      value: recipesTable.tableName,
    });

    const customerExclusionsTable = new ddb.Table(
      this,
      'CustomerExclusionsTable',
      {
        removalPolicy,
        tableName: `${name}-customer-exclusions-table`,
        billingMode: ddb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
          name: 'id',
          type: ddb.AttributeType.STRING,
        },
      }
    );

    new cdk.CfnOutput(this, 'CustomerExclusionsTableName', {
      value: customerExclusionsTable.tableName,
    });

    customerExclusionsTable.addGlobalSecondaryIndex({
      indexName: 'customerId',
      partitionKey: {
        name: 'customerId',
        type: ddb.AttributeType.STRING,
      },
    });

    customerExclusionsTable.addGlobalSecondaryIndex({
      indexName: 'exclusionId',
      partitionKey: {
        name: 'exclusionId',
        type: ddb.AttributeType.STRING,
      },
    });

    const recipeExclusionsTable = new ddb.Table(this, 'RecipeExclusionsTable', {
      removalPolicy,
      tableName: `${name}-recipe-exclusions-table`,
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });

    new cdk.CfnOutput(this, 'RecipeExclusionsTableName', {
      value: recipeExclusionsTable.tableName,
    });

    recipeExclusionsTable.grantFullAccess(resolverLambda);

    recipeExclusionsTable.addGlobalSecondaryIndex({
      indexName: 'recipeId',
      partitionKey: {
        name: 'recipeId',
        type: ddb.AttributeType.STRING,
      },
    });

    recipeExclusionsTable.addGlobalSecondaryIndex({
      indexName: 'exclusionId',
      partitionKey: {
        name: 'exclusionId',
        type: ddb.AttributeType.STRING,
      },
    });

    customerExclusionsTable.grantFullAccess(resolverLambda);

    resolverLambda.addEnvironment(
      'RECIPE_EXCLUSIONS_TABLE',
      recipeExclusionsTable.tableName
    );

    resolverLambda.addEnvironment(
      'CUSTOMER_EXCLUSIONS_TABLE',
      customerExclusionsTable.tableName
    );

    addProjectTags('TnmAdmin', [
      resolverLambda,
      customerExclusionsTable,
      recipeExclusionsTable,
      recipesTable,
      customersTable,
      exclusionsTable,
      lambdaDataSource,
      api,
      pool,
    ]);
  }
}
