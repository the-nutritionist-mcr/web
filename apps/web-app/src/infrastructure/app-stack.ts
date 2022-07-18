import { Stack, StackProps } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import {
  CachePolicy,
  OriginRequestCookieBehavior,
  OriginRequestPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import { CognitoSeeder } from '@tnmw/seed-cognito';
import { CfnOutput } from 'aws-cdk-lib';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { makeDataApis } from './make-data-apis';
import { makeUserPool } from './make-user-pool';
import { getDomainName } from './get-domain-name';
import { E2E, IAM } from '@tnmw/constants';
import { NextJSLambdaEdge } from '@sls-next/cdk-construct';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';

interface TnmAppProps {
  forceUpdateKey: string;
  stackProps: StackProps;
  envName: string;
  transient: boolean;
  chargebeeSite: string;
  nextJsBuildDir: string;
}

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

    const next = new NextJSLambdaEdge(this, 'NextJsApp', {
      serverlessBuildOutDir: props.nextJsBuildDir,
      runtime: Runtime.NODEJS_14_X,
      memory: 2048,
      withLogging: true,
      domain: {
        domainNames: [domainName],
        hostedZone,
        certificate,
      },
      defaultBehavior: {
        originRequestPolicy: new OriginRequestPolicy(
          this,
          'origin-request-policy',
          { cookieBehavior: OriginRequestCookieBehavior.all() }
        ),
      },
    });

    next.defaultNextLambda.addEnvironment(
      'FORCE_UPDATE_KEY',
      props.forceUpdateKey
    );

    next.defaultNextLambda.addEnvironment(
      'COGNITO_POOL_CLIENT_ID',
      client.userPoolClientId
    );

    next.defaultNextLambda.addEnvironment(
      'COGNITO_POOL_ID',
      userPool.userPoolId
    );

    next.distribution.addBehavior(
      '/app-config.json',
      new S3Origin(next.bucket),
      {
        cachePolicy: CachePolicy.CACHING_DISABLED,
      }
    );

    new CfnOutput(this, 'DeployBucket', {
      value: next.bucket.bucketName,
    });

    next.edgeLambdaRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [userPool.userPoolArn],
        actions: [IAM.actions.cognito.adminGetUser],
      })
    );

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
