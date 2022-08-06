import { Arn, ArnFormat, Stack, StackProps } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import {
  CachePolicy,
  OriginRequestCookieBehavior,
  OriginRequestPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { makeDataApis } from './make-data-apis';
import { getDomainName } from '@tnmw/utils';
import { E2E, IAM } from '@tnmw/constants';
import { NextJSLambdaEdge } from '@sls-next/cdk-construct';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { CognitoSeeder } from '@tnmw/seed-cognito';
import { makeArnRegionless } from './make-arn-regionless';
import {
  Dashboard,
  MathExpression,
  SingleValueWidget,
} from 'aws-cdk-lib/aws-cloudwatch';

const makeErrorRatioWidget = (func: Function) => {
  const problemPercentage = new MathExpression({
    expression: '(problems / invocations) * 100',
    usingMetrics: {
      errors: func.metricErrors(),
      invocations: func.metricInvocations(),
    },
  });

  return new SingleValueWidget({
    metrics: [problemPercentage],
    fullPrecision: false,
    title: `${func.functionName} error ratio`,
  });
};

interface TnmAppProps {
  forceUpdateKey: string;
  stackProps: StackProps;
  envName: string;
  transient: boolean;
  chargebeeSite: string;
  nextJsBuildDir: string;
  sesIdentityArn: string;
  userPool: UserPool;
}

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: TnmAppProps) {
    super(scope, id, props.stackProps);

    const domainName = getDomainName(props.envName);

    const dashboard = new Dashboard(this, 'dashboard', {
      dashboardName: `tnm-portal-${props.envName}`,
    });

    new CfnOutput(this, 'DomainName', {
      value: domainName,
    });

    if (props.transient) {
      new CognitoSeeder(this, `cognito-seeder`, {
        userpool: props.userPool,
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

    next.distribution.addBehavior(
      '/app-config.json',
      new S3Origin(next.bucket),
      {
        cachePolicy: CachePolicy.CACHING_DISABLED,
      }
    );

    dashboard.addWidgets(makeErrorRatioWidget(next.defaultNextLambda));

    new CfnOutput(this, 'DeployBucket', {
      value: next.bucket.bucketName,
    });

    next.edgeLambdaRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [
          makeArnRegionless(
            props.userPool.userPoolArn,
            ArnFormat.SLASH_RESOURCE_NAME
          ),
        ],
        actions: [IAM.actions.cognito.adminGetUser],
      })
    );

    makeDataApis(
      this,
      hostedZone,
      props.envName,
      props.userPool,
      props.sesIdentityArn,
      props.chargebeeSite,
      props.forceUpdateKey
    );
  }
}
