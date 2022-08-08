import { ArnFormat, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import {
  BucketDeployment,
  CacheControl,
  Source,
} from 'aws-cdk-lib/aws-s3-deployment';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import {
  OriginRequestCookieBehavior,
  OriginRequestPolicy,
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
import { SEED_USERS } from './seed-users';
import { BackendConfig } from './backend-stack';

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
  backendConfig: BackendConfig;
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
      invalidationPaths: ['/*'],
      defaultBehavior: {
        originRequestPolicy: new OriginRequestPolicy(
          this,
          'origin-request-policy',
          { cookieBehavior: OriginRequestCookieBehavior.all() }
        ),
      },
    });

    const config = {
      [id]: {
        DomainName: getDomainName(props.envName),
        ApiDomainName: getDomainName(props.envName, 'api'),
      },
      [props.backendConfig.id]: props.backendConfig.config,
    };

    new BucketDeployment(this, 'deploy-app-config', {
      sources: [Source.jsonData('app-config.json', config)],
      destinationBucket: next.bucket,
      cacheControl: [
        CacheControl.setPublic(),
        CacheControl.maxAge(Duration.hours(24 * 30)),
      ],
      distribution: next.distribution,
      distributionPaths: ['/app-config.json'],
    });

    next.distribution.addBehavior(
      '/app-config.json',
      new S3Origin(next.bucket)
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
