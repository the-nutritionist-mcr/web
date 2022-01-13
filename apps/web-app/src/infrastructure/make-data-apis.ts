import { Construct } from "@aws-cdk/core";
import { DnsValidatedCertificate } from "@aws-cdk/aws-certificatemanager";
import { Runtime } from '@aws-cdk/aws-lambda';
import { IHostedZone } from '@aws-cdk/aws-route53';
import { Table, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb"
import { getResourceName } from "./get-resource-name";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs"
import { IRestApi, LambdaIntegration, RestApi } from "@aws-cdk/aws-apigateway";
import path from "path";
import { getDomainName } from "./get-domain-name";

const makeDataApi = (context: Construct, name: string, environment: string, api: IRestApi) => {

  const apiResource = api.root.addResource(name)

  const dataTable = new Table(context, `${name}Table`, {
    tableName: getResourceName(`${name}-table`, environment),
    billingMode: BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: 'id',
      type: AttributeType.STRING
    }
  })

  const entryName = (name: string) => path.resolve(__dirname, "..", "backend", "lambdas", "data-api", name)

  const getFunction = new NodejsFunction(context, `Get${name}`, {
    entry: entryName("get.ts"),
    runtime: Runtime.NODEJS_14_X,
    memorySize: 2048,
    environment: {
      DYNAMODB_TABLE: dataTable.tableName
    },
    bundling: {
      sourceMap: true
    }
  })

  apiResource.addMethod("GET", new LambdaIntegration(getFunction))
  dataTable.grantReadData(getFunction)

  const createFunction = new NodejsFunction(context, `Create${name}`, {
    entry: entryName("post.ts"),
    runtime: Runtime.NODEJS_14_X,
    memorySize: 2048,
    environment: {
      DYNAMODB_TABLE: dataTable.tableName
    },
    bundling: {
      sourceMap: true
    }
  })

  apiResource.addMethod("POST", new LambdaIntegration(createFunction))
  dataTable.grantWriteData(createFunction)

  const updateFunction = new NodejsFunction(context, `Update${name}`, {
    entry: entryName("put.ts"),
    runtime: Runtime.NODEJS_14_X,
    memorySize: 2048,
    environment: {
      DYNAMODB_TABLE: dataTable.tableName
    },
    bundling: {
      sourceMap: true
    }
  })

  apiResource.addMethod("PUT", new LambdaIntegration(updateFunction))
  dataTable.grantWriteData(updateFunction)
}

export const makeDataApis = (
  context: Construct,
  hostedZone: IHostedZone,
  envName: string
) => {

  const domainName = getDomainName(envName, 'api')

  const certificate = new DnsValidatedCertificate(
    this,
    "apiCertificate",
    {
      domainName,
      hostedZone,
    }
  )

  const api = new RestApi(context, 'data-api', {
    restApiName: getResourceName('data-api', envName)
  });

  api.addDomainName("data-api-domain-name", {
    domainName,
    certificate
  })

  makeDataApi(context, "recipe", envName, api)
}
