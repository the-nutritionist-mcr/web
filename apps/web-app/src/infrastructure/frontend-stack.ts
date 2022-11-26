import { StackConfig } from '@tnmw/types';
import { getDomainName } from '@tnmw/utils';
import { Stack, StackProps } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ImageOptimisation } from '@tnmw/image-optimisation';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { IUserPool, IUserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { ARecord, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import path from 'node:path';
import { getResourceName } from './get-resource-name';

interface FrontendStackProps {
  stackProps: StackProps;
  envName: string;
  transient: boolean;
  chargebeeUrl: string;
  hostedZone: IHostedZone;
  poolClient: IUserPoolClient;
  userPool: IUserPool;
}

const DIST_PATH = path.join(
  // eslint-disable-next-line unicorn/prefer-module
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'dist'
);

const APP_PATH = path.join(DIST_PATH, 'apps', 'web-app');

const EXPORTED_PATH = path.join(APP_PATH, 'exported');

const DOT_NEXT_PATH = path.join(APP_PATH, '.next');

export class FrontendStack extends Stack {
  public constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props.stackProps);

    const domainName = getDomainName(props.envName);

    const staticsBucket = new Bucket(this, 'tnm-web-bucket', {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    });

    const certificate = new DnsValidatedCertificate(this, 'cert', {
      domainName,
      hostedZone: props.hostedZone,
      region: 'us-east-1',
    });

    const distribution = new Distribution(this, 'tnm-web-distribution', {
      defaultBehavior: {
        origin: new S3Origin(staticsBucket),
      },
      certificate,
      domainNames: [domainName],
    });

    new ARecord(this, 'FrontendARecord', {
      zone: props.hostedZone,
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });

    const apiDomainName = getDomainName(props.envName, 'api');

    const userPoolIdParam = new StringParameter(this, 'userPoolId', {
      parameterName: getResourceName('user-pool-id', props.envName),
      stringValue: props.userPool.userPoolId,
    });

    const userPoolClientIdParam = new StringParameter(
      this,
      'userPoolClientId',
      {
        parameterName: getResourceName('user-pool-client-id', props.envName),
        stringValue: props.poolClient.userPoolClientId,
      }
    );

    const config: StackConfig = {
      Environment: props.envName,
      UserPoolId: userPoolIdParam.stringValue,
      ClientId: userPoolClientIdParam.stringValue,
      ApiDomainName: apiDomainName,
      DomainName: domainName,
      AwsRegion: Stack.of(this).region,
      ChargebeeUrl: props.chargebeeUrl,
    };

    new BucketDeployment(this, 'dot-next-bucket-deployment', {
      sources: [Source.asset(path.join(DOT_NEXT_PATH, 'static', 'images'))],
      destinationBucket: staticsBucket,
      destinationKeyPrefix: '_next/static/images',
      distribution,
    });

    new ImageOptimisation(this, `image-optimsation-api`, {
      distribution,
      assetsPath: path.join(APP_PATH, 'public', 'images'),
    });

    new BucketDeployment(this, 'exported-bucket-deployment', {
      sources: [
        Source.asset(EXPORTED_PATH),
        Source.jsonData('app-config.json', config),
      ],
      destinationBucket: staticsBucket,
      distribution,
    });
  }
}
