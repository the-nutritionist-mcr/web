import { Distribution } from '@aws-cdk/aws-cloudfront';
import { S3Origin } from '@aws-cdk/aws-cloudfront-origins';
import { Bucket } from '@aws-cdk/aws-s3';
import { CfnOutput, RemovalPolicy, Construct } from '@aws-cdk/core';
import { getDomainName } from './get-domain-name';

export const deployStatics = (
  context: Construct,
  envName: string,
  distribution: Distribution
) => {
  const prefixes = ['_next', 'images', 'assets'];

  const bucketName = getDomainName(envName);

  const deploymentBucket = new Bucket(context, 'statics-bucket', {
    bucketName,
    publicReadAccess: true,
    websiteIndexDocument: 'index.html',
    websiteErrorDocument: 'index.html',
    removalPolicy: RemovalPolicy.DESTROY
  });

  new CfnOutput(context, 'StaticsBucket', {
    value: deploymentBucket.bucketName
  });

  const bucketOrigin = new S3Origin(deploymentBucket);

  prefixes.forEach(prefix => {
    distribution.addBehavior(`/${prefix}/*`, bucketOrigin);
  });

  distribution.addBehavior(`/storybook`, bucketOrigin);
  distribution.addBehavior('/app-config.json', bucketOrigin);
};
