import * as path from "path";
import { Cors, LambdaIntegration, RestApi } from "@aws-cdk/aws-apigateway";
import { HttpOrigin } from "@aws-cdk/aws-cloudfront-origins";
import { UserPool } from "@aws-cdk/aws-cognito";
import { Code, LayerVersion, Function, Runtime } from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import * as fs from "fs-extra";
import { getResourceName } from "./get-resource-name";
import { Duration } from "@aws-cdk/core";

export const makePagesApi = (
  context: cdk.Construct,
  lambdaFolder: string,
  envName: string,
  projectRoot: string,
  pool: UserPool
) => {
  const awsNextLayer = new LayerVersion(context, "aws-next-layer", {
    code: Code.fromAsset(path.resolve(projectRoot, "out_lambda", "layer"))
  });

  const api = new RestApi(context, "pages-api", {
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS
    },
    restApiName: `${envName}-app-render`
  });

  const pageNames = fs.readdirSync(path.resolve(lambdaFolder, "lambda"));

  const functions = pageNames.map(name => {
    const parts = name.split("_");
    const pageName = parts[parts.length - 1];

    const build = path.resolve(projectRoot, "build", name);
    fs.copySync(path.resolve(projectRoot, ".next", "serverless"), build);
    fs.copySync(
      path.resolve(projectRoot, "out_lambda", "lambda", name),
      path.resolve(build, "page")
    );

    const pageFunction = new Function(context, `next-${pageName}-handler`, {
      functionName: getResourceName(`next-${pageName}-handler`, envName),
      runtime: Runtime.NODEJS_14_X,
      timeout: Duration.seconds(30),
      memorySize: 2048,
      handler: "page/handler.render",
      code: Code.fromAsset(build),
      layers: [awsNextLayer],
      environment: {
        COGNITO_POOL_ID: pool.userPoolId
      }
    });

    const resource =
      pageName === "index" ? api.root : api.root.addResource(pageName);
    resource.addMethod("GET", new LambdaIntegration(pageFunction));
    return pageFunction;
  });

  const domainName = `${api.restApiId}.execute-api.${cdk.Aws.REGION}.amazonaws.com`;

  const httpOrigin = new HttpOrigin(domainName, { originPath: "/prod" });

  return {
    api,
    functions,
    httpOrigin
  };
};
