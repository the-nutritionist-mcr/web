import * as os from 'node:os';
import * as path from 'node:path';
import {
  Cors,
  IResource,
  LambdaIntegration,
  RestApi,
} from '@aws-cdk/aws-apigateway';
import { PolicyStatement, Effect } from '@aws-cdk/aws-iam';
import { HttpOrigin } from '@aws-cdk/aws-cloudfront-origins';
import { IUserPoolClient, IUserPool } from '@aws-cdk/aws-cognito';
import { Code, LayerVersion, Function, Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as fs from 'fs-extra';
import { getResourceName } from './get-resource-name';
import { Duration } from '@aws-cdk/core';
import { IAM } from '@tnmw/constants';

export const makePagesApi = (
  context: cdk.Construct,
  outLambda: string,
  envName: string,
  dotNextFolder: string,
  pool: IUserPool,
  poolClient: IUserPoolClient,
  forceUpdateKey: string
) => {
  const awsNextLayer = new LayerVersion(context, 'aws-next-layer', {
    code: Code.fromAsset(path.resolve(outLambda, 'layer')),
  });

  const api = new RestApi(context, 'pages-api', {
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
    },
    restApiName: getResourceName(`app-render`, envName),
  });

  const buildPage = (
    handlerPath: string,
    parent: IResource,
    baseFolder: string
  ) => {
    const relative = path.relative(baseFolder, path.dirname(handlerPath));
    const subDirPath = relative.replace(/\//g, '-');

    const parts = path.basename(handlerPath).split('_');
    const pageName = parts[parts.length - 1]
      .replace(/\[/g, '{')
      .replace(/\]/g, '}');

    const fullPageName = `${subDirPath ? `${subDirPath}-` : ''}${pageName}`;
    const buildDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tnm-cdk'));

    fs.copySync(path.resolve(dotNextFolder, 'serverless'), buildDir);

    const buildPath = ['page', ...relative.split('/')];

    const pagePath = [buildDir, ...buildPath];

    fs.copySync(handlerPath, path.resolve(...pagePath));

    const removeBraces = (thing: string) =>
      thing.replace(/\{/g, '').replace(/\}/g, '');

    const pageFunction = new Function(
      context,
      `next-${removeBraces(fullPageName)}-handler`,
      {
        functionName: getResourceName(
          `next-${removeBraces(fullPageName)}-handler`,
          envName
        ),
        runtime: Runtime.NODEJS_14_X,
        timeout: Duration.seconds(30),
        memorySize: 2048,
        handler: `${buildPath.join('/')}/handler.render`,
        code: Code.fromAsset(buildDir),
        layers: [awsNextLayer],
        environment: {
          FORCE_UPDATE_KEY: forceUpdateKey,
          COGNITO_POOL_CLIENT_ID: poolClient.userPoolClientId,
          COGNITO_POOL_ID: pool.userPoolId,
        },
      }
    );

    pageFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [pool.userPoolArn],
        actions: [IAM.actions.cognito.adminGetUser],
      })
    );

    const resourceToAttachTo =
      pageName === 'index' ? parent : parent.addResource(pageName);

    resourceToAttachTo.addMethod('GET', new LambdaIntegration(pageFunction));

    return pageFunction;
  };

  const buildPages = (
    root: string,
    resource: IResource,
    baseFolder?: string
  ) => {
    const dirNames = fs.readdirSync(root);

    return dirNames.flatMap((dir) => {
      const dirPath = path.resolve(root, dir);
      const base = baseFolder ? baseFolder : root;

      if (fs.existsSync(path.resolve(dirPath, 'handler.js'))) {
        return buildPage(dirPath, resource, base);
      } else {
        const subDirResource = resource.addResource(dir);
        return buildPages(path.resolve(root, dir), subDirResource, base);
      }
    });
  };

  const domainName = `${api.restApiId}.execute-api.${cdk.Aws.REGION}.amazonaws.com`;

  const httpOrigin = new HttpOrigin(domainName, { originPath: '/prod' });

  const functions = buildPages(path.resolve(outLambda, 'lambda'), api.root);

  return {
    api,
    functions,
    httpOrigin,
  };
};
