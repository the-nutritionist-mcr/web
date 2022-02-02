import path from 'node:path';

import { Construct } from '@aws-cdk/core';
import { IHostedZone } from '@aws-cdk/aws-route53';
import { IRestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { getResourceName } from './get-resource-name';

const entryName = (name: string) =>
  // eslint-disable-next-line unicorn/prefer-module
  path.resolve(__dirname, '..', 'backend', 'lambdas', 'chargebee-api', name);

export const makeCustomerApis = (
  context: Construct,
  hostedZone: IHostedZone,
  envName: string,
  api: IRestApi
) => {};
