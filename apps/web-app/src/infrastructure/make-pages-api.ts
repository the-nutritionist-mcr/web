import * as os from 'node:os';
import * as path from 'node:path';
import {
  Cors,
  IResource,
  LambdaIntegration,
  RestApi
} from '@aws-cdk/aws-apigateway';
import { HttpOrigin } from '@aws-cdk/aws-cloudfront-origins';
import { UserPool } from '@aws-cdk/aws-cognito';
import { Code, LayerVersion, Function, Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as fs from 'fs-extra';
import { getResourceName } from './get-resource-name';
import { Duration } from '@aws-cdk/core';

export const makePagesApi = (
  context: cdk.Construct,
  outLambda: string,
  envName: string,
  dotNextFolder: string,
  pool: UserPool
) => {
  const awsNextLayer = new LayerVersion(context, 'aws-next-layer', {
    code: Code.fromAsset(path.resolve(outLambda, 'layer'))
  });

  const api = new RestApi(context, 'pages-api', {
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS
    },
    restApiName: getResourceName(`app-render`, envName)
  });

  const buildPage = (name: string, parent: IResource, path: string) => {
    const parts = name.split('_');
    const pageName = parts[parts.length - 1];
    const buildDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tnm-cdk'));

    fs.copySync(path.resolve(dotNextFolder, 'serverless'), buildDir);
    fs.copySync(
      path.resolve(outLambda, 'lambda', name),
      path.resolve(buildDir, 'page')
    );

    const pageFunction = new Function(context, `next-${pageName}-handler`, {
      functionName: getResourceName(`next-${pageName}-handler`, envName),
      runtime: Runtime.NODEJS_14_X,
      timeout: Duration.seconds(30),
      memorySize: 2048,
      handler: 'page/handler.render',
      code: Code.fromAsset(buildDir),
      layers: [awsNextLayer],
      environment: {
        COGNITO_POOL_ID: pool.userPoolId
      }
    });

    const resource =
      pageName === 'index' ? parent : parent.addResource(pageName);
    resource.addMethod('GET', new LambdaIntegration(pageFunction));

    return pageFunction;
  };

  const buildPages = (root: string, resource: IResource) => {
    const dirNames = fs.readdirSync(root);

    return dirNames.flatMap(dir => {
      const dirPath = path.resolve(root, dir);

      if (fs.existsSync(path.resolve(dirPath, 'handler.js'))) {
        return buildPage(dirPath, resource);
      } else {
        const subDirResource = resource.addResource(dir);
        return buildPages(path.resolve(root, dir), subDirResource);
      }
    });
  };

  const domainName = `${api.restApiId}.execute-api.${cdk.Aws.REGION}.amazonaws.com`;

  const httpOrigin = new HttpOrigin(domainName, { originPath: '/prod' });

  return {
    api,
    functions,
    httpOrigin
  };
};
