import { Stack, StackProps } from 'aws-cdk-lib';
import { Code, LayerVersion, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { CognitoSeeder } from '@tnmw/seed-cognito';
import { CfnOutput } from 'aws-cdk-lib';
import path from 'node:path';
import { deployStatics } from './deploy-statics';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { makeDataApis } from './make-data-apis';
import { makePagesApi } from './make-pages-api';
import { makeUserPool } from './make-user-pool';
import { getDomainName } from './get-domain-name';
import { setupFrontDoor } from './setup-front-door';
import { E2E } from '@tnmw/constants';
import { NextJSLambdaEdge } from '@sls-next/cdk-construct';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';

interface TnmAppProps {
  forceUpdateKey: string;
  stackProps: StackProps;
  envName: string;
  transient: boolean;
  chargebeeSite: string;
  nextJsBuildDir: string;
}

// eslint-disable-next-line unicorn/prefer-module
const packageRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(packageRoot, '..', '..');

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: TnmAppProps) {
    super(scope, id, props.stackProps);

    const transient = props.envName !== 'prod';

    const { userPool, client } = makeUserPool(this, transient, props.envName);

    if (transient) {
      new CognitoSeeder(this, `cognito-seeder`, {
        userpool: userPool,
        users: [
          {
            otherAttributes: [
              {
                Name: 'given_name',
                Value: 'Cypress',
              },

              {
                Name: 'family_name',
                Value: 'Tester',
              },
            ],

            username: E2E.adminUserOne.username,
            password: E2E.adminUserOne.password,
            email: E2E.adminUserOne.email,
            state: 'Complete',
            groups: ['admin'],
          },
          {
            otherAttributes: [
              {
                Name: 'given_name',
                Value: 'Cypress',
              },

              {
                Name: 'family_name',
                Value: 'Tester2',
              },
            ],
            username: E2E.normalUserOne.username,
            password: E2E.normalUserOne.password,
            email: E2E.normalUserOne.email,
            state: 'Complete',
          },
          {
            otherAttributes: [
              {
                Name: 'given_name',
                Value: E2E.testCustomer.firstName,
              },
              {
                Name: 'family_name',
                Value: E2E.testCustomer.surname,
              },
              {
                Name: 'custom:plans',
                Value: E2E.testCustomer.plans,
              },
              {
                Name: 'custom:deliveryDay1',
                Value: E2E.testCustomer.deliveryDay1,
              },
              {
                Name: 'custom:deliveryDay2',
                Value: E2E.testCustomer.deliveryDay2,
              },
            ],
            username: E2E.testCustomer.username,
            password: E2E.testCustomer.password,
            email: E2E.testCustomer.email,
            state: 'Complete',
          },
        ],
      });
    }

    const domainName = getDomainName(props.envName);

    new CfnOutput(this, 'DomainName', {
      value: domainName,
    });

    const hostedZone = new PublicHostedZone(this, 'HostedZone', {
      zoneName: domainName,
    });

    const certificate = new DnsValidatedCertificate(this, 'cert', {
      domainName,
      hostedZone,
      region: 'us-east-1',
    });

    new NextJSLambdaEdge(this, 'NextJsApp', {
      serverlessBuildOutDir: props.nextJsBuildDir,
      runtime: Runtime.NODEJS_14_X,
      memory: 2048,
      domain: {
        domainNames: [domainName],
        hostedZone,
        certificate,
      },
      defaultBehaviour: {
        originRequestPolicy: new OriginRequestPolicy(
          context,
          'origin-request-policy',
          { cookieBehavior: OriginRequestCookieBehavior.all() }
        ),
      },
    });

    makeDataApis(
      this,
      hostedZone,
      props.envName,
      userPool,
      props.chargebeeSite,
      props.forceUpdateKey
    );
  }
}
