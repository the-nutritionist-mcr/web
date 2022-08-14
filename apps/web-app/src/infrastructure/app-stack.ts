import { ArnFormat, PhysicalName, Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement, Effect, IGroup } from 'aws-cdk-lib/aws-iam';
import {
  OriginRequestCookieBehavior,
  OriginRequestPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';
import { getDomainName } from '@tnmw/utils';
import { IAM } from '@tnmw/constants';
import { NextJSLambdaEdge } from './serverless-next-js-vendored/stack';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { NextJSLambdaEdge as nextThing } from '@sls-next/cdk-construct';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { makeArnRegionless } from './make-arn-regionless';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { getResourceName } from './get-resource-name';

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
  hostedZone: IHostedZone;
  developerGroup: IGroup;
}

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: TnmAppProps) {
    super(scope, id, props.stackProps);

    const domainName = getDomainName(props.envName);

    new CfnOutput(this, 'DomainName', {
      value: domainName,
    });

    const certificate = new DnsValidatedCertificate(this, 'cert', {
      domainName,
      hostedZone: props.hostedZone,
      region: 'us-east-1',
    });

    const next = new NextJSLambdaEdge(this, 'NextJsApp', {
      serverlessBuildOutDir: props.nextJsBuildDir,
      runtime: Runtime.NODEJS_14_X,
      fullName: getResourceName(`next-js-lambda-edge`, props.envName),
      memory: 2048,
      extraPolicyStatements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          resources: ['arn:aws:cognito-idp:*:568693217207:userpool/*'],
          actions: [IAM.actions.cognito.adminGetUser],
        }),
      ],
      withLogging: true,
      domain: {
        domainNames: [domainName],
        hostedZone: props.hostedZone,
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
      new S3Origin(next.bucket)
    );

    new CfnOutput(this, 'DeployBucket', {
      value: next.bucket.bucketName,
    });
  }
}
