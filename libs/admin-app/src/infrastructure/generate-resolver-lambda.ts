import { IGraphqlApi } from "@aws-cdk/aws-appsync";
import { Construct } from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import path from "path";

type ResolverType = "Query" | "Mutation";

export const generateResolverLambda = (
  context: Construct,
  api: IGraphqlApi,
  name: string,
  type: ResolverType,
  environment: { [key: string]: string }
) => {
  const bundlePath = process.env.IS_LOCAL_DEPLOY
    ? path.resolve(
        __dirname,
        "..",
        "..",
        "dist",
        "bundles",
        "backend",
        "handlers"
      )
    : path.resolve(__dirname, "..", "..", "backend", "handlers");

  const baseName = `${name}-resolver-lambda`;
  const resolverLambda = new lambda.Function(context, baseName, {
    functionName: baseName,
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: `${name}.handler`,
    code: lambda.Code.fromAsset(bundlePath),
    memorySize: 1024,
    environment,
  });

  const lambdaDataSource = api.addLambdaDataSource(
    `${name}DataSource`,
    resolverLambda
  );

  lambdaDataSource.createResolver({
    typeName: type,
    fieldName: name,
  });
};
