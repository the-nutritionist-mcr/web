import { ArnFormat, Stack, StackProps } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import {
  CachePolicy,
  OriginRequestCookieBehavior,
  OriginRequestPolicy,
  ResponseHeadersPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { makeDataApis } from './make-data-apis';
import { getDomainName } from '@tnmw/utils';
import { IAM } from '@tnmw/constants';
import { NextJSLambdaEdge } from '@sls-next/cdk-construct';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { CognitoSeeder } from '@tnmw/seed-cognito';
import { makeArnRegionless } from './make-arn-regionless';
import { Dashboard } from 'aws-cdk-lib/aws-cloudwatch';
import { makeErrorRatioWidget } from './make-error-ratio-widget';
import { instrumentFunctions } from './instrument-functions';
import { SEED_USERS } from './seed-users';

interface TnmAppProps {
  forceUpdateKey: string;
  stackProps: StackProps;
  envName: string;
  transient: boolean;
  chargebeeSite: string;
  nextJsBuildDir: string;
  sesIdentityArn: string;
  userPool: UserPool;
  gitHash: string;
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
        users: SEED_USERS,
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
      new S3Origin(next.bucket, {
        customHeaders: {
          'cache-control': 'public, max-age=31536000',
        },
      })
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
      props.gitHash,
      props.sesIdentityArn,
      props.chargebeeSite,
      props.forceUpdateKey
    );
  }
}
