import { Stack, StackProps } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import { makeUserPool } from './make-user-pool';
import { makeDataApis } from './make-data-apis';
import { IGroup } from 'aws-cdk-lib/aws-iam';
import { getDomainName } from '@tnmw/utils';
import {
  ARecord,
  IHostedZone,
  PublicHostedZone,
  RecordTarget,
} from 'aws-cdk-lib/aws-route53';
import { CognitoSeeder } from '@tnmw/seed-cognito';
import { SEED_USERS } from './seed-users';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import path from 'node:path';
import { StackConfig } from '@tnmw/types';

interface BackendStackProps {
  forceUpdateKey: string;
  stackProps: StackProps;
  envName: string;
  gitHash: string;
  transient: boolean;
  chargebeeSite: string;
  sesIdentityArn: string;
  developerGroup: IGroup;
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

export class BackendStack extends Stack {
  public pool: UserPool;
  public zone: IHostedZone;

  public constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props.stackProps);
    const transient = props.envName !== 'prod';

    const domainName = getDomainName(props.envName);

    const hostedZone = new PublicHostedZone(this, 'HostedZone', {
      zoneName: domainName,
    });

    const certificate = new DnsValidatedCertificate(this, 'cert', {
      domainName,
      hostedZone,
      region: 'us-east-1',
    });

    const staticsBucket = new Bucket(this, 'tnm-web-bucket', {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    });

    const distribution = new Distribution(this, 'tnm-web-distribution', {
      defaultBehavior: {
        origin: new S3Origin(staticsBucket),
      },
      certificate,
      domainNames: [domainName],
    });

    new ARecord(this, 'FrontendARecord', {
      zone: hostedZone,
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });

    const { userPool, client } = makeUserPool(
      this,
      transient,
      props.envName,
      props.gitHash
    );

    const apiDomainName = getDomainName(props.envName, 'api');

    const config: StackConfig = {
      UserPoolId: userPool.userPoolId,
      ClientId: client.userPoolClientId,
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
        userpool: userPool,
        users: SEED_USERS,
      });
    }

    makeDataApis(
      this,
      props.envName,
      userPool,
      hostedZone,
      props.gitHash,
      props.sesIdentityArn,
      props.chargebeeSite,
      props.forceUpdateKey,
      props.developerGroup
    );

    this.zone = hostedZone;
    this.pool = userPool;
  }
}
