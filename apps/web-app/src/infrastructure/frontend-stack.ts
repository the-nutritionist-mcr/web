import { CognitoSeeder } from '@tnmw/seed-cognito';
import { StackConfig } from '@tnmw/types';
import { getDomainName } from '@tnmw/utils';
import { Stack, StackProps } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
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
import { SEED_USERS } from './seed-users';

interface FrontendStackProps {
  stackProps: StackProps;
  envName: string;
  transient: boolean;
  hostedZone: IHostedZone;
  poolClient: IUserPoolClient;
  userPool: IUserPool;
}

const BUILD_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'dist',
  'apps',
  'web-app',
  'exported'
);

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
      UserPoolId: userPoolIdParam.stringValue,
      ClientId: userPoolClientIdParam.stringValue,
      ApiDomainName: apiDomainName,
      DomainName: domainName,
      AwsRegion: Stack.of(this).region,
    };

    new BucketDeployment(this, 'bucket-deployment', {
      sources: [
        Source.asset(BUILD_PATH),
        Source.jsonData('app-config.json', config),
      ],
      destinationBucket: staticsBucket,
      distribution,
    });

    if (props.transient) {
      new CognitoSeeder(this, `cognito-seeder`, {
        userpool: props.userPool,
        users: SEED_USERS,
      });
    }
  }
}
